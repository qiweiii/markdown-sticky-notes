/*global chrome*/
/* src/note_widget/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import { StylesProvider, jssPreset } from '@material-ui/styles';
import { create } from 'jss';
import {
  constructAndInitData,
  updateData,
  removeNoteFromStorage,
  saveItem
} from './storage.js';
import Note from './Note';
import './content.css';
// import root from 'react-shadow/material-ui'
// Shadow DOM / iframe can solve style encapsulation, but is not easy to use with material-ui, editor and draggable. I will explore more.

// Lots of callback hells here, coz chrome MV2 does not support promise.


/** Initialise root div */
const root = document.createElement('div');
root.className = "markdown-sticky-note-root";
document.body.appendChild(root);
const approot = document.createElement('div');
approot.className = "markdown-sticky-note-approot";
root.appendChild(approot);
const jss = create({
  ...jssPreset(),
  insertionPoint: approot
});
window.localStorage.setItem('md-curMaxIndex', 1300); // if set very high will cause popover modal to fall behind (which i cannot change)
// chrome.storage.local.clear(); // for testing & dev
const optionsUrl = chrome.extension.getURL('index.html');



class MarkdownStickyNoteApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: window.location.href.split("#")[0],
      notes: []
    }
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.location.pathname !== prevProps.location.pathname) {
  //     this.setState({
  //       url: window.location.href.split("#")[0],
  //       notes: []
  //     }, () => this.getNotes());
  //   }
  // }
  
  componentDidMount() {
    /** Listen for url change for SPA */
    // this.props.history.listen((location, action) => {
    //   this.setState({
    //     url: window.location.href.split("#")[0],
    //     notes: []
    //   }, this.getNotes)
    // }); 

    this.getNotes();

    /** Add listener for generating new note when click on extension icon */
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if( request.message === "clicked_extension_action" ) {
          // brand new note here
          chrome.storage.local.get('id', function(result) {
            // console.log("id: ", result["id"])
            let id = ++result['id'];  // ID will be unique across all notes (simpler to implement)
            let {x, y} = this.initXY();
            chrome.storage.local.get('defaultTheme', function(themeR) {
              let theme = themeR.defaultTheme;
              chrome.storage.local.get("defaultEditorFontFamily", function(fontR) {
                let font = fontR.defaultEditorFontFamily;
                chrome.storage.local.get("defaultOpacity", function(opacityR) {
                  let opacity = opacityR.defaultOpacity;
                  chrome.storage.local.get("defaultEditorFontSize", function(fontSize) {
                    this.addNote(id.toString(), x, y, 200, 250, "", theme, font, fontSize.defaultEditorFontSize, true, opacity);
                    constructAndInitData(x,y,id.toString()); // save initial empty note data to storage
                    saveItem({id: id});
                  }.bind(this))
                }.bind(this))
              }.bind(this))
            }.bind(this))
          }.bind(this))
        }
        // send message to background.js for google analytics
        chrome.runtime.sendMessage({action: "generated_new_note", url: this.state.url});
      }.bind(this)
    );
  }

  /** render saved notes for current url **/
  getNotes = () => {
    chrome.storage.local.get([this.state.url], function(result) {
      if (typeof result[this.state.url] === 'undefined') return; // if empty
      chrome.storage.local.get("defaultOpacity", function(opacityR) {
        let opacity = opacityR.defaultOpacity;
        for (let note of result[this.state.url]) {
          this.addNote(note.id, note.x, note.y, note.width, note.height, note.content, note.theme, note.font, note.fontSize, false, opacity);
        }
      }.bind(this))
    }.bind(this));
  }

  /** add a note to notes list */
  addNote = (id, x, y, width, height, content, theme, font, fontSize, autofocus, opacity) => {
    this.setState(prevState => ({
      notes: [
        ...prevState.notes,
        //add notes props, then render later
        {
          id: id,
          x: x,
          y: y,
          width: width,
          height: height,
          content: content,
          theme: theme,
          font: font,
          fontSize: fontSize,
          autofocus: autofocus,
          opacity: opacity
        }
      ]
    }))
  }

  /** update note in storage */
  updateNote = (updatedData, id) => {
    updateData(updatedData, id);
  }

  /** remove note from DOM & storage */
  deleteNote = (id) => {
    // removeNoteFromStorage(id);
    // this.setState({notes: []})
    // this.getNotes();

    // this.setState({
    //   notes: this.state.notes.filter(note => note.id !== id)
    // }, removeNoteFromStorage(id));

    // the way above does not work...so try this
    ReactDOM.unmountComponentAtNode(document.getElementById('markdown-sticky-note').querySelector(`div[id="${id}"]`));
    document.getElementById('markdown-sticky-note').querySelector(`div[id="${id}"]`).remove();
    removeNoteFromStorage(id);
  }

  
  /** Generate initial position */
  initXY = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const minX = Math.ceil(width*0.3);
    const maxX = Math.floor(width*0.8);
    const minY = Math.ceil(height*0.1);
    const maxY = Math.floor(height*0.5);
    const startX = Math.floor(Math.random() * (maxX - minX)) + minX;
    const startY = Math.floor(Math.random() * (maxY - minY)) + minY;
    const topOffset  = window.pageYOffset || document.documentElement.scrollTop; // if scrolled
    const leftOffset = window.pageXOffset || document.documentElement.scrollLeft; // if scrolled
    return {x:startX+leftOffset, y:startY+topOffset};
  }

  render() {
    return (
      <StylesProvider jss={jss}>
      <div id="markdown-sticky-note">
        {this.state.notes.map(note => {
          return <div id={note.id}>
              <Note 
                id={note.id}
                optionsPage={optionsUrl} 
                x={note.x} y={note.y}
                width={note.width}
                height={note.height}
                content={note.content}
                deleteNoteFn={this.deleteNote}
                updateNoteFn={this.updateNote}
                defaultTheme={note.theme}
                editorFontSize={note.fontSize}
                editorFontFamily={note.font}
                autofocus={note.autofocus}
                opacity={note.opacity}
              />
            </div>
        })}
      </div>
      </StylesProvider>
    )
  }
}

// let MSNwithRouter = withRouter(MarkdownStickyNote);
// ReactDOM.render(
//   <BrowserRouter>
//     <MSNwithRouter/>
//   </BrowserRouter>,
//   approot
// );
ReactDOM.render(
  <MarkdownStickyNoteApp />,
  approot
);