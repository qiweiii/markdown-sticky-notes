import { useRef } from "react";
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import * as themes from "@uiw/codemirror-themes-all";

type Props = {
  onChange: (value: string, viewUpdate: ViewUpdate) => void;
  value: string;
  theme: string;
  fontSize: number;
  fontFamily: string;
  autofocus: boolean;
};

const Editor = (props: Props) => {
  const editorRef = useRef();

  return (
    <div style={{ height: '100%' }}>
      {/* https://github.com/uiwjs/react-codemirror */}
      <CodeMirror
        value={props.value}
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
        ]}
        onChange={props.onChange}
        // @ts-ignore
        theme={themes[props.theme]} // TODO: check if all previous theme are working, then add new themes to ../thems
        autoFocus={props.autofocus}
        style={{ fontSize: props.fontSize, fontFamily: props.fontFamily }}
        height="100%"
      // basicSetup={false}
      />
    </div>
  );
};

export default Editor;
