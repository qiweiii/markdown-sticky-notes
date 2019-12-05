/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import "./content.css";
import Note from './Note';


const app = document.createElement('div');
app.id = "my-extension-root"
document.body.appendChild(app);


app.style.display = "block";

chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
      if( request.message === "clicked_extension_action") {
        // create a note when user clicked extension icon
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