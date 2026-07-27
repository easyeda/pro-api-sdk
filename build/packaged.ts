import path from 'node:path';
import process from 'node:process';
import fs from 'fs-extra';

import * as extensionConfig from '../extension.json';
import { fixUuid, packageExtension, testUuid } from './utils';

/**
 * 主逻辑方法
 */
function main() {
	if (!testUuid(extensionConfig.uuid)) {
		const newExtensionConfig = { ...extensionConfig };
		// @ts-expect-error - Removing default property from extension config
		delete newExtensionConfig.default;
		newExtensionConfig.uuid = fixUuid(extensionConfig.uuid);
		fs.writeJsonSync(path.join(__dirname, '../extension.json'), newExtensionConfig, { spaces: '\t', EOL: '\n', encoding: 'utf-8' });
	}

	const rootDir = path.join(__dirname, '../');
	const outputPath = path.join(__dirname, 'dist', `${extensionConfig.name}_v${extensionConfig.version}.eext`);

	packageExtension(rootDir, outputPath).then(() => {
		console.log(`打包完成: ${outputPath}`);
	}).catch((err) => {
		console.error('打包失败:', err);
		process.exit(1);
	});
}

main();
