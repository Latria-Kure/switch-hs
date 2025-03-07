import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Starting all tests.');

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('switch-hs'));
    });

    test('Should register commands', async () => {
        const commands = await vscode.commands.getCommands();
        assert.ok(commands.includes('switch-hs.switchFile'));
    });
}); 