#!/usr/bin/env node

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const GITHUB_REPO = 'easyeda/pro-api-sdk';
const GITHUB_URL = `https://github.com/${GITHUB_REPO}.git`;

/**
 * 需要从模板中排除的文件/目录（即使没有被 gitignore）
 */
const EXCLUDE_PATTERNS = [
	'.git',
	'.sdk-manifest.json',
	'build/create.js',
	'build/manifest.ts',
	'CHANGELOG.md',
	'README.md',
	'README.en.md',
	'README.ja.md',
	'README.ru.md',
	'README.zh-Hant.md',
];

/**
 * 检查目录是否为空
 */
function isDirEmpty(dir) {
	try {
		const files = fs.readdirSync(dir);
		return files.length === 0;
	}
	catch {
		return true;
	}
}

/**
 * 递归删除目录或文件
 *
 * @param targetPath - 要删除的路径
 */
function removeDirRecursive(targetPath) {
	if (!fs.existsSync(targetPath)) {
		return;
	}
	const stat = fs.statSync(targetPath);
	if (stat.isDirectory()) {
		const entries = fs.readdirSync(targetPath, { withFileTypes: true });
		for (const entry of entries) {
			removeDirRecursive(path.join(targetPath, entry.name));
		}
		fs.rmdirSync(targetPath);
	}
	else {
		fs.unlinkSync(targetPath);
	}
}

/**
 * 递归删除匹配的文件/目录
 *
 * @param dir - 当前处理的目录
 * @param rootDir - 根目录（用于计算相对路径）
 */
function removeExcludedFiles(dir, rootDir = dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		const relativePath = path.relative(rootDir, fullPath);

		// 检查是否匹配排除模式
		const shouldExclude = EXCLUDE_PATTERNS.some((pattern) => {
			return relativePath === pattern || relativePath.startsWith(`${pattern}/`);
		});

		if (shouldExclude) {
			removeDirRecursive(fullPath);
			continue;
		}

		if (entry.isDirectory()) {
			removeExcludedFiles(fullPath, rootDir);
			// 删除空目录
			if (isDirEmpty(fullPath)) {
				fs.rmdirSync(fullPath);
			}
		}
	}
}

/**
 * 主函数
 */
function main() {
	const args = process.argv.slice(2);
	const projectName = args[0];

	if (!projectName) {
		console.log('Usage:');
		console.log('  npx github:easyeda/pro-api-sdk <project-name>');
		console.log('');
		console.log('Example:');
		console.log('  npx github:easyeda/pro-api-sdk my-extension');
		process.exit(1);
	}

	const targetDir = path.resolve(process.cwd(), projectName);

	// 检查目录是否已存在
	if (fs.existsSync(targetDir)) {
		console.error(`Error: Directory already exists ${targetDir}`);
		process.exit(1);
	}

	console.log(`Creating project: ${projectName}`);

	// 创建临时目录
	const tempDir = path.join(process.cwd(), `.temp-${Date.now()}`);

	try {
		// 1. 克隆仓库（浅克隆）
		console.log('Downloading template...');
		execSync(`git clone --depth 1 ${GITHUB_URL} "${tempDir}"`, { stdio: 'pipe' });

		// 2. 删除不需要的文件
		console.log('Cleaning template...');
		removeExcludedFiles(tempDir);

		// 3. 移动到目标目录
		fs.renameSync(tempDir, targetDir);

		// 4. 重置 extension.json 中的名称
		const extensionJsonPath = path.join(targetDir, 'extension.json');
		if (fs.existsSync(extensionJsonPath)) {
			const extensionJson = JSON.parse(fs.readFileSync(extensionJsonPath, 'utf-8'));
			extensionJson.name = projectName;
			fs.writeFileSync(extensionJsonPath, `${JSON.stringify(extensionJson, null, '\t')}\n`, 'utf-8');
		}

		// 5. 生成新的 CHANGELOG.md（空文件）
		fs.writeFileSync(path.join(targetDir, 'CHANGELOG.md'), '', 'utf-8');

		// 6. 生成新的 README.md（只有一级标题）
		fs.writeFileSync(path.join(targetDir, 'README.md'), `# ${projectName}\n`, 'utf-8');

		console.log('');
		console.log(`✅ Project created successfully: ${targetDir}`);
		console.log('');
		console.log('Next steps:');
		console.log(`  cd ${projectName}`);
		console.log('  npm install');
		console.log('  npm run build');
	}
	catch (err) {
		console.error('Failed to create project:', err);
		// 清理临时目录
		if (fs.existsSync(tempDir)) {
			removeDirRecursive(tempDir);
		}
		process.exit(1);
	}
}

main();
