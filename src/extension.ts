import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface FilePair {
    name: string;
    patterns: string[];
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "switch-hs" is now active');

    let disposable = vscode.commands.registerCommand('switch-hs.switchFile', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor found');
            return;
        }

        const currentFilePath = editor.document.uri.fsPath;
        const targetFilePath = await findTargetFile(currentFilePath);

        if (targetFilePath) {
            try {
                const document = await vscode.workspace.openTextDocument(targetFilePath);
                await vscode.window.showTextDocument(document);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to open file: ${error}`);
            }
        } else {
            vscode.window.showInformationMessage('No matching file found');
        }
    });

    context.subscriptions.push(disposable);
}

async function findTargetFile(currentFilePath: string): Promise<string | undefined> {
    const config = vscode.workspace.getConfiguration('switch-hs');
    const filePairs: FilePair[] = config.get('filePairs') || [];

    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        vscode.window.showWarningMessage('No workspace folder is open');
        return undefined;
    }

    const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const fileBasename = path.basename(currentFilePath);
    const fileBasenameNoExtension = path.basename(currentFilePath, path.extname(currentFilePath));
    const fileExtension = path.extname(currentFilePath).substring(1); // Remove the dot

    for (const pair of filePairs) {
        const resolvedPatterns = pair.patterns.map(pattern =>
            pattern
                .replace(/{workspaceFolder}/g, workspaceFolder)
                .replace(/{fileBasename}/g, fileBasename)
                .replace(/{fileBasenameNoExtension}/g, fileBasenameNoExtension)
                .replace(/{fileExtension}/g, fileExtension)
        );

        // Find the index of the pattern that matches the current file
        const currentPatternIndex = resolvedPatterns.findIndex(pattern =>
            normalizePath(pattern) === normalizePath(currentFilePath)
        );

        if (currentPatternIndex !== -1) {
            // Get the next pattern in the cycle
            const nextPatternIndex = (currentPatternIndex + 1) % resolvedPatterns.length;
            const targetPath = resolvedPatterns[nextPatternIndex];

            // Check if the target file exists
            if (fs.existsSync(targetPath)) {
                return targetPath;
            }

            // If the target file doesn't exist, ask the user if they want to create it
            const createFile = await vscode.window.showQuickPick(['Yes', 'No'], {
                placeHolder: `File ${targetPath} does not exist. Create it?`
            });

            if (createFile === 'Yes') {
                // Ensure the directory exists
                const targetDir = path.dirname(targetPath);
                if (!fs.existsSync(targetDir)) {
                    fs.mkdirSync(targetDir, { recursive: true });
                }

                // Create an empty file
                fs.writeFileSync(targetPath, '');
                return targetPath;
            }
        }
    }

    return undefined;
}

// Normalize path for cross-platform comparison
function normalizePath(filePath: string): string {
    return filePath.replace(/\\/g, '/').toLowerCase();
}

export function deactivate() { } 