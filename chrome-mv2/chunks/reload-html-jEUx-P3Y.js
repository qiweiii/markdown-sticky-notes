(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
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
function setupWebSocket(onMessage) {
  const serverUrl = `${"ws:"}//${"localhost"}:${3e3}`;
  logger.debug("Connecting to dev server @", serverUrl);
  const ws = new WebSocket(serverUrl, "vite-hmr");
  ws.addEventListener("open", () => {
    logger.debug("Connected to dev server");
  });
  ws.addEventListener("close", () => {
    logger.debug("Disconnected from dev server");
  });
  ws.addEventListener("error", (event) => {
    logger.error("Failed to connect to dev server", event);
  });
  ws.addEventListener("message", (e) => {
    var _a, _b;
    try {
      const message = JSON.parse(e.data);
      if (message.type === "custom" && ((_b = (_a = message.event) == null ? void 0 : _a.startsWith) == null ? void 0 : _b.call(_a, "wxt:"))) {
        onMessage == null ? void 0 : onMessage(message);
      }
    } catch (err) {
      logger.error("Failed to handle message", err);
    }
  });
  return ws;
}
{
  try {
    setupWebSocket((message) => {
      if (message.event === "wxt:reload-page") {
        if (message.data === location.pathname.substring(1)) {
          location.reload();
        }
      }
    });
  } catch (err) {
    logger.error("Failed to setup web socket connection with dev server", err);
  }
}
