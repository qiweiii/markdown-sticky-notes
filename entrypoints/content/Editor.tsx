import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";
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

const availableThemes = themes as Record<string, unknown>;

const Editor = (props: Props) => {
  const themeName = themeOptions.includes(props.theme) ? props.theme : "monokai";

  return (
    <div style={{ height: "100%" }}>
      {/* https://github.com/uiwjs/react-codemirror */}
      <CodeMirror
        className="markdown-sticky-note-CodeMirror"
        height="100%"
        value={props.value}
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
          EditorView.lineWrapping,
          EditorView.domEventHandlers({
            keydown(event) {
              event.stopPropagation();
              return false;
            },
            keyup(event) {
              event.stopPropagation();
              return false;
            },
          }),
        ]}
        onChange={props.onChange}
        // @ts-ignore
        theme={availableThemes[themeName]}
        autoFocus={props.autofocus}
        style={{ fontSize: props.fontSize, fontFamily: props.fontFamily }}
      />
    </div>
  );
};

export default Editor;
