/*global chrome*/

interface Data {
  url: Note[];
}

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
}

/** Initial data for a new note */
export const constructAndInitData = (x: number, y: number, id: number) => {
  let data;
  browser.storage.local
    .get([
      "defaultTheme",
      "defaultEditorFontFamily",
      "defaultOpacity",
      "defaultEditorFontSize",
    ])
    .then((res) => {
      let theme = res.defaultTheme;
      let font = res.defaultEditorFontFamily;
      let fontSize = res.defaultEditorFontSize;
      data = {
        id: id,
        x: x,
        y: y,
        width: 200,
        height: 250,
        content: "",
        theme: theme,
        font: font,
        fontSize: fontSize.defaultEditorFontSize,
        opacity: 1,
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
    // console.log('init get result: ', result);
    if (typeof result[url] === "undefined") {
      // if url item empty means no item for this url yet
      data = {
        [url]: [noteData],
      };
    } else {
      result[url].push(noteData);
      data = result;
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
    if (!result[url]) {
      alert(
        "Error: You are trying to edit a deleted Markdown Sticky Note, please refresh the page."
      );
      return;
    }
    // console.log("update's get result: ", result);
    let newArray = result[url].filter((note: Note) => note.id !== id);
    newArray.push(updatedData);
    // console.log("updated array", newArray);
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
    let newArray = result[url].filter((note: Note) => note.id !== id);
    const newData = {
      [url]: newArray,
    };
    // console.log("data after rm: ", newData)
    if (newArray.length === 0) {
      removeUrlFromStorage(url);
    } else {
      // save the item
      saveItem(newData);
    }
  });
};

/** Save the whole item for the current url */
export const saveItem = (item: { [url: string]: Note[] }) => {
  // save the item
  browser.storage.local
    .set(item)
    .then(() => {
      console.log("saved: ", item);
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
