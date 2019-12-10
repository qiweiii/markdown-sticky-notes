import React from 'react';
import "./content.css";
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import ReactMarkdown from 'react-markdown';
import Editor from './Editor';
import CodeBlock from './CodeBlock';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Popover from '@material-ui/core/Popover';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import Skeleton from '@material-ui/lab/Skeleton';

// rn will have conflict when open Popover and ButtonBasse in pages that use material-ui
// but still using material coz it's small and faster, also other library produce more conflicts...
// maybe completely move setting&option button to options page in future...
// OR implement in shadow DOM when i know how to use it

// import { Popover } from 'antd';
// import Popover from 'antd/es/popover';
// import 'antd/es/popover/style/css';
// import 'bootstrap/dist/css/bootstrap.min.css';


const themes = [
  '3024-day',
  '3024-night',
  'abcdef',
  'base16-dark',
  'bespin',
  'base16-light',
  'blackboard',
  'cobalt',
  'duotone-dark',
  'duotone-light',
  'eclipse',
  'elegant',
  'erlang-dark',
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
  'neat',
  'neo',
  'night',
  'nord',
  'oceanic-next',
  'panda-syntax',
  'paraiso-dark',
  'paraiso-light',
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
  'yonce',
];
const fonts = {
  "Consolas": `"Consolas", "monaco", monospace`,
  "Courier New": `"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace`,
  "Anonymous Pro": "markdown-stick-notes-family-anonymous-pro",
  "B612 Mono": "markdown-stick-notes-family-b612-mono",
  "Inconsolata": "markdown-stick-notes-family-inconsolata",
  "PT Mono": "markdown-stick-notes-family-pt-mono",
  "Roboto Mono": "markdown-stick-notes-family-roboto-mono",
  "Source Code Pro": "markdown-stick-notes-family-source-code-pro",
  "Space Mono": "markdown-stick-notes-family-space-mono",
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
      noteDim: {
        x: 200, y: 250 // width and height from resizable
      },
      position: {
        x: props.x, y: props.y // x,y position from draggable
      },
      id: props.id,
      openSetting: false,
      anchorEl: null,
      anchorElHelp: null,
      dragging: false,
      // visible1: false,
      // visible2: false,
      theme: props.defaultTheme,
      editorFontSize: props.editorFontSize,
      editorFontFamily: props.editorFontFamily,
      mode: 0, // 0 for editting, 1 for display
      markdownSrc: `# Live demo

Changes are automatically rendered as you type.

## Table of Contents

* Renders actual, "native" React DOM elements
* Allows you to escape or skip HTML (try toggling the checkboxes above)
* If you escape or skip the HTML, no \`dangerouslySetInnerHTML\` is used! Yay!

## HTML block below
<blockquote>
  This blockquote will change based on the HTML settings above.
</blockquote>

## How about some code?
`
    };
    this.handleMarkdownChange = this.handleMarkdownChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    // console.log(e.target)
    if (e.target.id==="settingButton"||e.target.id==="helpButton") return;
    // if (e.target.className==="handle"||e.target.id==="settingButton"||e.target.id==="helpButton") return;
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
    document.addEventListener('mousedown', this.handleClick, false);
    this.setState({
      id: this.props.id
    })
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }
  handleMarkdownChange(evt) {
    this.setState({markdownSrc: evt.target.value})
    // this.setState({markdownSrc: evt});
  }
  handleDelete = () => {
    console.log("delete " + this.state.id)
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
  handleStart = (e) => { // draggable
    // this.node.style.display = "none"; 
    if (e.target.id==="settingButton"||e.target.id==="helpButton") return;
    this.setState({dragging: true}); // a dump way to map dragging smoother
  }
  handleStop = (e, d) => { // draggable
    this.setState({dragging: false});
    this.setState({
      position: {
        x: this.state.position.x + d.x,
        y: this.state.position.y+ d.y,
      }
    });
  }
  onResizeStop = (e, direction, ref, d) => {
    this.setState({
      noteDim: {
        x: this.state.noteDim.x + d.width,
        y: this.state.noteDim.y+ d.height,
      }
    });
  }
  // handleVisible1Change = visible => { // setting popover
  //   this.setState({ visible1: visible });
  // };
  // handleVisible2Change = visible => { // help popover
  //   this.setState({ visible2: visible });
  // };
  // renderSettingPopOver = () => {
  //   // return (
 
  //   // )
  // }

  render() {
    return (
      <div className="note-root">
        <Draggable 
          bounds="body"
          handle=".handle" 
          onStart={this.handleStart}
          onStop={this.handleStop}
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
            onResizeStop={this.onResizeStop}
          >
            <div className="markdown-sticky-note-paper">

              {/* Note tool bar */}
              <div className="handle">
                <button className="markdown-sticky-note-button" onClick={this.handleDelete} size="small">
                  <CloseIcon fontSize="small"/>
                </button>
                {/* <button size="small" onClick={this.handleMinimize}>
                  <MinimizeIcon fontSize="small"/>
                </button> */}
                <button 
                  className="markdown-sticky-note-button"
                  aria-describedby={Boolean(this.state.anchorEl) ? 'setting-popover' : undefined} 
                  size="small"
                  onClick={this.handleSettingClick}
                >
                  <SettingsIcon id="settingButton" fontSize="small"/>
                </button>
                <Popover
                  // id="setting-popover"
                  // content={this.renderSettingPopOver}
                  // trigger="click"
                  // visible={this.state.visible1}
                  // onVisibleChange={this.handleVisible1Change}
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
                  <FormControl style={{zIndex:1, margin:5, width:100}}>
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
                  <FormControl style={{zIndex:1, margin:5, width:100}}>
                    <InputLabel id="fontsize-label">Editor FontSize</InputLabel>
                    <Select
                      labelId="fontsize-label"
                      id="mutiple-fontsize"
                      value={this.state.editorFontSize}
                      onChange={(e) => {this.setState({editorFontSize:e.target.value})}}
                      input={<Input />}
                      MenuProps={MenuProps}
                    >
                      {Array.from(new Array(40), (x,i) => i + 9).map(size => (
                        <MenuItem key={size} value={size} >
                          {size}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl style={{zIndex:1, margin:5, width:100}}>
                    <InputLabel id="fontsize-label">Editor Font</InputLabel>
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
                <button 
                  className="markdown-sticky-note-button"
                  aria-describedby={Boolean(this.state.anchorElHelp) ? 'help-popover' : undefined} 
                  size="small"
                  onClick={this.handleHelpClick}
                >
                  <HelpOutlineIcon id="helpButton" fontSize="small"/>
                </button>
                {/* <Popover
                  id="help-popover"
                  style={{zIndex: 1500}}
                  content={
                    <div>
                    <a href="https://github.github.com/gfm/" rel="noopener noreferrer" target="_blank">
                      How to use markdown?<OpenInNewIcon fontSize='small'/>
                    </a>
                    <br/>
                    <a href={this.props.optionsPage} rel="noopener noreferrer" target="_blank">
                      Options Page<OpenInNewIcon fontSize='small'/>
                    </a>
                    </div>
                  }
                  trigger="click"
                  visible={this.state.visible2}
                  onVisibleChange={this.handleVisible2Change}
                  >
                
                </Popover> */}
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
                { this.state.dragging ?(
                  <div>
                    {Array.from(new Array(Math.floor(0.8*(this.state.noteDim.y-44)/26))).map((v, i) => (
                      <Skeleton key={i} height={20} disableAnimate={true} style={{ margin: 6 }} />
                    ))}
                    <Skeleton height={20} disableAnimate={true} style={{ margin: 6 }} width="80%" />
                  </div>
                ) : (
                 this.state.mode === 0 ?
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
                )}
              </div>
            </div>
          </Resizable>
        </Draggable>
      </div>
    )
  }
}