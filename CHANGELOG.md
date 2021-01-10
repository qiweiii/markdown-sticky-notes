# Change Log

## [0.0.4] - 2020-01-02

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

## [0.0.9] - 2020-02-25

#### Changed

- Remove auto focus when rendering created notes.
- Minimum height and width.

#### Fixed

- Focusing need triple click for new notes.
- Break long url.
- List items consistent indentation.

## [0.1.0] - 2020-12-20

#### Added

- Note opacity

#### Changed

- Options page url list overflow
- url list sort by name
- Save notes by url without hash

#### Fixed

- CSS conflict in some pages
- Extension size too large (5MB) after install
- Fixed source map warning

## [0.1.1] - 2021-01-xx

#### Added

