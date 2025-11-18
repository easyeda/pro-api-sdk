/**
 * 入口文件
 *
 * 本文件为默认扩展入口文件，如果你想要配置其它文件作为入口文件，
 * 请修改 `extension.json` 中的 `entry` 字段；
 *
 * 请在此处使用 `export`  导出所有你希望在 `headerMenus` 中引用的方法，
 * 方法通过方法名与 `headerMenus` 关联。
 *
 * 如需了解更多开发细节，请阅读：
 * https://prodocs.lceda.cn/cn/api/guide/
 */
import * as extensionConfig from '../extension.json';
import AIOrchestrator from './ai/AIOrchestrator';

// AIオーケストレーターのグローバルインスタンス
let orchestrator: AIOrchestrator | null = null;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function activate(status?: 'onStartupFinished', arg?: string): Promise<void> {
	try {
		// API キーを設定から取得
		const gpt51ApiKey = eda.sys_Storage.getExtensionUserConfig('gpt51_api_key');
		const geminiApiKey = eda.sys_Storage.getExtensionUserConfig('gemini_api_key');

		// 両方のAPIキーが設定されている場合、AIオーケストレーターを初期化
		if (gpt51ApiKey && geminiApiKey) {
			const config = {
				gpt51: {
					apiKey: gpt51ApiKey,
					model: 'gpt-5.1-preview' as const,
					baseURL: 'https://api.openai.com/v1/chat/completions',
				},
				gemini25: {
					apiKey: geminiApiKey,
					model: 'gemini-2.5-pro' as const,
				},
			};

			orchestrator = new AIOrchestrator(config);
			console.log('AIOrchestrator initialized successfully');
		} else {
			console.log('AI APIキーが未設定のため、AIオーケストレーターは初期化されませんでした');
		}
	} catch (error) {
		console.error('Error initializing AIOrchestrator:', error);
	}
}

export function about(): void {
	eda.sys_Dialog.showInformationMessage(
		eda.sys_I18n.text('EasyEDA extension SDK v', undefined, undefined, extensionConfig.version),
		eda.sys_I18n.text('About'),
	);
}

/**
 * AI設定を構成する関数
 */
export async function configureAISettings(): Promise<void> {
	try {
		// OpenAI APIキーの設定
		const currentGpt51Key = eda.sys_Storage.getExtensionUserConfig('gpt51_api_key') || '';
		const gpt51Key = await eda.sys_Dialog.showInputBox('OpenAI API キーを入力してください (GPT-5.1用)', currentGpt51Key, {
			placeHolder: 'sk-...',
			password: true,
		});

		if (gpt51Key !== null && gpt51Key !== undefined) {
			await eda.sys_Storage.setExtensionUserConfig('gpt51_api_key', gpt51Key);
		}

		// Gemini APIキーの設定
		const currentGeminiKey = eda.sys_Storage.getExtensionUserConfig('gemini_api_key') || '';
		const geminiKey = await eda.sys_Dialog.showInputBox('Google Gemini API キーを入力してください (Gemini 2.5用)', currentGeminiKey, {
			placeHolder: 'AIza...',
			password: true,
		});

		if (geminiKey !== null && geminiKey !== undefined) {
			await eda.sys_Storage.setExtensionUserConfig('gemini_api_key', geminiKey);
		}

		// 両方のキーが設定されている場合、AIオーケストレーターを再初期化
		if (gpt51Key && geminiKey) {
			const config = {
				gpt51: {
					apiKey: gpt51Key,
					model: 'gpt-5.1-preview' as const,
					baseURL: 'https://api.openai.com/v1/chat/completions',
				},
				gemini25: {
					apiKey: geminiKey,
					model: 'gemini-2.5-pro' as const,
				},
			};

			orchestrator = new AIOrchestrator(config);

			eda.sys_Dialog.showInformationMessage('AI設定が保存され、AIオーケストレーターが初期化されました。', '成功');
		} else {
			eda.sys_Dialog.showInformationMessage('API キーが保存されました。両方のキーを設定するとAI機能が有効になります。', '保存完了');
		}
	} catch (error: any) {
		eda.sys_Dialog.showInformationMessage(`AI設定の保存中にエラーが発生しました: ${error.message}`, 'エラー');
	}
}

/**
 * AI回路デザイナーを開く
 */
export async function openAICircuitDesigner(): Promise<void> {
	// orchestrator が初期化されているか確認
	if (!orchestrator) {
		const result = await eda.sys_Dialog.showQuestionMessage(
			'AI機能を使用するには、OpenAI と Gemini の API キーを設定する必要があります。\n\n今すぐ設定しますか?',
			'AI設定が必要です',
		);

		if (result) {
			await configureAISettings();
		}
		return;
	}

	// iFrameダイアログを開く
	try {
		await eda.sys_IFrame.openIFrame('/iframe/ai-designer.html', 1200, 800, 'ai-designer-main', {
			maximizeButton: true,
			minimizeButton: false,
			grayscaleMask: true,
		});
	} catch (error: any) {
		eda.sys_Dialog.showInformationMessage(`AI回路デザイナーの起動に失敗しました: ${error.message}`, 'エラー');
	}
}

/**
 * iFrame からのメッセージを受信して処理
 */
if (typeof window !== 'undefined') {
	window.addEventListener('message', async (event) => {
		if (event.data.type === 'PROCESS_USER_INPUT') {
			try {
				// orchestrator が初期化されているか確認
				if (!orchestrator) {
					event.source?.postMessage(
						{
							type: 'DESIGN_RESPONSE',
							error: 'AIオーケストレーターが初期化されていません。AI設定を確認してください。',
						},
						event.origin as any,
					);
					return;
				}

				const response = await orchestrator.processUserRequest(event.data.input, event.data.context);

				// 結果を iFrame に送信
				event.source?.postMessage(
					{
						type: 'DESIGN_RESPONSE',
						response,
					},
					event.origin as any,
				);
			} catch (error: any) {
				// エラーハンドリング
				event.source?.postMessage(
					{
						type: 'DESIGN_RESPONSE',
						error: `処理中にエラーが発生しました: ${error.message}`,
					},
					event.origin as any,
				);
			}
		}
	});
}
