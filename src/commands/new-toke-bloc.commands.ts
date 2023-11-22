import * as lodash from "lodash";
import * as mkdirp from "mkdirp";
import * as changeCase from "change-case";

import { InputBoxOptions, OpenDialogOptions, Uri, window, workspace } from "vscode";
import { existsSync, lstatSync, writeFile } from "fs";
import { getBlocEventTemplate, getBlocStateTemplate, getBlocTemplate } from "../utils";

export const newTokeBloc = async (uri: Uri) => {
    const blocName = await promptForBlocName();
    if (lodash.isNil(blocName) || blocName.trim() === "") {
        window.showErrorMessage("The bloc name must not be empty");
        return;
    }

    let targetDirectory;
    if (lodash.isNil(lodash.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
        targetDirectory = await promptForTargetDirectory();
        if (lodash.isNil(targetDirectory)) {
            window.showErrorMessage("Please select a valid directory");
            return;
        }
    } else {
        targetDirectory = uri.fsPath;
    }

    const pascalCaseBlocName = changeCase.pascalCase(blocName);
    try {
        await generateBlocCode(blocName, targetDirectory);
        window.showInformationMessage(
            `Successfully Generated ${pascalCaseBlocName} Bloc`
        );
    } catch (error) {
        window.showErrorMessage(
            `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
        );
    }
}

function promptForBlocName(): Thenable<string | undefined> {
    const blocNamePromptOptions: InputBoxOptions = {
        prompt: "Bloc Name",
        placeHolder: "counter",
    };
    return window.showInputBox(blocNamePromptOptions);
}

async function promptForTargetDirectory(): Promise<string | undefined> {
    const options: OpenDialogOptions = {
        canSelectMany: false,
        openLabel: "Select a folder to create the bloc in",
        canSelectFolders: true,
    };

    return window.showOpenDialog(options).then((uri) => {
        if (lodash.isNil(uri) || lodash.isEmpty(uri)) {
            return undefined;
        }
        return uri[0].fsPath;
    });
}

async function generateBlocCode(
    blocName: string,
    targetDirectory: string,
) {
    const shouldCreateDirectory = workspace
        .getConfiguration("bloc")
        .get<boolean>("newBlocTemplate.createDirectory");
    const blocDirectoryPath = shouldCreateDirectory
        ? `${targetDirectory}/bloc`
        : targetDirectory;
    if (!existsSync(blocDirectoryPath)) {
        await createDirectory(blocDirectoryPath);
    }

    await Promise.all([
        createBlocEventTemplate(blocName, blocDirectoryPath),
        createBlocStateTemplate(blocName, blocDirectoryPath),
        createBlocTemplate(blocName, blocDirectoryPath),
    ]);
}

function createDirectory(targetDirectory: string): Promise<void> {
    return new Promise((resolve, reject) => {
        mkdirp(targetDirectory, (error) => {
            if (error) {
                return reject(error);
            }
            resolve();
        });
    });
}

function createBlocEventTemplate(
    blocName: string,
    targetDirectory: string,
) {
    const snakeCaseBlocName = changeCase.snakeCase(blocName);
    const targetPath = `${targetDirectory}/${snakeCaseBlocName}_event.dart`;
    if (existsSync(targetPath)) {
        throw Error(`${snakeCaseBlocName}_event.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
        writeFile(
            targetPath,
            getBlocEventTemplate(blocName),
            "utf8",
            (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            }
        );
    });
}

function createBlocStateTemplate(
    blocName: string,
    targetDirectory: string,
) {
    const snakeCaseBlocName = changeCase.snakeCase(blocName);
    const targetPath = `${targetDirectory}/${snakeCaseBlocName}_state.dart`;
    if (existsSync(targetPath)) {
        throw Error(`${snakeCaseBlocName}_state.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
        writeFile(
            targetPath,
            getBlocStateTemplate(blocName),
            "utf8",
            (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            }
        );
    });
}

function createBlocTemplate(
    blocName: string,
    targetDirectory: string,
) {
    const snakeCaseBlocName = changeCase.snakeCase(blocName);
    const targetPath = `${targetDirectory}/${snakeCaseBlocName}_bloc.dart`;
    if (existsSync(targetPath)) {
        throw Error(`${snakeCaseBlocName}_bloc.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
        writeFile(targetPath, getBlocTemplate(blocName), "utf8", (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}
