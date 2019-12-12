/*global chrome*/

// storage stuff: https://developer.chrome.com/extensions/storage
// using local for now since it has 5MB limit, sync only has 104kb limit.
// rmb can only get item using top-level keys
/**
 * @typedef {Object} Data
 * @property {Note[]} url - The key of this object
 */
/**
 * @typedef {Object} Note
 * @property {string} id
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {string} content - text in editor
 * @property {string} theme - editor theme
 * @property {string} font - editor font
 * @property {number} fontSize - editor font-size
 */
/** Initial data for a new note */
export const constructAndInitData = (x,y,id) => {
  let theme, font;
  let data;
  chrome.storage.local.get('defaultTheme', function(themeR) {
    theme = themeR.defaultTheme;
    chrome.storage.local.get("defaultEditorFontFamily", function(fontR) {
      font = fontR.defaultEditorFontFamily;
      chrome.storage.local.get("defaultEditorFontSize", function(fontSize) {
        data = {
          id: id,
          x: x,
          y: y,
          width: 200,
          height: 250,
          content: "",
          theme: theme,
          font: font,
          fontSize: fontSize.defaultEditorFontSize
        }
        // console.log(data);
        initData(data, id);
      });
    });
  });
}

/** Init a single note's data to current url's list of notes 
 *  Used for initialise new note and save it
*/
export const initData = (noteData, id) => {
  // need to check exisitng ones first
  let url = window.location.href;
  let data;
  // console.log("noteData passed to init: ", noteData)
  chrome.storage.local.get(url, function(result) {
    // console.log('init get result: ', result);
    if (typeof result[url] === 'undefined') {
      // if url item empty means no item for this url yet
      data = {
        [url]: [
          noteData
        ]
      }
    } else {
      result[url].push(noteData);
      data = result;
    }
    saveItem(data);
    // chrome.storage.local.get([window.location.href], function(result) { // for testing
    //   console.log("after save:", result);
    // });
  });
}

/** Update data for a particular note */
export const updateData = (updatedData, id) => {
  const url = window.location.href;
  chrome.storage.local.get(url, function(result) {
    // console.log("update's get result: ", result);
    let newArray = result[url].filter(note => note.id !== id);
    newArray.push(updatedData);
    // console.log("updated array", newArray);
    const newData = {
      [window.location.href]: newArray
    }
    saveItem(newData);
  });
}

/** Remove a single note from storage */
export const removeNoteFromStorage = (id) => {
  // need to get the note and modify and save
  const url = window.location.href;
  chrome.storage.local.get(url, function(result) {
    let newArray = result[url].filter(note => note.id !== id);
    const newData = {
      [window.location.href]: newArray
    }
    // console.log("data after rm: ", newData)
    if (newArray.length === 0) {
      removeUrlFromStorage(window.location.href);
    } else {
      // save the item
      saveItem(newData);
    }
  });
}

/** Save the whole item for the current url */
export const saveItem = (item) => {
  // save the item
  chrome.storage.local.set(item, function() {
    if (chrome.runtime.lastError) {
      alert("Chrome's local storage for markdown sticky notes is full, please delete some of notes in options page");
    }
    // console.log("saved: ", item);
  });
}

/** Remove all notes from url */
export const removeUrlFromStorage = (url) => {
  chrome.storage.local.remove([url])
}
