import path from 'node:path';
import process from 'node:process';
import fs from 'fs-extra';

const GITHUB_OWNER = 'easyeda';
const GITHUB_REPO = 'pro-api-sdk';
const GITHUB_BRANCH = 'master';

const GITEE_OWNER = 'jlceda';
const GITEE_REPO = 'pro-api-sdk';
const GITEE_BRANCH = 'master';

const GITHUB_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;
const GITEE_BASE_URL = `https://raw.giteeusercontent.com/${GITEE_OWNER}/${GITEE_REPO}/raw/${GITEE_BRANCH}`;

/**
 * 获取本地 manifest
 */
function getLocalManifest(): { version: string; frameworkFiles: string[] } | null {
	const manifestPath = path.join(__dirname, '../.sdk-manifest.json');
	if (!fs.existsSync(manifestPath)) {
		return null;
	}
	return fs.readJsonSync(manifestPath);
}

/**
 * 从指定 URL 获取 JSON
 */
async function fetchJson<T>(url: string): Promise<T | null> {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			return null;
		}
		return await response.json();
	}
	catch {
		return null;
	}
}

/**
 * 从指定 URL 获取文本
 */
async function fetchText(url: string): Promise<string | null> {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			return null;
		}
		return await response.text();
	}
	catch {
		return null;
	}
}

/**
 * 获取远程 manifest（带回退）
 */
async function getRemoteManifest(): Promise<{ version: string; frameworkFiles: string[] } | null> {
	// 先尝试 GitHub
	const githubUrl = `${GITHUB_BASE_URL}/.sdk-manifest.json`;
	let manifest = await fetchJson<{ version: string; frameworkFiles: string[] }>(githubUrl);

	if (manifest) {
		console.log('[GitHub] 获取 manifest 成功');
		return manifest;
	}

	// GitHub 失败，回退到 Gitee
	console.log('[GitHub] 获取 manifest 失败，尝试 Gitee...');
	const giteeUrl = `${GITEE_BASE_URL}/.sdk-manifest.json`;
	manifest = await fetchJson<{ version: string; frameworkFiles: string[] }>(giteeUrl);

	if (manifest) {
		console.log('[Gitee] 获取 manifest 成功');
		return manifest;
	}

	console.error('无法从 GitHub 或 Gitee 获取远程 manifest');
	return null;
}

/**
 * 智能合并 package.json
 */
function mergePackageJson(local: any, remote: any): any {
	const result = { ...local };

	// 版本号使用远程
	result.version = remote.version;

	// 合并 scripts（远程覆盖本地）
	if (remote.scripts) {
		result.scripts = {
			...local.scripts,
			...remote.scripts,
		};
	}

	// 合并 devDependencies（远程覆盖本地）
	if (remote.devDependencies) {
		result.devDependencies = {
			...local.devDependencies,
			...remote.devDependencies,
		};
	}

	// 合并 dependencies（远程覆盖本地）
	if (remote.dependencies) {
		result.dependencies = {
			...local.dependencies,
			...remote.dependencies,
		};
	}

	return result;
}

/**
 * 下载文件（带回退）
 */
async function downloadFile(filePath: string): Promise<boolean> {
	// 先尝试 GitHub
	const githubUrl = `${GITHUB_BASE_URL}/${filePath}`;
	let content = await fetchText(githubUrl);

	if (content !== null) {
		console.log(`[GitHub] 下载成功: ${filePath}`);
	}
	else {
		// GitHub 失败，回退到 Gitee
		console.log(`[GitHub] 下载失败，尝试 Gitee: ${filePath}`);
		const giteeUrl = `${GITEE_BASE_URL}/${filePath}`;
		content = await fetchText(giteeUrl);

		if (content !== null) {
			console.log(`[Gitee] 下载成功: ${filePath}`);
		}
		else {
			console.error(`下载失败: ${filePath}`);
			return false;
		}
	}

	const fullPath = path.join(__dirname, '../', filePath);
	fs.ensureDirSync(path.dirname(fullPath));
	fs.writeFileSync(fullPath, content, 'utf-8');
	return true;
}

