/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import Note from './Note';
import { StylesProvider, jssPreset } from '@material-ui/styles';
import { create } from 'jss';
import {
  constructAndInitData,
  updateData,
  removeNoteFromStorage,
  saveItem,
} from './storage.js';


/** Initialise parent div */
// let shadowDOM = approot.attachShadow({mode: 'open'}); // Create a shadow root
const approot = document.createElement('div');
const app = document.createElement('div');
const jss = create({
  ...jssPreset(),
  insertionPoint: app
});
approot.className = "markdown-sticky-note-approot";
app.className = "markdown-sticky-note";
approot.appendChild(app);
document.body.appendChild(approot);
window.localStorage.setItem('md-curMaxIndex', 1300); // if set very high will cause modal to fall behind..
// chrome.storage.local.clear(); // for testing & dev


// render saved notes for current url
const url = window.location.href;
chrome.storage.local.get([url], function(result) {
  // console.log("existing notes: ", result[url])
  if (typeof result[url] === 'undefined') return; // if empty
  for (let note of result[url]) {
    renderNote(note.id, note.x, note.y, note.width, note.height, note.content, note.theme, note.font, note.fontSize, false);
  }
});

/** Generate new note when click on extension icon */
const optionsUrl = chrome.extension.getURL('index.html');
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if( request.message === "clicked_extension_action" ) {
        // brand new note here
        chrome.storage.local.get('id', function(result) {
          // console.log("id: ", result["id"])
          let id = ++result['id'];  // ID will be unique across all notes (simpler to implement)
          let {x, y} = initXY();
          chrome.storage.local.get('defaultTheme', function(themeR) {
            let theme = themeR.defaultTheme;
            chrome.storage.local.get("defaultEditorFontFamily", function(fontR) {
              let font = fontR.defaultEditorFontFamily;
              chrome.storage.local.get("defaultEditorFontSize", function(fontSize) {
                renderNote(id.toString(), x, y, 200, 250, "", theme, font, fontSize.defaultEditorFontSize);
                constructAndInitData(x,y,id.toString()); // save initial empty note data to storage
                saveItem({id: id});
              })
            })
          })
        })
      }
      // send message to background.js for google analytics
      chrome.runtime.sendMessage({action: "generated_new_note", url: url});
   }
);

/** render a note */
const renderNote = (id, x, y, width, height, content, theme, font, fontSize, autofocus) => {
  let div = document.createElement('div');
  app.appendChild(div);
  div.id = id
  div.addEventListener('mousedown', (e) => {
    let curMaxZIndex = window.localStorage.getItem("md-curMaxIndex");
    let el = document.getElementsByClassName('markdown-react-draggable'+id)[0];
    if (el) el.style.zIndex = curMaxZIndex++;
    // console.log(curMaxZIndex);
    window.localStorage.setItem('md-curMaxIndex', curMaxZIndex);
  });
  ReactDOM.render(
    <StylesProvider jss={jss}>
      <Note 
        id={id} 
        optionsPage={optionsUrl} 
        x={x} y={y}
        width={width}
        height={height}
        content={content}
        deleteNoteFn={deleteNote}
        updateNoteFn={updateNote}
        defaultTheme={theme}
        editorFontSize={fontSize}
        editorFontFamily={font}
        autofocus={autofocus}
      />
    </StylesProvider>, 
    div
  );
}

/** update note in storage */
const updateNote = (updatedData, id) => {
  updateData(updatedData, id);
}

/** remove note from DOM & storage */
const deleteNote = (id) => {
  ReactDOM.unmountComponentAtNode(document.getElementById(id));
  document.getElementsByClassName('markdown-sticky-note')[0].querySelector(`div[id="${id}"]`).remove();
  // remove from storage
  removeNoteFromStorage(id);
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
