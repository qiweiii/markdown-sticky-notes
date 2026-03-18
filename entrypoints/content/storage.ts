export interface Note {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string; // text in editor
  theme: string; // editor theme
  font: string; // editor font
  fontSize: number; // editor font size
  opacity: number; // note opacity
  autofocus?: boolean; // editor autofocus
  color?: string; // note result bg color, could be undefined for old notes
}

export interface StorageDefaults {
  id: number;
  defaultTheme: string;
  defaultEditorFontFamily: string;
  defaultOpacity: number;
  defaultEditorFontSize: number;
  defaultColor: string;
}

type NotesByUrl = Partial<Record<string, Note[]>>;

/** Initial data for a new note */
export const constructAndInitData = (x: number, y: number, id: number) => {
  let data;
  browser.storage.local
    .get([
      "defaultTheme",
      "defaultEditorFontFamily",
      "defaultOpacity",
      "defaultEditorFontSize",
      "defaultColor",
    ])
    .then((res) => {
      const defaults = res as Partial<StorageDefaults>;
      const theme = defaults.defaultTheme ?? "monokai";
      const font =
        defaults.defaultEditorFontFamily ?? '"Consolas", "monaco", monospace';
      const fontSize = defaults.defaultEditorFontSize ?? 14;
      const color = defaults.defaultColor ?? "#fff";
      data = {
        id: id,
        x: x,
        y: y,
        width: 200,
        height: 250,
        content: "",
        theme: theme,
        font: font,
        fontSize: fontSize,
        opacity: 1,
        color,
      };
      // console.log(data);
      initData(data);
    });
};

/**
 * Init a single note's data to current url's list of notes.
 * Used for initialise new note and save it.
 */
export const initData = (noteData: Note) => {
  // need to check exisitng ones first
  let url = window.location.href.split("#")[0];
  let data;
  // console.log("noteData passed to init: ", noteData)
  browser.storage.local.get(url).then((result) => {
    const storedNotes = result as NotesByUrl;
    const existingNotes = storedNotes[url];
    // console.log('init get result: ', result);
    if (!Array.isArray(existingNotes)) {
      // if url item empty means no item for this url yet
      data = {
        [url]: [noteData],
      };
    } else {
      data = {
        [url]: [...existingNotes, noteData],
      };
    }
    saveItem(data);
    // browser.storage.local.get([window.location.href], function(result) { // for testing
    //   console.log("after save:", result);
    // });
  });
};

/** Update data for a particular note */
export const updateData = (updatedData: Note, id: number) => {
  const url = window.location.href.split("#")[0];
  browser.storage.local.get(url).then((result) => {
    const storedNotes = result as NotesByUrl;
    const existingNotes = storedNotes[url];

    if (!existingNotes) {
      console.error(
        "Error: You are trying to update a Markdown Sticky Note that does not exist, please refresh the page."
      );
      return;
    }

    const newArray = existingNotes.filter((note) => note.id !== id);
    newArray.push(updatedData);

    const newData = {
      [url]: newArray,
    };
    saveItem(newData);
  });
};

/** Remove a single note from storage */
export const removeNoteFromStorage = (id: number) => {
  // need to get the note and modify and save
  const url = window.location.href.split("#")[0];
  browser.storage.local.get(url).then((result) => {
    const storedNotes = result as NotesByUrl;
    const existingNotes = storedNotes[url] ?? [];
    const newArray = existingNotes.filter((note) => note.id !== id);
    const newData = {
      [url]: newArray,
    };

    if (newArray.length === 0) {
      removeUrlFromStorage(url);
    } else {
      // save the item
      saveItem(newData);
    }
  });
};

/** Save the whole item for the current url */
export const saveItem = <T extends Record<string, unknown>>(item: T) => {
  // save the item
  browser.storage.local
    .set(item)
    .then(() => {
      // console.log("saved: ", item);
    })
    .catch((err) => {
      console.error(err);
      alert(
        "An error occurred while saving the note. Please try again later." + err
      );
    });
};

/** Remove all notes from url */
export const removeUrlFromStorage = (url: string) => {
  browser.storage.local.remove([url]);
};
