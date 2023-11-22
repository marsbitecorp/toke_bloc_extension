import { ExtensionContext, commands, languages } from 'vscode';
import { newTokeBloc, wrapWithTokeBlocBuilder, wrapWithTokeBlocSelector } from './commands';
import { BlocCodeActionProvider } from './code-actions';

const DART_MODE = { language: "dart", scheme: "file" };

export function activate(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand("extension.new-tokebloc", newTokeBloc),
		commands.registerCommand("extension.wrap-tokeblocbuilder", wrapWithTokeBlocBuilder),
		commands.registerCommand("extension.wrap-tokeblocselector", wrapWithTokeBlocSelector),
		languages.registerCodeActionsProvider(
			DART_MODE,
			new BlocCodeActionProvider()
		)
	);
}

export function deactivate() { }