/**
 * 检查更新
 */
async function checkUpdate(): Promise<{ hasUpdate: boolean; localVersion: string | null; remoteVersion: string | null }> {
	const localManifest = getLocalManifest();
	const remoteManifest = await getRemoteManifest();

	if (!remoteManifest) {
		console.log('无法获取远程 manifest');
		return { hasUpdate: false, localVersion: localManifest?.version ?? null, remoteVersion: null };
	}

	const localVersion = localManifest?.version ?? null;
	const remoteVersion = remoteManifest.version;

	if (!localVersion) {
		console.log(`发现新版本: ${remoteVersion}`);
		return { hasUpdate: true, localVersion: null, remoteVersion };
	}

	if (localVersion === remoteVersion) {
		console.log(`已是最新版本: ${localVersion}`);
		return { hasUpdate: false, localVersion, remoteVersion };
	}

	console.log(`发现新版本: ${localVersion} → ${remoteVersion}`);
	return { hasUpdate: true, localVersion, remoteVersion };
}

/**
 * 执行更新
 */
async function performUpdate() {
	const localManifest = getLocalManifest();
	const remoteManifest = await getRemoteManifest();

	if (!remoteManifest) {
		console.error('无法获取远程 manifest，更新失败');
		return false;
	}

	// 检查是否有更新
	if (localManifest && localManifest.version === remoteManifest.version) {
		console.log(`已是最新版本: ${localManifest.version}`);
		return true;
	}

	console.log(`开始更新: ${localManifest?.version ?? 'unknown'} → ${remoteManifest.version}`);

	// 备份 package.json
	const packageJsonPath = path.join(__dirname, '../package.json');
	const packageJsonBackupPath = path.join(__dirname, '../package.json.backup');
	fs.copySync(packageJsonPath, packageJsonBackupPath);
	console.log('已备份 package.json → package.json.backup');

	// 智能合并 package.json
	const localPackageJson = fs.readJsonSync(packageJsonPath);

	// 先尝试 GitHub 获取 package.json
	let remotePackageJson = await fetchJson<any>(`${GITHUB_BASE_URL}/package.json`);
	if (!remotePackageJson) {
		console.log('[GitHub] 获取 package.json 失败，尝试 Gitee...');
		remotePackageJson = await fetchJson<any>(`${GITEE_BASE_URL}/package.json`);
	}

	if (!remotePackageJson) {
		console.error('无法获取远程 package.json');
		return false;
	}

	const mergedPackageJson = mergePackageJson(localPackageJson, remotePackageJson);
	fs.writeJsonSync(packageJsonPath, mergedPackageJson, { spaces: '\t', EOL: '\n' });
	console.log('已合并 package.json');

	// 下载框架文件
	const frameworkFiles = remoteManifest.frameworkFiles ?? [];
	for (const file of frameworkFiles) {
		const success = await downloadFile(file);
		if (success) {
			console.log(`已更新: ${file}`);
		}
	}

	// 更新 manifest
	fs.writeJsonSync(path.join(__dirname, '../.sdk-manifest.json'), remoteManifest, { spaces: '\t', EOL: '\n' });
	console.log('已更新 .sdk-manifest.json');

	console.log('更新完成！请运行 npm install 安装依赖');
	return true;
}

/**
 * 主函数
 */
async function main() {
	const args = process.argv.slice(2);
	const command = args[0];

	if (command === 'check') {
		await checkUpdate();
	}
	else if (command === 'update') {
		await performUpdate();
	}
	else {
		console.log('用法:');
		console.log('  npm run update:check  - 检查更新');
		console.log('  npm run update        - 执行更新');
	}
}

main().catch((err) => {
	console.error('发生错误:', err);
	process.exit(1);
});
