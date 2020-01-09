# Change Log

## [0.0.4] - 2020-01-02

Some fixes.

#### Added

- description for the extension in manifest.json

#### Changed

- change background script persistent to false

#### Fixed

- fix typos in comments

## [0.0.5] - 2020-01-06

Bug fixes.

#### Fixed

- Extension not working after a while, i mistakenly put `browserAction.onClicked` listener inside `onInstall` block, so it stopped working after i restart the browser.

## [0.0.6] - 2020-01-07

Bug fixes.

#### Fixed

- Tool bar font-size break on some pages. (inherited font-size from main page)

## [0.0.8] - 2020-01-09

Bug fixes.

#### Fixed

- Fixed CSS for ordered list items displayed as unordered items.
- Fixed CSS of inline code tag, ul/ol indentation, change all rem to em.
