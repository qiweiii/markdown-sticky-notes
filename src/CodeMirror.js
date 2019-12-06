import React from 'react';
import { createRef, createElement } from 'react';
import { bool, string, func } from 'prop-types';
import CodeMirror from 'codemirror';
/* import all mode here */
require('codemirror/mode/markdown/markdown');
/* import all themes & css in index.html (import here has conflicts) */


// adapted from:
// https://github.com/rexxars/react-markdown/blob/master/demo/src/codemirror.js

const IS_MOBILE = typeof navigator === 'undefined' || (
  navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
)

class CodeMirrorEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {isControlled: Boolean(this.props.value)}
    this.handleChange = this.handleChange.bind(this)
    this.editorRef = createRef()
  }

  componentDidMount() {
    const isTextArea = this.props.forceTextArea || IS_MOBILE;
    if (!isTextArea) {
      this.editor = CodeMirror.fromTextArea(this.editorRef.current, {
        lineWrapping: true,
        autofocus: true,
        mode: this.props.mode,
        theme: this.props.theme
      });
      this.editor.on('change', this.handleChange);
      var charWidth = this.editor.defaultCharWidth(), basePadding = 4;
      this.editor.on("renderLine", function(cm, line, elt) {
        var off = CodeMirror.countColumn(line.text, null, cm.getOption("tabSize")) * charWidth;
        elt.style.textIndent = "-" + off + "px";
        elt.style.paddingLeft = (basePadding + off) + "px";
      });
      this.editor.getWrapperElement().style["font-size"] = this.props.fontSize+'px';
      this.editor.getWrapperElement().style["font-family"] = this.props.fontFamily;
      this.editor.refresh();
    }
  }

  componentDidUpdate() {
    if (!this.editor) {
      return
    }

    if (this.props.value) {
      if (this.editor.getValue() !== this.props.value) {
        this.editor.setValue(this.props.value);
      }
    }
  }

  handleChange() {
    if (!this.editor) {
      return
    }

    const value = this.editor.getValue()
    if (value === this.props.value) {
      return
    }

    if (this.props.onChange) {
      this.props.onChange({target: {value: value}})
    }

    if (this.editor.getValue() !== this.props.value) {
      if (this.state.isControlled) {
        this.editor.setValue(this.props.value)
      } else {
        this.props.value = value
      }
    }
  }

  render() {
    const editor = createElement('textarea', {
      ref: this.editorRef,
      value: this.props.value,
      readOnly: this.props.readOnly,
      defaultValue: this.props.defaultValue,
      onChange: this.props.onChange,
      className: this.props.textAreaClassName
    })

    return createElement('div', null, editor);
  }
}

CodeMirrorEditor.propTypes = {
  readOnly: bool,
  defaultValue: string,
  textAreaClassName: string,
  onChange: func,
  forceTextArea: bool,
  value: string
}

export default CodeMirrorEditor