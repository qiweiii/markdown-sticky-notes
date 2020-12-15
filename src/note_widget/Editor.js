import React from 'react'
import { func, string, number } from 'prop-types'
import CodeMirror from './CodeMirror'

function Editor(props) {
  return (
    <div>
      <CodeMirror 
        mode="markdown" 
        theme={props.theme} 
        value={props.value} 
        onChange={props.onChange} 
        fontSize={props.fontSize}
        fontFamily={props.fontFamily}
        autofocus={props.autofocus}
      />
    </div>
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
  value: '',
  theme: '',
  fontSize: 16,
  fontFamily: "Consolas,monaco,monospace"
}

export default Editor