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
// import markdown from 'highlight.js/lib/languages/markdown';
// import java from 'highlight.js/lib/languages/java';
// import python from 'highlight.js/lib/languages/python';
// hljs.registerLanguage('markdown', markdown);
// hljs.registerLanguage('java', java);
// hljs.registerLanguage('python', python);
import CloseIcon from '@material-ui/icons/Close';
// import MinimizeIcon from '@material-ui/icons/Minimize';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const themes = [
  '3024-day',
  '3024-night',
  'abcdef',
  'ambiance',
  'base16-dark',
  'bespin',
  'base16-light',
  'blackboard',
  'cobalt',
  'colorforth',
  'dracula',
  'duotone-dark',
  'duotone-light',
  'eclipse',
  'elegant',
  'erlang-dark',
  'gruvbox-dark',
  'hopscotch',
  'icecoder',
  'isotope',
  'lesser-dark',
  'liquibyte',
  'lucario',
  'material',
  'material-darker',
  'material-palenight',
  'material-ocean',
  'mbo',
  'mdn-like',
  'midnight',
  'monokai',
  'moxer',
  'neat',
  'neo',
  'night',
  'nord',
  'oceanic-next',
  'panda-syntax',
  'paraiso-dark',
  'paraiso-light',
  'pastel-on-dark',
  'railscasts',
  'rubyblue',
  'seti',
  'shadowfox',
  'solarized',
  'the-matrix',
  'tomorrow-night-bright',
  'tomorrow-night-eighties',
  'ttcn',
  'twilight',
  'vibrant-ink',
  'xq-dark',
  'xq-light',
  'yeti',
  'idea',
  'darcula',
  'yonce',
  'zenburn',
];
const ITEM_HEIGHT = 20;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
      width:150,
    },
  },
};

export default class Note extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // fontSize: 16,
      // fontFamily: "Consolas,monaco,monospace",
      // noteDim: {
      //   x: 250, y: 250
      // },
      id: props.id,
      // selected: true,
      openSetting: false,
      anchorEl: null,
      anchorElHelp: null,
      theme: 'monokai',
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

  handleClick(e) {
    // console.log(e.target)
    if (e.target.className==="handle"||e.target.id==="settingButton"||e.target.id==="helpButton") return;
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
    this.setState({
      id: this.props.id
    })
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }
  handleMarkdownChange(evt) {
    this.setState({markdownSrc: evt.target.value})
    // this.setState({markdownSrc: evt});
  }
  handleDelete = () => {
    console.log("delete" + this.state.id)
    this.props.callback(this.state.id);
  }
  handleSettingClose = () => {
    this.setState({
      anchorEl: null
    });
  };
  handleSettingClick = (e) => {
    this.setState({
      anchorEl: e.currentTarget,
    });
  };
  handleHelpClose = () => {
    this.setState({
      anchorElHelp: null
    });
  };
  handleHelpClick = (e) => {
    this.setState({
      anchorElHelp: e.currentTarget
    });
  };

  render() {
    return (
      <div className="note-root">
        <Draggable bounds="body" handle=".handle">
          <Resizable 
            defaultSize={{
              width: 200,
              height: 250,
            }}
            // minWidth={200}
            // minHeight={200}
            // onResize={this.onResize}
          >
            <Paper elevation={10} className="markdown-sticky-note-paper">
              <div className="handle">
                <IconButton onClick={this.handleDelete} size="small">
                  <CloseIcon fontSize="small"/>
                </IconButton>
                {/* <IconButton size="small" onClick={this.handleMinimize}>
                  <MinimizeIcon fontSize="small"/>
                </IconButton> */}
                <IconButton 
                  aria-describedby={Boolean(this.state.anchorEl) ? 'setting-popover' : undefined} 
                  size="small"
                  onClick={this.handleSettingClick}
                >
                  <SettingsIcon id="settingButton" fontSize="small"/>
                </IconButton>
                <Popover
                  id="setting-popover"
                  open={Boolean(this.state.anchorEl)}
                  anchorEl={this.state.anchorEl}
                  onClose={this.handleSettingClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <FormControl style={{zIndex:1, margin:2}}>
                    <InputLabel id="mutiple-name-label">Editor Theme</InputLabel>
                    <Select
                      labelId="mutiple-name-label"
                      id="mutiple-name"
                      value={this.state.theme}
                      onChange={(e) => {this.setState({theme:e.target.value})}}
                      input={<Input />}
                      MenuProps={MenuProps}
                    >
                      {themes.map(name => (
                        <MenuItem key={name} value={name} >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Popover>
                <IconButton 
                  aria-describedby={Boolean(this.state.anchorElHelp) ? 'help-popover' : undefined} 
                  size="small"
                  onClick={this.handleHelpClick}
                >
                  <HelpOutlineIcon id="helpButton" fontSize="small"/>
                </IconButton>
                <Popover
                  id="help-popover"
                  open={Boolean(this.state.anchorElHelp)}
                  anchorEl={this.state.anchorElHelp}
                  onClose={this.handleHelpClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <div>
                    <MenuItem key={1} component="a" href="https://github.github.com/gfm/" target="_blank">
                      How to use markdown? <OpenInNewIcon fontSize='small'/>
                    </MenuItem>
                    <MenuItem key={2} component="a" href={this.props.optionsPage} target="_blank" >
                      Options page <OpenInNewIcon fontSize='small'/>
                    </MenuItem>
                  </div>
                </Popover>
              </div>
              
              {/* <Collapse in={this.state.selected} className="collapse"> */}
                {/* <Paper> */}
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
              <div ref={node => this.node = node} className="note-pane">
                { this.state.mode === 0 ?
                  <Editor 
                    value={this.state.markdownSrc} 
                    theme={this.state.theme}
                    fontSize={14}                           // later, let user choose
                    fontFamily="Consolas, monaco, monospace"// later, let user choose
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
              {/* </Paper> */}
            {/* </Collapse> */}
            </Paper>
          </Resizable>
        </Draggable>
      </div>
      // </div>
    )
  }
}