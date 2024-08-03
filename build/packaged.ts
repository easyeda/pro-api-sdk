import fs from 'fs-extra';
import ignore from 'ignore';
import JSZip from 'jszip';

import * as extensionConfig from '../extension.json';

/**
 * 将多行字符串拆分成字符串数组
 *
 * @param str - 多行字符串
 * @returns 字符串数组
 */
function multiLineStrToArray(str: string): Array<string> {
	return str.split(/[\r\n]+/);
}

/**
 * 主逻辑方法
 */
function main() {
	const filepathListWithoutFilter = fs.readdirSync(__dirname + '/../', { encoding: 'utf-8', recursive: true });
	const edaignoreListWithoutResolve = multiLineStrToArray(fs.readFileSync(__dirname + '/../.edaignore', { encoding: 'utf-8' }));
	const edaignoreList: Array<string> = [];
	for (const edaignoreLine of edaignoreListWithoutResolve) {
		if (edaignoreLine.endsWith('/') || edaignoreLine.endsWith('\\')) {
			edaignoreList.push(edaignoreLine.slice(0, edaignoreLine.length - 1));
		} else {
			edaignoreList.push(edaignoreLine);
		}
	}
	const edaignore = ignore().add(edaignoreList);
	const filepathListWithoutResolve = edaignore.filter(filepathListWithoutFilter);
	const fileList: Array<string> = [];
	const folderList: Array<string> = []; // 无用数据
	for (const filepath of filepathListWithoutResolve) {
		if (fs.lstatSync(filepath).isFile()) {
			fileList.push(filepath.replace(/\\/g, '/'));
		} else {
			folderList.push(filepath.replace(/\\/g, '/'));
		}
	}

	const zip = new JSZip();
	for (const file of fileList) {
		zip.file(file, fs.createReadStream(__dirname + '/../' + file));
	}

	zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).pipe(
		fs.createWriteStream(__dirname + '/dist/' + extensionConfig.name + '_v' + extensionConfig.version + '.eext'),
	);
}

main();
