import React from 'react';
import "./content.css";
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import Paper from '@material-ui/core/Paper';
// import InputBase from '@material-ui/core/InputBase';
import "./Note.css";
import hljs from 'highlight.js/lib/highlight';
import markdown from 'highlight.js/lib/languages/markdown';
import ReactMarkdown from 'react-markdown';
import Editor from './Editor';
import CodeBlock from './CodeBlock';

hljs.registerLanguage('markdown', markdown);

const stylesRoot = {
  height: "100%",
  width: "100%",
}
// const styleText = {
//   lineHeight: "1.18em",
//   paddingLeft: 3
// }

export default class Note extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // fontSize: 16,
      // fontFamily: "Consolas,monaco,monospace",
      // noteDim: {
      //   x: 250, y: 250
      // },
      markdownSrc: "",
    };
    this.handleMarkdownChange = this.handleMarkdownChange.bind(this)
  }

  handleMarkdownChange(evt) {
    this.setState({markdownSrc: evt.target.value})
  }

  // onResize = (e, direction, ref, d) => {
  //   const {x, y} = this.state.noteDim;
  //   console.log(d)
  //   this.setState({
  //     noteDim: {
  //       x: x + d.width,
  //       y: y + d.height,
  //     }
  //   });
  // }

  render() {
    return (
      <Draggable handle=".handle">
        <div>
          <Resizable 
            defaultSize={{
              width: 250,
              height: 280,
            }}
            minWidth={200}
            minHeight={200}
          >
            <Paper elevation={4} style={stylesRoot}>
              <div className="handle">Drag bar here</div>
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
              <Editor 
                value={this.state.markdownSrc} 
                theme='monokai'                         // let user choose
                fontSize={20}                           // let user choose
                fontFamily="Consolas,monaco,monospace"  // let user choose
                onChange={this.handleMarkdownChange} 
              />
            </Paper>
          </Resizable>
        </div>
      </Draggable>
    )
  }
}