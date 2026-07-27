import path from 'node:path';
import fs from 'fs-extra';
import ignore from 'ignore';
import JSZip from 'jszip';

/**
 * 将多行字符串拆分成字符串数组
 */
export function multiLineStrToArray(str: string): Array<string> {
	return str.split(/[\r\n]+/);
}

/**
 * 检查 UUID 是否合法
 */
export function testUuid(uuid?: string): uuid is string {
	const regExp = /^[a-z0-9]{32}$/;
	if (uuid && uuid !== '00000000000000000000000000000000') {
		return regExp.test(uuid.trim());
	}
	else {
		return false;
	}
}

/**
 * 获取正确的 UUID
 */
export function fixUuid(uuid?: string): string {
	uuid = uuid?.trim() || undefined;
	if (testUuid(uuid)) {
		return uuid.trim();
	}
	else {
		return crypto.randomUUID().replaceAll('-', '');
	}
}

/**
 * 获取要打包的文件列表
 */
export function getPackageFileList(rootDir: string): Array<string> {
	const filepathListWithoutFilter = fs.readdirSync(rootDir, { encoding: 'utf-8', recursive: true });
	const edaignoreListWithoutResolve = multiLineStrToArray(fs.readFileSync(path.join(rootDir, '.edaignore'), { encoding: 'utf-8' }));
	const edaignoreList: Array<string> = [];
	for (const edaignoreLine of edaignoreListWithoutResolve) {
		if (edaignoreLine.endsWith('/') || edaignoreLine.endsWith('\\')) {
			edaignoreList.push(edaignoreLine.slice(0, edaignoreLine.length - 1));
		}
		else {
			edaignoreList.push(edaignoreLine);
		}
	}
	const edaignore = ignore().add(edaignoreList);
	const filepathListWithoutResolve = edaignore.filter(filepathListWithoutFilter);
	const fileList: Array<string> = [];
	for (const filepath of filepathListWithoutResolve) {
		if (fs.lstatSync(path.join(rootDir, filepath)).isFile()) {
			fileList.push(filepath.replace(/\\/g, '/'));
		}
	}
	return fileList;
}

/**
 * 打包扩展为 eext 文件
 */
export async function packageExtension(rootDir: string, outputPath: string): Promise<void> {
	const fileList = getPackageFileList(rootDir);

	const zip = new JSZip();
	for (const file of fileList) {
		zip.file(file, fs.createReadStream(path.join(rootDir, file)));
	}

	const nodeStream = zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true, compression: 'DEFLATE', compressionOptions: { level: 9 } });
	const writeStream = fs.createWriteStream(outputPath);

	return new Promise((resolve, reject) => {
		nodeStream.pipe(writeStream);
		writeStream.on('finish', resolve);
		writeStream.on('error', reject);
		nodeStream.on('error', reject);
	});
}
