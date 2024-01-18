(function() {
  "use strict";
  const definition = [
    "3024-day",
    "3024-night",
    "abcdef",
    "base16-dark",
    "bespin",
    "base16-light",
    "blackboard",
    "cobalt",
    "duotone-dark",
    "duotone-light",
    "eclipse",
    "elegant",
    "erlang-dark",
    "isotope",
    "lesser-dark",
    "liquibyte",
    "lucario",
    "material",
    "material-darker",
    "material-palenight",
    "material-ocean",
    "mbo",
    "mdn-like",
    "midnight",
    "monokai",
    "neat",
    "neo",
    "night",
    "nord",
    "oceanic-next",
    "panda-syntax",
    "paraiso-dark",
    "paraiso-light",
    "railscasts",
    "rubyblue",
    "seti",
    "shadowfox",
    "solarized",
    "the-matrix",
    "tomorrow-night-bright",
    "tomorrow-night-eighties",
    "ttcn",
    "twilight",
    "vibrant-ink",
    "yonce"
  ];
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
        `The unlisted script "${"themes"}" crashed on startup!`,
        err
      );
    }
  })();
})();
