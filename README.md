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

- refer to `wxt` [docs](https://wxt.dev/guide/introduction.html) for more details


## Install Locally

```sh
pnpm run build
```

- Go to [chrome://extensions/](chrome://extensions/)
- Turn on developer mode
- Click "load unpacked" button
- Choose the `.output/chrome-mv3/` folder
- Then you will be able to see extension icon in Chrome extension bar.
