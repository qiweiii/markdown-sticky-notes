# Markdown-Sticky-Notes

## Features

- Create new notes by clicking on the extension icon
- Auto save content and position
- Draggable
- Resizable
- Multiple editor theme, font

## Test/Install locally

```js
yarn install
yarn build // output to build directory
```

Go to [chrome://extensions/](chrome://extensions/), turn on developer mode, click "load unpacked" button, choose the `build/` folder, then you will be able to see extension icon in Chrome extension bar.

## Notes

- I am using Manifest version 2, because version 3 is new and doc is not complete and not much tutorials exist yet, but i will switch to MV3 later on.
- User could set shortcuts in [chrome://extensions/shortcuts](chrome://extensions/shortcuts)

## Feature requests

- Export/import all notes
- Export/import notes in one page
- different style for hashtags (tag pills)
- scroll sync between editor and output
- pin a note
- supports SPA
