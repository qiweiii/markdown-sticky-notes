import React from 'react';
import "./content.css";
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import Paper from '@material-ui/core/Paper';
// import InputBase from '@material-ui/core/InputBase';
import ReactMarkdown from 'react-markdown';
import Editor from './Editor';
import CodeBlock from './CodeBlock';
// import Editor from 'react-simple-code-editor';
// import hljs from 'highlight.js/lib/highlight';
// import 'highlight.js/styles/github.css';
// import markdown from 'highlight.js/lib/languages/markdown';
// import java from 'highlight.js/lib/languages/java';
// import python from 'highlight.js/lib/languages/python';
// hljs.registerLanguage('markdown', markdown);
// hljs.registerLanguage('java', java);
// hljs.registerLanguage('python', python);
import CloseIcon from '@material-ui/icons/Close';
import MinimizeIcon from '@material-ui/icons/Minimize';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import IconButton from '@material-ui/core/IconButton';


export default class Note extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // fontSize: 16,
      // fontFamily: "Consolas,monaco,monospace",
      // noteDim: {
      //   x: 250, y: 250
      // },
      mode: 0, // 0 for editting, 1 for display
      markdownSrc: `# Live demo

Changes are automatically rendered as you type.

## Table of Contents

* Implements [GitHub Flavored Markdown](https://github.github.com/gfm/)
* Renders actual, "native" React DOM elements
* Allows you to escape or skip HTML (try toggling the checkboxes above)
* If you escape or skip the HTML, no \`dangerouslySetInnerHTML\` is used! Yay!

## HTML block below
<blockquote>
  This blockquote will change based on the HTML settings above.
</blockquote>

## How about some code?

\`\`\`js
var React = require('react');
var Markdown = require('react-markdown');
React.render(
  <Markdown source="# Your markdown here" />,
  document.getElementById('content')
);
\`\`\`

Pretty neat, eh?

## Tables?

| Feature   | Support |
| --------- | ------- |
| tables    | ✔ |
| alignment | ✔ |
| wewt      | ✔ |
## More info?
`
    };
    this.handleMarkdownChange = this.handleMarkdownChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleMarkdownChange(evt) {
    this.setState({markdownSrc: evt.target.value})
    // this.setState({markdownSrc: evt});
  }

  handleClick(e) {
    if (this.node.contains(e.target)) {
      // clicked inside of the component
      if (window.getSelection().toString()!=="") return;
      if (this.state.mode === 1) {
        this.setState({mode: 0});
      }
      return;
    }
    // clicked outside
    this.setState({mode: 1});
  }
  
  componentDidMount() {
    document.addEventListener('click', this.handleClick, false);
  }
  
  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  // onResize = (e, direction, ref, d) => {
  //   const {x, y} = this.state.noteDim;
  //   // console.log(d)
  //   this.setState({
  //     noteDim: {
  //       x: x + d.width,
  //       y: y + d.height,
  //     }
  //   });
  // }

  render() {
    return (
      <div className="note-root">
      <Draggable handle=".handle">
          <Resizable 
            defaultSize={{
              width: 200,
              height: 250,
            }}
            minWidth={200}
            minHeight={200}
            // onResize={this.onResize}
          >
            <Paper elevation={10} className="markdown-sticky-note-paper">
              {/* <InputBase 
                style={{fontFamily: this.state.fontFamily, fontSize: this.state.fontSize, ...styleText}}
                id="textfield" 
                variant="outlined"
                autoFocus={true}
                multiline={true}
                fullWidth={true}
                rows={((this.state.noteDim.y-18)/(this.state.fontSize*1.18))}
                inputProps={{ 'aria-label': 'naked' }}
              /> */}
              <div className="handle">
                <IconButton size="small">
                  <CloseIcon fontSize="small"/>
                </IconButton>
                <IconButton size="small">
                  <MinimizeIcon fontSize="small"/>
                </IconButton>
                <IconButton size="small">
                  <SettingsIcon fontSize="small"/>
                </IconButton>
                <IconButton size="small">
                  <HelpOutlineIcon fontSize="small"/>
                </IconButton>
              </div>
              <div ref={node => this.node = node} className="note-pane">
                { this.state.mode === 0 ?
                  <Editor 
                    value={this.state.markdownSrc} 
                    theme='monokai'                         // let user choose
                    fontSize={14}                           // let user choose
                    fontFamily="Consolas, monaco, monospace"// let user choose
                    onChange={this.handleMarkdownChange} 
                  />
                  // <div className="editor-pane">
                  //   <Editor 
                  //     value={this.state.markdownSrc}
                  //     onValueChange={this.handleMarkdownChange}
                  //     highlight={code => hljs.highlight('markdown', code).value}
                  //     padding={3}
                  //     style={{
                  //       fontFamily: '"Fira code", "Fira Mono", monospace',
                  //       fontSize: 14,
                  //     }}
                  //   />
                  // </div>
                  // <div></div>
                  :
                  <ReactMarkdown
                    className="result"
                    source={this.state.markdownSrc}
                    renderers={{code: CodeBlock}}
                  />
                }
              </div>
            </Paper>
          </Resizable>
      </Draggable>
      </div>
      // </div>
    )
  }
}