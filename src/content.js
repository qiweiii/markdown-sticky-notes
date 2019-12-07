/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import "./content.css";
import Note from './Note';
 
const app = document.createElement('div');
app.className = "markdown-sticky-note";
document.body.appendChild(app);

chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
      if( request.message === "clicked_extension_action" ) {
        // create a note when user clicked extension icon
        let div = document.createElement('div');
        ReactDOM.render(<Note />, div);
        app.appendChild(div);
      }
   }
);