import crypto from 'node:crypto';
import path from 'node:path';
import process from 'node:process';
import fs from 'fs-extra';

/**
 * 计算文件 SHA256 哈希
 */
function getFileHash(filePath: string): string {
	const content = fs.readFileSync(filePath);
	return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * 递归获取目录下所有文件
 */
function getFilesRecursively(dir: string, baseDir: string = dir): string[] {
	const files: string[] = [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

		if (entry.isDirectory()) {
			files.push(...getFilesRecursively(fullPath, baseDir));
		}
		else {
			files.push(relativePath);
		}
	}

	return files;
}

/**
 * 生成 manifest
 */
function generateManifest() {
	const rootDir = path.join(__dirname, '../');
	const packageJsonPath = path.join(rootDir, 'package.json');
	const packageJson = fs.readJsonSync(packageJsonPath);

	const buildDir = path.join(rootDir, 'build');
	const configDir = path.join(rootDir, 'config');

	// 获取框架文件列表（排除 build/dist 目录）
	const buildFiles = getFilesRecursively(buildDir, rootDir).filter(file => !file.startsWith('build/dist/'));
	const configFiles = getFilesRecursively(configDir, rootDir);
	const frameworkFiles = [...buildFiles, ...configFiles];

	// 构建文件哈希映射
	const fileHashes: Record<string, string> = {};
	for (const file of frameworkFiles) {
		const fullPath = path.join(rootDir, file);
		fileHashes[file] = getFileHash(fullPath);
	}

	const manifest = {
		version: packageJson.version,
		generatedAt: new Date().toISOString(),
		frameworkFiles: fileHashes,
	};

	return manifest;
}

/**
 * 主函数
 */
function main() {
	const args = process.argv.slice(2);
	const command = args[0];

	if (command === 'generate') {
		const manifest = generateManifest();
		const manifestPath = path.join(__dirname, '../.sdk-manifest.json');
		fs.writeJsonSync(manifestPath, manifest, { spaces: '\t', EOL: '\n' });
		console.log(`已生成 .sdk-manifest.json (版本：${manifest.version})`);
	}
	else if (command === 'bump') {
		// 提升版本号
		const packageJsonPath = path.join(__dirname, '../package.json');
		const packageJson = fs.readJsonSync(packageJsonPath);

		const versionParts = packageJson.version.split('.');
		const patchVersion = Number.parseInt(versionParts[2] ?? '0', 10) + 1;
		versionParts[2] = String(patchVersion);
		packageJson.version = versionParts.join('.');

		fs.writeJsonSync(packageJsonPath, packageJson, { spaces: '\t', EOL: '\n' });
		console.log(`版本号已提升：${packageJson.version}`);

		// 重新生成 manifest
		const manifest = generateManifest();
		const manifestPath = path.join(__dirname, '../.sdk-manifest.json');
		fs.writeJsonSync(manifestPath, manifest, { spaces: '\t', EOL: '\n' });
		console.log(`已生成 .sdk-manifest.json (版本: ${manifest.version})`);
	}
	else {
		console.log('用法：');
		console.log('  npm run manifest:generate  - 生成 manifest');
		console.log('  npm run manifest:bump      - 提升版本号并生成 manifest');
	}
}

main();
