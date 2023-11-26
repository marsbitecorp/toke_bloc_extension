import * as changeCase from "change-case";

export function getBlocTemplate(blocName: string) {
  const pascalCaseBlocName = changeCase.pascalCase(blocName);
  const snakeCaseBlocName = changeCase.snakeCase(blocName);
  const blocState = `${pascalCaseBlocName}State`;
  const blocEvent = `${pascalCaseBlocName}Event`;
  return `import 'package:equatable/equatable.dart';
import 'package:toke_bloc/toke_bloc.dart';

part '${snakeCaseBlocName}_event.dart';
part '${snakeCaseBlocName}_state.dart';

class ${pascalCaseBlocName}Bloc extends Bloc<${blocEvent}, ${blocState}> {
  ${pascalCaseBlocName}Bloc() : super(${pascalCaseBlocName}State.initial()) {
    on<${blocEvent}>((event, emit) {
      // TODO: implement event handler
    });
  }
}
`;
}
