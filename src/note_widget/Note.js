import React from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import ReactMarkdown from 'react-markdown';
import Editor from './Editor';
import CodeBlock from './CodeBlock';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
// import PinDropIcon from '@material-ui/icons/PinDrop';
import Popover from '@material-ui/core/Popover';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import Skeleton from '@material-ui/lab/Skeleton';
import themes from '../themes.js';
import fonts from '../fonts.js';



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
        x: props.width, y: props.height // width and height from resizable
      },
      position: {
        x: props.x, y: props.y // x,y position for draggable
      },
      id: props.id,
      openSetting: false,
      anchorEl: null,
      anchorElHelp: null,
      dragging: false,
      theme: props.defaultTheme,
      editorFontSize: props.editorFontSize,
      editorFontFamily: props.editorFontFamily,
      mode: 0, // 0 for editting, 1 for display
      markdownSrc: props.content,
      opacity: props.opacity,
      pinColor: "action"
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
    // save immediately when change, maybe set a small interval?
    this.updateStorage();
  }
  handleDelete = () => { // arrow function to define your method so it is lexically bound
    this.props.deleteNoteFn(this.state.id);
  }
  updateStorage = () => {
    let updatedData = {
      id: this.state.id,
      x: this.state.position.x,
      y: this.state.position.y,
      width: this.state.noteDim.x,
      height: this.state.noteDim.y,
      content: this.state.markdownSrc,
      theme: this.state.theme,
      font: this.state.editorFontFamily,
      fontSize: this.state.editorFontSize
    }
    this.props.updateNoteFn(updatedData, this.state.id);
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
    if (e.target.id==="settingButton"||e.target.id==="helpButton") return;
    this.setState({dragging: true}); // a dump way to make dragging smoother
  }
  handleStop = (e, d) => { // draggable
    this.setState({dragging: false});
    this.setState({
      position: {
        x: d.x,
        y: d.y,
      }
    });
    this.updateStorage();
  }
  onResizeStop = (e, direction, ref, d) => {
    this.setState({
      noteDim: {
        x: this.state.noteDim.x + d.width,
        y: this.state.noteDim.y+ d.height,
      }
    });
    this.updateStorage();
  }
  handleChangeTheme = (e) => {
    this.setState({
      theme:e.target.value
    }, () => this.updateStorage())
  }
  handleChangeFont = (e) => {
    this.setState({
      editorFontFamily:e.target.value
    }, () => this.updateStorage())
  }
  handleChangeFontSize = (e) => {
    this.setState({
      editorFontSize:e.target.value
    }, () => this.updateStorage())
  }
  // Handle mouse down for updating zIndex of the focused note.
  // The following functions get DOM elem coz Draggable component does not accept style property
  handleMouseDown = () => {
    let curMaxZIndex = window.localStorage.getItem("md-curMaxIndex");
    let el = document.getElementsByClassName('markdown-react-draggable'+this.state.id)[0];
    if (el) el.style.zIndex = curMaxZIndex++;
    window.localStorage.setItem('md-curMaxIndex', curMaxZIndex);
  }
  // setPositionCSSProperty = () => {
  //   let el = document.getElementsByClassName('markdown-react-draggable'+this.state.id)[0];
  //   if (el) {
  //     el.style.position = el.style.position === "relative" ? "fixed" : "relative";
  //     this.state.pinColor === "action" ? this.setState({ pinColor: "primary" }) : this.setState({ pinColor: "action" });;
  //   }
  // }

  render() {
    return (
      <div className="note-root">
        <Draggable 
          // bounds="body"
          handle=".handle" 
          onStart={this.handleStart}
          onStop={this.handleStop}
          defaultClassName={"markdown-react-draggable"+this.props.id} 
          defaultPosition={{x: this.state.position.x, y: this.state.position.y}}
          // defaultPosition={{x:window.innerWidth*0.3, y:window.innerHeight*0.5}}
          onMouseDown={this.handleMouseDown}
          // bounds="parent"
        >
          <Resizable 
            defaultSize={{
              width: this.state.noteDim.x,
              height: this.state.noteDim.y,
            }}
            minWidth={100}
            minHeight={100}
            onResizeStop={this.onResizeStop}
          >
            <div className="markdown-sticky-note-paper" style={{opacity: `${this.state.opacity}`}}>
              {/* Note tool bar */}
              <div className="handle">
                <button className="markdown-sticky-note-button" onClick={this.handleDelete} size="small">
                  <CloseIcon fontSize="small"/>
                </button>
                <button 
                  className="markdown-sticky-note-button"
                  aria-describedby={Boolean(this.state.anchorEl) ? 'setting-popover' : undefined} 
                  size="small"
                  onClick={this.handleSettingClick}
                >
                  <SettingsIcon id="settingButton" fontSize="small"/>
                </button>
                <Popover
                  className="markdown-popover"
                  id="setting-popover"
                  disableScrollLock={true}
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
                  <FormControl style={{zIndex:1, margin:5, width:100}} className="markdown-setting-popover">
                    <InputLabel id="theme-label">Editor Theme</InputLabel>
                    <Select
                      labelId="theme-label"
                      id="mutiple-theme"
                      value={this.state.theme}
                      onChange={this.handleChangeTheme}
                      input={<Input />}
                      MenuProps={MenuProps}
                    >
                      {themes.map(name => (
                        <MenuItem key={name} value={name} className="markdown-setting-select">
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl style={{zIndex:1, margin:5, width:105}} className="markdown-setting-popover">
                    <InputLabel id="fontsize-label">Editor Font Size</InputLabel>
                    <Select
                      labelId="fontsize-label"
                      id="mutiple-fontsize"
                      value={this.state.editorFontSize}
                      onChange={this.handleChangeFontSize}
                      input={<Input />}
                      MenuProps={MenuProps}
                    >
                      {Array.from(new Array(40), (x,i) => i + 9).map(size => (
                        <MenuItem key={size} value={size} className="markdown-setting-select">
                          {size}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl style={{zIndex:1, margin:5, width:100}} className="markdown-setting-popover">
                    <InputLabel id="fontfamily-label">Editor Font</InputLabel>
                    <Select
                      labelId="fontfamily-label"
                      id="mutiple-fontfamily"
                      value={this.state.editorFontFamily}
                      onChange={this.handleChangeFont}
                      input={<Input />}
                      MenuProps={MenuProps}
                    >
                      {Object.entries(fonts).map(([font, family]) => (
                        <MenuItem key={font} value={family} className="markdown-setting-select">
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
                  disableScrollLock={true}
                >
                  <div id="markdown-help-popover">
                    <MenuItem key={1} component="a" href="https://guides.github.com/features/mastering-markdown/" target="_blank">
                      How to use markdown? <OpenInNewIcon fontSize='small'/>
                    </MenuItem>
                    <MenuItem key={2} component="a" href={this.props.optionsPage} target="_blank" >
                      Go to setting page <OpenInNewIcon fontSize='small'/>
                    </MenuItem>
                  </div>
                </Popover>
                {/* <button className="markdown-sticky-note-button" onClick={this.setPositionCSSProperty} size="small">
                  <PinDropIcon color={this.state.pinColor} fontSize="small"/>
                </button> */}
              </div>

              {/* Note editor & display area */}
              <div ref={node => this.node = node} className="note-pane">
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
                    autofocus={this.props.autofocus}
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