# Change Log

## [0.0.4] - 2020-01-02

Some fixes.

#### Added

- description for the extension in manifest.json

#### Changed

- change background script persistent to false

#### Fixed

- fix typos in comments

## [0.0.5] - 2020-01-xx

Bug fixes.

#### Added

#### Changed

#### Fixed

- Extension not working after a while, i mistakenly put `browserAction.onClicked` listener inside `onInstall` block, so it stopped working after i restart the browser.
