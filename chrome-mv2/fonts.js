(function() {
  "use strict";
  const definition = {
    "Consolas": `"Consolas", "monaco", monospace`,
    "Courier New": `"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace`,
    "Anonymous Pro": "markdown-stick-notes-family-anonymous-pro",
    "B612 Mono": "markdown-stick-notes-family-b612-mono",
    "Inconsolata": "markdown-stick-notes-family-inconsolata",
    "PT Mono": "markdown-stick-notes-family-pt-mono",
    "Roboto Mono": "markdown-stick-notes-family-roboto-mono",
    "Source Code Pro": "markdown-stick-notes-family-source-code-pro",
    "Space Mono": "markdown-stick-notes-family-space-mono"
  };
  function print(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  var logger = {
    debug: (...args) => print(console.debug, ...args),
    log: (...args) => print(console.log, ...args),
    warn: (...args) => print(console.warn, ...args),
    error: (...args) => print(console.error, ...args)
  };
  (async () => {
    try {
      await definition.main();
    } catch (err) {
      logger.error(
        `The unlisted script "${"fonts"}" crashed on startup!`,
        err
      );
    }
  })();
})();
