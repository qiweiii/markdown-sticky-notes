/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import "./content.css";
import Note from './Note';
 

/** initialise parent div */
const app = document.createElement('div');
app.className = "markdown-sticky-note";
document.body.appendChild(app);
window.localStorage.setItem('md-curMaxIndex', 1000);


/** Used to generate unique IDs. */
let idCounter = 0; // later will need to record this var in storage or DB...
const uniqueId= () => {
  let id = ++idCounter;
  return id.toString();
}


/** Generate new note when click on extension icon */
const optionsUrl = chrome.extension.getURL('options.html')
chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
      if( request.message === "clicked_extension_action" ) {
        let div = document.createElement('div');
        div.id = uniqueId();
        div.addEventListener('click', (e) => {
          let curMaxZIndex = window.localStorage.getItem("md-curMaxIndex");
          let elArray = document.getElementsByClassName('react-draggable');
          // console.log('here',elArray);
          for (let el of elArray) {
            if (el.contains(e.target)) {
              el.style.zIndex = curMaxZIndex++;
            }
          }
          window.localStorage.setItem('md-curMaxIndex', curMaxZIndex);
        });
        // choose a position
        // div.style.position = '';
        app.appendChild(div);
        ReactDOM.render(<Note id={div.id} optionsPage={optionsUrl} callback={deleteNote} />, div);
      }
   }
);


/** remove note frrom DOM */
const deleteNote = (id) => {
  ReactDOM.unmountComponentAtNode(document.getElementById(id));
  window.localStorage.removeItem('md-curMaxIndex');
}