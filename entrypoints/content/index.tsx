import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { StyledEngineProvider } from "@mui/material/styles";

import {
  constructAndInitData,
  updateData,
  removeNoteFromStorage,
  saveItem,
} from "./storage.js";
import type { Note as NoteType, StorageDefaults } from "./storage.js";
import Note from "./Note.js";
import "./content.css";

import "katex/dist/katex.min.css";

// import root from 'react-shadow/material-ui'
// Shadow DOM / iframe can solve style encapsulation, but is not easy to use with material-ui, markdown editor and draggable.

type ContentStorageDefaults = Pick<
  StorageDefaults,
  | "id"
  | "defaultTheme"
  | "defaultEditorFontFamily"
  | "defaultOpacity"
  | "defaultEditorFontSize"
  | "defaultColor"
>;

type NotesStorageResult = Partial<Record<string, NoteType[]>> &
  Partial<ContentStorageDefaults>;

const getUrlWithoutHash = (href: string) => href.split("#")[0];

const isCloudflareChallengePage = () => {
  // Redirect / managed-challenge case: top-level URL itself is under /cdn-cgi/.
  if (window.location.pathname.startsWith("/cdn-cgi/")) {
    return true;
  }
  // JS challenge interstitial ("Just a moment..."). The top-level URL stays the
  // original page (e.g. https://my.vultr.com/), so the pathname check above
  // misses it. Detect via the standard title and challenge-platform markers
  // instead. These are present by document_idle, when this content script runs.
  if (document.title === "Just a moment...") {
    return true;
  }
  if (
    document.querySelector(
      'script[src*="/cdn-cgi/challenge-platform/"], ' +
        'iframe[src*="cdn-cgi/challenge-platform"], ' +
        'iframe[src*="challenges.cloudflare.com"], ' +
        "#challenge-form, #challenge-running, #cf-challenge-running"
    )
  ) {
    return true;
  }
  return false;
};

let pendingCreateNoteRequests = 0;
let isAppMounted = false;
let urlObserver: MutationObserver | null = null;
let createNoteHandler: (() => void) | null = null;

const MarkdownStickyNoteApp = () => {
  // This is not 100% correct, but 99% of # usage are not new pages, hopefully this is good enough
  const [url, setUrl] = useState(getUrlWithoutHash(window.location.href));
  const [notes, setNotes] = useState<NoteType[]>([]);
  const optionsUrl = browser.runtime.getURL("/options.html");

  useEffect(() => {
    setNotes([]);
    getNotesFromStorage();
  }, [url]);

  useEffect(() => {
    // Listen for url change, added for SPA support
    let previousUrl = "";
    const observer = new MutationObserver(() => {
      if (location.href !== previousUrl) {
        previousUrl = location.href;
        // console.log(`URL changed to ${location.href}`);
        setUrl(getUrlWithoutHash(location.href));
      }
    });
    observer.observe(document, { subtree: true, childList: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const createNote = () => {
      const { x, y } = initXY();
      browser.storage.local
        .get([
          "id",
          "defaultTheme",
          "defaultEditorFontFamily",
          "defaultOpacity",
          "defaultEditorFontSize",
          "defaultColor",
        ])
        .then((res) => {
          const defaults = res as Partial<ContentStorageDefaults>;
          const nextId = (defaults.id ?? 0) + 1;
          const theme = defaults.defaultTheme ?? "monokai";
          const font =
            defaults.defaultEditorFontFamily ?? '"Consolas", "monaco", monospace';
          const opacity = defaults.defaultOpacity ?? 0.9;
          const fontSize = defaults.defaultEditorFontSize ?? 14;
          const color = defaults.defaultColor ?? "#fff";
          addNote({
            id: nextId,
            x: x,
            y: y,
            width: 220,
            height: 250,
            content: "\n".repeat(10),
            theme: theme,
            font: font,
            fontSize: fontSize,
            autofocus: true,
            opacity: opacity,
            color,
          });
          constructAndInitData(x, y, nextId);
          saveItem({ id: nextId });
          browser.runtime.sendMessage({
            action: "generated_new_note",
            url: url,
          });
        });
    };

    createNoteHandler = createNote;

    const queuedRequests = pendingCreateNoteRequests;
    pendingCreateNoteRequests = 0;
    for (let index = 0; index < queuedRequests; index += 1) {
      createNote();
    }

    return () => {
      if (createNoteHandler === createNote) {
        createNoteHandler = null;
      }
    };
  }, [url]);

  /**
   * Get saved notes for current url
   *
   * Note: only use for on mount, not intented to be used after this
   */
  const getNotesFromStorage = () => {
    browser.storage.local
      .get([url, "defaultOpacity", "defaultColor"])
      .then((res) => {
        const stored = res as NotesStorageResult;
        const storedNotes = stored[url] ?? [];
        if (storedNotes.length > 0) {
          const opacity = stored.defaultOpacity ?? 0.9;
          const defaultColor = stored.defaultColor ?? "#fff";
          for (const note of storedNotes) {
            addNote({
              id: note.id,
              x: note.x,
              y: note.y,
              width: note.width,
              height: note.height,
              content: note.content,
              theme: note.theme,
              font: note.font,
              fontSize: note.fontSize,
              autofocus: false,
              opacity: opacity,
              color: note.color || defaultColor,
            });
          }
        }
      });
  };

  /** add a note to DOM notes list */
  const addNote = ({
    id,
    x,
    y,
    width,
    height,
    content,
    theme,
    font,
    fontSize,
    autofocus,
    opacity,
    color,
  }: NoteType) => {
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
        color,
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
                color={note.color}
              />
            </div>
          );
        })}
      </div>
    </StyledEngineProvider>
  );
};

