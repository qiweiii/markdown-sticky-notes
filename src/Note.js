import React from 'react';
import "./content.css";
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import Paper from '@material-ui/core/Paper';
// import InputBase from '@material-ui/core/InputBase';
import ReactMarkdown from 'react-markdown';
import Editor from './Editor';
import CodeBlock from './CodeBlock';
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
// from: https://www.cssfontstack.com/
const fonts = {
  "Consolas": "Consolas, monaco, monospace",
  "Courier New": `"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace`,
  "Anonymous Pro": "markdown-stick-notes-family-anonymous-pro",
  "B612 Mono": "markdown-stick-notes-family-b612-mono",
  "Fira Code": "markdown-stick-notes-family-fira-code",
  "Inconsolata": "markdown-stick-notes-family-inconsolata",
  "Nanum Gothic Coding": "markdown-stick-notes-family-nanum-gothic_coding",
  "PT Mono": "markdown-stick-notes-family-pt-mono",
  "Roboto Mono": "markdown-stick-notes-family-roboto-mono",
  "Share Tech Mono": "markdown-stick-notes-family-share-tech-mono",
  "Source Code Pro": "markdown-stick-notes-family-source-code-pro",
  "Space Mono": "markdown-stick-notes-family-space-mono",
  "Ubuntu Mono": "markdown-stick-notes-family-ubuntu-mono"
};
const ITEM_HEIGHT = 20;
const ITEM_PADDING_TOP = 5;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
      width:200,
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
      // selected: true,
      id: props.id,
      openSetting: false,
      anchorEl: null,
      anchorElHelp: null,
      theme: props.defaultTheme,
      editorFontSize: props.editorFontSize,
      editorFontFamily: props.editorFontFamily,
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
        <Draggable 
          bounds="body"
          handle=".handle" 
          defaultClassName={"markdown-react-draggable"+this.props.id} 
          defaultPosition={{x:this.props.x, y:this.props.y}}
          // defaultPosition={{x:window.innerWidth*0.3, y:window.innerHeight*0.5}}
        >
          <Resizable 
            defaultSize={{
              width: 200,
              height: 250,
            }}
            minWidth={150}
            minHeight={150}
            // onResize={this.onResize}
          >
            <Paper elevation={10} className="markdown-sticky-note-paper">

              {/* Note tool bar */}
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
                  <FormControl style={{zIndex:1, margin:1, width:100}}>
                    <InputLabel id="theme-label">Editor Theme</InputLabel>
                    <Select
                      labelId="theme-label"
                      id="mutiple-theme"
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
                  <FormControl style={{zIndex:1, margin:1, width:100}}>
                    <InputLabel id="fontsize-label">Editor FontSize</InputLabel>
                    <Select
                      labelId="fontsize-label"
                      id="mutiple-fontsize"
                      value={this.state.editorFontSize}
                      onChange={(e) => {this.setState({editorFontSize:e.target.value})}}
                      input={<Input />}
                      MenuProps={MenuProps}
                    >
                      {Array.from(new Array(40), (x,i) => i + 8).map(size => (
                        <MenuItem key={size} value={size} >
                          {size}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl style={{zIndex:1, margin:1, width:100}}>
                    <InputLabel id="fontsize-label">Editor FontSize</InputLabel>
                    <Select
                      labelId="fontsize-label"
                      id="mutiple-fontsize"
                      value={this.state.editorFontFamily}
                      onChange={(e) => {this.setState({editorFontFamily:e.target.value})}}
                      input={<Input />}
                      MenuProps={MenuProps}
                    >
                      {Object.entries(fonts).map(([font, family]) => (
                        <MenuItem key={font} value={family} >
                          {font}
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

              {/* Note editor & dissplay area */}
              <div ref={node => this.node = node} className="note-pane">
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
                { this.state.mode === 0 ?
                  <Editor 
                    value={this.state.markdownSrc} 
                    theme={this.state.theme}
                    fontSize={this.state.editorFontSize}
                    fontFamily={this.state.editorFontFamily}
                    onChange={this.handleMarkdownChange} 
                  />
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
    )
  }
}