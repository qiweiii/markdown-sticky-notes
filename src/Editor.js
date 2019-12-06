import React from 'react'
import { func, string, number } from 'prop-types'
import CodeMirror from './CodeMirror'

function Editor(props) {
  return (
    <form className="editor pure-form">
      <CodeMirror 
        mode="markdown" 
        theme={props.theme} 
        value={props.value} 
        onChange={props.onChange} 
        fontSize={props.fontSize}
        fontFamily={props.fontFamily}
      />
    </form>
  )
}

Editor.propTypes = {
  onChange: func.isRequired,
  value: string,
  mode: string,
  theme: string,
  fontSize: number,
  fontFamily: string
}

Editor.defaultProps = {
  value: ''
}

export default Editor