const loadFontFace = () => {
  const vendor = browser.runtime.getURL("/options.html").split("/options")[0];
  const fonts = [
    new FontFace(
      "markdown-stick-notes-family-anonymous-pro",
      `url("${vendor}/fonts/Anonymous_Pro/AnonymousPro-Regular.ttf")`
    ),
    new FontFace(
      "markdown-stick-notes-family-b612-mono",
      `url("${vendor}/fonts/B612_Mono/B612Mono-Regular.ttf")`
    ),
    new FontFace(
      "markdown-stick-notes-family-inconsolata",
      `url("${vendor}/fonts/Inconsolata/Inconsolata-Regular.ttf")`
    ),
    new FontFace(
      "markdown-stick-notes-family-pt-mono",
      `url("${vendor}/fonts/PT_Mono/PTMono-Regular.ttf")`
    ),
    new FontFace(
      "markdown-stick-notes-family-roboto-mono",
      `url("${vendor}/fonts/Roboto_Mono/RobotoMono-Regular.ttf")`
    ),
    new FontFace(
      "markdown-stick-notes-family-source-code-pro",
      `url("${vendor}/fonts/Source_Code_Pro/SourceCodePro-Regular.ttf")`
    ),
    new FontFace(
      "markdown-stick-notes-family-space-mono",
      `url("${vendor}/fonts/Space_Mono/SpaceMono-Regular.ttf")`
    ),
  ];
  fonts.forEach((font) => {
    font
      .load()
      .then((loaded_face) => {
        document.fonts.add(loaded_face);
      })
      .catch(function (error) {
        // error occurred
        console.error(error);
      });
  });
};

const ensureAppMounted = () => {
  if (isAppMounted || isCloudflareChallengePage()) {
    return;
  }

  if (!document.body) {
    window.addEventListener("DOMContentLoaded", ensureAppMounted, { once: true });
    return;
  }

  isAppMounted = true;
  urlObserver?.disconnect();
  urlObserver = null;

  const root = document.createElement("div");
  root.className = "markdown-sticky-note-root";
  document.body.appendChild(root);

  const approot = document.createElement("div");
  approot.className = "markdown-sticky-note-approot";
  root.appendChild(approot);

  loadFontFace();
  ReactDOM.createRoot(approot).render(<MarkdownStickyNoteApp />);
};

const mountAppIfCurrentPageHasNotes = () => {
  const url = getUrlWithoutHash(window.location.href);
  browser.storage.local.get(url).then((result) => {
    const storedNotes = (result as Partial<Record<string, NoteType[]>>)[url] ?? [];
    if (storedNotes.length > 0) {
      ensureAppMounted();
    }
  });
};

export default defineContentScript({
  matches: ["https://*/*", "http://*/*"],

  main() {
    if (isCloudflareChallengePage()) {
      return;
    }

    browser.runtime.onMessage.addListener((request) => {
      if (request.message !== "clicked_extension_action") {
        return;
      }

      if (createNoteHandler) {
        createNoteHandler();
        return;
      }

      pendingCreateNoteRequests += 1;
      ensureAppMounted();
    });

    mountAppIfCurrentPageHasNotes();

    let previousUrl = window.location.href;
    urlObserver = new MutationObserver(() => {
      if (isAppMounted || isCloudflareChallengePage()) {
        return;
      }

      if (window.location.href !== previousUrl) {
        previousUrl = window.location.href;
        mountAppIfCurrentPageHasNotes();
      }
    });
    urlObserver.observe(document, { subtree: true, childList: true });
  },
});
