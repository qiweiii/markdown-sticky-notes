/*global chrome*/
import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import themes from '../themes.js';
import fonts from '../fonts.js';
import { withStyles } from '@material-ui/core/styles';


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

const styles = theme => ({
  main: {
    marginTop: "15%",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: 300,
    height: 100
  }
});

class Preference extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      theme: "",
      font: "",
      fontsize: "",
    };
  }

  componentDidMount() {
    // get defaults from storage and update states
    chrome.storage.local.get('defaultTheme', function(themeR) {
      this.setState({theme: themeR.defaultTheme});
      chrome.storage.local.get("defaultEditorFontFamily", function(fontR) {
        this.setState({font: fontR.defaultEditorFontFamily});
        chrome.storage.local.get("defaultEditorFontSize", function(fontSize) {
          this.setState({fontsize: fontSize.defaultEditorFontSize});
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }

  updateDefaultTheme = (value) => {
    chrome.storage.local.set({defaultTheme: value}, function() {
      console.log("set default theme");
    });
  }
  updateDefaultFont = (value) => {
    chrome.storage.local.set({defaultEditorFontFamily: value}, function() {
      console.log("set default font family");
    });
  }
  updateDefaultSize = (value) => {
    chrome.storage.local.set({defaultEditorFontSize: value}, function() {
      console.log("set default font size");
    });
  }
  handleChangeTheme = (e) => {
    this.setState({
      theme:e.target.value
    }, () => this.updateDefaultTheme(e.target.value))
  }
  handleChangeFont = (e) => {
    this.setState({
      font:e.target.value
    }, () => this.updateDefaultFont(e.target.value))
  }
  handleChangeFontSize = (e) => {
    this.setState({
      fontsize:e.target.value
    }, () => this.updateDefaultSize(e.target.value))
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.main}>
        <FormControl className={classes.form}>
          <InputLabel id="theme-label">Default Editor Theme</InputLabel>
          <Select
            labelId="theme-label"
            id="mutiple-theme"
            value={this.state.theme}
            onChange={this.handleChangeTheme}
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
        <FormControl className={classes.form}>
          <InputLabel id="fontsize-label">Default Editor FontSize</InputLabel>
          <Select
            labelId="fontsize-label"
            id="mutiple-fontsize"
            value={this.state.fontsize}
            onChange={this.handleChangeFontSize}
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
        <FormControl className={classes.form}>
          <InputLabel id="fontfamily-label">Default Editor Font</InputLabel>
          <Select
            labelId="fontfamily-label"
            id="mutiple-fontfamily"
            value={this.state.font}
            onChange={this.handleChangeFont}
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
      </div>
  )}
}

export default withStyles(styles)(Preference);