import * as extensionConfig from '../extension.json';

type TActivateStatus =
	| 'onCommands'
	| 'onLanguages'
	| 'onProjectOpened'
	| 'onEditorSchematic'
	| 'onEditorSymbol'
	| 'onEditorPcb'
	| 'onEditorFootprint'
	| 'onEditorPanel'
	| 'onStartupFinished'
	| 'onLogged';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function activate(status?: TActivateStatus, arg?: string): void {}

export async function about(): Promise<void> {
	eda.sys_MessageBox.showInformationMessage(
		eda.sys_I18n.text('EasyEDA extension SDK v', undefined, undefined, extensionConfig.version),
		eda.sys_I18n.text('About'),
	);
}
