import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { StyledEngineProvider } from "@mui/material/styles";

import {
  constructAndInitData,
  updateData,
  removeNoteFromStorage,
  saveItem,
} from "./storage.js";
import type { Note as NoteType } from "./storage.js";
import Note from "./Note.js";
import "./content.css";

// import root from 'react-shadow/material-ui'
// Shadow DOM / iframe can solve style encapsulation, but is not easy to use with material-ui, markdown editor and draggable.

const MarkdownStickyNoteApp = () => {
  // This is not 100% correct, but 99% of # usage are not new pages, hopefully this is good enough
  const [url, setUrl] = useState(window.location.href.split("#")[0]);
  const [notes, setNotes] = useState<NoteType[]>([]);
  const optionsUrl = browser.runtime.getURL("/options.html");

  useEffect(() => {
    setNotes([]);
    getNotesFromStorage();
  }, [url]);

  useEffect(() => {
    // Listen for url change, added for SPA support
    let previousUrl = '';
    const observer = new MutationObserver((mutations) => {
      if (location.href !== previousUrl) {
        previousUrl = location.href;
        // console.log(`URL changed to ${location.href}`);
        setUrl(location.href.split("#")[0]);
      }
    });
    observer.observe(document, { subtree: true, childList: true });
  }, []);

  useEffect(() => {
    // Add listener for generating new note when click on extension icon
    browser.runtime.onMessage.addListener(function (request) {
      if (request.message === "clicked_extension_action") {
        // brand new note here
        let { x, y } = initXY();
        browser.storage.local
          .get([
            "id",
            "defaultTheme",
            "defaultEditorFontFamily",
            "defaultOpacity",
            "defaultEditorFontSize",
          ])
          .then((res) => {
            let id = res.id + 1; // ID will be incremented by 1
            let theme = res.defaultTheme;
            let font = res.defaultEditorFontFamily;
            let opacity = res.defaultOpacity;
            let fontSize = res.defaultEditorFontSize;
            addNote(
              id.toString(),
              x,
              y,
              200,
              250,
              "\n".repeat(11),
              theme,
              font,
              fontSize,
              true,
              opacity
            );
            constructAndInitData(x, y, id.toString()); // save initial empty note data to storage
            saveItem({ id: id });
          });
      }
      // send message to background.js for google analytics
      browser.runtime.sendMessage({
        action: "generated_new_note",
        url: url,
      });
    });
  }, []);

  /**
   * Get saved notes for current url
   *
   * Note: only use for on mount, not intented to be used after this
   */
  const getNotesFromStorage = () => {
    browser.storage.local.get([url, "defaultOpacity"]).then((res) => {
      if (res[url]) {
        let opacity = res.defaultOpacity;
        for (let note of res[url]) {
          addNote(
            note.id,
            note.x,
            note.y,
            note.width,
            note.height,
            note.content,
            note.theme,
            note.font,
            note.fontSize,
            false,
            opacity
          );
        }
      }
    });
  };

  /** add a note to DOM notes list */
  const addNote = (
    id: number,
    x: number,
    y: number,
    width: number,
    height: number,
    content: string,
    theme: any,
    font: string,
    fontSize: number,
    autofocus: boolean,
    opacity: number
  ) => {
    setNotes((notes) => [
      ...notes,
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
        opacity: opacity,
      },
    ]);
  };

  /** update note in storage */
  const updateNote = (updatedData: NoteType, id: number) => {
    updateData(updatedData, id);
  };

  /** remove note from DOM & storage */
  const deleteNote = (id: number) => {
    setNotes((notes) => notes.filter((note) => note.id !== id));
    removeNoteFromStorage(id);
  };

  /** Generate initial position */
  const initXY = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const minX = Math.ceil(width * 0.3);
    const maxX = Math.floor(width * 0.8);
    const minY = Math.ceil(height * 0.1);
    const maxY = Math.floor(height * 0.5);
    const startX = Math.floor(Math.random() * (maxX - minX)) + minX;
    const startY = Math.floor(Math.random() * (maxY - minY)) + minY;
    const topOffset = window.pageYOffset || document.documentElement.scrollTop; // if scrolled
    const leftOffset =
      window.pageXOffset || document.documentElement.scrollLeft; // if scrolled
    return { x: startX + leftOffset, y: startY + topOffset };
  };

  return (
    <StyledEngineProvider injectFirst>
      <div id="markdown-sticky-note">
        {notes.map((note) => {
          return (
            <div
              id={`markdown-sticky-note-${note.id}`}
              key={`markdown-sticky-note-${note.id}`}
            >
              <Note
                id={note.id}
                optionsPage={optionsUrl}
                x={note.x}
                y={note.y}
                width={note.width}
                height={note.height}
                content={note.content}
                deleteNoteFn={deleteNote}
                updateNoteFn={updateNote}
                defaultTheme={note.theme}
                editorFontSize={note.fontSize}
                editorFontFamily={note.font}
                autofocus={note.autofocus ?? true}
                opacity={note.opacity}
              />
            </div>
          );
        })}
      </div>
    </StyledEngineProvider>
  );
};

export default defineContentScript({
  matches: ["https://*/*", "http://*/*"],

  main(ctx) {
    /** Initialise root div */
    const root = document.createElement("div");
    root.className = "markdown-sticky-note-root";
    document.body.appendChild(root);
    const approot = document.createElement("div");
    approot.className = "markdown-sticky-note-approot";
    root.appendChild(approot);

    // if set very high will cause settings popover to go behind (which i cannot change)
    window.localStorage.setItem("md-curMaxIndex", "1300");

    // Render app root
    ReactDOM.createRoot(approot).render(<MarkdownStickyNoteApp />);
  },
});
