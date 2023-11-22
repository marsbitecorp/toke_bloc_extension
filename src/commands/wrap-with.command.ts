import { wrapWith } from "../utils";

const tokeBlocBuilderSnippet = (widget: string) => {
  return `TokeBlocBuilder<\${1:Subject}Bloc, $1State>(
  builder: (context, state) {
    return state.when(
      loaded: (loaded) {
        return ${widget};
      },
    );
  },
)`;
};

const tokeBlocSelectorSnippet = (widget: string) => {
  return `BlocSelector<\${1:Subject}Bloc}, \${3:State}, \${3:SelectionType}>(
  selector: (state) {
    return \${4:Selection};
  },
  builder: (context, state) {
    return ${widget};
  },
)`;
};


export const wrapWithTokeBlocBuilder = async () => wrapWith(tokeBlocBuilderSnippet);
export const wrapWithTokeBlocSelector = async () => wrapWith(tokeBlocSelectorSnippet);
