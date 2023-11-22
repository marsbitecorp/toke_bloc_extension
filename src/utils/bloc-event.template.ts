import * as changeCase from "change-case";

export function getBlocEventTemplate(blocName: string): string {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  return `part of '${snakeCaseBlocName}_bloc.dart';

sealed class ${pascalCaseBlocName}Event extends Equatable {
  const ${pascalCaseBlocName}Event();

  @override
  List<Object> get props => [];
}
`;
}