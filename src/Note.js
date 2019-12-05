import React from 'react';
import "./content.css";
import Draggable from 'react-draggable'; // The default
import { ResizableBox } from 'react-resizable';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import "./Note.css";

const stylesRoot = {
  height: "100%",
  width: "100%",
}
const styleText = {
  
}

export default class Note extends React.Component {
  state = {
    activeDrags: 0,
    fontSize: 26,
    fontFamily: "Consolas,monaco,monospace",
    deltaPosition: {
      x: 0, y: 0
    },
  };
  handleDrag = (e, ui) => {
    const {x, y} = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    });
  };
  onResizeStop = (e, data) => {
    console.log(data)
  }
  render() {
    return (
      <Draggable  handle=".handle">
        <div>
          <ResizableBox className="box" width={200} height={250} minConstraints={[100, 100]}>
            <Paper elevation={3} style={stylesRoot}>
              <div className="handle">Drag bar here</div>
              <InputBase 
                style={{fontFamily: this.state.fontFamily, fontSize: this.state.fontSize, ...styleText}}
                id="textfield" 
                variant="outlined"
                autoFocus={true}
                multiline={true}
                fullWidth={true}
                rows={this.state.deltaPosition.y / this.state.fontSize}
                inputProps={{ 'aria-label': 'naked' }}
              />
              {/* <textarea /> */}
            </Paper>
          </ResizableBox>
        </div>
      </Draggable>
    )
  }
}