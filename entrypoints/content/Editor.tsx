import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import * as themes from "@uiw/codemirror-themes-all";
import themeOptions from "@/entrypoints/themes";

type Props = {
  onChange: (value: string, viewUpdate: ViewUpdate) => void;
  value: string;
  theme: string;
  fontSize: number;
  fontFamily: string;
  autofocus: boolean;
};

const Editor = (props: Props) => {

  return (
    <div style={{ height: '100%' }}>
      {/* https://github.com/uiwjs/react-codemirror */}
      <CodeMirror
        className="CodeMirror"
        height="100%"
        value={props.value}
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
        ]}
        onChange={props.onChange}
        // @ts-ignore
        theme={themes[themeOptions.includes(props.theme) ? props.theme : 'monokai']}
        autoFocus={props.autofocus}
        style={{ fontSize: props.fontSize, fontFamily: props.fontFamily }}
      />
    </div>
  );
};

export default Editor;
