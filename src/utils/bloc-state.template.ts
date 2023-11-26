import * as changeCase from "change-case";

export function getBlocStateTemplate(blocName: string): string {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  return `part of '${snakeCaseBlocName}_bloc.dart';

class ${pascalCaseBlocName}Loaded extends Loaded {
  @override
  List<Object?> get props => [];
}

class ${pascalCaseBlocName}State extends ITokeStates {
  ${pascalCaseBlocName}State._(super.union);

  factory ${pascalCaseBlocName}State.initial() => ${pascalCaseBlocName}State._(TokeState.initial());

  factory ${pascalCaseBlocName}State.loading() => ${pascalCaseBlocName}State._(TokeState.loading());

  factory ${pascalCaseBlocName}State.loaded() =>
      ${pascalCaseBlocName}State._(TokeState.loaded(state: ${pascalCaseBlocName}Loaded()));

  factory ${pascalCaseBlocName}State.failed({required String message}) =>
      ${pascalCaseBlocName}State._(TokeState.failed(message: message));
}
`;
}
