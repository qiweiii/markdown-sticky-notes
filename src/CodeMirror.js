import React from 'react';
import { createRef, createElement } from 'react';
import { bool, string, func } from 'prop-types';
import 'codemirror-minified/mode/markdown/markdown'; // only need markdown mode
import 'codemirror-minified/theme/monokai.css';
import CodeMirror from 'codemirror-minified/lib/codemirror.js'
import 'codemirror-minified/lib/codemirror.css';
import 'codemirror-minified/theme/3024-day.css';
import 'codemirror-minified/theme/3024-night.css';
import 'codemirror-minified/theme/abcdef.css';
import 'codemirror-minified/theme/ambiance.css';
import 'codemirror-minified/theme/base16-dark.css';
import 'codemirror-minified/theme/bespin.css';
import 'codemirror-minified/theme/base16-light.css';
import 'codemirror-minified/theme/blackboard.css';
import 'codemirror-minified/theme/cobalt.css';
import 'codemirror-minified/theme/colorforth.css';
import 'codemirror-minified/theme/dracula.css';
import 'codemirror-minified/theme/duotone-dark.css';
import 'codemirror-minified/theme/duotone-light.css';
import 'codemirror-minified/theme/eclipse.css';
import 'codemirror-minified/theme/elegant.css';
import 'codemirror-minified/theme/erlang-dark.css';
import 'codemirror-minified/theme/gruvbox-dark.css';
import 'codemirror-minified/theme/hopscotch.css';
import 'codemirror-minified/theme/icecoder.css';
import 'codemirror-minified/theme/isotope.css';
import 'codemirror-minified/theme/lesser-dark.css';
import 'codemirror-minified/theme/liquibyte.css';
import 'codemirror-minified/theme/lucario.css';
import 'codemirror-minified/theme/material.css';
import 'codemirror-minified/theme/material-darker.css';
import 'codemirror-minified/theme/material-palenight.css';
import 'codemirror-minified/theme/material-ocean.css';
import 'codemirror-minified/theme/mbo.css';
import 'codemirror-minified/theme/mdn-like.css';
import 'codemirror-minified/theme/midnight.css';
import 'codemirror-minified/theme/monokai.css';
import 'codemirror-minified/theme/moxer.css';
import 'codemirror-minified/theme/neat.css';
import 'codemirror-minified/theme/neo.css';
import 'codemirror-minified/theme/night.css';
import 'codemirror-minified/theme/nord.css';
import 'codemirror-minified/theme/oceanic-next.css';
import 'codemirror-minified/theme/panda-syntax.css';
import 'codemirror-minified/theme/paraiso-dark.css';
import 'codemirror-minified/theme/paraiso-light.css';
import 'codemirror-minified/theme/pastel-on-dark.css';
import 'codemirror-minified/theme/railscasts.css';
import 'codemirror-minified/theme/rubyblue.css';
import 'codemirror-minified/theme/seti.css';
import 'codemirror-minified/theme/shadowfox.css';
import 'codemirror-minified/theme/solarized.css';
import 'codemirror-minified/theme/the-matrix.css';
import 'codemirror-minified/theme/tomorrow-night-bright.css';
import 'codemirror-minified/theme/tomorrow-night-eighties.css';
import 'codemirror-minified/theme/ttcn.css';
import 'codemirror-minified/theme/twilight.css';
import 'codemirror-minified/theme/vibrant-ink.css';
import 'codemirror-minified/theme/xq-dark.css';
import 'codemirror-minified/theme/xq-light.css';
import 'codemirror-minified/theme/yeti.css';
import 'codemirror-minified/theme/idea.css';
import 'codemirror-minified/theme/darcula.css';
import 'codemirror-minified/theme/yonce.css';
import 'codemirror-minified/theme/zenburn.css';

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