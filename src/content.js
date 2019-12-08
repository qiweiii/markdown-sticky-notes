/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import "./content.css";
import Note from './Note';
 

/** Initialise parent div */
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
          let el = document.getElementsByClassName('markdown-react-draggable'+div.id)[0];
          el.style.zIndex = curMaxZIndex++;
          window.localStorage.setItem('md-curMaxIndex', curMaxZIndex);
        });
        const {x, y} = initXY();
        app.appendChild(div);
        ReactDOM.render(
          <Note 
            id={div.id} 
            optionsPage={optionsUrl} 
            x={x} y={y} 
            callback={deleteNote} 
            defaultTheme='monokai' // maybe allow customizing after i have options_page and DB
            editorFontSize={14} // maybe allow customizing after i have options_page and DB
            editorFontFamily="Consolas,monaco,monospace" // maybe allow customizing after i have options_page and DB
          />, 
        div);
      }
   }
);


/** remove note frrom DOM */
const deleteNote = (id) => {
  ReactDOM.unmountComponentAtNode(document.getElementById(id));
  window.localStorage.removeItem('md-curMaxIndex');
}


/** Generate initial position */
const initXY = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const minX = Math.ceil(width*0.3);
  const maxX = Math.floor(width*0.8);
  const minY = Math.ceil(height*0.1);
  const maxY = Math.floor(height*0.5);
  const startX = Math.floor(Math.random() * (maxX - minX)) + minX;
  const startY = Math.floor(Math.random() * (maxY - minY)) + minY;
  const top  = window.pageYOffset || document.documentElement.scrollTop; // if scrolled
  const left = window.pageXOffset || document.documentElement.scrollLeft; // if scrolled
  return {x:startX+left, y:startY+top};
}