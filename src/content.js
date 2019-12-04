/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
// import Frame, { FrameContextConsumer }from 'react-frame-component';
import "./content.css";
import Draggable from 'react-draggable';


class Note extends React.Component {
  
  render() {
    return (
      <Draggable handle="strong">
        <div className="box no-cursor">
          <strong className="cursor"><div>Drag here</div></strong>
          <div>You must click my handle to drag me</div>
        </div>
      </Draggable>
    )
  }
}

const app = document.createElement('div');
app.id = "my-extension-root"
document.body.appendChild(app);


app.style.display = "block";

chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action") {
        // toggle();
        let div = document.createElement('div');
        ReactDOM.render(<Note />, div);
        app.appendChild(div);
      }
   }
);

// function toggle(){
//    if(app.style.display === "none"){
//      app.style.display = "block";
//    }else{
//      app.style.display = "none";
//    }
// }