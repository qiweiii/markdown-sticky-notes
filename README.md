# Markdown Sticky Notes

> A markdown sticky note that can be used in web pages

## Features

- Create new notes by clicking on the extension icon
- Auto save content and position in the web page
- Draggable, resizable
- Multiple editor theme and font styles
- Nice markdown result

## Develop

```sh
# dev
pnpm run dev

# build
pnpm run build
pnpm run build:firefox

# zip
pnpm run zip
pnpm run zip:firefox
```

- refer to `wxt` [docs](https://wxt.dev/guide/introduction.html)

## Feature Requests

- [ ] Export/import notes, by website or all notes
- [ ] Different style for hashtags (e.g. tag pills)
- [ ] Scroll sync between editor and result
- [ ] Pin a note (fixed position in window)
- [ ] Supports save in SPA
- [ ] Hotkeys/Shortcuts for creating notes
- [ ] Improve styles of markdown result
- [ ] Publish to firefox
- [ ] Publish to edge
- [ ] Publish to safari

## Manifest version

I am using version 2 since migrating to version 3 requires too much work. I will migrate to version 3 when I have time.

## Install Locally

```sh
pnpm run build
```

- Go to [chrome://extensions/](chrome://extensions/)
- Turn on developer mode
- Click "load unpacked" button
- Choose the `.output/chrome-mv2/` folder
- Then you will be able to see extension icon in Chrome extension bar.
