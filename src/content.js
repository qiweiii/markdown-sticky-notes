/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import Note from './Note';
import { StylesProvider, jssPreset } from '@material-ui/styles';
import { create } from 'jss';


/** Initialise parent div */
const approot = document.createElement('div');
const app = document.createElement('div');
const jss = create({
  ...jssPreset(),
  insertionPoint: app
});
app.className = "markdown-sticky-note";
approot.appendChild(app);
document.body.appendChild(approot);
window.localStorage.setItem('md-curMaxIndex', 1000);
// let shadowDOM = approot.attachShadow({mode: 'open'}); // Create a shadow root
// shadowDOM.appendChild(app);
// document.body.appendChild(approot);
// Apply external styles to the shadow dom
// const linkElem = document.createElement('link');
// linkElem.setAttribute('rel', 'stylesheet');
// linkElem.setAttribute('href', chrome.runtime.getURL("/static/css/content.css"));
// // Attach the created element to the shadow dom
// shadowDOM.appendChild(linkElem);


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
          if (el) el.style.zIndex = curMaxZIndex++;
          window.localStorage.setItem('md-curMaxIndex', curMaxZIndex);
        });
        const {x, y} = initXY();
        ReactDOM.render(
          <StylesProvider jss={jss}>
            <Note 
              id={div.id} 
              optionsPage={optionsUrl} 
              x={x} y={y}            // allow customizing after i have DB
              callback={deleteNote} 
              defaultTheme='monokai' // allow customizing after i have options_page and DB
              editorFontSize={14} // allow customizing after i have options_page and DB
              editorFontFamily='"Consolas","monaco",monospace' // allow customizing after i have options_page and DB
              // initialWidth // allow customizing after i have DB
              // initialHeight // allow customizing after i have DB
              // initialContent // allow customizing after i have DB
            />
          </StylesProvider>, 
          div
        );        
        app.appendChild(div);
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