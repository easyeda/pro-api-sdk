import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import fs from 'fs-extra';
import { WebSocketServer } from 'ws';

import common from '../config/esbuild.common.ts';
import rawExtensionConfig from '../extension.json' with { type: 'json' };

import { fixUuid, packageExtension, testUuid } from './utils.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEBSOCKET_PORT = 59394;
const DIST_DIR = path.join(__dirname, '../dist');
const ROOT_DIR = path.join(__dirname, '../');

// 处理 extension.json，确保 UUID 合法（只在启动时修复一次）
function resolveExtensionConfig() {
	const extensionConfig = { ...rawExtensionConfig } as Record<string, unknown>;
	if (!testUuid(extensionConfig.uuid as string | undefined)) {
		delete extensionConfig.default;
		extensionConfig.uuid = fixUuid(extensionConfig.uuid as string | undefined);
		fs.writeJsonSync(path.join(__dirname, '../extension.json'), extensionConfig, { spaces: '\t', EOL: '\n', encoding: 'utf-8' });
		console.log('[Dev Mode] Fixed UUID in extension.json');
	}
	return extensionConfig;
}

const extensionConfig = resolveExtensionConfig();
const EEXT_FILENAME = `${extensionConfig.name}_v${extensionConfig.version}.eext`;
const EEXT_PATH = path.join(DIST_DIR, EEXT_FILENAME);

/**
 * 读取 eext 文件并转为 base64
 */
async function getEextBase64(): Promise<string> {
	const buffer = await fs.readFile(EEXT_PATH);
	return buffer.toString('base64');
}

/**
 * 向所有已连接的 WebSocket 客户端推送 eext 文件
 */
async function broadcastEext(wss: WebSocketServer): Promise<void> {
	let base64Content: string;
	try {
		base64Content = await getEextBase64();
	}
	catch (err) {
		console.error('[Dev Mode] Failed to read eext file:', err);
		return;
	}

	const message = JSON.stringify({
		type: 'file',
		topic: 'Dev Mode Extension Package Update',
		content: base64Content,
		fileName: EEXT_FILENAME,
		fileMimeType: 'application/octet-stream',
	});

	let clientCount = 0;
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(message);
			clientCount++;
		}
	});
	console.log(`[Dev Mode] Pushed update to ${clientCount} client(s): ${EEXT_FILENAME}`);
}

/**
 * 主逻辑
 */
async function main() {
	// 确保 dist 目录存在
	fs.ensureDirSync(DIST_DIR);

	// 启动 WebSocket 服务器
	const wss = new WebSocketServer({ port: WEBSOCKET_PORT });
	console.log(`[Dev Mode] WebSocket server started: ws://localhost:${WEBSOCKET_PORT}`);

	wss.on('connection', async (ws) => {
		console.log('[Dev Mode] New client connected');

		// 客户端首次连接时，发送当前最新的 eext 文件
		try {
			const base64Content = await getEextBase64();
			const message = JSON.stringify({
				type: 'file',
				topic: 'Dev Mode Extension Package Update',
				content: base64Content,
				fileName: EEXT_FILENAME,
				fileMimeType: 'application/octet-stream',
			});
			ws.send(message);
			console.log(`[Dev Mode] Sent current version to new client: ${EEXT_FILENAME}`);
		}
		catch (err) {
			console.error('[Dev Mode] Failed to send initial eext:', err);
		}

		ws.on('close', () => {
			console.log('[Dev Mode] Client disconnected');
		});
	});

	// 监听构建完成事件，增量构建后自动打包并推送
	let buildTimeout: NodeJS.Timeout | null = null;
	const rebuildPlugin = {
		name: 'rebuild-notify',
		setup(build: esbuild.PluginBuild) {
			build.onEnd((result) => {
				if (result.errors.length === 0) {
					// 防抖处理，避免短时间内多次触发
					if (buildTimeout) {
						clearTimeout(buildTimeout);
					}
					buildTimeout = setTimeout(async () => {
						console.log('[Dev Mode] Change detected, repackaging...');
						try {
							await packageExtension(ROOT_DIR, EEXT_PATH);
							console.log('[Dev Mode] Repackaging complete');
							await broadcastEext(wss);
						}
						catch (err) {
							console.error('[Dev Mode] Repackaging failed:', err);
						}
					}, 300);
				}
			});
		},
	};

	// 创建带插件的 context
	const ctx = await esbuild.context({
		...common,
		plugins: [rebuildPlugin],
	});

	// 初始构建
	console.log('[Dev Mode] Starting initial build...');
	await ctx.rebuild();
	console.log('[Dev Mode] Initial build complete');

	// 初始打包
	console.log('[Dev Mode] Starting to package extension...');
	await packageExtension(ROOT_DIR, EEXT_PATH);
	// 启动文件监听
	await ctx.watch();
	console.log('[Dev Mode] File watcher started, waiting for changes...');
}

main().catch((err) => {
	console.error('[Dev Mode] Error occurred:', err);
	process.exit(1);
});
