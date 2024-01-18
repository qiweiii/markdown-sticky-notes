(function() {
  "use strict";
  var _MatchPattern = class {
    constructor(matchPattern) {
      if (matchPattern === "<all_urls>") {
        this.isAllUrls = true;
        this.protocolMatches = [..._MatchPattern.PROTOCOLS];
        this.hostnameMatch = "*";
        this.pathnameMatch = "*";
      } else {
        const groups = /(.*):\/\/(.*?)(\/.*)/.exec(matchPattern);
        if (groups == null)
          throw new InvalidMatchPattern(matchPattern, "Incorrect format");
        const [_, protocol, hostname, pathname] = groups;
        validateProtocol(matchPattern, protocol);
        validateHostname(matchPattern, hostname);
        this.protocolMatches = protocol === "*" ? ["http", "https"] : [protocol];
        this.hostnameMatch = hostname;
        this.pathnameMatch = pathname;
      }
    }
    includes(url) {
      if (this.isAllUrls)
        return true;
      const u = typeof url === "string" ? new URL(url) : url instanceof Location ? new URL(url.href) : url;
      return !!this.protocolMatches.find((protocol) => {
        if (protocol === "http")
          return this.isHttpMatch(u);
        if (protocol === "https")
          return this.isHttpsMatch(u);
        if (protocol === "file")
          return this.isFileMatch(u);
        if (protocol === "ftp")
          return this.isFtpMatch(u);
        if (protocol === "urn")
          return this.isUrnMatch(u);
      });
    }
    isHttpMatch(url) {
      return url.protocol === "http:" && this.isHostPathMatch(url);
    }
    isHttpsMatch(url) {
      return url.protocol === "https:" && this.isHostPathMatch(url);
    }
    isHostPathMatch(url) {
      if (!this.hostnameMatch || !this.pathnameMatch)
        return false;
      const hostnameMatchRegexs = [
        this.convertPatternToRegex(this.hostnameMatch),
        this.convertPatternToRegex(this.hostnameMatch.replace(/^\*\./, ""))
      ];
      const pathnameMatchRegex = this.convertPatternToRegex(this.pathnameMatch);
      return !!hostnameMatchRegexs.find((regex) => regex.test(url.hostname)) && pathnameMatchRegex.test(url.pathname);
    }
    isFileMatch(url) {
      throw Error("Not implemented: file:// pattern matching. Open a PR to add support");
    }
    isFtpMatch(url) {
      throw Error("Not implemented: ftp:// pattern matching. Open a PR to add support");
    }
    isUrnMatch(url) {
      throw Error("Not implemented: urn:// pattern matching. Open a PR to add support");
    }
    convertPatternToRegex(pattern) {
      const escaped = this.escapeForRegex(pattern);
      const starsReplaced = escaped.replace(/\\\*/g, ".*");
      return RegExp(`^${starsReplaced}$`);
    }
    escapeForRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  };
  var MatchPattern = _MatchPattern;
  MatchPattern.PROTOCOLS = ["http", "https", "file", "ftp", "urn"];
  var InvalidMatchPattern = class extends Error {
    constructor(matchPattern, reason) {
      super(`Invalid match pattern "${matchPattern}": ${reason}`);
    }
  };
  function validateProtocol(matchPattern, protocol) {
    if (!MatchPattern.PROTOCOLS.includes(protocol) && protocol !== "*")
      throw new InvalidMatchPattern(
        matchPattern,
        `${protocol} not a valid protocol (${MatchPattern.PROTOCOLS.join(", ")})`
      );
  }
  function validateHostname(matchPattern, hostname) {
    if (hostname.includes(":"))
      throw new InvalidMatchPattern(matchPattern, `Hostname cannot include a port`);
    if (hostname.includes("*") && hostname.length > 1 && !hostname.startsWith("*."))
      throw new InvalidMatchPattern(
        matchPattern,
        `If using a wildcard (*), it must go at the start of the hostname`
      );
  }
  function defineBackground(arg) {
    if (typeof arg === "function")
      return { main: arg };
    return arg;
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var browserPolyfill = { exports: {} };
  (function(module, exports) {
    (function(global2, factory) {
      {
        factory(module);
      }
    })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : commonjsGlobal, function(module2) {
      var _a, _b;
      if (!((_b = (_a = globalThis.chrome) == null ? void 0 : _a.runtime) == null ? void 0 : _b.id)) {
        throw new Error("This script should only be loaded in a browser extension.");
      }
      if (typeof globalThis.browser === "undefined" || Object.getPrototypeOf(globalThis.browser) !== Object.prototype) {
        const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
        const wrapAPIs = (extensionAPIs) => {
          const apiMetadata = {
            "alarms": {
              "clear": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "clearAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "get": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "bookmarks": {
              "create": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getChildren": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getRecent": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getSubTree": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getTree": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "move": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeTree": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "search": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            },
            "browserAction": {
              "disable": {
                "minArgs": 0,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "enable": {
                "minArgs": 0,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "getBadgeBackgroundColor": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getBadgeText": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getPopup": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getTitle": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "openPopup": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "setBadgeBackgroundColor": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setBadgeText": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setIcon": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "setPopup": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setTitle": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              }
            },
            "browsingData": {
              "remove": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "removeCache": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeCookies": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeDownloads": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeFormData": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeHistory": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeLocalStorage": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removePasswords": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removePluginData": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "settings": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "commands": {
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "contextMenus": {
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            },
            "cookies": {
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAllCookieStores": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "set": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "devtools": {
              "inspectedWindow": {
                "eval": {
                  "minArgs": 1,
                  "maxArgs": 2,
                  "singleCallbackArg": false
                }
              },
              "panels": {
                "create": {
                  "minArgs": 3,
                  "maxArgs": 3,
                  "singleCallbackArg": true
                },
                "elements": {
                  "createSidebarPane": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                }
              }
            },
            "downloads": {
              "cancel": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "download": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "erase": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getFileIcon": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "open": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "pause": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeFile": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "resume": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "search": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "show": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              }
            },
            "extension": {
              "isAllowedFileSchemeAccess": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "isAllowedIncognitoAccess": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "history": {
              "addUrl": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "deleteAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "deleteRange": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "deleteUrl": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getVisits": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "search": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "i18n": {
              "detectLanguage": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAcceptLanguages": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "identity": {
              "launchWebAuthFlow": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "idle": {
              "queryState": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "management": {
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getSelf": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "setEnabled": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "uninstallSelf": {
                "minArgs": 0,
                "maxArgs": 1
              }
            },
            "notifications": {
              "clear": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "create": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getPermissionLevel": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            },
            "pageAction": {
              "getPopup": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getTitle": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "hide": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setIcon": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "setPopup": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "setTitle": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              },
              "show": {
                "minArgs": 1,
                "maxArgs": 1,
                "fallbackToNoCallback": true
              }
            },
            "permissions": {
              "contains": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "request": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "runtime": {
              "getBackgroundPage": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getPlatformInfo": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "openOptionsPage": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "requestUpdateCheck": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "sendMessage": {
                "minArgs": 1,
                "maxArgs": 3
              },
              "sendNativeMessage": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "setUninstallURL": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "sessions": {
              "getDevices": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getRecentlyClosed": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "restore": {
                "minArgs": 0,
                "maxArgs": 1
              }
            },
            "storage": {
              "local": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getBytesInUse": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "managed": {
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getBytesInUse": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "sync": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getBytesInUse": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              }
            },
            "tabs": {
              "captureVisibleTab": {
                "minArgs": 0,
                "maxArgs": 2
              },
              "create": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "detectLanguage": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "discard": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "duplicate": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "executeScript": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "get": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getCurrent": {
                "minArgs": 0,
                "maxArgs": 0
              },
              "getZoom": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getZoomSettings": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "goBack": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "goForward": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "highlight": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "insertCSS": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "move": {
                "minArgs": 2,
                "maxArgs": 2
              },
              "query": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "reload": {
                "minArgs": 0,
                "maxArgs": 2
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "removeCSS": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "sendMessage": {
                "minArgs": 2,
                "maxArgs": 3
              },
              "setZoom": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "setZoomSettings": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "update": {
                "minArgs": 1,
                "maxArgs": 2
              }
            },
            "topSites": {
              "get": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "webNavigation": {
              "getAllFrames": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "getFrame": {
                "minArgs": 1,
                "maxArgs": 1
              }
            },
            "webRequest": {
              "handlerBehaviorChanged": {
                "minArgs": 0,
                "maxArgs": 0
              }
            },
            "windows": {
              "create": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "get": {
                "minArgs": 1,
                "maxArgs": 2
              },
              "getAll": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getCurrent": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "getLastFocused": {
                "minArgs": 0,
                "maxArgs": 1
              },
              "remove": {
                "minArgs": 1,
                "maxArgs": 1
              },
              "update": {
                "minArgs": 2,
                "maxArgs": 2
              }
            }
          };
          if (Object.keys(apiMetadata).length === 0) {
            throw new Error("api-metadata.json has not been included in browser-polyfill");
          }
          class DefaultWeakMap extends WeakMap {
            constructor(createItem, items = void 0) {
              super(items);
              this.createItem = createItem;
            }
            get(key) {
              if (!this.has(key)) {
                this.set(key, this.createItem(key));
              }
              return super.get(key);
            }
          }
          const isThenable = (value) => {
            return value && typeof value === "object" && typeof value.then === "function";
          };
          const makeCallback = (promise, metadata) => {
            return (...callbackArgs) => {
              if (extensionAPIs.runtime.lastError) {
                promise.reject(new Error(extensionAPIs.runtime.lastError.message));
              } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
                promise.resolve(callbackArgs[0]);
              } else {
                promise.resolve(callbackArgs);
              }
            };
          };
          const pluralizeArguments = (numArgs) => numArgs == 1 ? "argument" : "arguments";
          const wrapAsyncFunction = (name, metadata) => {
            return function asyncFunctionWrapper(target, ...args) {
              if (args.length < metadata.minArgs) {
                throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
              }
              if (args.length > metadata.maxArgs) {
                throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
              }
              return new Promise((resolve, reject) => {
                if (metadata.fallbackToNoCallback) {
                  try {
                    target[name](...args, makeCallback({
                      resolve,
                      reject
                    }, metadata));
                  } catch (cbError) {
                    console.warn(`${name} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, cbError);
                    target[name](...args);
                    metadata.fallbackToNoCallback = false;
                    metadata.noCallback = true;
                    resolve();
                  }
                } else if (metadata.noCallback) {
                  target[name](...args);
                  resolve();
                } else {
                  target[name](...args, makeCallback({
                    resolve,
                    reject
                  }, metadata));
                }
              });
            };
          };
          const wrapMethod = (target, method, wrapper) => {
            return new Proxy(method, {
              apply(targetMethod, thisObj, args) {
                return wrapper.call(thisObj, target, ...args);
              }
            });
          };
          let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
          const wrapObject = (target, wrappers = {}, metadata = {}) => {
            let cache = /* @__PURE__ */ Object.create(null);
            let handlers = {
              has(proxyTarget2, prop) {
                return prop in target || prop in cache;
              },
              get(proxyTarget2, prop, receiver) {
                if (prop in cache) {
                  return cache[prop];
                }
                if (!(prop in target)) {
                  return void 0;
                }
                let value = target[prop];
                if (typeof value === "function") {
                  if (typeof wrappers[prop] === "function") {
                    value = wrapMethod(target, target[prop], wrappers[prop]);
                  } else if (hasOwnProperty(metadata, prop)) {
                    let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                    value = wrapMethod(target, target[prop], wrapper);
                  } else {
                    value = value.bind(target);
                  }
                } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
                  value = wrapObject(value, wrappers[prop], metadata[prop]);
                } else if (hasOwnProperty(metadata, "*")) {
                  value = wrapObject(value, wrappers[prop], metadata["*"]);
                } else {
                  Object.defineProperty(cache, prop, {
                    configurable: true,
                    enumerable: true,
                    get() {
                      return target[prop];
                    },
                    set(value2) {
                      target[prop] = value2;
                    }
                  });
                  return value;
                }
                cache[prop] = value;
                return value;
              },
              set(proxyTarget2, prop, value, receiver) {
                if (prop in cache) {
                  cache[prop] = value;
                } else {
                  target[prop] = value;
                }
                return true;
              },
              defineProperty(proxyTarget2, prop, desc) {
                return Reflect.defineProperty(cache, prop, desc);
              },
              deleteProperty(proxyTarget2, prop) {
                return Reflect.deleteProperty(cache, prop);
              }
            };
            let proxyTarget = Object.create(target);
            return new Proxy(proxyTarget, handlers);
          };
          const wrapEvent = (wrapperMap) => ({
            addListener(target, listener, ...args) {
              target.addListener(wrapperMap.get(listener), ...args);
            },
            hasListener(target, listener) {
              return target.hasListener(wrapperMap.get(listener));
            },
            removeListener(target, listener) {
              target.removeListener(wrapperMap.get(listener));
            }
          });
          const onRequestFinishedWrappers = new DefaultWeakMap((listener) => {
            if (typeof listener !== "function") {
              return listener;
            }
            return function onRequestFinished(req) {
              const wrappedReq = wrapObject(
                req,
                {},
                {
                  getContent: {
                    minArgs: 0,
                    maxArgs: 0
                  }
                }
              );
              listener(wrappedReq);
            };
          });
          const onMessageWrappers = new DefaultWeakMap((listener) => {
            if (typeof listener !== "function") {
              return listener;
            }
            return function onMessage(message, sender, sendResponse) {
              let didCallSendResponse = false;
              let wrappedSendResponse;
              let sendResponsePromise = new Promise((resolve) => {
                wrappedSendResponse = function(response) {
                  didCallSendResponse = true;
                  resolve(response);
                };
              });
              let result;
              try {
                result = listener(message, sender, wrappedSendResponse);
              } catch (err) {
                result = Promise.reject(err);
              }
              const isResultThenable = result !== true && isThenable(result);
              if (result !== true && !isResultThenable && !didCallSendResponse) {
                return false;
              }
              const sendPromisedResult = (promise) => {
                promise.then((msg) => {
                  sendResponse(msg);
                }, (error) => {
                  let message2;
                  if (error && (error instanceof Error || typeof error.message === "string")) {
                    message2 = error.message;
                  } else {
                    message2 = "An unexpected error occurred";
                  }
                  sendResponse({
                    __mozWebExtensionPolyfillReject__: true,
                    message: message2
                  });
                }).catch((err) => {
                  console.error("Failed to send onMessage rejected reply", err);
                });
              };
              if (isResultThenable) {
                sendPromisedResult(result);
              } else {
                sendPromisedResult(sendResponsePromise);
              }
              return true;
            };
          });
          const wrappedSendMessageCallback = ({
            reject,
            resolve
          }, reply) => {
            if (extensionAPIs.runtime.lastError) {
              if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
                resolve();
              } else {
                reject(new Error(extensionAPIs.runtime.lastError.message));
              }
            } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
              reject(new Error(reply.message));
            } else {
              resolve(reply);
            }
          };
          const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
            if (args.length < metadata.minArgs) {
              throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
            }
            if (args.length > metadata.maxArgs) {
              throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
            }
            return new Promise((resolve, reject) => {
              const wrappedCb = wrappedSendMessageCallback.bind(null, {
                resolve,
                reject
              });
              args.push(wrappedCb);
              apiNamespaceObj.sendMessage(...args);
            });
          };
          const staticWrappers = {
            devtools: {
              network: {
                onRequestFinished: wrapEvent(onRequestFinishedWrappers)
              }
            },
            runtime: {
              onMessage: wrapEvent(onMessageWrappers),
              onMessageExternal: wrapEvent(onMessageWrappers),
              sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                minArgs: 1,
                maxArgs: 3
              })
            },
            tabs: {
              sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                minArgs: 2,
                maxArgs: 3
              })
            }
          };
          const settingMetadata = {
            clear: {
              minArgs: 1,
              maxArgs: 1
            },
            get: {
              minArgs: 1,
              maxArgs: 1
            },
            set: {
              minArgs: 1,
              maxArgs: 1
            }
          };
          apiMetadata.privacy = {
            network: {
              "*": settingMetadata
            },
            services: {
              "*": settingMetadata
            },
            websites: {
              "*": settingMetadata
            }
          };
          return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
        };
        module2.exports = wrapAPIs(chrome);
      } else {
        module2.exports = globalThis.browser;
      }
    });
  })(browserPolyfill);
  var browserPolyfillExports = browserPolyfill.exports;
  const originalBrowser = /* @__PURE__ */ getDefaultExportFromCjs(browserPolyfillExports);
  var browser = originalBrowser;
  (function() {
    var data = {
      "resource": {
        "version": "2",
        "macros": [{ "function": "__e" }, { "vtp_signal": 0, "function": "__c", "vtp_value": 0 }, { "function": "__c", "vtp_value": "google.cn" }, { "function": "__c", "vtp_value": 1 }, { "vtp_signal": 0, "function": "__c", "vtp_value": 0 }, { "function": "__c", "vtp_value": "google.cn" }, { "function": "__c", "vtp_value": 1 }],
        "tags": [{ "function": "__ogt_ga_send", "priority": 7, "vtp_value": true, "tag_id": 16 }, { "function": "__ogt_referral_exclusion", "priority": 7, "vtp_includeConditions": ["list", "asdf\\.com"], "tag_id": 18 }, { "function": "__ogt_session_timeout", "priority": 7, "vtp_sessionMinutes": 30, "vtp_sessionHours": 0, "tag_id": 19 }, { "function": "__ogt_1p_data_v2", "priority": 7, "vtp_isAutoEnabled": true, "vtp_autoCollectExclusionSelectors": ["list", ["map", "exclusionSelector", ""]], "vtp_isEnabled": true, "vtp_cityType": "CSS_SELECTOR", "vtp_manualEmailEnabled": false, "vtp_firstNameType": "CSS_SELECTOR", "vtp_countryType": "CSS_SELECTOR", "vtp_cityValue": "", "vtp_emailType": "CSS_SELECTOR", "vtp_regionType": "CSS_SELECTOR", "vtp_autoEmailEnabled": true, "vtp_postalCodeValue": "", "vtp_lastNameValue": "", "vtp_phoneType": "CSS_SELECTOR", "vtp_phoneValue": "", "vtp_streetType": "CSS_SELECTOR", "vtp_autoPhoneEnabled": false, "vtp_postalCodeType": "CSS_SELECTOR", "vtp_emailValue": "", "vtp_firstNameValue": "", "vtp_streetValue": "", "vtp_lastNameType": "CSS_SELECTOR", "vtp_autoAddressEnabled": false, "vtp_regionValue": "", "vtp_countryValue": "", "vtp_isAutoCollectPiiEnabledFlag": false, "tag_id": 20 }, { "function": "__ccd_ga_first", "priority": 6, "vtp_instanceDestinationId": "G-3X9EELR6PB", "tag_id": 27 }, { "function": "__set_product_settings", "priority": 5, "vtp_instanceDestinationId": "G-3X9EELR6PB", "vtp_foreignTldMacroResult": ["macro", 5], "vtp_isChinaVipRegionMacroResult": ["macro", 6], "tag_id": 26 }, { "function": "__ogt_google_signals", "priority": 4, "vtp_googleSignals": "DISABLED", "vtp_instanceDestinationId": "G-3X9EELR6PB", "vtp_serverMacroResult": ["macro", 4], "tag_id": 25 }, { "function": "__ccd_ga_regscope", "priority": 3, "vtp_settingsTable": ["list", ["map", "redactFieldGroup", "DEVICE_AND_GEO", "disallowAllRegions", false, "disallowedRegions", ""], ["map", "redactFieldGroup", "GOOGLE_SIGNALS", "disallowAllRegions", true, "disallowedRegions", ""]], "vtp_instanceDestinationId": "G-3X9EELR6PB", "tag_id": 24 }, { "function": "__ccd_conversion_marking", "priority": 2, "vtp_conversionRules": ["list", ["map", "matchingRules", '{"type":5,"args":[{"stringValue":"purchase"},{"contextValue":{"namespaceType":1,"keyParts":["eventName"]}}]}']], "vtp_instanceDestinationId": "G-3X9EELR6PB", "tag_id": 23 }, { "function": "__ccd_auto_redact", "priority": 1, "vtp_redactEmail": false, "vtp_instanceDestinationId": "G-3X9EELR6PB", "tag_id": 22 }, { "function": "__gct", "vtp_trackingId": "G-3X9EELR6PB", "vtp_sessionDuration": 0, "vtp_googleSignals": ["macro", 1], "vtp_foreignTld": ["macro", 2], "vtp_restrictDomain": ["macro", 3], "vtp_eventSettings": ["map"], "tag_id": 13 }, { "function": "__ccd_ga_last", "priority": 0, "vtp_instanceDestinationId": "G-3X9EELR6PB", "tag_id": 21 }],
        "predicates": [{ "function": "_eq", "arg0": ["macro", 0], "arg1": "gtm.js" }, { "function": "_eq", "arg0": ["macro", 0], "arg1": "gtm.init" }],
        "rules": [[["if", 0], ["add", 10]], [["if", 1], ["add", 0, 1, 2, 3, 11, 9, 8, 7, 6, 5, 4]]]
      },
      "runtime": [
        [50, "__ccd_auto_redact", [46, "a"], [50, "v", [46, "bk"], [36, [2, [15, "bk"], "replace", [7, [15, "u"], "\\$1"]]]], [50, "w", [46, "bk"], [52, "bl", ["c", [15, "bk"]]], [52, "bm", [7]], [65, "bn", [2, [15, "bl"], "split", [7, ""]], [46, [53, [52, "bo", [7, ["v", [15, "bn"]]]], [52, "bp", ["d", [15, "bn"]]], [22, [12, [15, "bp"], [45]], [46, [36, ["d", ["v", [15, "bk"]]]]]], [22, [21, [15, "bp"], [15, "bn"]], [46, [2, [15, "bo"], "push", [7, [15, "bp"]]], [22, [21, [15, "bn"], [2, [15, "bn"], "toLowerCase", [7]]], [46, [2, [15, "bo"], "push", [7, ["d", [2, [15, "bn"], "toLowerCase", [7]]]]]], [46, [22, [21, [15, "bn"], [2, [15, "bn"], "toUpperCase", [7]]], [46, [2, [15, "bo"], "push", [7, ["d", [2, [15, "bn"], "toUpperCase", [7]]]]]]]]]]], [22, [18, [17, [15, "bo"], "length"], 1], [46, [2, [15, "bm"], "push", [7, [0, [0, "(?:", [2, [15, "bo"], "join", [7, "|"]]], ")"]]]], [46, [2, [15, "bm"], "push", [7, [16, [15, "bo"], 0]]]]]]]], [36, [2, [15, "bm"], "join", [7, ""]]]], [50, "x", [46, "bk", "bl", "bm"], [52, "bn", ["z", [15, "bk"], [15, "bm"]]], [22, [28, [15, "bn"]], [46, [36, [15, "bk"]]]], [22, [28, [17, [15, "bn"], "search"]], [46, [36, [15, "bk"]]]], [41, "bo"], [3, "bo", [17, [15, "bn"], "search"]], [65, "bp", [15, "bl"], [46, [53, [52, "bq", [7, ["v", [15, "bp"]], ["w", [15, "bp"]]]], [65, "br", [15, "bq"], [46, [53, [52, "bs", [30, [16, [15, "t"], [15, "br"]], [43, [15, "t"], [15, "br"], ["b", [0, [0, "([?&]", [15, "br"]], "=)([^&]*)"], "gi"]]]], [3, "bo", [2, [15, "bo"], "replace", [7, [15, "bs"], [0, "$1", [15, "r"]]]]]]]]]]], [22, [20, [15, "bo"], [17, [15, "bn"], "search"]], [46, [36, [15, "bk"]]]], [22, [20, [16, [15, "bo"], 0], "&"], [46, [3, "bo", [2, [15, "bo"], "substring", [7, 1]]]]], [22, [21, [16, [15, "bo"], 0], "?"], [46, [3, "bo", [0, "?", [15, "bo"]]]]], [22, [20, [15, "bo"], "?"], [46, [3, "bo", ""]]], [43, [15, "bn"], "search", [15, "bo"]], [36, ["ba", [15, "bn"], [15, "bm"]]]], [50, "z", [46, "bk", "bl"], [22, [20, [15, "bl"], [17, [15, "s"], "PATH"]], [46, [3, "bk", [0, [15, "y"], [15, "bk"]]]]], [36, ["g", [15, "bk"]]]], [50, "ba", [46, "bk", "bl"], [41, "bm"], [3, "bm", ""], [22, [20, [15, "bl"], [17, [15, "s"], "URL"]], [46, [53, [41, "bn"], [3, "bn", ""], [22, [30, [17, [15, "bk"], "username"], [17, [15, "bk"], "password"]], [46, [3, "bn", [0, [15, "bn"], [0, [0, [0, [17, [15, "bk"], "username"], [39, [17, [15, "bk"], "password"], ":", ""]], [17, [15, "bk"], "password"]], "@"]]]]], [3, "bm", [0, [0, [0, [17, [15, "bk"], "protocol"], "//"], [15, "bn"]], [17, [15, "bk"], "host"]]]]]], [36, [0, [0, [0, [15, "bm"], [17, [15, "bk"], "pathname"]], [17, [15, "bk"], "search"]], [17, [15, "bk"], "hash"]]]], [50, "bb", [46, "bk", "bl"], [41, "bm"], [3, "bm", [2, [15, "bk"], "replace", [7, [15, "n"], [15, "r"]]]], [22, [30, [20, [15, "bl"], [17, [15, "s"], "URL"]], [20, [15, "bl"], [17, [15, "s"], "PATH"]]], [46, [53, [52, "bn", ["z", [15, "bm"], [15, "bl"]]], [22, [20, [15, "bn"], [44]], [46, [36, [15, "bm"]]]], [52, "bo", [17, [15, "bn"], "search"]], [52, "bp", [2, [15, "bo"], "replace", [7, [15, "o"], [15, "r"]]]], [22, [20, [15, "bo"], [15, "bp"]], [46, [36, [15, "bm"]]]], [43, [15, "bn"], "search", [15, "bp"]], [3, "bm", ["ba", [15, "bn"], [15, "bl"]]]]]], [36, [15, "bm"]]], [50, "bc", [46, "bk"], [22, [20, [15, "bk"], [15, "q"]], [46, [36, [17, [15, "s"], "PATH"]]], [46, [22, [21, [2, [15, "p"], "indexOf", [7, [15, "bk"]]], [27, 1]], [46, [36, [17, [15, "s"], "URL"]]], [46, [36, [17, [15, "s"], "TEXT"]]]]]]], [50, "bd", [46, "bk", "bl"], [41, "bm"], [3, "bm", false], [52, "bn", ["f", [15, "bk"]]], [38, [15, "bn"], [46, "string", "array", "object"], [46, [5, [46, [52, "bo", ["bb", [15, "bk"], [15, "bl"]]], [22, [21, [15, "bk"], [15, "bo"]], [46, [36, [15, "bo"]]]], [4]]], [5, [46, [53, [41, "bp"], [3, "bp", 0], [63, [7, "bp"], [23, [15, "bp"], [17, [15, "bk"], "length"]], [33, [15, "bp"], [3, "bp", [0, [15, "bp"], 1]]], [46, [53, [52, "bq", ["bd", [16, [15, "bk"], [15, "bp"]], [17, [15, "s"], "TEXT"]]], [22, [21, [15, "bq"], [44]], [46, [43, [15, "bk"], [15, "bp"], [15, "bq"]], [3, "bm", true]]]]]]], [4]]], [5, [46, [54, "bp", [15, "bk"], [46, [53, [52, "bq", ["bd", [16, [15, "bk"], [15, "bp"]], [17, [15, "s"], "TEXT"]]], [22, [21, [15, "bq"], [44]], [46, [43, [15, "bk"], [15, "bp"], [15, "bq"]], [3, "bm", true]]]]]], [4]]]]], [36, [39, [15, "bm"], [15, "bk"], [44]]]], [50, "bj", [46, "bk", "bl"], [52, "bm", [30, [2, [15, "bk"], "getMetadata", [7, [15, "bi"]]], [7]]], [22, [20, [2, [15, "bm"], "indexOf", [7, [15, "bl"]]], [27, 1]], [46, [2, [15, "bm"], "push", [7, [15, "bl"]]]]], [2, [15, "bk"], "setMetadata", [7, [15, "bi"], [15, "bm"]]]], [52, "b", ["require", "internal.createRegex"]], [52, "c", ["require", "decodeUriComponent"]], [52, "d", ["require", "encodeUriComponent"]], [52, "e", [13, [41, "$0"], [3, "$0", ["require", "internal.getFlags"]], ["$0"]]], [52, "f", ["require", "getType"]], [52, "g", ["require", "parseUrl"]], [52, "h", ["require", "internal.registerCcdCallback"]], [52, "i", [17, [15, "a"], "instanceDestinationId"]], [52, "j", [17, [15, "a"], "redactEmail"]], [52, "k", [17, [15, "a"], "redactQueryParams"]], [52, "l", [39, [15, "k"], [2, [15, "k"], "split", [7, ","]], [7]]], [52, "m", "is_sgtm_prehit"], [22, [1, [28, [17, [15, "l"], "length"]], [28, [15, "j"]]], [46, [2, [15, "a"], "gtmOnSuccess", [7]], [36]]], [52, "n", ["b", "[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}", "gi"]], [52, "o", ["b", [0, "([A-Z0-9._-]|%25|%2B)+%40[A-Z0-9.-]", "+\\.[A-Z]{2,}"], "gi"]], [52, "p", [7, "page_location", "page_referrer", "page_path", "link_url", "video_url", "form_destination"]], [52, "q", "page_path"], [52, "r", "(redacted)"], [52, "s", [8, "TEXT", 0, "URL", 1, "PATH", 2]], [52, "t", [8]], [52, "u", ["b", "([\\\\^$.|?*+(){}]|\\[|\\[)", "g"]], [52, "y", "http://."], [52, "be", 15], [52, "bf", 16], [52, "bg", 23], [52, "bh", 24], [52, "bi", "event_usage"], ["h", [15, "i"], [51, "", [7, "bk"], [22, [15, "j"], [46, [53, [52, "bl", [2, [15, "bk"], "getHitKeys", [7]]], [65, "bm", [15, "bl"], [46, [53, [22, [20, [15, "bm"], "_sst_parameters"], [46, [6]]], [52, "bn", [2, [15, "bk"], "getHitData", [7, [15, "bm"]]]], [22, [28, [15, "bn"]], [46, [6]]], [52, "bo", ["bc", [15, "bm"]]], [52, "bp", ["bd", [15, "bn"], [15, "bo"]]], [22, [21, [15, "bp"], [44]], [46, [2, [15, "bk"], "setHitData", [7, [15, "bm"], [15, "bp"]]], ["bj", [15, "bk"], [39, [2, [15, "bk"], "getMetadata", [7, [15, "m"]]], [15, "bg"], [15, "be"]]]]]]]]]]], [22, [17, [15, "l"], "length"], [46, [65, "bl", [15, "p"], [46, [53, [52, "bm", [2, [15, "bk"], "getHitData", [7, [15, "bl"]]]], [22, [28, [15, "bm"]], [46, [6]]], [52, "bn", [39, [20, [15, "bl"], [15, "q"]], [17, [15, "s"], "PATH"], [17, [15, "s"], "URL"]]], [52, "bo", ["x", [15, "bm"], [15, "l"], [15, "bn"]]], [22, [21, [15, "bo"], [15, "bm"]], [46, [2, [15, "bk"], "setHitData", [7, [15, "bl"], [15, "bo"]]], ["bj", [15, "bk"], [39, [2, [15, "bk"], "getMetadata", [7, [15, "m"]]], [15, "bh"], [15, "bf"]]]]]]]]]]]], [2, [15, "a"], "gtmOnSuccess", [7]]],
        [50, "__ccd_conversion_marking", [46, "a"], [22, [30, [28, [17, [15, "a"], "conversionRules"]], [20, [17, [17, [15, "a"], "conversionRules"], "length"], 0]], [46, [2, [15, "a"], "gtmOnSuccess", [7]], [36]]], [52, "b", ["require", "internal.copyPreHit"]], [52, "c", ["require", "internal.evaluateBooleanExpression"]], [52, "d", ["require", "internal.registerCcdCallback"]], [52, "e", "is_conversion"], [52, "f", "is_first_visit"], [52, "g", "is_first_visit_conversion"], [52, "h", "is_session_start"], [52, "i", "is_session_start_conversion"], [52, "j", "first_visit"], [52, "k", "session_start"], [41, "l"], [41, "m"], ["d", [17, [15, "a"], "instanceDestinationId"], [51, "", [7, "n"], [52, "o", [8, "preHit", [15, "n"]]], [65, "p", [17, [15, "a"], "conversionRules"], [46, [22, ["c", [17, [15, "p"], "matchingRules"], [15, "o"]], [46, [2, [15, "n"], "setMetadata", [7, [15, "e"], true]], [4]]]]], [22, [2, [15, "n"], "getMetadata", [7, [15, "f"]]], [46, [22, [28, [15, "l"]], [46, [53, [52, "p", ["b", [15, "n"], [8, "omitHitData", true, "omitMetadata", true]]], [2, [15, "p"], "setEventName", [7, [15, "j"]]], [3, "l", [8, "preHit", [15, "p"]]]]]], [65, "p", [17, [15, "a"], "conversionRules"], [46, [22, ["c", [17, [15, "p"], "matchingRules"], [15, "l"]], [46, [2, [15, "n"], "setMetadata", [7, [15, "g"], true]], [4]]]]]]], [22, [2, [15, "n"], "getMetadata", [7, [15, "h"]]], [46, [22, [28, [15, "m"]], [46, [53, [52, "p", ["b", [15, "n"], [8, "omitHitData", true, "omitMetadata", true]]], [2, [15, "p"], "setEventName", [7, [15, "k"]]], [3, "m", [8, "preHit", [15, "p"]]]]]], [65, "p", [17, [15, "a"], "conversionRules"], [46, [22, ["c", [17, [15, "p"], "matchingRules"], [15, "m"]], [46, [2, [15, "n"], "setMetadata", [7, [15, "i"], true]], [4]]]]]]]]], [2, [15, "a"], "gtmOnSuccess", [7]], [36]],
        [50, "__ccd_ga_first", [46, "a"], [2, [15, "a"], "gtmOnSuccess", [7]]],
        [50, "__ccd_ga_last", [46, "a"], [2, [15, "a"], "gtmOnSuccess", [7]]],
        [50, "__ccd_ga_regscope", [46, "a"], [52, "b", [15, "__module_ccdGaRegionScopedSettings"]], [2, [15, "b"], "applyRegionScopedSettings", [7, [15, "a"]]], [2, [15, "a"], "gtmOnSuccess", [7]]],
        [50, "__ogt_1p_data_v2", [46, "a"], [50, "j", [46, "m", "n", "o"], [22, [20, [16, [15, "n"], "type"], [15, "o"]], [46, [22, [28, [15, "m"]], [46, [3, "m", [8]]]], [22, [28, [16, [15, "m"], [15, "o"]]], [46, [43, [15, "m"], [15, "o"], [16, [15, "n"], "userData"]]]]]], [36, [15, "m"]]], [50, "k", [46, "m", "n"], [52, "o", [16, [15, "a"], [15, "m"]]], [41, "p"], [22, [20, [15, "o"], "CSS_SELECTOR"], [46, [3, "p", "css_selector"]], [46, [22, [20, [15, "o"], "JS_VAR"], [46, [3, "p", "js_variable"]]]]], [36, [8, "selector_type", [15, "p"], "value", [16, [15, "a"], [15, "n"]]]]], [50, "l", [46, "m", "n", "o", "p"], [22, [28, [16, [15, "a"], [15, "p"]]], [46, [36]]], [43, [15, "m"], [15, "n"], ["k", [15, "o"], [15, "p"]]]], [22, [28, [17, [15, "a"], "isEnabled"]], [46, [2, [15, "a"], "gtmOnSuccess", [7]], [36]]], [52, "b", [13, [41, "$0"], [3, "$0", ["require", "internal.getFlags"]], ["$0"]]], [52, "c", ["require", "internal.getDestinationIds"]], [52, "d", ["require", "internal.getProductSettingsParameter"]], [52, "e", ["require", "internal.detectUserProvidedData"]], [52, "f", ["require", "internal.setRemoteConfigParameter"]], [52, "g", ["require", "internal.registerCcdCallback"]], [52, "h", [30, ["c"], [7]]], [52, "i", [8, "enable_code", true]], [22, [17, [15, "a"], "isAutoEnabled"], [46, [53, [52, "m", [7]], [22, [1, [17, [15, "a"], "autoCollectExclusionSelectors"], [17, [17, [15, "a"], "autoCollectExclusionSelectors"], "length"]], [46, [53, [41, "o"], [3, "o", 0], [63, [7, "o"], [23, [15, "o"], [17, [17, [15, "a"], "autoCollectExclusionSelectors"], "length"]], [33, [15, "o"], [3, "o", [0, [15, "o"], 1]]], [46, [53, [52, "p", [17, [16, [17, [15, "a"], "autoCollectExclusionSelectors"], [15, "o"]], "exclusionSelector"]], [22, [15, "p"], [46, [2, [15, "m"], "push", [7, [15, "p"]]]]]]]]]]], [52, "n", [39, [17, [15, "a"], "isAutoCollectPiiEnabledFlag"], [17, [15, "a"], "autoEmailEnabled"], true]], [43, [15, "i"], "auto_detect", [8, "email", [15, "n"], "phone", [17, [15, "a"], "autoPhoneEnabled"], "address", [17, [15, "a"], "autoAddressEnabled"], "exclude_element_selectors", [15, "m"]]]]]], [22, [17, [15, "a"], "isManualEnabled"], [46, [53, [52, "m", [8]], [22, [17, [15, "a"], "manualEmailEnabled"], [46, ["l", [15, "m"], "email", "emailType", "emailValue"]]], [22, [17, [15, "a"], "manualPhoneEnabled"], [46, ["l", [15, "m"], "phone", "phoneType", "phoneValue"]]], [22, [17, [15, "a"], "manualAddressEnabled"], [46, [53, [52, "n", [8]], ["l", [15, "n"], "first_name", "firstNameType", "firstNameValue"], ["l", [15, "n"], "last_name", "lastNameType", "lastNameValue"], ["l", [15, "n"], "street", "streetType", "streetValue"], ["l", [15, "n"], "city", "cityType", "cityValue"], ["l", [15, "n"], "region", "regionType", "regionValue"], ["l", [15, "n"], "country", "countryType", "countryValue"], ["l", [15, "n"], "postal_code", "postalCodeType", "postalCodeValue"], [43, [15, "m"], "name_and_address", [7, [15, "n"]]]]]], [43, [15, "i"], "selectors", [15, "m"]]]]], [65, "m", [15, "h"], [46, [53, [41, "n"], [3, "n", [15, "i"]], [22, [1, [20, [2, [15, "m"], "indexOf", [7, "G-"]], 0], [28, [16, [15, "b"], "enableEuidAutoMode"]]], [46, [53, [52, "q", [8, "enable_code", true, "selectors", [16, [15, "i"], "selectors"]]], [3, "n", [15, "q"]]]]], ["f", [15, "m"], "user_data_settings", [15, "n"]], [52, "o", [16, [15, "n"], "auto_detect"]], [22, [28, [15, "o"]], [46, [6]]], [52, "p", [51, "", [7, "q"], [52, "r", [2, [15, "q"], "getMetadata", [7, "user_data_from_automatic"]]], [22, [15, "r"], [46, [36, [15, "r"]]]], [52, "s", ["e", [8, "excludeElementSelectors", [16, [15, "o"], "exclude_element_selectors"], "fieldFilters", [8, "email", [16, [15, "o"], "email"], "phone", [16, [15, "o"], "phone"], "address", [16, [15, "o"], "address"]]]]], [52, "t", [1, [15, "s"], [16, [15, "s"], "elements"]]], [52, "u", [8]], [22, [1, [15, "t"], [18, [17, [15, "t"], "length"], 0]], [46, [53, [41, "v"], [53, [41, "w"], [3, "w", 0], [63, [7, "w"], [23, [15, "w"], [17, [15, "t"], "length"]], [33, [15, "w"], [3, "w", [0, [15, "w"], 1]]], [46, [53, [52, "x", [16, [15, "t"], [15, "w"]]], ["j", [15, "u"], [15, "x"], "email"], [22, [16, [15, "b"], "enableAutoPiiOnPhoneAndAddress"], [46, ["j", [15, "u"], [15, "x"], "phone_number"], [3, "v", ["j", [15, "v"], [15, "x"], "first_name"]], [3, "v", ["j", [15, "v"], [15, "x"], "last_name"]], [3, "v", ["j", [15, "v"], [15, "x"], "country"]], [3, "v", ["j", [15, "v"], [15, "x"], "postal_code"]]]]]]]], [22, [1, [15, "v"], [28, [16, [15, "u"], "address"]]], [46, [43, [15, "u"], "address", [15, "v"]]]]]]], [2, [15, "q"], "setMetadata", [7, "user_data_from_automatic", [15, "u"]]], [36, [15, "u"]]]], ["g", [15, "m"], [51, "", [7, "q"], [2, [15, "q"], "setMetadata", [7, "user_data_from_automatic_getter", [15, "p"]]]]]]]], [2, [15, "a"], "gtmOnSuccess", [7]]],
        [50, "__ogt_ga_send", [46, "a"], [50, "g", [46, "h", "i", "j", "k"], [22, [21, [16, [15, "h"], [15, "i"]], [44]], [46, [43, [15, "j"], [15, "k"], [16, [15, "h"], [15, "i"]]]]]], [22, [28, [17, [15, "a"], "value"]], [46, [2, [15, "a"], "gtmOnSuccess", [7]], [36]]], [52, "b", ["require", "getContainerVersion"]], [52, "c", ["require", "internal.getDestinationIds"]], [52, "d", ["require", "internal.sendGtagEvent"]], [52, "e", ["require", "internal.addGaSendListener"]], [41, "f"], [3, "f", ["c"]], [22, [30, [28, [15, "f"]], [20, [17, [15, "f"], "length"], 0]], [46, [3, "f", [7, [17, ["b"], "containerId"]]]]], ["e", [51, "", [7, "h", "i"], [41, "j"], [41, "k"], [3, "k", [8]], [22, [20, [15, "h"], "event"], [46, [3, "j", [16, [15, "i"], "eventAction"]], ["g", [15, "i"], "eventCategory", [15, "k"], "event_category"], ["g", [15, "i"], "eventLabel", [15, "k"], "event_label"], ["g", [15, "i"], "eventValue", [15, "k"], "value"]], [46, [22, [20, [15, "h"], "exception"], [46, [3, "j", "exception"], ["g", [15, "i"], "exDescription", [15, "k"], "description"], ["g", [15, "i"], "exFatal", [15, "k"], "fatal"]], [46, [22, [20, [15, "h"], "timing"], [46, [22, [30, [30, [20, [16, [15, "i"], "timingCategory"], [44]], [20, [16, [15, "i"], "timingVar"], [44]]], [20, [16, [15, "i"], "timingValue"], [44]]], [46, [36]]], [3, "j", "timing_complete"], ["g", [15, "i"], "timingCategory", [15, "k"], "event_category"], ["g", [15, "i"], "timingVar", [15, "k"], "name"], ["g", [15, "i"], "timingValue", [15, "k"], "value"], ["g", [15, "i"], "timingLabel", [15, "k"], "event_label"]]]]]]], [22, [21, [15, "j"], [44]], [46, [53, [52, "l", [8, "eventMetadata", [8, "event_usage", [7, 7]], "eventId", [17, [15, "a"], "gtmEventId"], "noGtmEvent", true]], [65, "m", [15, "f"], [46, [22, [20, [2, [15, "m"], "indexOf", [7, "G-"]], 0], [46, ["d", [15, "m"], [15, "j"], [15, "k"], [15, "l"]]]]]]]]]]], [2, [15, "a"], "gtmOnSuccess", [7]]],
        [50, "__ogt_google_signals", [46, "a"], [52, "b", ["require", "internal.setProductSettingsParameter"]], [52, "c", ["require", "getContainerVersion"]], [52, "d", [13, [41, "$0"], [3, "$0", ["require", "internal.getFlags"]], ["$0"]]], [52, "e", [30, [17, [15, "a"], "instanceDestinationId"], [17, ["c"], "containerId"]]], ["b", [15, "e"], "google_signals", [20, [17, [15, "a"], "serverMacroResult"], 1]], ["b", [15, "e"], "google_ono", [20, [17, [15, "a"], "serverMacroResult"], 2]], [2, [15, "a"], "gtmOnSuccess", [7]]],
        [50, "__ogt_referral_exclusion", [46, "a"], [52, "b", [15, "__module_convertDomainConditions"]], [52, "c", ["require", "internal.getDestinationIds"]], [52, "d", ["require", "internal.setRemoteConfigParameter"]], [52, "e", [13, [41, "$0"], [3, "$0", ["require", "internal.getFlags"]], ["$0"]]], [22, [17, [15, "a"], "includeConditions"], [46, [53, [41, "f"], [3, "f", [30, ["c"], [7]]], [65, "g", [15, "f"], [46, [53, [41, "h"], [3, "h", [17, [15, "a"], "includeConditions"]], [22, [17, [15, "h"], "length"], [46, [3, "h", [2, [15, "b"], "convertDomainConditions", [7, [15, "h"]]]], ["d", [15, "g"], "referral_exclusion_definition", [8, "include_conditions", [15, "h"]]]]]]]]]]], [2, [15, "a"], "gtmOnSuccess", [7]]],
        [50, "__ogt_session_timeout", [46, "a"], [52, "b", ["require", "internal.getDestinationIds"]], [52, "c", ["require", "makeNumber"]], [52, "d", ["require", "internal.setRemoteConfigParameter"]], [41, "e"], [3, "e", [30, ["b"], [7]]], [52, "f", [30, ["c", [17, [15, "a"], "sessionHours"]], 0]], [52, "g", [30, ["c", [17, [15, "a"], "sessionMinutes"]], 0]], [22, [30, [15, "f"], [15, "g"]], [46, [53, [52, "i", [0, [26, [15, "f"], 60], [15, "g"]]], [65, "j", [15, "e"], [46, ["d", [15, "j"], "session_duration", [15, "i"]]]]]]], [52, "h", [30, ["c", [17, [15, "a"], "engagementSeconds"]], 0]], [22, [15, "h"], [46, [53, [52, "i", [26, [15, "h"], 1e3]], [65, "j", [15, "e"], [46, ["d", [15, "j"], "session_engaged_time", [15, "i"]]]]]]], [2, [15, "a"], "gtmOnSuccess", [7]]],
        [50, "__set_product_settings", [46, "a"], [2, [15, "a"], "gtmOnSuccess", [7]]],
        [52, "__module_convertDomainConditions", [13, [41, "$0"], [3, "$0", [51, "", [7], [50, "a", [46], [50, "e", [46, "g"], [36, [2, [15, "g"], "replace", [7, [15, "d"], "\\$&"]]]], [50, "f", [46, "g"], [52, "h", [7]], [53, [41, "i"], [3, "i", 0], [63, [7, "i"], [23, [15, "i"], [17, [15, "g"], "length"]], [33, [15, "i"], [3, "i", [0, [15, "i"], 1]]], [46, [53, [41, "j"], [22, [20, ["c", [16, [15, "g"], [15, "i"]]], "object"], [46, [53, [52, "l", [16, [16, [15, "g"], [15, "i"]], "matchType"]], [52, "m", [16, [16, [15, "g"], [15, "i"]], "matchValue"]], [38, [15, "l"], [46, "BEGINS_WITH", "ENDS_WITH", "EQUALS", "REGEX", "CONTAINS"], [46, [5, [46, [3, "j", [0, "^", ["e", [15, "m"]]]], [4]]], [5, [46, [3, "j", [0, ["e", [15, "m"]], "$"]], [4]]], [5, [46, [3, "j", [0, [0, "^", ["e", [15, "m"]]], "$"]], [4]]], [5, [46, [3, "j", [15, "m"]], [4]]], [5, [46]], [9, [46, [3, "j", ["e", [15, "m"]]], [4]]]]]]], [46, [3, "j", [16, [15, "g"], [15, "i"]]]]], [41, "k"], [22, [15, "j"], [46, [3, "k", ["b", [15, "j"]]]]], [22, [15, "k"], [46, [2, [15, "h"], "push", [7, [15, "k"]]]]]]]]], [36, [15, "h"]]], [52, "b", ["require", "internal.createRegex"]], [52, "c", ["require", "getType"]], [52, "d", ["b", "[.*+\\-?^${}()|[\\]\\\\]", "g"]], [36, [8, "convertDomainConditions", [15, "f"]]]], [36, ["a"]]]], ["$0"]]],
        [52, "__module_activities", [13, [41, "$0"], [3, "$0", [51, "", [7], [50, "a", [46], [50, "b", [46, "c", "d"], [36, [39, [15, "d"], ["d", [15, "c"]], [15, "c"]]]], [36, [8, "withRequestContext", [15, "b"]]]], [36, ["a"]]]], ["$0"]]],
        [52, "__module_ccdGaRegionScopedSettings", [13, [41, "$0"], [3, "$0", [51, "", [7], [50, "a", [46], [50, "j", [46, "l", "m"], [50, "r", [46, "s"], [22, [30, [28, [15, "p"]], [21, [17, [15, "p"], "length"], 2]], [46, [36, false]]], [52, "t", ["k", [15, "s"]]], [53, [41, "u"], [3, "u", 0], [63, [7, "u"], [23, [15, "u"], [17, [15, "t"], "length"]], [33, [15, "u"], [3, "u", [0, [15, "u"], 1]]], [46, [53, [52, "v", [16, [15, "t"], [15, "u"]]], [52, "w", [17, [15, "v"], "countryCode"]], [52, "x", [17, [15, "v"], "regionCode"]], [52, "y", [20, [15, "w"], [15, "p"]]], [52, "z", [30, [28, [15, "x"]], [20, [15, "x"], [15, "q"]]]], [22, [1, [15, "y"], [15, "z"]], [46, [36, true]]]]]]], [36, false]], [22, [28, [17, [15, "l"], "settingsTable"]], [46, [36]]], [52, "n", [30, [17, [15, "l"], "instanceDestinationId"], [17, ["b"], "containerId"]]], [52, "o", ["g", [15, "c"], [15, "m"]]], [52, "p", [13, [41, "$0"], [3, "$0", ["g", [15, "d"], [15, "m"]]], ["$0"]]], [52, "q", [13, [41, "$0"], [3, "$0", ["g", [15, "e"], [15, "m"]]], ["$0"]]], [53, [41, "s"], [3, "s", 0], [63, [7, "s"], [23, [15, "s"], [17, [17, [15, "l"], "settingsTable"], "length"]], [33, [15, "s"], [3, "s", [0, [15, "s"], 1]]], [46, [53, [52, "t", [16, [17, [15, "l"], "settingsTable"], [15, "s"]]], [22, [30, [17, [15, "t"], "disallowAllRegions"], ["r", [17, [15, "t"], "disallowedRegions"]]], [46, [53, [52, "u", [16, [15, "i"], [17, [15, "t"], "redactFieldGroup"]]], [22, [28, [15, "u"]], [46, [6]]], [53, [41, "v"], [3, "v", 0], [63, [7, "v"], [23, [15, "v"], [17, [15, "u"], "length"]], [33, [15, "v"], [3, "v", [0, [15, "v"], 1]]], [46, [53, [52, "w", [16, [15, "u"], [15, "v"]]], ["o", [15, "n"], [17, [15, "w"], "name"], [17, [15, "w"], "value"]]]]]]]]]]]]]], [50, "k", [46, "l"], [52, "m", [7]], [22, [28, [15, "l"]], [46, [36, [15, "m"]]]], [52, "n", [2, [15, "l"], "split", [7, ","]]], [53, [41, "o"], [3, "o", 0], [63, [7, "o"], [23, [15, "o"], [17, [15, "n"], "length"]], [33, [15, "o"], [3, "o", [0, [15, "o"], 1]]], [46, [53, [52, "p", [2, [16, [15, "n"], [15, "o"]], "trim", [7]]], [22, [28, [15, "p"]], [46, [6]]], [52, "q", [2, [15, "p"], "split", [7, "-"]]], [52, "r", [16, [15, "q"], 0]], [52, "s", [39, [20, [17, [15, "q"], "length"], 2], [15, "p"], [44]]], [22, [30, [28, [15, "r"]], [21, [17, [15, "r"], "length"], 2]], [46, [6]]], [22, [1, [21, [15, "s"], [44]], [30, [23, [17, [15, "s"], "length"], 4], [18, [17, [15, "s"], "length"], 6]]], [46, [6]]], [2, [15, "m"], "push", [7, [8, "countryCode", [15, "r"], "regionCode", [15, "s"]]]]]]]], [36, [15, "m"]]], [52, "b", ["require", "getContainerVersion"]], [52, "c", ["require", "internal.setRemoteConfigParameter"]], [52, "d", ["require", "internal.getCountryCode"]], [52, "e", ["require", "internal.getRegionCode"]], [52, "f", [15, "__module_activities"]], [52, "g", [17, [15, "f"], "withRequestContext"]], [41, "h"], [52, "i", [8, "GOOGLE_SIGNALS", [7, [8, "name", "allow_google_signals", "value", false]], "DEVICE_AND_GEO", [7, [8, "name", "geo_granularity", "value", true], [8, "name", "redact_device_info", "value", true]]]], [36, [8, "applyRegionScopedSettings", [15, "j"]]]], [36, ["a"]]]], ["$0"]]]
      ],
      "entities": {
        "__ccd_auto_redact": { "2": true, "4": true },
        "__ccd_conversion_marking": { "2": true, "4": true },
        "__ccd_ga_first": { "2": true, "4": true },
        "__ccd_ga_last": { "2": true, "4": true },
        "__ccd_ga_regscope": { "2": true, "4": true },
        "__ogt_1p_data_v2": { "2": true },
        "__ogt_ga_send": { "2": true },
        "__ogt_google_signals": { "2": true, "4": true },
        "__ogt_referral_exclusion": { "2": true },
        "__ogt_session_timeout": { "2": true },
        "__set_product_settings": { "2": true, "4": true }
      },
      "permissions": {
        "__ccd_auto_redact": {},
        "__ccd_conversion_marking": {},
        "__ccd_ga_first": {},
        "__ccd_ga_last": {},
        "__ccd_ga_regscope": { "read_container_data": {} },
        "__ogt_1p_data_v2": { "detect_user_provided_data": { "limitDataSources": true, "allowAutoDataSources": true, "allowManualDataSources": false, "allowCodeDataSources": false } },
        "__ogt_ga_send": { "access_globals": { "keys": [{ "key": "ga.q", "read": true, "write": true, "execute": true }, { "key": "GoogleAnalyticsObject", "read": true, "write": false, "execute": false }] }, "read_container_data": {} },
        "__ogt_google_signals": { "read_container_data": {} },
        "__ogt_referral_exclusion": {},
        "__ogt_session_timeout": {},
        "__set_product_settings": {}
      },
      "security_groups": {
        "google": [
          "__ccd_auto_redact",
          "__ccd_conversion_marking",
          "__ccd_ga_first",
          "__ccd_ga_last",
          "__ccd_ga_regscope",
          "__ogt_1p_data_v2",
          "__ogt_ga_send",
          "__ogt_google_signals",
          "__ogt_referral_exclusion",
          "__ogt_session_timeout",
          "__set_product_settings"
        ]
      }
    };
    var aa, ba = function(a) {
      var b = 0;
      return function() {
        return b < a.length ? { done: false, value: a[b++] } : { done: true };
      };
    }, ca = function(a) {
      return a.raw = a;
    }, da = function(a, b) {
      a.raw = b;
      return a;
    }, ea = function(a) {
      var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
      if (b)
        return b.call(a);
      if ("number" == typeof a.length)
        return { next: ba(a) };
      throw Error(String(a) + " is not an iterable or ArrayLike");
    }, ha = function(a) {
      for (var b, c = []; !(b = a.next()).done; )
        c.push(b.value);
      return c;
    }, ia = function(a) {
      return a instanceof Array ? a : ha(ea(a));
    }, ja = "function" == typeof Object.create ? Object.create : function(a) {
      var b = function() {
      };
      b.prototype = a;
      return new b();
    }, ma;
    if ("function" == typeof Object.setPrototypeOf)
      ma = Object.setPrototypeOf;
    else {
      var na;
      a: {
        var oa = { a: true }, qa = {};
        try {
          qa.__proto__ = oa;
          na = qa.a;
          break a;
        } catch (a) {
        }
        na = false;
      }
      ma = na ? function(a, b) {
        a.__proto__ = b;
        if (a.__proto__ !== b)
          throw new TypeError(a + " is not extensible");
        return a;
      } : null;
    }
    var ra = ma, sa = function(a, b) {
      a.prototype = ja(b.prototype);
      a.prototype.constructor = a;
      if (ra)
        ra(a, b);
      else
        for (var c in b)
          if ("prototype" != c)
            if (Object.defineProperties) {
              var d = Object.getOwnPropertyDescriptor(b, c);
              d && Object.defineProperty(a, c, d);
            } else
              a[c] = b[c];
      a.Zn = b.prototype;
    }, ta = function() {
      for (var a = Number(this), b = [], c = a; c < arguments.length; c++)
        b[c - a] = arguments[c];
      return b;
    };
    var ua = this || self, va = function(a) {
      return a;
    };
    var wa = function(a, b) {
      this.h = a;
      this.s = b;
    };
    var xa = function() {
      this.h = {};
      this.C = {};
    };
    aa = xa.prototype;
    aa.get = function(a) {
      return this.h["dust." + a];
    };
    aa.set = function(a, b) {
      a = "dust." + a;
      this.C.hasOwnProperty(a) || (this.h[a] = b);
    };
    aa.Uh = function(a, b) {
      this.set(a, b);
      this.C["dust." + a] = true;
    };
    aa.has = function(a) {
      return this.h.hasOwnProperty("dust." + a);
    };
    aa.remove = function(a) {
      a = "dust." + a;
      this.C.hasOwnProperty(a) || delete this.h[a];
    };
    var ya = function() {
      this.quota = {};
    };
    ya.prototype.reset = function() {
      this.quota = {};
    };
    var za = function(a, b) {
      this.X = a;
      this.M = function(c, d, e) {
        return c.apply(d, e);
      };
      this.C = b;
      this.s = new xa();
      this.h = this.F = void 0;
    };
    za.prototype.add = function(a, b) {
      Aa(this, a, b, false);
    };
    var Aa = function(a, b, c, d) {
      d ? a.s.Uh(b, c) : a.s.set(b, c);
    };
    za.prototype.set = function(a, b) {
      !this.s.has(a) && this.C && this.C.has(a) ? this.C.set(a, b) : this.s.set(a, b);
    };
    za.prototype.get = function(a) {
      return this.s.has(a) ? this.s.get(a) : this.C ? this.C.get(a) : void 0;
    };
    za.prototype.has = function(a) {
      return !!this.s.has(a) || !(!this.C || !this.C.has(a));
    };
    var Ba = function(a) {
      var b = new za(a.X, a);
      a.F && (b.F = a.F);
      b.M = a.M;
      b.h = a.h;
      return b;
    };
    var Fa = function(a) {
      return "function" === typeof a;
    }, k = function(a) {
      return "string" === typeof a;
    }, Ga = function(a) {
      return "number" === typeof a && !isNaN(a);
    }, Ha = Array.isArray, Ia = function(a, b) {
      if (a && Ha(a)) {
        for (var c = 0; c < a.length; c++)
          if (a[c] && b(a[c]))
            return a[c];
      }
    }, Ja = function(a, b) {
      if (!Ga(a) || !Ga(b) || a > b)
        a = 0, b = 2147483647;
      return Math.floor(Math.random() * (b - a + 1) + a);
    }, La = function(a, b) {
      for (var c = new Ka(), d = 0; d < a.length; d++)
        c.set(a[d], true);
      for (var e = 0; e < b.length; e++)
        if (c.get(b[e]))
          return true;
      return false;
    }, l = function(a, b) {
      for (var c in a)
        Object.prototype.hasOwnProperty.call(a, c) && b(c, a[c]);
    }, Ma = function(a) {
      return !!a && ("[object Arguments]" === Object.prototype.toString.call(a) || Object.prototype.hasOwnProperty.call(a, "callee"));
    }, Na = function(a) {
      return Math.round(Number(a)) || 0;
    }, Oa = function(a) {
      return "false" === String(a).toLowerCase() ? false : !!a;
    }, Pa = function(a) {
      var b = [];
      if (Ha(a))
        for (var c = 0; c < a.length; c++)
          b.push(String(a[c]));
      return b;
    }, Qa = function(a) {
      return a ? a.replace(/^\s+|\s+$/g, "") : "";
    }, Ra = function() {
      return new Date(Date.now());
    }, Sa = function() {
      return Ra().getTime();
    }, Ka = function() {
      this.prefix = "gtm.";
      this.values = {};
    };
    Ka.prototype.set = function(a, b) {
      this.values[this.prefix + a] = b;
    };
    Ka.prototype.get = function(a) {
      return this.values[this.prefix + a];
    };
    var Va = function(a) {
      var b = a;
      return function() {
        if (b) {
          var c = b;
          b = void 0;
          try {
            c();
          } catch (d) {
          }
        }
      };
    }, Wa = function(a, b) {
      for (var c in b)
        b.hasOwnProperty(c) && (a[c] = b[c]);
    }, Xa = function(a, b) {
      for (var c = [], d = 0; d < a.length; d++)
        c.push(a[d]), c.push.apply(c, b[a[d]] || []);
      return c;
    }, Ya = function(a, b) {
      return a.substring(0, b.length) === b;
    }, $a = function(a, b) {
      for (var c = {}, d = c, e = a.split("."), f = 0; f < e.length - 1; f++)
        d = d[e[f]] = {};
      d[e[e.length - 1]] = b;
      return c;
    }, ab = /^\w{1,9}$/, bb = function(a, b) {
      a = a || {};
      b = b || ",";
      var c = [];
      l(a, function(d, e) {
        ab.test(d) && e && c.push(d);
      });
      return c.join(b);
    };
    function db(a, b) {
      for (var c, d = 0; d < b.length && !(c = eb(a, b[d]), c instanceof wa); d++)
        ;
      return c;
    }
    function eb(a, b) {
      try {
        var c = a.get(String(b[0]));
        if (!c || "function" !== typeof c.invoke)
          throw Error("Attempting to execute non-function " + b[0] + ".");
        return c.invoke.apply(c, [a].concat(b.slice(1)));
      } catch (e) {
        var d = a.F;
        d && d(e, b.context ? { id: b[0], line: b.context.line } : null);
        throw e;
      }
    }
    var fb = function() {
      this.C = new ya();
      this.h = new za(this.C);
    };
    fb.prototype.execute = function(a, b) {
      var c = Array.prototype.slice.call(arguments, 0);
      return this.s(c);
    };
    fb.prototype.s = function(a) {
      for (var b, c = 0; c < arguments.length; c++)
        b = eb(this.h, arguments[c]);
      return b;
    };
    fb.prototype.F = function(a, b) {
      var c = Ba(this.h);
      c.h = a;
      for (var d, e = 1; e < arguments.length; e++)
        d = eb(c, arguments[e]);
      return d;
    };
    var gb = function() {
      xa.call(this);
      this.s = false;
    };
    sa(gb, xa);
    var hb = function(a, b) {
      var c = [], d;
      for (d in a.h)
        if (a.h.hasOwnProperty(d))
          switch (d = d.substr(5), b) {
            case 1:
              c.push(d);
              break;
            case 2:
              c.push(a.get(d));
              break;
            case 3:
              c.push([d, a.get(d)]);
          }
      return c;
    };
    aa = gb.prototype;
    aa.set = function(a, b) {
      this.s || xa.prototype.set.call(this, a, b);
    };
    aa.Uh = function(a, b) {
      this.s || xa.prototype.Uh.call(this, a, b);
    };
    aa.remove = function(a) {
      this.s || xa.prototype.remove.call(this, a);
    };
    aa.Eb = function() {
      this.s = true;
    };
    aa.Hj = function() {
      return this.s;
    };
    var ib = /\[object (Boolean|Number|String|Function|Array|Date|RegExp)\]/, jb = function(a) {
      if (null == a)
        return String(a);
      var b = ib.exec(Object.prototype.toString.call(Object(a)));
      return b ? b[1].toLowerCase() : "object";
    }, kb = function(a, b) {
      return Object.prototype.hasOwnProperty.call(Object(a), b);
    }, mb = function(a) {
      if (!a || "object" != jb(a) || a.nodeType || a == a.window)
        return false;
      try {
        if (a.constructor && !kb(a, "constructor") && !kb(a.constructor.prototype, "isPrototypeOf"))
          return false;
      } catch (c) {
        return false;
      }
      for (var b in a)
        ;
      return void 0 === b || kb(a, b);
    }, nb = function(a, b) {
      var c = b || ("array" == jb(a) ? [] : {}), d;
      for (d in a)
        if (kb(a, d)) {
          var e = a[d];
          "array" == jb(e) ? ("array" != jb(c[d]) && (c[d] = []), c[d] = nb(e, c[d])) : mb(e) ? (mb(c[d]) || (c[d] = {}), c[d] = nb(e, c[d])) : c[d] = e;
        }
      return c;
    };
    var ob = function(a) {
      for (var b = [], c = 0; c < a.length(); c++)
        a.has(c) && (b[c] = a.get(c));
      return b;
    }, pb = function(a) {
      if (void 0 == a || Ha(a) || mb(a))
        return true;
      switch (typeof a) {
        case "boolean":
        case "number":
        case "string":
        case "function":
          return true;
      }
      return false;
    }, qb = function(a) {
      return "number" === typeof a && 0 <= a && isFinite(a) && 0 === a % 1 || "string" === typeof a && "-" !== a[0] && a === "" + parseInt(a, 10);
    };
    var rb = function(a) {
      this.s = new gb();
      this.h = [];
      this.C = false;
      a = a || [];
      for (var b in a)
        a.hasOwnProperty(b) && (qb(b) ? this.h[Number(b)] = a[Number(b)] : this.s.set(b, a[b]));
    };
    aa = rb.prototype;
    aa.toString = function(a) {
      if (a && 0 <= a.indexOf(this))
        return "";
      for (var b = [], c = 0; c < this.h.length; c++) {
        var d = this.h[c];
        null === d || void 0 === d ? b.push("") : d instanceof rb ? (a = a || [], a.push(this), b.push(d.toString(a)), a.pop()) : b.push(String(d));
      }
      return b.join(",");
    };
    aa.set = function(a, b) {
      if (!this.C)
        if ("length" === a) {
          if (!qb(b))
            throw Error("RangeError: Length property must be a valid integer.");
          this.h.length = Number(b);
        } else
          qb(a) ? this.h[Number(a)] = b : this.s.set(a, b);
    };
    aa.get = function(a) {
      return "length" === a ? this.length() : qb(a) ? this.h[Number(a)] : this.s.get(a);
    };
    aa.length = function() {
      return this.h.length;
    };
    aa.Tb = function() {
      for (var a = hb(this.s, 1), b = 0; b < this.h.length; b++)
        a.push(b + "");
      return new rb(a);
    };
    aa.remove = function(a) {
      qb(a) ? delete this.h[Number(a)] : this.s.remove(a);
    };
    aa.pop = function() {
      return this.h.pop();
    };
    aa.push = function(a) {
      return this.h.push.apply(this.h, Array.prototype.slice.call(arguments));
    };
    aa.shift = function() {
      return this.h.shift();
    };
    aa.splice = function(a, b, c) {
      return new rb(this.h.splice.apply(this.h, arguments));
    };
    aa.unshift = function(a) {
      return this.h.unshift.apply(this.h, Array.prototype.slice.call(arguments));
    };
    aa.has = function(a) {
      return qb(a) && this.h.hasOwnProperty(a) || this.s.has(a);
    };
    aa.Eb = function() {
      this.C = true;
      Object.freeze(this.h);
      this.s.Eb();
    };
    aa.Hj = function() {
      return this.C;
    };
    var sb = function() {
      gb.call(this);
    };
    sa(sb, gb);
    sb.prototype.Tb = function() {
      return new rb(hb(this, 1));
    };
    function tb() {
      for (var a = ub, b = {}, c = 0; c < a.length; ++c)
        b[a[c]] = c;
      return b;
    }
    function vb() {
      var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      a += a.toLowerCase() + "0123456789-_";
      return a + ".";
    }
    var ub, wb;
    function xb(a) {
      ub = ub || vb();
      wb = wb || tb();
      for (var b = [], c = 0; c < a.length; c += 3) {
        var d = c + 1 < a.length, e = c + 2 < a.length, f = a.charCodeAt(c), g = d ? a.charCodeAt(c + 1) : 0, h = e ? a.charCodeAt(c + 2) : 0, m = f >> 2, n = (f & 3) << 4 | g >> 4, p = (g & 15) << 2 | h >> 6, q = h & 63;
        e || (q = 64, d || (p = 64));
        b.push(ub[m], ub[n], ub[p], ub[q]);
      }
      return b.join("");
    }
    function yb(a) {
      function b(m) {
        for (; d < a.length; ) {
          var n = a.charAt(d++), p = wb[n];
          if (null != p)
            return p;
          if (!/^[\s\xa0]*$/.test(n))
            throw Error("Unknown base64 encoding at char: " + n);
        }
        return m;
      }
      ub = ub || vb();
      wb = wb || tb();
      for (var c = "", d = 0; ; ) {
        var e = b(-1), f = b(0), g = b(64), h = b(64);
        if (64 === h && -1 === e)
          return c;
        c += String.fromCharCode(e << 2 | f >> 4);
        64 != g && (c += String.fromCharCode(f << 4 & 240 | g >> 2), 64 != h && (c += String.fromCharCode(g << 6 & 192 | h)));
      }
    }
    var zb = {}, Ab = function(a, b) {
      zb[a] = zb[a] || [];
      zb[a][b] = true;
    }, Bb = function() {
      delete zb.GA4_EVENT;
    }, Cb = function(a) {
      var b = zb[a];
      if (!b || 0 === b.length)
        return "";
      for (var c = [], d = 0, e = 0; e < b.length; e++)
        0 === e % 8 && 0 < e && (c.push(String.fromCharCode(d)), d = 0), b[e] && (d |= 1 << e % 8);
      0 < d && c.push(String.fromCharCode(d));
      return xb(c.join("")).replace(/\.+$/, "");
    };
    var Db = Array.prototype.indexOf ? function(a, b) {
      return Array.prototype.indexOf.call(a, b, void 0);
    } : function(a, b) {
      if ("string" === typeof a)
        return "string" !== typeof b || 1 != b.length ? -1 : a.indexOf(b, 0);
      for (var c = 0; c < a.length; c++)
        if (c in a && a[c] === b)
          return c;
      return -1;
    };
    var Eb, Fb = function() {
      if (void 0 === Eb) {
        var a = null, b = ua.trustedTypes;
        if (b && b.createPolicy) {
          try {
            a = b.createPolicy("goog#html", { createHTML: va, createScript: va, createScriptURL: va });
          } catch (c) {
            ua.console && ua.console.error(c.message);
          }
          Eb = a;
        } else
          Eb = a;
      }
      return Eb;
    };
    var Gb = function(a) {
      this.h = a;
    };
    Gb.prototype.toString = function() {
      return this.h + "";
    };
    var Hb = function(a) {
      return a instanceof Gb && a.constructor === Gb ? a.h : "type_error:TrustedResourceUrl";
    }, Kb = function(a) {
      var b = a, c = Fb(), d = c ? c.createScriptURL(b) : b;
      return new Gb(d);
    };
    var Pb, Qb;
    a: {
      for (var Rb = ["CLOSURE_FLAGS"], Sb = ua, Tb = 0; Tb < Rb.length; Tb++)
        if (Sb = Sb[Rb[Tb]], null == Sb) {
          Qb = null;
          break a;
        }
      Qb = Sb;
    }
    var Ub = Qb && Qb[610401301];
    Pb = null != Ub ? Ub : false;
    function Vb() {
      var a = ua.navigator;
      if (a) {
        var b = a.userAgent;
        if (b)
          return b;
      }
      return "";
    }
    var Wb, Xb = ua.navigator;
    Wb = Xb ? Xb.userAgentData || null : null;
    function Yb(a) {
      return Pb ? Wb ? Wb.brands.some(function(b) {
        var c = b.brand;
        return c && -1 != c.indexOf(a);
      }) : false : false;
    }
    function Zb(a) {
      return -1 != Vb().indexOf(a);
    }
    function $b() {
      return Pb ? !!Wb && 0 < Wb.brands.length : false;
    }
    function ac() {
      return $b() ? false : Zb("Opera");
    }
    function bc() {
      return Zb("Firefox") || Zb("FxiOS");
    }
    function cc() {
      return $b() ? Yb("Chromium") : (Zb("Chrome") || Zb("CriOS")) && !($b() ? 0 : Zb("Edge")) || Zb("Silk");
    }
    var gc = ca([""]), hc = da(["\0"], ["\\0"]), ic = da(["\n"], ["\\n"]), jc = da(["\0"], ["\\u0000"]);
    function kc(a) {
      return -1 === a.toString().indexOf("`");
    }
    kc(function(a) {
      return a(gc);
    }) || kc(function(a) {
      return a(hc);
    }) || kc(function(a) {
      return a(ic);
    }) || kc(function(a) {
      return a(jc);
    });
    var sc = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
    var uc = function() {
    }, vc = function(a) {
      this.h = a;
    };
    sa(vc, uc);
    vc.prototype.toString = function() {
      return this.h;
    };
    function Bc(a) {
      return null === a ? "null" : void 0 === a ? "undefined" : a;
    }
    var z = window, C = document, Cc = navigator, Dc = C.currentScript && C.currentScript.src, Ec = function(a, b) {
      var c = z[a];
      z[a] = void 0 === c ? b : c;
      return z[a];
    }, Fc = function(a, b) {
      b && (a.addEventListener ? a.onload = b : a.onreadystatechange = function() {
        a.readyState in { loaded: 1, complete: 1 } && (a.onreadystatechange = null, b());
      });
    }, Gc = { async: 1, nonce: 1, onerror: 1, onload: 1, src: 1, type: 1 }, Hc = { onload: 1, src: 1, width: 1, height: 1, style: 1 };
    function Ic(a, b, c) {
      b && l(b, function(d, e) {
        d = d.toLowerCase();
        c.hasOwnProperty(d) || a.setAttribute(d, e);
      });
    }
    var Jc = function(a, b, c, d, e) {
      var f = C.createElement("script");
      Ic(f, d, Gc);
      f.type = "text/javascript";
      f.async = d && false === d.async ? false : true;
      var g;
      g = Kb(Bc(a));
      f.src = Hb(g);
      var h, m, n, p = null == (n = (m = (f.ownerDocument && f.ownerDocument.defaultView || window).document).querySelector) ? void 0 : n.call(m, "script[nonce]");
      (h = p ? p.nonce || p.getAttribute("nonce") || "" : "") && f.setAttribute("nonce", h);
      Fc(f, b);
      c && (f.onerror = c);
      if (e)
        e.appendChild(f);
      else {
        var q = C.getElementsByTagName("script")[0] || C.body || C.head;
        q.parentNode.insertBefore(
          f,
          q
        );
      }
      return f;
    }, Lc = function() {
      if (Dc) {
        var a = Dc.toLowerCase();
        if (0 === a.indexOf("https://"))
          return 2;
        if (0 === a.indexOf("http://"))
          return 3;
      }
      return 1;
    }, Mc = function(a, b, c, d, e) {
      var f;
      f = void 0 === f ? true : f;
      var g = e, h = false;
      g || (g = C.createElement("iframe"), h = true);
      Ic(g, c, Hc);
      d && l(d, function(n, p) {
        g.dataset[n] = p;
      });
      f && (g.height = "0", g.width = "0", g.style.display = "none", g.style.visibility = "hidden");
      if (h) {
        var m = C.body && C.body.lastChild || C.body || C.head;
        m.parentNode.insertBefore(g, m);
      }
      Fc(g, b);
      void 0 !== a && (g.src = a);
      return g;
    }, Nc = function(a, b, c, d) {
      var e = new Image(1, 1);
      Ic(e, d, {});
      e.onload = function() {
        e.onload = null;
        b && b();
      };
      e.onerror = function() {
        e.onerror = null;
        c && c();
      };
      e.src = a;
    }, Oc = function(a, b, c, d) {
      a.addEventListener ? a.addEventListener(b, c, !!d) : a.attachEvent && a.attachEvent("on" + b, c);
    }, Pc = function(a, b, c) {
      a.removeEventListener ? a.removeEventListener(b, c, false) : a.detachEvent && a.detachEvent("on" + b, c);
    }, F = function(a) {
      z.setTimeout(a, 0);
    }, Rc = function(a) {
      var b = a.innerText || a.textContent || "";
      b && " " != b && (b = b.replace(/^[\s\xa0]+|[\s\xa0]+$/g, ""));
      b && (b = b.replace(/(\xa0+|\s{2,}|\n|\r\t)/g, " "));
      return b;
    }, Uc = function(a) {
      var b;
      try {
        b = Cc.sendBeacon && Cc.sendBeacon(a);
      } catch (c) {
        Ab("TAGGING", 15);
      }
      b || Nc(a);
    }, Xc = function() {
      var a = z.performance;
      if (a && Fa(a.now))
        return a.now();
    };
    var ed = function(a, b) {
      gb.call(this);
      this.F = a;
      this.M = b;
    };
    sa(ed, gb);
    ed.prototype.toString = function() {
      return this.F;
    };
    ed.prototype.Tb = function() {
      return new rb(hb(this, 1));
    };
    ed.prototype.invoke = function(a, b) {
      return this.M.apply(new fd(this, a), Array.prototype.slice.call(arguments, 1));
    };
    ed.prototype.ab = function(a, b) {
      try {
        return this.invoke.apply(this, Array.prototype.slice.call(arguments, 0));
      } catch (c) {
      }
    };
    var fd = function(a, b) {
      this.s = a;
      this.h = b;
    }, H = function(a, b) {
      var c = a.h;
      return Ha(b) ? eb(c, b) : b;
    }, I = function(a) {
      return a.s.F;
    };
    var gd = function() {
      this.map = /* @__PURE__ */ new Map();
    };
    gd.prototype.set = function(a, b) {
      this.map.set(a, b);
    };
    gd.prototype.get = function(a) {
      return this.map.get(a);
    };
    var hd = function() {
      this.keys = [];
      this.values = [];
    };
    hd.prototype.set = function(a, b) {
      this.keys.push(a);
      this.values.push(b);
    };
    hd.prototype.get = function(a) {
      var b = this.keys.indexOf(a);
      if (-1 < b)
        return this.values[b];
    };
    function id() {
      try {
        return Map ? new gd() : new hd();
      } catch (a) {
        return new hd();
      }
    }
    var jd = function(a) {
      if (a instanceof jd)
        return a;
      if (pb(a))
        throw Error("Type of given value has an equivalent Pixie type.");
      this.h = a;
    };
    jd.prototype.toString = function() {
      return String(this.h);
    };
    var ld = function(a) {
      gb.call(this);
      this.F = a;
      this.set("then", kd(this));
      this.set("catch", kd(this, true));
      this.set("finally", kd(this, false, true));
    };
    sa(ld, sb);
    var kd = function(a, b, c) {
      b = void 0 === b ? false : b;
      c = void 0 === c ? false : c;
      return new ed("", function(d, e) {
        b && (e = d, d = void 0);
        c && (e = d);
        d instanceof ed || (d = void 0);
        e instanceof ed || (e = void 0);
        var f = Ba(this.h), g = function(m) {
          return function(n) {
            return c ? (m.invoke(f), a.F) : m.invoke(f, n);
          };
        }, h = a.F.then(d && g(d), e && g(e));
        return new ld(h);
      });
    };
    var nd = function(a, b, c) {
      var d = id(), e = function(g, h) {
        for (var m = hb(g, 1), n = 0; n < m.length; n++)
          h[m[n]] = f(g.get(m[n]));
      }, f = function(g) {
        var h = d.get(g);
        if (h)
          return h;
        if (g instanceof rb) {
          var m = [];
          d.set(g, m);
          for (var n = g.Tb(), p = 0; p < n.length(); p++)
            m[n.get(p)] = f(g.get(n.get(p)));
          return m;
        }
        if (g instanceof ld)
          return g.F;
        if (g instanceof sb) {
          var q = {};
          d.set(g, q);
          e(g, q);
          return q;
        }
        if (g instanceof ed) {
          var r = function() {
            for (var u = Array.prototype.slice.call(arguments, 0), v = 0; v < u.length; v++)
              u[v] = md(u[v], b, c);
            var w = new za(b ? b.X : new ya());
            b && (w.h = b.h);
            return f(g.invoke.apply(g, [w].concat(u)));
          };
          d.set(g, r);
          e(g, r);
          return r;
        }
        var t = false;
        switch (c) {
          case 1:
            t = true;
            break;
          case 2:
            t = false;
            break;
          case 3:
            t = false;
            break;
        }
        if (g instanceof jd && t)
          return g.h;
        switch (typeof g) {
          case "boolean":
          case "number":
          case "string":
          case "undefined":
            return g;
          case "object":
            if (null === g)
              return null;
        }
      };
      return f(a);
    }, md = function(a, b, c) {
      var d = id(), e = function(g, h) {
        for (var m in g)
          g.hasOwnProperty(m) && h.set(m, f(g[m]));
      }, f = function(g) {
        var h = d.get(g);
        if (h)
          return h;
        if (Ha(g) || Ma(g)) {
          var m = new rb([]);
          d.set(g, m);
          for (var n in g)
            g.hasOwnProperty(n) && m.set(n, f(g[n]));
          return m;
        }
        if (mb(g)) {
          var p = new sb();
          d.set(g, p);
          e(g, p);
          return p;
        }
        if ("function" === typeof g) {
          var q = new ed("", function(x) {
            for (var y = Array.prototype.slice.call(arguments, 0), A = 0; A < y.length; A++)
              y[A] = nd(H(this, y[A]), b, c);
            return f((0, this.h.M)(g, g, y));
          });
          d.set(g, q);
          e(g, q);
          return q;
        }
        var v = typeof g;
        if (null === g || "string" === v || "number" === v || "boolean" === v)
          return g;
        var w = false;
        switch (c) {
          case 1:
            w = true;
            break;
          case 2:
            w = false;
            break;
        }
        if (void 0 !== g && w)
          return new jd(g);
      };
      return f(a);
    };
    var pd = { supportedMethods: "concat every filter forEach hasOwnProperty indexOf join lastIndexOf map pop push reduce reduceRight reverse shift slice some sort splice unshift toString".split(" "), concat: function(a, b) {
      for (var c = [], d = 0; d < this.length(); d++)
        c.push(this.get(d));
      for (var e = 1; e < arguments.length; e++)
        if (arguments[e] instanceof rb)
          for (var f = arguments[e], g = 0; g < f.length(); g++)
            c.push(f.get(g));
        else
          c.push(arguments[e]);
      return new rb(c);
    }, every: function(a, b) {
      for (var c = this.length(), d = 0; d < this.length() && d < c; d++)
        if (this.has(d) && !b.invoke(a, this.get(d), d, this))
          return false;
      return true;
    }, filter: function(a, b) {
      for (var c = this.length(), d = [], e = 0; e < this.length() && e < c; e++)
        this.has(e) && b.invoke(a, this.get(e), e, this) && d.push(this.get(e));
      return new rb(d);
    }, forEach: function(a, b) {
      for (var c = this.length(), d = 0; d < this.length() && d < c; d++)
        this.has(d) && b.invoke(a, this.get(d), d, this);
    }, hasOwnProperty: function(a, b) {
      return this.has(b);
    }, indexOf: function(a, b, c) {
      var d = this.length(), e = void 0 === c ? 0 : Number(c);
      0 > e && (e = Math.max(d + e, 0));
      for (var f = e; f < d; f++)
        if (this.has(f) && this.get(f) === b)
          return f;
      return -1;
    }, join: function(a, b) {
      for (var c = [], d = 0; d < this.length(); d++)
        c.push(this.get(d));
      return c.join(b);
    }, lastIndexOf: function(a, b, c) {
      var d = this.length(), e = d - 1;
      void 0 !== c && (e = 0 > c ? d + c : Math.min(c, e));
      for (var f = e; 0 <= f; f--)
        if (this.has(f) && this.get(f) === b)
          return f;
      return -1;
    }, map: function(a, b) {
      for (var c = this.length(), d = [], e = 0; e < this.length() && e < c; e++)
        this.has(e) && (d[e] = b.invoke(a, this.get(e), e, this));
      return new rb(d);
    }, pop: function() {
      return this.pop();
    }, push: function(a, b) {
      return this.push.apply(this, Array.prototype.slice.call(arguments, 1));
    }, reduce: function(a, b, c) {
      var d = this.length(), e, f = 0;
      if (void 0 !== c)
        e = c;
      else {
        if (0 === d)
          throw Error("TypeError: Reduce on List with no elements.");
        for (var g = 0; g < d; g++)
          if (this.has(g)) {
            e = this.get(g);
            f = g + 1;
            break;
          }
        if (g === d)
          throw Error("TypeError: Reduce on List with no elements.");
      }
      for (var h = f; h < d; h++)
        this.has(h) && (e = b.invoke(a, e, this.get(h), h, this));
      return e;
    }, reduceRight: function(a, b, c) {
      var d = this.length(), e, f = d - 1;
      if (void 0 !== c)
        e = c;
      else {
        if (0 === d)
          throw Error("TypeError: ReduceRight on List with no elements.");
        for (var g = 1; g <= d; g++)
          if (this.has(d - g)) {
            e = this.get(d - g);
            f = d - (g + 1);
            break;
          }
        if (g > d)
          throw Error("TypeError: ReduceRight on List with no elements.");
      }
      for (var h = f; 0 <= h; h--)
        this.has(h) && (e = b.invoke(a, e, this.get(h), h, this));
      return e;
    }, reverse: function() {
      for (var a = ob(this), b = a.length - 1, c = 0; 0 <= b; b--, c++)
        a.hasOwnProperty(b) ? this.set(c, a[b]) : this.remove(c);
      return this;
    }, shift: function() {
      return this.shift();
    }, slice: function(a, b, c) {
      var d = this.length();
      void 0 === b && (b = 0);
      b = 0 > b ? Math.max(d + b, 0) : Math.min(b, d);
      c = void 0 === c ? d : 0 > c ? Math.max(d + c, 0) : Math.min(c, d);
      c = Math.max(b, c);
      for (var e = [], f = b; f < c; f++)
        e.push(this.get(f));
      return new rb(e);
    }, some: function(a, b) {
      for (var c = this.length(), d = 0; d < this.length() && d < c; d++)
        if (this.has(d) && b.invoke(a, this.get(d), d, this))
          return true;
      return false;
    }, sort: function(a, b) {
      var c = ob(this);
      void 0 === b ? c.sort() : c.sort(function(e, f) {
        return Number(b.invoke(a, e, f));
      });
      for (var d = 0; d < c.length; d++)
        c.hasOwnProperty(d) ? this.set(d, c[d]) : this.remove(d);
      return this;
    }, splice: function(a, b, c, d) {
      return this.splice.apply(this, Array.prototype.splice.call(arguments, 1, arguments.length - 1));
    }, toString: function() {
      return this.toString();
    }, unshift: function(a, b) {
      return this.unshift.apply(this, Array.prototype.slice.call(arguments, 1));
    } };
    var qd = function(a) {
      var b;
      b = Error.call(this, a);
      this.message = b.message;
      "stack" in b && (this.stack = b.stack);
    };
    sa(qd, Error);
    var rd = { charAt: 1, concat: 1, indexOf: 1, lastIndexOf: 1, match: 1, replace: 1, search: 1, slice: 1, split: 1, substring: 1, toLowerCase: 1, toLocaleLowerCase: 1, toString: 1, toUpperCase: 1, toLocaleUpperCase: 1, trim: 1 }, sd = new wa("break"), td = new wa("continue"), ud = function(a, b) {
      return H(this, a) + H(this, b);
    }, vd = function(a, b) {
      return H(this, a) && H(this, b);
    }, wd = function(a, b, c) {
      a = H(this, a);
      b = H(this, b);
      c = H(this, c);
      if (!(c instanceof rb))
        throw Error("Error: Non-List argument given to Apply instruction.");
      if (null === a || void 0 === a) {
        var d = "TypeError: Can't read property " + b + " of " + a + ".";
        throw Error(d);
      }
      var e = "number" === typeof a;
      if ("boolean" === typeof a || e) {
        if ("toString" === b) {
          if (e && c.length()) {
            var f = nd(c.get(0));
            try {
              return a.toString(f);
            } catch (y) {
            }
          }
          return a.toString();
        }
        var g = "TypeError: " + a + "." + b + " is not a function.";
        throw Error(g);
      }
      if ("string" === typeof a) {
        if (rd.hasOwnProperty(b)) {
          var h = 2;
          h = 1;
          var m = nd(c, void 0, h);
          return md(a[b].apply(a, m), this.h);
        }
        var n = "TypeError: " + b + " is not a function";
        throw Error(n);
      }
      if (a instanceof rb) {
        if (a.has(b)) {
          var p = a.get(b);
          if (p instanceof ed) {
            var q = ob(c);
            q.unshift(this.h);
            return p.invoke.apply(p, q);
          }
          var r = "TypeError: " + b + " is not a function";
          throw Error(r);
        }
        if (0 <= pd.supportedMethods.indexOf(b)) {
          var t = ob(c);
          t.unshift(this.h);
          return pd[b].apply(a, t);
        }
      }
      if (a instanceof ed || a instanceof sb) {
        if (a.has(b)) {
          var u = a.get(b);
          if (u instanceof ed) {
            var v = ob(c);
            v.unshift(this.h);
            return u.invoke.apply(u, v);
          }
          var w = "TypeError: " + b + " is not a function";
          throw Error(w);
        }
        if ("toString" === b)
          return a instanceof ed ? a.F : a.toString();
        if ("hasOwnProperty" === b)
          return a.has.apply(a, ob(c));
      }
      if (a instanceof jd && "toString" === b)
        return a.toString();
      var x = "TypeError: Object has no '" + b + "' property.";
      throw Error(x);
    }, xd = function(a, b) {
      a = H(this, a);
      if ("string" !== typeof a)
        throw Error("Invalid key name given for assignment.");
      var c = this.h;
      if (!c.has(a))
        throw Error("Attempting to assign to undefined value " + b);
      var d = H(this, b);
      c.set(a, d);
      return d;
    }, yd = function(a) {
      var b = Ba(this.h), c = db(b, Array.prototype.slice.apply(arguments));
      if (c instanceof wa)
        return c;
    }, zd = function() {
      return sd;
    }, Ad = function(a) {
      for (var b = H(this, a), c = 0; c < b.length; c++) {
        var d = H(this, b[c]);
        if (d instanceof wa)
          return d;
      }
    }, Bd = function(a) {
      for (var b = this.h, c = 0; c < arguments.length - 1; c += 2) {
        var d = arguments[c];
        if ("string" === typeof d) {
          var e = H(this, arguments[c + 1]);
          Aa(
            b,
            d,
            e,
            true
          );
        }
      }
    }, Cd = function() {
      return td;
    }, Dd = function(a, b) {
      return new wa(a, H(this, b));
    }, Ed = function(a, b, c) {
      var d = new rb();
      b = H(this, b);
      for (var e = 0; e < b.length; e++)
        d.push(b[e]);
      var f = [51, a, d].concat(Array.prototype.splice.call(arguments, 2, arguments.length - 2));
      this.h.add(a, H(this, f));
    }, Fd = function(a, b) {
      return H(this, a) / H(this, b);
    }, Gd = function(a, b) {
      a = H(this, a);
      b = H(this, b);
      var c = a instanceof jd, d = b instanceof jd;
      return c || d ? c && d ? a.h == b.h : false : a == b;
    }, Hd = function(a) {
      for (var b, c = 0; c < arguments.length; c++)
        b = H(this, arguments[c]);
      return b;
    };
    function Id(a, b, c, d) {
      for (var e = 0; e < b(); e++) {
        var f = a(c(e)), g = db(f, d);
        if (g instanceof wa) {
          if ("break" === g.h)
            break;
          if ("return" === g.h)
            return g;
        }
      }
    }
    function Jd(a, b, c) {
      if ("string" === typeof b)
        return Id(a, function() {
          return b.length;
        }, function(f) {
          return f;
        }, c);
      if (b instanceof sb || b instanceof rb || b instanceof ed) {
        var d = b.Tb(), e = d.length();
        return Id(a, function() {
          return e;
        }, function(f) {
          return d.get(f);
        }, c);
      }
    }
    var Kd = function(a, b, c) {
      a = H(this, a);
      b = H(this, b);
      c = H(this, c);
      var d = this.h;
      return Jd(function(e) {
        d.set(a, e);
        return d;
      }, b, c);
    }, Ld = function(a, b, c) {
      a = H(this, a);
      b = H(this, b);
      c = H(this, c);
      var d = this.h;
      return Jd(function(e) {
        var f = Ba(d);
        Aa(f, a, e, true);
        return f;
      }, b, c);
    }, Md = function(a, b, c) {
      a = H(this, a);
      b = H(this, b);
      c = H(this, c);
      var d = this.h;
      return Jd(function(e) {
        var f = Ba(d);
        f.add(a, e);
        return f;
      }, b, c);
    }, Od = function(a, b, c) {
      a = H(this, a);
      b = H(this, b);
      c = H(this, c);
      var d = this.h;
      return Nd(function(e) {
        d.set(a, e);
        return d;
      }, b, c);
    }, Pd = function(a, b, c) {
      a = H(this, a);
      b = H(this, b);
      c = H(this, c);
      var d = this.h;
      return Nd(function(e) {
        var f = Ba(d);
        Aa(f, a, e, true);
        return f;
      }, b, c);
    }, Qd = function(a, b, c) {
      a = H(this, a);
      b = H(this, b);
      c = H(this, c);
      var d = this.h;
      return Nd(function(e) {
        var f = Ba(d);
        f.add(a, e);
        return f;
      }, b, c);
    };
    function Nd(a, b, c) {
      if ("string" === typeof b)
        return Id(a, function() {
          return b.length;
        }, function(d) {
          return b[d];
        }, c);
      if (b instanceof rb)
        return Id(a, function() {
          return b.length();
        }, function(d) {
          return b.get(d);
        }, c);
      throw new TypeError("The value is not iterable.");
    }
    var Rd = function(a, b, c, d) {
      function e(p, q) {
        for (var r = 0; r < f.length(); r++) {
          var t = f.get(r);
          q.add(t, p.get(t));
        }
      }
      var f = H(this, a);
      if (!(f instanceof rb))
        throw Error("TypeError: Non-List argument given to ForLet instruction.");
      var g = this.h;
      d = H(this, d);
      var h = Ba(g);
      for (e(g, h); eb(h, b); ) {
        var m = db(h, d);
        if (m instanceof wa) {
          if ("break" === m.h)
            break;
          if ("return" === m.h)
            return m;
        }
        var n = Ba(g);
        e(h, n);
        eb(n, c);
        h = n;
      }
    }, Sd = function(a, b, c) {
      var d = this.h, e = H(this, b);
      if (!(e instanceof rb))
        throw Error("Error: non-List value given for Fn argument names.");
      var f = Array.prototype.slice.call(arguments, 2);
      return new ed(a, /* @__PURE__ */ function() {
        return function(g) {
          var h = Ba(d);
          void 0 === h.h && (h.h = this.h.h);
          for (var m = Array.prototype.slice.call(arguments, 0), n = 0; n < m.length; n++)
            if (m[n] = H(this, m[n]), m[n] instanceof wa)
              return m[n];
          for (var p = e.get("length"), q = 0; q < p; q++)
            q < m.length ? h.add(e.get(q), m[q]) : h.add(e.get(q), void 0);
          h.add("arguments", new rb(m));
          var r = db(h, f);
          if (r instanceof wa)
            return "return" === r.h ? r.s : r;
        };
      }());
    }, Td = function(a) {
      a = H(this, a);
      var b = this.h;
      return b.get(a);
    }, Ud = function(a, b) {
      var c;
      a = H(this, a);
      b = H(this, b);
      if (void 0 === a || null === a) {
        var d = "TypeError: Cannot read properties of " + a + " (reading '" + b + "')";
        throw Error(d);
      }
      if (a instanceof sb || a instanceof rb || a instanceof ed)
        c = a.get(b);
      else if ("string" === typeof a)
        "length" === b ? c = a.length : qb(b) && (c = a[b]);
      else if (a instanceof jd)
        return;
      return c;
    }, Vd = function(a, b) {
      return H(this, a) > H(this, b);
    }, Wd = function(a, b) {
      return H(this, a) >= H(this, b);
    }, Xd = function(a, b) {
      a = H(this, a);
      b = H(this, b);
      a instanceof jd && (a = a.h);
      b instanceof jd && (b = b.h);
      return a === b;
    }, Yd = function(a, b) {
      return !Xd.call(this, a, b);
    }, Zd = function(a, b, c) {
      var d = [];
      H(this, a) ? d = H(this, b) : c && (d = H(this, c));
      var e = db(this.h, d);
      if (e instanceof wa)
        return e;
    }, $d = function(a, b) {
      return H(this, a) < H(this, b);
    }, be = function(a, b) {
      return H(this, a) <= H(this, b);
    }, ce = function(a) {
      for (var b = new rb(), c = 0; c < arguments.length; c++) {
        var d = H(this, arguments[c]);
        b.push(d);
      }
      return b;
    }, de = function(a) {
      for (var b = new sb(), c = 0; c < arguments.length - 1; c += 2) {
        var d = H(this, arguments[c]) + "", e = H(this, arguments[c + 1]);
        b.set(d, e);
      }
      return b;
    }, ee = function(a, b) {
      return H(this, a) % H(this, b);
    }, fe = function(a, b) {
      return H(this, a) * H(this, b);
    }, ge = function(a) {
      return -H(this, a);
    }, he = function(a) {
      return !H(this, a);
    }, ie = function(a, b) {
      return !Gd.call(this, a, b);
    }, je = function() {
      return null;
    }, ke = function(a, b) {
      return H(this, a) || H(this, b);
    }, le = function(a, b) {
      var c = H(this, a);
      H(this, b);
      return c;
    }, me = function(a) {
      return H(this, a);
    }, ne = function(a) {
      return Array.prototype.slice.apply(arguments);
    }, oe = function(a) {
      return new wa("return", H(this, a));
    }, pe = function(a, b, c) {
      a = H(this, a);
      b = H(this, b);
      c = H(this, c);
      if (null === a || void 0 === a) {
        var d = "TypeError: Can't set property " + b + " of " + a + ".";
        throw Error(d);
      }
      (a instanceof ed || a instanceof rb || a instanceof sb) && a.set(b, c);
      return c;
    }, qe = function(a, b) {
      return H(this, a) - H(this, b);
    }, re = function(a, b, c) {
      a = H(this, a);
      var d = H(this, b), e = H(this, c);
      if (!Ha(d) || !Ha(e))
        throw Error("Error: Malformed switch instruction.");
      for (var f, g = false, h = 0; h < d.length; h++)
        if (g || a === H(this, d[h]))
          if (f = H(this, e[h]), f instanceof wa) {
            var m = f.h;
            if ("break" === m)
              return;
            if ("return" === m || "continue" === m)
              return f;
          } else
            g = true;
      if (e.length === d.length + 1 && (f = H(this, e[e.length - 1]), f instanceof wa && ("return" === f.h || "continue" === f.h)))
        return f;
    }, se = function(a, b, c) {
      return H(this, a) ? H(this, b) : H(this, c);
    }, te = function(a) {
      a = H(this, a);
      return a instanceof ed ? "function" : typeof a;
    }, ue = function(a) {
      for (var b = this.h, c = 0; c < arguments.length; c++) {
        var d = arguments[c];
        "string" !== typeof d || b.add(d, void 0);
      }
    }, ve = function(a, b, c, d) {
      var e = H(this, d);
      if (H(this, c)) {
        var f = db(this.h, e);
        if (f instanceof wa) {
          if ("break" === f.h)
            return;
          if ("return" === f.h)
            return f;
        }
      }
      for (; H(this, a); ) {
        var g = db(this.h, e);
        if (g instanceof wa) {
          if ("break" === g.h)
            break;
          if ("return" === g.h)
            return g;
        }
        H(this, b);
      }
    }, we = function(a) {
      return ~Number(H(this, a));
    }, xe = function(a, b) {
      return Number(H(this, a)) << Number(H(this, b));
    }, ye = function(a, b) {
      return Number(H(this, a)) >> Number(H(
        this,
        b
      ));
    }, ze = function(a, b) {
      return Number(H(this, a)) >>> Number(H(this, b));
    }, Ae = function(a, b) {
      return Number(H(this, a)) & Number(H(this, b));
    }, Be = function(a, b) {
      return Number(H(this, a)) ^ Number(H(this, b));
    }, Ce = function(a, b) {
      return Number(H(this, a)) | Number(H(this, b));
    }, De = function() {
    }, Ee = function(a, b, c, d, e) {
      var f = true;
      try {
        var g = H(this, c);
        if (g instanceof wa)
          return g;
      } catch (r) {
        if (!(r instanceof qd && a))
          throw f = r instanceof qd, r;
        var h = Ba(this.h), m = new jd(r);
        h.add(b, m);
        var n = H(this, d), p = db(h, n);
        if (p instanceof wa)
          return p;
      } finally {
        if (f && void 0 !== e) {
          var q = H(this, e);
          if (q instanceof wa)
            return q;
        }
      }
    };
    var Ie = function() {
      this.h = new fb();
      He(this);
    };
    Ie.prototype.execute = function(a) {
      return Je(this.h.s(a));
    };
    var Ke = function(a, b, c) {
      return Je(a.h.F(b, c));
    }, He = function(a) {
      var b = function(c, d) {
        var e = String(c), f = new ed(e, d);
        f.Eb();
        a.h.h.set(e, f);
      };
      b(0, ud);
      b(1, vd);
      b(2, wd);
      b(3, xd);
      b(56, Ae);
      b(57, xe);
      b(58, we);
      b(59, Ce);
      b(60, ye);
      b(61, ze);
      b(62, Be);
      b(53, yd);
      b(4, zd);
      b(5, Ad);
      b(52, Bd);
      b(6, Cd);
      b(49, Dd);
      b(7, ce);
      b(8, de);
      b(9, Ad);
      b(50, Ed);
      b(10, Fd);
      b(12, Gd);
      b(13, Hd);
      b(51, Sd);
      b(47, Kd);
      b(54, Ld);
      b(55, Md);
      b(63, Rd);
      b(64, Od);
      b(65, Pd);
      b(66, Qd);
      b(15, Td);
      b(16, Ud);
      b(17, Ud);
      b(18, Vd);
      b(19, Wd);
      b(20, Xd);
      b(21, Yd);
      b(22, Zd);
      b(23, $d);
      b(24, be);
      b(25, ee);
      b(26, fe);
      b(27, ge);
      b(28, he);
      b(29, ie);
      b(45, je);
      b(30, ke);
      b(32, le);
      b(33, le);
      b(34, me);
      b(35, me);
      b(46, ne);
      b(36, oe);
      b(43, pe);
      b(37, qe);
      b(38, re);
      b(39, se);
      b(67, Ee);
      b(40, te);
      b(44, De);
      b(41, ue);
      b(42, ve);
    };
    function Je(a) {
      if (a instanceof wa || a instanceof ed || a instanceof rb || a instanceof sb || a instanceof jd || null === a || void 0 === a || "string" === typeof a || "number" === typeof a || "boolean" === typeof a)
        return a;
    }
    function Le(a) {
      switch (a) {
        case 1:
          return "1";
        case 2:
        case 4:
          return "0";
        default:
          return "-";
      }
    }
    function Me(a) {
      switch (a) {
        case 1:
          return "G";
        case 3:
          return "g";
        case 2:
          return "D";
        case 4:
          return "d";
        case 0:
          return "g";
        default:
          return "g";
      }
    }
    function Ne(a, b) {
      var c = a[1] || 0, d = a[2] || 0;
      switch (b) {
        case 0:
          return "G1" + Le(c) + Le(d);
        case 1:
          return "G2" + Me(c) + Me(d);
        default:
          return "g1--";
      }
    }
    var Oe = function() {
      var a = function(b) {
        return { toString: function() {
          return b;
        } };
      };
      return {
        kk: a("consent"),
        fi: a("convert_case_to"),
        gi: a("convert_false_to"),
        hi: a("convert_null_to"),
        ii: a("convert_true_to"),
        ji: a("convert_undefined_to"),
        un: a("debug_mode_metadata"),
        na: a("function"),
        Tg: a("instance_name"),
        Sk: a("live_only"),
        Tk: a("malware_disabled"),
        Uk: a("metadata"),
        Xk: a("original_activity_id"),
        Jn: a("original_vendor_template_id"),
        In: a("once_on_load"),
        Wk: a("once_per_event"),
        ej: a("once_per_load"),
        Nn: a("priority_override"),
        On: a("respected_consent_types"),
        kj: a("setup_tags"),
        oe: a("tag_id"),
        pj: a("teardown_tags")
      };
    }();
    var kf;
    var lf = [], mf = [], nf = [], of = [], pf = [], qf = {}, rf, uf = function(a) {
    }, vf, wf = [], xf = function(a, b) {
      var c = {};
      c[Oe.na] = "__" + a;
      for (var d in b)
        b.hasOwnProperty(d) && (c["vtp_" + d] = b[d]);
      return c;
    }, yf = function(a, b) {
      var c = a[Oe.na], d = b && b.event;
      if (!c)
        throw Error("Error: No function name given for function call.");
      var e = qf[c], f = b && 2 === b.type && d.reportMacroDiscrepancy && e && -1 !== wf.indexOf(c), g = {}, h = {}, m;
      for (m in a)
        a.hasOwnProperty(m) && 0 === m.indexOf("vtp_") && (e && d && d.checkPixieIncompatibility && d.checkPixieIncompatibility(a[m]), e && (g[m] = a[m]), !e || f) && (h[m.substr(4)] = a[m]);
      e && d && d.cachedModelValues && (g.vtp_gtmCachedValues = d.cachedModelValues);
      if (b) {
        if (null == b.name) {
          var n;
          a: {
            var p = b.type, q = b.index;
            if (null == q)
              n = "";
            else {
              var r;
              switch (p) {
                case 2:
                  r = lf[q];
                  break;
                case 1:
                  r = of[q];
                  break;
                default:
                  n = "";
                  break a;
              }
              var t = r && r[Oe.Tg];
              n = t ? String(t) : "";
            }
          }
          b.name = n;
        }
        e && (g.vtp_gtmEntityIndex = b.index, g.vtp_gtmEntityName = b.name);
      }
      var u, v;
      e && (u = e(g));
      if (!e || f)
        v = kf(c, h, b);
      f && d && (pb(u) ? typeof u !== typeof v && d.reportMacroDiscrepancy(d.id, c) : u !== v && d.reportMacroDiscrepancy(d.id, c));
      return e ? u : v;
    }, Af = function(a, b, c) {
      c = c || [];
      var d = {}, e;
      for (e in a)
        a.hasOwnProperty(e) && (d[e] = zf(a[e], b, c));
      return d;
    }, zf = function(a, b, c) {
      if (Ha(a)) {
        var d;
        switch (a[0]) {
          case "function_id":
            return a[1];
          case "list":
            d = [];
            for (var e = 1; e < a.length; e++)
              d.push(zf(a[e], b, c));
            return d;
          case "macro":
            var f = a[1];
            if (c[f])
              return;
            var g = lf[f];
            if (!g || b.isBlocked(g))
              return;
            c[f] = true;
            var h = String(g[Oe.Tg]);
            try {
              var m = Af(g, b, c);
              m.vtp_gtmEventId = b.id;
              b.priorityId && (m.vtp_gtmPriorityId = b.priorityId);
              d = yf(m, { event: b, index: f, type: 2, name: h });
              vf && (d = vf.xl(d, m));
            } catch (y) {
              b.logMacroError && b.logMacroError(y, Number(f), h), d = false;
            }
            c[f] = false;
            return d;
          case "map":
            d = {};
            for (var n = 1; n < a.length; n += 2)
              d[zf(a[n], b, c)] = zf(a[n + 1], b, c);
            return d;
          case "template":
            d = [];
            for (var p = false, q = 1; q < a.length; q++) {
              var r = zf(a[q], b, c);
              d.push(r);
            }
            return d.join("");
          case "escape":
            d = zf(a[1], b, c);
            d = String(d);
            for (var t = 2; t < a.length; t++)
              Pe[a[t]] && (d = Pe[a[t]](d));
            return d;
          case "tag":
            var u = a[1];
            if (!of[u])
              throw Error("Unable to resolve tag reference " + u + ".");
            return d = { Aj: a[2], index: u };
          case "zb":
            var v = { arg0: a[2], arg1: a[3], ignore_case: a[5] };
            v[Oe.na] = a[1];
            var w = Bf(v, b, c), x = !!a[4];
            return x || 2 !== w ? x !== (1 === w) : null;
          default:
            throw Error("Attempting to expand unknown Value type: " + a[0] + ".");
        }
      }
      return a;
    }, Bf = function(a, b, c) {
      try {
        return rf(Af(a, b, c));
      } catch (d) {
        JSON.stringify(a);
      }
      return 2;
    }, Cf = function(a) {
      var b = a[Oe.na];
      if (!b)
        throw Error("Error: No function name given for function call.");
      return !!qf[b];
    };
    var Df = function(a, b, c) {
      var d;
      d = Error.call(this, c);
      this.message = d.message;
      "stack" in d && (this.stack = d.stack);
      this.h = a;
    };
    sa(Df, Error);
    function Ef(a, b) {
      if (Ha(a)) {
        Object.defineProperty(a, "context", { value: { line: b[0] } });
        for (var c = 1; c < a.length; c++)
          Ef(a[c], b[c]);
      }
    }
    var Ff = function(a, b) {
      var c;
      c = Error.call(this);
      this.message = c.message;
      "stack" in c && (this.stack = c.stack);
      this.Km = a;
      this.s = b;
      this.h = [];
    };
    sa(Ff, Error);
    var Hf = function() {
      return function(a, b) {
        a instanceof Ff || (a = new Ff(a, Gf));
        b && a.h.push(b);
        throw a;
      };
    };
    function Gf(a) {
      if (!a.length)
        return a;
      a.push({ id: "main", line: 0 });
      for (var b = a.length - 1; 0 < b; b--)
        Ga(a[b].id) && a.splice(b++, 1);
      for (var c = a.length - 1; 0 < c; c--)
        a[c].line = a[c - 1].line;
      a.splice(0, 1);
      return a;
    }
    var Kf = function(a) {
      function b(r) {
        for (var t = 0; t < r.length; t++)
          d[r[t]] = true;
      }
      for (var c = [], d = [], e = If(a), f = 0; f < mf.length; f++) {
        var g = mf[f], h = Jf(g, e);
        if (h) {
          for (var m = g.add || [], n = 0; n < m.length; n++)
            c[m[n]] = true;
          b(g.block || []);
        } else
          null === h && b(g.block || []);
      }
      for (var p = [], q = 0; q < of.length; q++)
        c[q] && !d[q] && (p[q] = true);
      return p;
    }, Jf = function(a, b) {
      for (var c = a["if"] || [], d = 0; d < c.length; d++) {
        var e = b(c[d]);
        if (0 === e)
          return false;
        if (2 === e)
          return null;
      }
      for (var f = a.unless || [], g = 0; g < f.length; g++) {
        var h = b(f[g]);
        if (2 === h)
          return null;
        if (1 === h)
          return false;
      }
      return true;
    }, If = function(a) {
      var b = [];
      return function(c) {
        void 0 === b[c] && (b[c] = Bf(nf[c], a));
        return b[c];
      };
    };
    var Lf = { xl: function(a, b) {
      b[Oe.fi] && "string" === typeof a && (a = 1 == b[Oe.fi] ? a.toLowerCase() : a.toUpperCase());
      b.hasOwnProperty(Oe.hi) && null === a && (a = b[Oe.hi]);
      b.hasOwnProperty(Oe.ji) && void 0 === a && (a = b[Oe.ji]);
      b.hasOwnProperty(Oe.ii) && true === a && (a = b[Oe.ii]);
      b.hasOwnProperty(Oe.gi) && false === a && (a = b[Oe.gi]);
      return a;
    } };
    var Mf = function() {
      this.h = {};
    }, Of = function(a, b) {
      var c = Nf.s, d;
      null != (d = c.h)[a] || (d[a] = []);
      c.h[a].push(function() {
        return b.apply(null, ia(ta.apply(0, arguments)));
      });
    };
    function Pf(a, b, c, d) {
      if (a)
        for (var e = 0; e < a.length; e++) {
          var f = void 0, g = "A policy function denied the permission request";
          try {
            f = a[e](b, c, d), g += ".";
          } catch (h) {
            g = "string" === typeof h ? g + (": " + h) : h instanceof Error ? g + (": " + h.message) : g + ".";
          }
          if (!f)
            throw new Df(c, d, g);
        }
    }
    function Qf(a, b, c) {
      return function() {
        var d = arguments[0];
        if (d) {
          var e = a.h[d], f = a.h.all;
          if (e || f) {
            var g = c.apply(void 0, Array.prototype.slice.call(arguments, 0));
            Pf(e, b, d, g);
            Pf(f, b, d, g);
          }
        }
      };
    }
    var Rf = [], Sf = function(a) {
      return void 0 == Rf[a] ? false : Rf[a];
    };
    var Wf = function() {
      var a = data.permissions || {}, b = Tf.ctid, c = this;
      this.s = new Mf();
      this.h = {};
      var d = Sf(15), e = {}, f = {}, g = Qf(this.s, b, function() {
        var h = arguments[0];
        return h && e[h] ? e[h].apply(void 0, Array.prototype.slice.call(arguments, 0)) : {};
      });
      l(a, function(h, m) {
        var n = {};
        l(m, function(q, r) {
          var t = Uf(q, r);
          n[q] = t.assert;
          e[q] || (e[q] = t.K);
          d && t.sj && !f[q] && (f[q] = t.sj);
        });
        var p;
        d && (p = function(q) {
          var r = ta.apply(1, arguments);
          if (!n[q])
            throw Vf(q, {}, "The requested additional permission " + q + " is not configured.");
          g.apply(
            null,
            [q].concat(ia(r))
          );
        });
        c.h[h] = function(q, r) {
          var t = n[q];
          if (!t)
            throw Vf(q, {}, "The requested permission " + q + " is not configured.");
          var u = Array.prototype.slice.call(arguments, 0);
          t.apply(void 0, u);
          g.apply(void 0, u);
          if (d) {
            var v = f[q];
            v && v.apply(null, [p].concat(ia(u.slice(1))));
          }
        };
      });
    }, Xf = function(a) {
      return Nf.h[a] || function() {
      };
    };
    function Uf(a, b) {
      var c = xf(a, b);
      c.vtp_permissionName = a;
      c.vtp_createPermissionError = Vf;
      try {
        return yf(c);
      } catch (d) {
        return { assert: function(e) {
          throw new Df(e, {}, "Permission " + e + " is unknown.");
        }, K: function() {
          if (Sf(15))
            throw new Df(a, {}, "Permission " + a + " is unknown.");
          for (var e = {}, f = 0; f < arguments.length; ++f)
            e["arg" + (f + 1)] = arguments[f];
          return e;
        } };
      }
    }
    function Vf(a, b, c) {
      return new Df(a, b, c);
    }
    var Yf = false;
    var Zf = {};
    Zf.qn = Oa("");
    Zf.Bl = Oa("");
    var $f = Yf, ag = Zf.Bl, bg = Zf.qn;
    var fg = function(a) {
      var b = {}, c = 0;
      l(a, function(e, f) {
        if (null != f) {
          if (f = ("" + f).replace(/~/g, "~~"), cg.hasOwnProperty(e))
            b[cg[e]] = f;
          else if (dg.hasOwnProperty(e)) {
            var g = dg[e], h = f;
            b.hasOwnProperty(g) || (b[g] = h);
          } else if ("category" === e)
            for (var m = f.split("/", 5), n = 0; n < m.length; n++) {
              var p = b, q = eg[n], r = m[n];
              p.hasOwnProperty(q) || (p[q] = r);
            }
          else if (27 > c) {
            var t = String.fromCharCode(10 > c ? 48 + c : 65 + c - 10);
            b["k" + t] = ("" + String(e)).replace(/~/g, "~~");
            b["v" + t] = f;
            c++;
          }
        }
      });
      var d = [];
      l(b, function(e, f) {
        d.push("" + e + f);
      });
      return d.join("~");
    }, cg = { item_id: "id", item_name: "nm", item_brand: "br", item_category: "ca", item_category2: "c2", item_category3: "c3", item_category4: "c4", item_category5: "c5", item_variant: "va", price: "pr", quantity: "qt", coupon: "cp", item_list_name: "ln", index: "lp", item_list_id: "li", discount: "ds", affiliation: "af", promotion_id: "pi", promotion_name: "pn", creative_name: "cn", creative_slot: "cs", location_id: "lo" }, dg = { id: "id", name: "nm", brand: "br", variant: "va", list_name: "ln", list_position: "lp", list: "ln", position: "lp", creative: "cn" }, eg = [
      "ca",
      "c2",
      "c3",
      "c4",
      "c5"
    ];
    var gg = function(a) {
      var b = [];
      l(a, function(c, d) {
        null != d && b.push(encodeURIComponent(c) + "=" + encodeURIComponent(String(d)));
      });
      return b.join("&");
    }, hg = function(a, b, c, d) {
      this.la = a.la;
      this.Hc = a.Hc;
      this.kh = a.kh;
      this.s = b;
      this.F = c;
      this.C = gg(a.la);
      this.h = gg(a.kh);
      this.M = this.h.length;
      if (d && 16384 < this.M)
        throw Error("EVENT_TOO_LARGE");
    };
    var ig = function() {
      this.events = [];
      this.h = "";
      this.la = {};
      this.s = "";
      this.F = 0;
      this.M = this.C = false;
    };
    ig.prototype.add = function(a) {
      return this.X(a) ? (this.events.push(a), this.h = a.C, this.la = a.la, this.s = a.s, this.F += a.M, this.C = a.F, true) : false;
    };
    ig.prototype.X = function(a) {
      return this.events.length ? 20 <= this.events.length || 16384 <= a.M + this.F ? false : this.s === a.s && this.C === a.F && this.Oa(a) : true;
    };
    ig.prototype.Oa = function(a) {
      var b = this;
      if (this.M) {
        var c = Object.keys(this.la);
        return c.length === Object.keys(a.la).length && c.every(function(d) {
          return a.la.hasOwnProperty(d) && String(b.la[d]) === String(a.la[d]);
        });
      }
      return this.h === a.C;
    };
    var jg = function(a, b) {
      l(a, function(c, d) {
        null != d && b.push(encodeURIComponent(c) + "=" + encodeURIComponent(d));
      });
    }, kg = function(a, b) {
      var c = [];
      a.C && c.push(a.C);
      b && c.push("_s=" + b);
      jg(a.Hc, c);
      var d = false;
      a.h && (c.push(a.h), d = true);
      var e = c.join("&"), f = "", g = e.length + a.s.length + 1;
      d && 2048 < g && (f = c.pop(), e = c.join("&"));
      return { params: e, body: f };
    }, lg = function(a, b) {
      var c = a.events;
      if (1 == c.length)
        return kg(c[0], b);
      var d = [];
      a.h && d.push(a.h);
      for (var e = {}, f = 0; f < c.length; f++)
        l(c[f].Hc, function(t, u) {
          null != u && (e[t] = e[t] || {}, e[t][String(u)] = e[t][String(u)] + 1 || 1);
        });
      var g = {};
      l(e, function(t, u) {
        var v, w = -1, x = 0;
        l(u, function(y, A) {
          x += A;
          var B = (y.length + t.length + 2) * (A - 1);
          B > w && (v = y, w = B);
        });
        x == c.length && (g[t] = v);
      });
      jg(g, d);
      b && d.push("_s=" + b);
      for (var h = d.join("&"), m = [], n = {}, p = 0; p < c.length; n = { Eh: void 0 }, p++) {
        var q = [];
        n.Eh = {};
        l(c[p].Hc, /* @__PURE__ */ function(t) {
          return function(u, v) {
            g[u] != "" + v && (t.Eh[u] = v);
          };
        }(n));
        c[p].h && q.push(c[p].h);
        jg(n.Eh, q);
        m.push(q.join("&"));
      }
      var r = m.join("\r\n");
      return { params: h, body: r };
    };
    var pg = ["matches", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector", "oMatchesSelector"];
    function qg(a, b) {
      a = String(a);
      b = String(b);
      var c = a.length - b.length;
      return 0 <= c && a.indexOf(b, c) === c;
    }
    var rg = new Ka();
    function sg(a, b, c) {
      var d = c ? "i" : void 0;
      try {
        var e = String(b) + d, f = rg.get(e);
        f || (f = new RegExp(b, d), rg.set(e, f));
        return f.test(a);
      } catch (g) {
        return false;
      }
    }
    function tg(a, b) {
      return 0 <= String(a).indexOf(String(b));
    }
    function ug(a, b) {
      return String(a) === String(b);
    }
    function vg(a, b) {
      return Number(a) >= Number(b);
    }
    function wg(a, b) {
      return Number(a) <= Number(b);
    }
    function xg(a, b) {
      return Number(a) > Number(b);
    }
    function yg(a, b) {
      return Number(a) < Number(b);
    }
    function zg(a, b) {
      return 0 === String(a).indexOf(String(b));
    }
    var Gg = /^[1-9a-zA-Z_-][1-9a-c][1-9a-v]\d$/;
    function Hg(a, b) {
      for (var c = "", d = true; 7 < a; ) {
        var e = a & 31;
        a >>= 5;
        d ? d = false : e |= 32;
        c = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[e] + c;
      }
      a <<= 2;
      d || (a |= 32);
      return c = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[a | b] + c;
    }
    var Ig = /^([a-z][a-z0-9]*):(!|\?)(\*|string|boolean|number|Fn|PixieMap|List|OpaqueValue)$/i, Jg = { Fn: "function", PixieMap: "Object", List: "Array" }, J = function(a, b, c) {
      for (var d = 0; d < b.length; d++) {
        var e = Ig.exec(b[d]);
        if (!e)
          throw Error("Internal Error in " + a);
        var f = e[1], g = "!" === e[2], h = e[3], m = c[d];
        if (null == m) {
          if (g)
            throw Error("Error in " + a + ". Required argument " + f + " not supplied.");
        } else if ("*" !== h) {
          var n = typeof m;
          m instanceof ed ? n = "Fn" : m instanceof rb ? n = "List" : m instanceof sb ? n = "PixieMap" : m instanceof jd && (n = "OpaqueValue");
          if (n != h)
            throw Error("Error in " + a + ". Argument " + f + " has type " + (Jg[n] || n) + ", which does not match required type " + (Jg[h] || h) + ".");
        }
      }
    };
    var Mg = function(a, b) {
      var c = new ed(a, function() {
        for (var d = Array.prototype.slice.call(arguments, 0), e = 0; e < d.length; e++)
          d[e] = H(this, d[e]);
        try {
          return b.apply(this, d);
        } catch (g) {
          throw g;
        }
      });
      c.Eb();
      return c;
    }, Ng = function(a, b) {
      var c = new sb(), d;
      for (d in b)
        if (b.hasOwnProperty(d)) {
          var e = b[d];
          Fa(e) ? c.set(d, Mg(a + "_" + d, e)) : mb(e) ? c.set(d, Ng(
            a + "_" + d,
            e
          )) : (Ga(e) || k(e) || "boolean" === typeof e) && c.set(d, e);
        }
      c.Eb();
      return c;
    };
    var Og = function(a, b) {
      J(I(this), ["apiName:!string", "message:?string"], arguments);
      var c = {};
      new sb();
      return Ng("AssertApiSubject", c);
    };
    var Pg = function(a, b) {
      J(I(this), ["actual:?*", "message:?string"], arguments);
      if (a instanceof ld)
        throw Error("Argument actual cannot have type Promise. Assertions on asynchronous code aren't supported.");
      var c = {};
      new sb();
      return Ng("AssertThatSubject", c);
    };
    function Qg(a) {
      return function() {
        for (var b = [], c = this.h, d = 0; d < arguments.length; ++d)
          b.push(nd(arguments[d], c));
        return md(a.apply(null, b));
      };
    }
    var Sg = function() {
      for (var a = Math, b = Rg, c = {}, d = 0; d < b.length; d++) {
        var e = b[d];
        a.hasOwnProperty(e) && (c[e] = Qg(a[e].bind(a)));
      }
      return c;
    };
    var Tg = function(a) {
      var b;
      return b;
    };
    var Ug = function(a) {
      var b;
      J(I(this), ["uri:!string"], arguments);
      try {
        b = decodeURIComponent(a);
      } catch (c) {
      }
      return b;
    };
    var Vg = function(a) {
      try {
        return encodeURI(a);
      } catch (b) {
      }
    };
    var Wg = function(a) {
      try {
        return encodeURIComponent(a);
      } catch (b) {
      }
    };
    function Xg(a, b) {
      var c = false;
      J(I(this), ["booleanExpression:!string", "context:?PixieMap"], arguments);
      var d = JSON.parse(a);
      if (!d)
        throw Error("Invalid boolean expression string was given.");
      var e = b ? nd(b) : {};
      c = Yg(d, e);
      return c;
    }
    var Zg = function(a, b) {
      for (var c = 0; c < b.length; c++) {
        if (void 0 === a)
          return;
        a = a[b[c]];
      }
      return a;
    }, $g = function(a, b) {
      var c = b.preHit;
      if (c) {
        var d = a[0];
        switch (d) {
          case "hitData":
            return 2 > a.length ? void 0 : Zg(c.getHitData(a[1]), a.slice(2));
          case "metadata":
            return 2 > a.length ? void 0 : Zg(c.getMetadata(a[1]), a.slice(2));
          case "eventName":
            return c.getEventName();
          case "destinationId":
            return c.getDestinationId();
          default:
            throw Error(d + " is not a valid field that can be accessed\n                      from PreHit data.");
        }
      }
    }, ah = function(a, b) {
      if (a) {
        if (void 0 !== a.contextValue) {
          var c;
          a: {
            var d = a.contextValue, e = d.keyParts;
            if (e && 0 !== e.length) {
              var f = d.namespaceType;
              switch (f) {
                case 1:
                  c = $g(e, b);
                  break a;
                case 2:
                  var g = b.macro;
                  c = g ? g[e[0]] : void 0;
                  break a;
                default:
                  throw Error("Unknown Namespace Type used: " + f);
              }
            }
            c = void 0;
          }
          return c;
        }
        if (void 0 !== a.booleanExpressionValue)
          return Yg(a.booleanExpressionValue, b);
        if (void 0 !== a.booleanValue)
          return !!a.booleanValue;
        if (void 0 !== a.stringValue)
          return String(a.stringValue);
        if (void 0 !== a.integerValue)
          return Number(a.integerValue);
        if (void 0 !== a.doubleValue)
          return Number(a.doubleValue);
        throw Error("Unknown field used for variable of type ExpressionValue:" + a);
      }
    }, Yg = function(a, b) {
      var c = a.args;
      if (!Ha(c) || 0 === c.length)
        throw Error('Invalid boolean expression format. Expected "args":' + c + " property to\n         be non-empty array.");
      var d = function(g) {
        return ah(g, b);
      };
      switch (a.type) {
        case 1:
          for (var e = 0; e < c.length; e++)
            if (d(c[e]))
              return true;
          return false;
        case 2:
          for (var f = 0; f < c.length; f++)
            if (!d(c[f]))
              return false;
          return 0 < c.length;
        case 3:
          return !d(c[0]);
        case 4:
          return sg(d(c[0]), d(c[1]), false);
        case 5:
          return ug(d(c[0]), d(c[1]));
        case 6:
          return zg(d(c[0]), d(c[1]));
        case 7:
          return qg(d(c[0]), d(c[1]));
        case 8:
          return tg(d(c[0]), d(c[1]));
        case 9:
          return yg(d(c[0]), d(c[1]));
        case 10:
          return wg(d(c[0]), d(c[1]));
        case 11:
          return xg(d(c[0]), d(c[1]));
        case 12:
          return vg(d(c[0]), d(c[1]));
        default:
          throw Error('Invalid boolean expression format. Expected "type" property tobe a positive integer which is less than 13.');
      }
    };
    Xg.D = "internal.evaluateBooleanExpression";
    var bh = function(a) {
      J(I(this), ["message:?string"], arguments);
    };
    var ch = function(a, b) {
      J(I(this), ["min:!number", "max:!number"], arguments);
      return Ja(a, b);
    };
    var dh = function() {
      return (/* @__PURE__ */ new Date()).getTime();
    };
    var jh = function(a) {
      if (null === a)
        return "null";
      if (a instanceof rb)
        return "array";
      if (a instanceof ed)
        return "function";
      if (a instanceof jd) {
        a = a.h;
        if (void 0 === a.constructor || void 0 === a.constructor.name) {
          var b = String(a);
          return b.substring(8, b.length - 1);
        }
        return String(a.constructor.name);
      }
      return typeof a;
    };
    var kh = function(a) {
      function b(c) {
        return function(d) {
          try {
            return c(d);
          } catch (e) {
            bg && a.call(this, e.message);
          }
        };
      }
      return { parse: b(function(c) {
        return md(JSON.parse(c));
      }), stringify: b(function(c) {
        return JSON.stringify(nd(c));
      }) };
    };
    var lh = function(a) {
      return Na(nd(a, this.h));
    };
    var mh = function(a) {
      return Number(nd(a, this.h));
    };
    var nh = function(a) {
      return null === a ? "null" : void 0 === a ? "undefined" : a.toString();
    };
    var oh = function(a, b, c) {
      var d = null, e = false;
      return e ? d : null;
    };
    var Rg = "floor ceil round max min abs pow sqrt".split(" ");
    var rh = function(a, b) {
      J(I(this), ["apiName:!string", "mock:?*"], arguments);
    };
    var sh = {};
    sh.keys = function(a) {
      return new rb();
    };
    sh.values = function(a) {
      return new rb();
    };
    sh.entries = function(a) {
      return new rb();
    };
    sh.freeze = function(a) {
      return a;
    };
    sh.delete = function(a, b) {
      return false;
    };
    var K = function(a, b, c) {
      var d = a.h.h;
      if (!d)
        throw Error("Missing program state.");
      if (d.Wm) {
        try {
          d.uj.apply(null, Array.prototype.slice.call(arguments, 1));
        } catch (e) {
          throw Ab("TAGGING", 21), e;
        }
        return;
      }
      d.uj.apply(null, Array.prototype.slice.call(arguments, 1));
    };
    var uh = function() {
      this.h = {};
      this.s = {};
    };
    uh.prototype.get = function(a, b) {
      var c = this.h.hasOwnProperty(a) ? this.h[a] : void 0;
      return c;
    };
    uh.prototype.add = function(a, b, c) {
      if (this.h.hasOwnProperty(a))
        throw "Attempting to add a function which already exists: " + a + ".";
      if (this.s.hasOwnProperty(a))
        throw "Attempting to add an API with an existing private API name: " + a + ".";
      this.h[a] = c ? void 0 : Fa(b) ? Mg(a, b) : Ng(a, b);
    };
    function wh() {
      var a = {};
      return a;
    }
    var yh = function(a) {
      return xh ? C.querySelectorAll(a) : null;
    }, zh = function(a, b) {
      if (!xh)
        return null;
      if (Element.prototype.closest)
        try {
          return a.closest(b);
        } catch (e) {
          return null;
        }
      var c = Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector, d = a;
      if (!C.documentElement.contains(d))
        return null;
      do {
        try {
          if (c.call(d, b))
            return d;
        } catch (e) {
          break;
        }
        d = d.parentElement || d.parentNode;
      } while (null !== d && 1 === d.nodeType);
      return null;
    }, Ah = false;
    if (C.querySelectorAll)
      try {
        var Bh = C.querySelectorAll(":root");
        Bh && 1 == Bh.length && Bh[0] == C.documentElement && (Ah = true);
      } catch (a) {
      }
    var xh = Ah;
    var L = function(a) {
      Ab("GTM", a);
    };
    var Ch = function(a) {
      return null == a ? "" : k(a) ? Qa(String(a)) : "e0";
    }, Eh = function(a) {
      return a.replace(Dh, "");
    }, Gh = function(a) {
      return Fh(a.replace(/\s/g, ""));
    }, Fh = function(a) {
      return Qa(a.replace(Hh, "").toLowerCase());
    }, Jh = function(a) {
      a = a.replace(/[\s-()/.]/g, "");
      "+" !== a.charAt(0) && (a = "+" + a);
      return Ih.test(a) ? a : "e0";
    }, Lh = function(a) {
      var b = a.toLowerCase().split("@");
      if (2 == b.length) {
        var c = b[0];
        /^(gmail|googlemail)\./.test(b[1]) && (c = c.replace(/\./g, ""));
        c = c + "@" + b[1];
        if (Kh.test(c))
          return c;
      }
      return "e0";
    }, Oh = function(a) {
      if ("" === a || "e0" === a)
        return Promise.resolve(a);
      if (z.crypto && z.crypto.subtle) {
        if (Mh.test(a))
          return Promise.resolve(a);
        try {
          var b = Nh(a);
          return z.crypto.subtle.digest("SHA-256", b).then(function(c) {
            var d = Array.from(new Uint8Array(c)).map(function(e) {
              return String.fromCharCode(e);
            }).join("");
            return z.btoa(d).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
          }).catch(function() {
            return "e2";
          });
        } catch (c) {
          return Promise.resolve("e2");
        }
      } else
        return Promise.resolve("e1");
    }, Nh = function(a) {
      var b;
      if (z.TextEncoder)
        b = new TextEncoder("utf-8").encode(a);
      else {
        for (var c = [], d = 0; d < a.length; d++) {
          var e = a.charCodeAt(d);
          128 > e ? c.push(e) : 2048 > e ? c.push(192 | e >> 6, 128 | e & 63) : 55296 > e || 57344 <= e ? c.push(224 | e >> 12, 128 | e >> 6 & 63, 128 | e & 63) : (e = 65536 + ((e & 1023) << 10 | a.charCodeAt(++d) & 1023), c.push(240 | e >> 18, 128 | e >> 12 & 63, 128 | e >> 6 & 63, 128 | e & 63));
        }
        b = new Uint8Array(c);
      }
      return b;
    }, Hh = /[0-9`~!@#$%^&*()_\-+=:;<>,.?|/\\[\]]/g, Kh = /^\S+@\S+\.\S+$/, Ih = /^\+\d{10,15}$/, Dh = /[.~]/g, Ph = /^[0-9A-Za-z_-]{43}$/, Mh = /^[0-9A-Fa-f]{64}$/, Qh = {}, Rh = (Qh.email = "em", Qh.phone_number = "pn", Qh.first_name = "fn", Qh.last_name = "ln", Qh.street = "sa", Qh.city = "ct", Qh.region = "rg", Qh.country = "co", Qh.postal_code = "pc", Qh.error_code = "ec", Qh), Sh = {}, Th = (Sh.email = "sha256_email_address", Sh.phone_number = "sha256_phone_number", Sh.first_name = "sha256_first_name", Sh.last_name = "sha256_last_name", Sh.street = "sha256_street", Sh), Vh = function(a, b) {
      a.some(function(c) {
        c.value && Uh.indexOf(c.name);
      }) ? b(a) : z.Promise ? Promise.all(a.map(function(c) {
        return c.value && -1 !== Uh.indexOf(c.name) ? Oh(c.value).then(function(d) {
          c.value = d;
        }) : Promise.resolve();
      })).then(function() {
        b(a);
      }).catch(function() {
        b([]);
      }) : b([]);
    }, Xh = function(a, b) {
      var c = Wh(a);
      Vh(c, b);
    }, Wh = function(a) {
      function b(r, t, u, v) {
        var w = Ch(r);
        "" !== w && (Mh.test(w) ? h.push({ name: t, value: w, index: v }) : h.push({ name: t, value: u(w), index: v }));
      }
      function c(r, t) {
        var u = r;
        if (k(u) || Ha(u)) {
          u = Ha(r) ? r : [r];
          for (var v = 0; v < u.length; ++v) {
            var w = Ch(u[v]), x = Mh.test(w);
            t && !x && L(89);
            !t && x && L(88);
          }
        }
      }
      function d(r, t) {
        var u = r[t];
        c(u, false);
        var v = Th[t];
        r.hasOwnProperty(v) && (r.hasOwnProperty(t) && L(90), u = r[v], c(u, true));
        return u;
      }
      function e(r, t, u) {
        var v = d(r, t);
        v = Ha(v) ? v : [v];
        for (var w = 0; w < v.length; ++w)
          b(
            v[w],
            t,
            u
          );
      }
      function f(r, t, u, v) {
        var w = d(r, t);
        b(w, t, u, v);
      }
      function g(r) {
        return function(t) {
          L(64);
          return r(t);
        };
      }
      var h = [];
      if ("https:" !== z.location.protocol)
        return h.push({ name: "error_code", value: "e3", index: void 0 }), h;
      e(a, "email", Lh);
      e(a, "phone_number", Jh);
      e(a, "first_name", g(Gh));
      e(a, "last_name", g(Gh));
      var m = a.home_address || {};
      e(m, "street", g(Fh));
      e(m, "city", g(Fh));
      e(m, "postal_code", g(Eh));
      e(m, "region", g(Fh));
      e(m, "country", g(Eh));
      var n = a.address || {};
      n = Ha(n) ? n : [n];
      for (var p = 0; p < n.length; p++) {
        var q = n[p];
        f(
          q,
          "first_name",
          Gh,
          p
        );
        f(q, "last_name", Gh, p);
        f(q, "street", Fh, p);
        f(q, "city", Fh, p);
        f(q, "postal_code", Eh, p);
        f(q, "region", Fh, p);
        f(q, "country", Eh, p);
      }
      return h;
    }, Zh = function(a, b) {
      Xh(a, function(c) {
        var d = Yh(c);
        b(d.Nf, d.Lh);
      });
    }, Yh = function(a) {
      for (var b = ["tv.1"], c = 0, d = 0; d < a.length; ++d) {
        var e = a[d].name, f = a[d].value, g = a[d].index, h = Rh[e];
        h && f && (-1 === Uh.indexOf(e) || /^e\d+$/.test(f) || Ph.test(f) || Mh.test(f)) && (void 0 !== g && (h += g), b.push(h + "." + f), c++);
      }
      1 === a.length && "error_code" === a[0].name && (c = 0);
      return {
        Nf: encodeURIComponent(b.join("~")),
        Lh: c
      };
    }, Uh = Object.freeze(["email", "phone_number", "first_name", "last_name", "street"]);
    var N = { g: {
      Ea: "ad_personalization",
      J: "ad_storage",
      N: "ad_user_data",
      R: "analytics_storage",
      Va: "region",
      ud: "consent_updated",
      We: "wait_for_update",
      pk: "ads",
      ag: "all",
      qk: "maps",
      rk: "playstore",
      sk: "search",
      tk: "shopping",
      uk: "youtube",
      ki: "app_remove",
      li: "app_store_refund",
      mi: "app_store_subscription_cancel",
      ni: "app_store_subscription_convert",
      oi: "app_store_subscription_renew",
      dg: "add_payment_info",
      eg: "add_shipping_info",
      ac: "add_to_cart",
      bc: "remove_from_cart",
      fg: "view_cart",
      Hb: "begin_checkout",
      fc: "select_item",
      fb: "view_item_list",
      sb: "select_promotion",
      hb: "view_promotion",
      ra: "purchase",
      hc: "refund",
      Fa: "view_item",
      gg: "add_to_wishlist",
      wk: "exception",
      ri: "first_open",
      si: "first_visit",
      sa: "gtag.config",
      Pa: "gtag.get",
      ui: "in_app_purchase",
      ic: "page_view",
      xk: "screen_view",
      vi: "session_start",
      yk: "timing_complete",
      zk: "track_social",
      xd: "user_engagement",
      tb: "gclid",
      wa: "ads_data_redaction",
      ja: "allow_ad_personalization_signals",
      Xe: "allow_custom_scripts",
      Ye: "allow_display_features",
      yd: "allow_enhanced_conversions",
      ib: "allow_google_signals",
      Ga: "allow_interest_groups",
      Ak: "app_id",
      Bk: "app_installer_id",
      Ck: "app_name",
      Dk: "app_version",
      jc: "auid",
      wi: "auto_detection_enabled",
      Ib: "aw_remarketing",
      Ze: "aw_remarketing_only",
      zd: "discount",
      Ad: "aw_feed_country",
      Bd: "aw_feed_language",
      Z: "items",
      Cd: "aw_merchant_id",
      hg: "aw_basket_type",
      Ic: "campaign_content",
      Jc: "campaign_id",
      Kc: "campaign_medium",
      Lc: "campaign_name",
      Mc: "campaign",
      Nc: "campaign_source",
      Oc: "campaign_term",
      ub: "client_id",
      xi: "content_group",
      yi: "content_type",
      Qa: "conversion_cookie_prefix",
      Pc: "conversion_id",
      Ha: "conversion_linker",
      Jb: "conversion_api",
      af: "cookie_deprecation",
      Wa: "cookie_domain",
      Ka: "cookie_expires",
      Xa: "cookie_flags",
      kc: "cookie_name",
      Qc: "cookie_path",
      Ra: "cookie_prefix",
      mc: "cookie_update",
      nc: "country",
      xa: "currency",
      Dd: "customer_lifetime_value",
      Rc: "custom_map",
      zi: "gcldc",
      Ai: "debug_mode",
      ba: "developer_id",
      Bi: "disable_merchant_reported_purchases",
      Sc: "dc_custom_params",
      Ci: "dc_natural_search",
      ig: "dynamic_event_settings",
      jg: "affiliation",
      Ed: "checkout_option",
      bf: "checkout_step",
      kg: "coupon",
      Tc: "item_list_name",
      cf: "list_name",
      Di: "promotions",
      Uc: "shipping",
      df: "tax",
      Fd: "engagement_time_msec",
      Gd: "enhanced_client_id",
      Hd: "enhanced_conversions",
      lg: "enhanced_conversions_automatic_settings",
      Id: "estimated_delivery_date",
      ef: "euid_logged_in_state",
      Vc: "event_callback",
      Ek: "event_category",
      vb: "event_developer_id_string",
      Fk: "event_label",
      mg: "event",
      Jd: "event_settings",
      Kd: "event_timeout",
      Gk: "description",
      Hk: "fatal",
      Ei: "experiments",
      ff: "firebase_id",
      Ld: "first_party_collection",
      Md: "_x_20",
      kb: "_x_19",
      ng: "fledge",
      og: "flight_error_code",
      pg: "flight_error_message",
      Fi: "fl_activity_category",
      Gi: "fl_activity_group",
      qg: "fl_advertiser_id",
      Hi: "fl_ar_dedupe",
      rg: "match_id",
      Ii: "fl_random_number",
      Ji: "tran",
      Ki: "u",
      Nd: "gac_gclid",
      oc: "gac_wbraid",
      sg: "gac_wbraid_multiple_conversions",
      ug: "ga_restrict_domain",
      vg: "ga_temp_client_id",
      Od: "gdpr_applies",
      wg: "geo_granularity",
      wb: "value_callback",
      lb: "value_key",
      Ik: "google_ono",
      Kb: "google_signals",
      xg: "google_tld",
      Pd: "groups",
      yg: "gsa_experiment_id",
      zg: "iframe_state",
      Wc: "ignore_referrer",
      hf: "internal_traffic_results",
      Lb: "is_legacy_converted",
      yb: "is_legacy_loaded",
      Qd: "is_passthrough",
      jf: "_lps",
      La: "language",
      kf: "legacy_developer_id_string",
      Ma: "linker",
      qc: "accept_incoming",
      zb: "decorate_forms",
      W: "domains",
      Mb: "url_position",
      Ag: "method",
      Jk: "name",
      Xc: "new_customer",
      Bg: "non_interaction",
      Li: "optimize_id",
      Mi: "page_hostname",
      Yc: "page_path",
      Na: "page_referrer",
      Ab: "page_title",
      Cg: "passengers",
      Dg: "phone_conversion_callback",
      Ni: "phone_conversion_country_code",
      Eg: "phone_conversion_css_class",
      Oi: "phone_conversion_ids",
      Fg: "phone_conversion_number",
      Gg: "phone_conversion_options",
      Hg: "_protected_audience_enabled",
      Zc: "quantity",
      Rd: "redact_device_info",
      lf: "referral_exclusion_definition",
      Nb: "restricted_data_processing",
      Pi: "retoken",
      Kk: "sample_rate",
      nf: "screen_name",
      Bb: "screen_resolution",
      Qi: "search_term",
      Sa: "send_page_view",
      Ob: "send_to",
      Sd: "server_container_url",
      ad: "session_duration",
      Td: "session_engaged",
      pf: "session_engaged_time",
      Cb: "session_id",
      Ud: "session_number",
      bd: "delivery_postal_code",
      Lk: "temporary_client_id",
      qf: "topmost_url",
      Ri: "tracking_id",
      rf: "traffic_type",
      ya: "transaction_id",
      Pb: "transport_url",
      Ig: "trip_type",
      Qb: "update",
      Db: "url_passthrough",
      Wd: "_user_agent_architecture",
      Xd: "_user_agent_bitness",
      Yd: "_user_agent_full_version_list",
      Zd: "_user_agent_mobile",
      ae: "_user_agent_model",
      be: "_user_agent_platform",
      ce: "_user_agent_platform_version",
      de: "_user_agent_wow64",
      Ba: "user_data",
      Jg: "user_data_auto_latency",
      Kg: "user_data_auto_meta",
      Lg: "user_data_auto_multi",
      Mg: "user_data_auto_selectors",
      Ng: "user_data_auto_status",
      ee: "user_data_mode",
      fe: "user_data_settings",
      Ta: "user_id",
      Ya: "user_properties",
      Si: "_user_region",
      Og: "us_privacy_string",
      ia: "value",
      sc: "wbraid",
      Pg: "wbraid_multiple_conversions",
      Yi: "_host_name",
      Zi: "_in_page_command",
      aj: "_is_passthrough_cid",
      fd: "non_personalized_ads",
      ne: "_sst_parameters",
      jb: "conversion_label",
      Aa: "page_location",
      xb: "global_developer_id_string",
      Vd: "tc_privacy_string"
    } }, ai = {}, bi = Object.freeze((ai[N.g.ja] = 1, ai[N.g.Ye] = 1, ai[N.g.yd] = 1, ai[N.g.ib] = 1, ai[N.g.Z] = 1, ai[N.g.Wa] = 1, ai[N.g.Ka] = 1, ai[N.g.Xa] = 1, ai[N.g.kc] = 1, ai[N.g.Qc] = 1, ai[N.g.Ra] = 1, ai[N.g.mc] = 1, ai[N.g.Rc] = 1, ai[N.g.ba] = 1, ai[N.g.ig] = 1, ai[N.g.Vc] = 1, ai[N.g.Jd] = 1, ai[N.g.Kd] = 1, ai[N.g.Ld] = 1, ai[N.g.ug] = 1, ai[N.g.Kb] = 1, ai[N.g.xg] = 1, ai[N.g.Pd] = 1, ai[N.g.hf] = 1, ai[N.g.Lb] = 1, ai[N.g.yb] = 1, ai[N.g.Ma] = 1, ai[N.g.lf] = 1, ai[N.g.Nb] = 1, ai[N.g.Sa] = 1, ai[N.g.Ob] = 1, ai[N.g.Sd] = 1, ai[N.g.ad] = 1, ai[N.g.pf] = 1, ai[N.g.bd] = 1, ai[N.g.Pb] = 1, ai[N.g.Qb] = 1, ai[N.g.fe] = 1, ai[N.g.Ya] = 1, ai[N.g.ne] = 1, ai));
    Object.freeze([N.g.Aa, N.g.Na, N.g.Ab, N.g.La, N.g.nf, N.g.Ta, N.g.ff, N.g.xi]);
    var ci = {}, di = Object.freeze((ci[N.g.ki] = 1, ci[N.g.li] = 1, ci[N.g.mi] = 1, ci[N.g.ni] = 1, ci[N.g.oi] = 1, ci[N.g.ri] = 1, ci[N.g.si] = 1, ci[N.g.ui] = 1, ci[N.g.vi] = 1, ci[N.g.xd] = 1, ci)), ei = {}, fi = Object.freeze((ei[N.g.dg] = 1, ei[N.g.eg] = 1, ei[N.g.ac] = 1, ei[N.g.bc] = 1, ei[N.g.fg] = 1, ei[N.g.Hb] = 1, ei[N.g.fc] = 1, ei[N.g.fb] = 1, ei[N.g.sb] = 1, ei[N.g.hb] = 1, ei[N.g.ra] = 1, ei[N.g.hc] = 1, ei[N.g.Fa] = 1, ei[N.g.gg] = 1, ei));
    Object.freeze([N.g.ja, N.g.ib, N.g.mc, N.g.Wc, N.g.Qb]);
    Object.freeze([
      N.g.Ka,
      N.g.Kd,
      N.g.ad,
      N.g.pf,
      N.g.Fd
    ]);
    var ki = {}, li = (ki[N.g.J] = "1", ki[N.g.R] = "2", ki[N.g.N] = "3", ki[N.g.Ea] = "4", ki), mi = {};
    Object.freeze((mi[N.g.ja] = 1, mi[N.g.yd] = 1, mi[N.g.Ga] = 1, mi[N.g.Ib] = 1, mi[N.g.Ze] = 1, mi[N.g.zd] = 1, mi[N.g.Ad] = 1, mi[N.g.Bd] = 1, mi[N.g.Z] = 1, mi[N.g.Cd] = 1, mi[N.g.Qa] = 1, mi[N.g.Ha] = 1, mi[N.g.Wa] = 1, mi[N.g.Ka] = 1, mi[N.g.Xa] = 1, mi[N.g.Ra] = 1, mi[N.g.xa] = 1, mi[N.g.Dd] = 1, mi[N.g.ba] = 1, mi[N.g.Bi] = 1, mi[N.g.Hd] = 1, mi[N.g.Id] = 1, mi[N.g.ff] = 1, mi[N.g.Ld] = 1, mi[N.g.Lb] = 1, mi[N.g.yb] = 1, mi[N.g.La] = 1, mi[N.g.Xc] = 1, mi[N.g.Aa] = 1, mi[N.g.Na] = 1, mi[N.g.Dg] = 1, mi[N.g.Eg] = 1, mi[N.g.Fg] = 1, mi[N.g.Gg] = 1, mi[N.g.Nb] = 1, mi[N.g.Sa] = 1, mi[N.g.Ob] = 1, mi[N.g.Sd] = 1, mi[N.g.bd] = 1, mi[N.g.ya] = 1, mi[N.g.Pb] = 1, mi[N.g.Qb] = 1, mi[N.g.Db] = 1, mi[N.g.Ba] = 1, mi[N.g.Ta] = 1, mi[N.g.ia] = 1, mi));
    var oi = {}, pi = Object.freeze((oi[N.g.sk] = "s", oi[N.g.uk] = "y", oi[N.g.rk] = "p", oi[N.g.tk] = "h", oi[N.g.pk] = "a", oi[N.g.qk] = "m", oi));
    Object.freeze(N.g);
    var qi = {}, ri = z.google_tag_manager = z.google_tag_manager || {};
    qi.Ug = "41a0";
    qi.me = Number("0") || 0;
    qi.fa = "dataLayer";
    qi.mk = "ChAIgLWjrQYQgoHTjb2J8tFOEiUA1yOXrV0AmUO7HwS8hX9AA4PsMbtZmYjAZ+sDnvVipVigg/GlGgLDsg==";
    var ti = { __cl: 1, __ecl: 1, __ehl: 1, __evl: 1, __fal: 1, __fil: 1, __fsl: 1, __hl: 1, __jel: 1, __lcl: 1, __sdl: 1, __tl: 1, __ytl: 1 }, ui = { __paused: 1, __tg: 1 }, vi;
    for (vi in ti)
      ti.hasOwnProperty(vi) && (ui[vi] = 1);
    var wi = Oa("true"), xi, yi = false;
    yi = true;
    xi = yi;
    var zi, Ai = false;
    zi = Ai;
    var Bi, Ci = false;
    Bi = Ci;
    var Di, Ei = false;
    Di = Ei;
    qi.wd = "www.googletagmanager.com";
    var Fi = "" + qi.wd + (xi ? "/gtag/js" : "/gtm.js"), Gi = null, Hi = null, Ii = {}, Ji = {}, Ki = {}, Li = function() {
      var a = ri.sequence || 1;
      ri.sequence = a + 1;
      return a;
    };
    qi.lk = "";
    var Mi = "";
    qi.zf = Mi;
    var Oi = new Ka(), Pi = {}, Qi = {}, Ti = { name: qi.fa, set: function(a, b) {
      nb($a(a, b), Pi);
      Ri();
    }, get: function(a) {
      return Si(a, 2);
    }, reset: function() {
      Oi = new Ka();
      Pi = {};
      Ri();
    } }, Si = function(a, b) {
      return 2 != b ? Oi.get(a) : Ui(a);
    }, Ui = function(a, b) {
      var c = a.split(".");
      b = b || [];
      for (var d = Pi, e = 0; e < c.length; e++) {
        if (null === d)
          return false;
        if (void 0 === d)
          break;
        d = d[c[e]];
        if (-1 !== b.indexOf(d))
          return;
      }
      return d;
    }, Vi = function(a, b) {
      Qi.hasOwnProperty(a) || (Oi.set(a, b), nb($a(a, b), Pi), Ri());
    }, Wi = function() {
      for (var a = [
        "gtm.allowlist",
        "gtm.blocklist",
        "gtm.whitelist",
        "gtm.blacklist",
        "tagTypeBlacklist"
      ], b = 0; b < a.length; b++) {
        var c = a[b], d = Si(c, 1);
        if (Ha(d) || mb(d))
          d = nb(d);
        Qi[c] = d;
      }
    }, Ri = function(a) {
      l(Qi, function(b, c) {
        Oi.set(b, c);
        nb($a(b), Pi);
        nb($a(b, c), Pi);
        a && delete Qi[b];
      });
    }, Xi = function(a, b) {
      var c, d = 1 !== (void 0 === b ? 2 : b) ? Ui(a) : Oi.get(a);
      "array" === jb(d) || "object" === jb(d) ? c = nb(d) : c = d;
      return c;
    };
    var Yi = function(a, b, c) {
      if (!c)
        return false;
      var d = c.selector_type, e = String(c.value), f;
      if ("js_variable" === d) {
        e = e.replace(/\["?'?/g, ".").replace(/"?'?\]/g, "");
        for (var g = e.split(","), h = 0; h < g.length; h++) {
          var m = g[h].trim();
          if (m) {
            if (0 === m.indexOf("dataLayer."))
              f = Si(m.substring(10));
            else {
              var n = m.split(".");
              f = z[n.shift()];
              for (var p = 0; p < n.length; p++)
                f = f && f[n[p]];
            }
            if (void 0 !== f)
              break;
          }
        }
      } else if ("css_selector" === d && xh) {
        var q = yh(e);
        if (q && 0 < q.length) {
          f = [];
          for (var r = 0; r < q.length && r < ("email" === b || "phone_number" === b ? 5 : 1); r++)
            f.push(Rc(q[r]) || Qa(q[r].value));
          f = 1 === f.length ? f[0] : f;
        }
      }
      return f ? (a[b] = f, true) : false;
    }, Zi = function(a) {
      if (a) {
        var b = {}, c = false;
        c = Yi(b, "email", a.email) || c;
        c = Yi(b, "phone_number", a.phone) || c;
        b.address = [];
        for (var d = a.name_and_address || [], e = 0; e < d.length; e++) {
          var f = {};
          c = Yi(f, "first_name", d[e].first_name) || c;
          c = Yi(f, "last_name", d[e].last_name) || c;
          c = Yi(f, "street", d[e].street) || c;
          c = Yi(f, "city", d[e].city) || c;
          c = Yi(f, "region", d[e].region) || c;
          c = Yi(f, "country", d[e].country) || c;
          c = Yi(f, "postal_code", d[e].postal_code) || c;
          b.address.push(f);
        }
        return c ? b : void 0;
      }
    }, $i = function(a) {
      return mb(a) ? !!a.enable_code : false;
    };
    var dj = [];
    function ej(a) {
      switch (a) {
        case 25:
          return 3;
        case 48:
          return 14;
        case 59:
          return 11;
        case 60:
          return 12;
        case 63:
          return 10;
        case 65:
          return 13;
        case 61:
          return 15;
        case 102:
          return 16;
        case 105:
          return 17;
      }
    }
    function Q(a) {
      dj[a] = true;
      var b = ej(a);
      b && (Rf[b] = true);
    }
    Q(5);
    Q(6);
    Q(7);
    Q(9);
    Q(10);
    Q(14);
    Q(11);
    Q(15);
    Q(18);
    Q(19);
    Q(20);
    Q(21);
    Q(23);
    Q(24);
    Q(31);
    Q(32);
    Q(33);
    Q(35);
    Q(36);
    Q(40);
    Q(42);
    Q(45);
    Q(46);
    Q(47);
    Q(49);
    Q(50);
    Q(51);
    Q(53);
    Q(54);
    Q(55);
    Q(56);
    Q(61);
    Q(63);
    Q(64);
    Q(67);
    Q(68);
    Q(69);
    Q(74);
    Q(87);
    Q(91);
    function R(a) {
      return !!dj[a];
    }
    var ij = function(a) {
      Ab("HEALTH", a);
    };
    var pj;
    try {
      pj = JSON.parse(yb("eyIwIjoiQ04iLCIxIjoiIiwiMiI6dHJ1ZSwiMyI6Imdvb2dsZS5jbiIsIjQiOiIiLCI1Ijp0cnVlLCI2IjpmYWxzZSwiNyI6ImFkX3N0b3JhZ2V8YW5hbHl0aWNzX3N0b3JhZ2V8YWRfdXNlcl9kYXRhfGFkX3BlcnNvbmFsaXphdGlvbiJ9"));
    } catch (a) {
      L(123), ij(2), pj = {};
    }
    var qj = function() {
      return pj["0"] || "";
    }, rj = function() {
      return pj["1"] || "";
    }, sj = function() {
      var a = false;
      a = !!pj["2"];
      return a;
    }, tj = function() {
      var a = "";
      a = pj["4"] || "";
      return a;
    }, uj = function() {
      var a = false;
      a = !!pj["5"];
      return a;
    }, vj = function() {
      var a = "";
      a = pj["3"] || "";
      return a;
    };
    var wj = new function(a, b) {
      this.h = a;
      this.defaultValue = void 0 === b ? false : b;
    }(1933);
    var zj = function() {
      var a = yj, b = "th";
      if (a.th && a.hasOwnProperty(b))
        return a.th;
      var c = new a();
      return a.th = c;
    };
    var yj = function() {
      var a = {};
      this.h = function() {
        var b = wj.h, c = wj.defaultValue;
        return null != a[b] ? a[b] : c;
      };
      this.s = function() {
        a[wj.h] = true;
      };
    };
    var Aj = false, Bj = false, Cj = {}, Fj = { ad_storage: false, ad_user_data: false, ad_personalization: false };
    function Gj() {
      var a = Ec("google_tag_data", {});
      return a.ics = a.ics || new Hj();
    }
    var Hj = function() {
      this.entries = {};
      this.cps = {};
      this.waitPeriodTimedOut = this.wasSetLate = this.accessedAny = this.accessedDefault = this.usedSetCps = this.usedImplicit = this.usedUpdate = this.usedDefault = this.usedDeclare = this.active = false;
      this.h = [];
    };
    Hj.prototype.default = function(a, b, c, d, e, f) {
      this.usedDefault || this.usedDeclare || !this.accessedDefault && !this.accessedAny || (this.wasSetLate = true);
      this.usedDefault = this.active = true;
      Ab("TAGGING", 19);
      void 0 == b ? Ab("TAGGING", 18) : Ij(this, a, "granted" === b, c, d, e, f);
    };
    Hj.prototype.waitForUpdate = function(a, b) {
      for (var c = 0; c < a.length; c++)
        Ij(this, a[c], void 0, void 0, "", "", b);
    };
    var Ij = function(a, b, c, d, e, f, g) {
      var h = a.entries, m = h[b] || {}, n = m.region, p = d && k(d) ? d.toUpperCase() : void 0;
      e = e.toUpperCase();
      f = f.toUpperCase();
      if (Jj(p, n, e, f)) {
        var q = !!(g && 0 < g && void 0 === m.update), r = { region: p, declare_region: m.declare_region, implicit: m.implicit, default: void 0 !== c ? c : m.default, declare: m.declare, update: m.update, quiet: q };
        if ("" !== e || false !== m.default)
          h[b] = r;
        q && z.setTimeout(function() {
          h[b] === r && r.quiet && (Ab("TAGGING", 2), a.waitPeriodTimedOut = true, a.clearTimeout(b, void 0), a.notifyListeners());
        }, g);
      }
    };
    aa = Hj.prototype;
    aa.clearTimeout = function(a, b) {
      var c = [a], d;
      for (d in Cj)
        Cj.hasOwnProperty(d) && Cj[d] === a && c.push(d);
      var e = this.entries[a] || {}, f = this.getConsentState(a);
      if (e.quiet) {
        e.quiet = false;
        for (var g = ea(c), h = g.next(); !h.done; h = g.next())
          Kj(this, h.value);
      } else if (void 0 !== b && f !== b) {
        var m = ea(c);
        for (h = m.next(); !h.done; h = m.next())
          Kj(this, h.value);
      }
    };
    aa.update = function(a, b) {
      this.usedDefault || this.usedDeclare || this.usedUpdate || !this.accessedAny || (this.wasSetLate = true);
      this.usedUpdate = this.active = true;
      if (void 0 != b) {
        var c = this.getConsentState(a), d = this.entries;
        (d[a] = d[a] || {}).update = "granted" === b;
        this.clearTimeout(a, c);
      }
    };
    aa.declare = function(a, b, c, d, e) {
      this.usedDeclare = this.active = true;
      var f = this.entries, g = f[a] || {}, h = g.declare_region, m = c && k(c) ? c.toUpperCase() : void 0;
      d = d.toUpperCase();
      e = e.toUpperCase();
      if (Jj(m, h, d, e)) {
        var n = { region: g.region, declare_region: m, declare: "granted" === b, implicit: g.implicit, default: g.default, update: g.update, quiet: g.quiet };
        if ("" !== d || false !== g.declare)
          f[a] = n;
      }
    };
    aa.implicit = function(a, b) {
      this.usedImplicit = true;
      var c = this.entries, d = c[a] = c[a] || {};
      false !== d.implicit && (d.implicit = "granted" === b);
    };
    aa.getConsentState = function(a) {
      var b = this.entries, c = b[a] || {}, d = c.update;
      if (void 0 !== d)
        return d ? 1 : 2;
      d = c.default;
      if (void 0 !== d)
        return d ? 1 : 2;
      if (Cj.hasOwnProperty(a)) {
        var e = b[Cj[a]] || {};
        d = e.update;
        if (void 0 !== d)
          return d ? 1 : 2;
        d = e.default;
        if (void 0 !== d)
          return d ? 1 : 2;
      }
      d = c.declare;
      if (void 0 !== d)
        return d ? 1 : 2;
      if (Sf(3)) {
        d = c.implicit;
        if (void 0 !== d)
          return d ? 3 : 4;
        if (Fj.hasOwnProperty(a))
          return Fj[a] ? 3 : 4;
      }
      return 0;
    };
    aa.setCps = function(a, b, c, d, e) {
      Lj(this.cps, a, b, c, d, e) && (this.usedSetCps = true);
    };
    aa.addListener = function(a, b) {
      this.h.push({ consentTypes: a, Gl: b });
    };
    var Kj = function(a, b) {
      for (var c = 0; c < a.h.length; ++c) {
        var d = a.h[c];
        Ha(d.consentTypes) && -1 !== d.consentTypes.indexOf(b) && (d.Nj = true);
      }
    };
    Hj.prototype.notifyListeners = function(a, b) {
      for (var c = 0; c < this.h.length; ++c) {
        var d = this.h[c];
        if (d.Nj) {
          d.Nj = false;
          try {
            d.Gl({ consentEventId: a, consentPriorityId: b });
          } catch (e) {
          }
        }
      }
    };
    function Jj(a, b, c, d) {
      return "" === c || a === d ? true : a === c ? b !== d : !a && !b;
    }
    function Lj(a, b, c, d, e, f) {
      var g = a[b] || {}, h = g.region, m = d && k(d) ? d.toUpperCase() : void 0;
      e = e.toUpperCase();
      f = f.toUpperCase();
      if (Jj(m, h, e, f)) {
        var n = { enabled: "granted" === c, region: m };
        if ("" !== e || false !== g.enabled)
          return a[b] = n, true;
      }
      return false;
    }
    var Mj = function(a) {
      var b = Gj();
      b.accessedAny = true;
      return (k(a) ? [a] : a).every(function(c) {
        switch (b.getConsentState(c)) {
          case 1:
          case 3:
            return true;
          case 2:
          case 4:
            return false;
          default:
            return true;
        }
      });
    }, Nj = function(a) {
      var b = Gj();
      b.accessedAny = true;
      return b.getConsentState(a);
    }, Oj = function(a) {
      var b = Gj();
      b.accessedAny = true;
      return !(b.entries[a] || {}).quiet;
    }, Pj = function() {
      if (!zj().h())
        return false;
      var a = Gj();
      a.accessedAny = true;
      return a.active;
    }, Qj = function(a, b) {
      Gj().addListener(a, b);
    }, Rj = function(a, b) {
      Gj().notifyListeners(a, b);
    }, Sj = function(a, b) {
      function c() {
        for (var e = 0; e < b.length; e++)
          if (!Oj(b[e]))
            return true;
        return false;
      }
      if (c()) {
        var d = false;
        Qj(b, function(e) {
          d || c() || (d = true, a(e));
        });
      } else
        a({});
    }, Tj = function(a, b) {
      function c() {
        for (var h = [], m = 0; m < e.length; m++) {
          var n = e[m];
          Mj(n) && !f[n] && h.push(n);
        }
        return h;
      }
      function d(h) {
        for (var m = 0; m < h.length; m++)
          f[h[m]] = true;
      }
      var e = k(b) ? [b] : b, f = {}, g = c();
      g.length !== e.length && (d(g), Qj(e, function(h) {
        function m(q) {
          0 !== q.length && (d(q), h.consentTypes = q, a(h));
        }
        var n = c();
        if (0 !== n.length) {
          var p = Object.keys(f).length;
          n.length + p >= e.length ? m(n) : z.setTimeout(function() {
            m(c());
          }, 500);
        }
      }));
    };
    function Uj() {
    }
    function Vj() {
    }
    var Wj = [N.g.J, N.g.R, N.g.N, N.g.Ea], Xj = function(a) {
      for (var b = a[N.g.Va], c = Array.isArray(b) ? b : [b], d = { Ce: 0 }; d.Ce < c.length; d = { Ce: d.Ce }, ++d.Ce)
        l(a, /* @__PURE__ */ function(e) {
          return function(f, g) {
            if (f !== N.g.Va) {
              var h = c[e.Ce], m = qj(), n = rj();
              Bj = true;
              Aj && Ab("TAGGING", 20);
              Gj().declare(f, g, h, m, n);
            }
          };
        }(d));
    }, Yj = function(a) {
      var b = a[N.g.Va];
      b && L(40);
      var c = a[N.g.We];
      c && L(41);
      for (var d = Ha(b) ? b : [b], e = { De: 0 }; e.De < d.length; e = { De: e.De }, ++e.De)
        l(a, /* @__PURE__ */ function(f) {
          return function(g, h) {
            if (g !== N.g.Va && g !== N.g.We) {
              var m = d[f.De], n = Number(c), p = qj(), q = rj();
              Aj = true;
              Bj && Ab("TAGGING", 20);
              Gj().default(g, h, m, p, q, n);
            }
          };
        }(e));
    }, Zj = function(a, b) {
      l(a, function(c, d) {
        Aj = true;
        Bj && Ab("TAGGING", 20);
        Gj().update(c, d);
      });
      Rj(b.eventId, b.priorityId);
    }, ak = function(a) {
      for (var b = a[N.g.Va], c = Array.isArray(b) ? b : [b], d = { Ee: 0 }; d.Ee < c.length; d = { Ee: d.Ee }, ++d.Ee)
        l(a, /* @__PURE__ */ function(e) {
          return function(f, g) {
            if (f !== N.g.Va) {
              var h = c[e.Ee], m = qj(), n = rj();
              Gj().setCps(f, g, h, m, n);
            }
          };
        }(d));
    }, ck = function(a) {
      Array.isArray(a) || (a = [a]);
      return a.every(function(b) {
        return Mj(b);
      });
    }, dk = function(a, b) {
      Qj(a, b);
    }, ek = function(a, b) {
      Tj(a, b);
    }, fk = function(a, b) {
      Sj(a, b);
    }, gk = function() {
      var a = [N.g.J, N.g.Ea, N.g.N];
      Gj().waitForUpdate(a, 500);
    }, hk = function(a) {
      for (var b = ea(a), c = b.next(); !c.done; c = b.next()) {
        var d = c.value;
        Gj().clearTimeout(
          d,
          void 0
        );
      }
      Rj();
    };
    var ik = function(a, b, c, d, e, f, g, h, m, n, p) {
      this.eventId = a;
      this.priorityId = b;
      this.h = c;
      this.M = d;
      this.C = e;
      this.F = f;
      this.s = g;
      this.eventMetadata = h;
      this.onSuccess = m;
      this.onFailure = n;
      this.isGtmEvent = p;
    }, jk = function(a, b) {
      var c = [];
      switch (b) {
        case 3:
          c.push(a.h);
          c.push(a.M);
          c.push(a.C);
          c.push(a.F);
          c.push(a.s);
          break;
        case 2:
          c.push(a.h);
          break;
        case 1:
          c.push(a.M);
          c.push(a.C);
          c.push(a.F);
          c.push(a.s);
          break;
        case 4:
          c.push(a.h), c.push(a.M), c.push(a.C), c.push(a.F);
      }
      return c;
    }, S = function(a, b, c, d) {
      for (var e = ea(jk(a, void 0 === d ? 3 : d)), f = e.next(); !f.done; f = e.next()) {
        var g = f.value;
        if (void 0 !== g[b])
          return g[b];
      }
      return c;
    }, lk = function(a, b, c) {
      function d(n) {
        mb(n) && l(n, function(p, q) {
          f = true;
          e[p] = q;
        });
      }
      var e = {}, f = false, g = jk(a, void 0 === c ? 3 : c);
      g.reverse();
      for (var h = ea(g), m = h.next(); !m.done; m = h.next())
        d(m.value[b]);
      return f ? e : void 0;
    }, mk = function(a) {
      for (var b = [
        N.g.Mc,
        N.g.Ic,
        N.g.Jc,
        N.g.Kc,
        N.g.Lc,
        N.g.Nc,
        N.g.Oc
      ], c = jk(a, 3), d = ea(c), e = d.next(); !e.done; e = d.next()) {
        for (var f = e.value, g = {}, h = false, m = ea(b), n = m.next(); !n.done; n = m.next()) {
          var p = n.value;
          void 0 !== f[p] && (g[p] = f[p], h = true);
        }
        var q = h ? g : void 0;
        if (q)
          return q;
      }
      return {};
    }, nk = function(a, b) {
      this.uf = a;
      this.vf = b;
      this.C = {};
      this.Sb = {};
      this.h = {};
      this.F = {};
      this.ed = {};
      this.Rb = {};
      this.s = {};
      this.Oa = function() {
      };
      this.X = function() {
      };
      this.M = false;
    }, ok = function(a, b) {
      a.C = b;
      return a;
    }, pk = function(a, b) {
      a.Sb = b;
      return a;
    }, qk = function(a, b) {
      a.h = b;
      return a;
    }, rk = function(a, b) {
      a.F = b;
      return a;
    }, sk = function(a, b) {
      a.ed = b;
      return a;
    }, tk = function(a, b) {
      a.Rb = b;
      return a;
    }, uk = function(a, b) {
      a.s = b || {};
      return a;
    }, vk = function(a, b) {
      a.Oa = b;
      return a;
    }, wk = function(a, b) {
      a.X = b;
      return a;
    }, xk = function(a, b) {
      a.M = b;
      return a;
    }, yk = function(a) {
      return new ik(a.uf, a.vf, a.C, a.Sb, a.h, a.F, a.Rb, a.s, a.Oa, a.X, a.M);
    };
    function zk(a, b) {
      if ("" === a)
        return b;
      var c = Number(a);
      return isNaN(c) ? b : c;
    }
    var Bk = function(a) {
      var b = a;
      return function() {
        if (b) {
          var c = b;
          b = null;
          c();
        }
      };
    };
    var Ck = function(a, b, c) {
      a.addEventListener && a.addEventListener(b, c, false);
    };
    function Dk() {
      return Pb ? !!Wb && !!Wb.platform : false;
    }
    function Ek() {
      return Zb("iPhone") && !Zb("iPod") && !Zb("iPad");
    }
    function Fk() {
      Ek() || Zb("iPad") || Zb("iPod");
    }
    ac();
    $b() || Zb("Trident") || Zb("MSIE");
    Zb("Edge");
    !Zb("Gecko") || -1 != Vb().toLowerCase().indexOf("webkit") && !Zb("Edge") || Zb("Trident") || Zb("MSIE") || Zb("Edge");
    -1 != Vb().toLowerCase().indexOf("webkit") && !Zb("Edge") && Zb("Mobile");
    Dk() || Zb("Macintosh");
    Dk() || Zb("Windows");
    (Dk() ? "Linux" === Wb.platform : Zb("Linux")) || Dk() || Zb("CrOS");
    Dk() || Zb("Android");
    Ek();
    Zb("iPad");
    Zb("iPod");
    Fk();
    Vb().toLowerCase().indexOf("kaios");
    var Mk = function(a, b) {
      if (a)
        for (var c in a)
          Object.prototype.hasOwnProperty.call(a, c) && b(a[c], c, a);
    };
    function Nk(a) {
      if (!a || !C.head)
        return null;
      var b = Ok("META");
      C.head.appendChild(b);
      b.httpEquiv = "origin-trial";
      b.content = a;
      return b;
    }
    var Ok = function(a, b) {
      b = void 0 === b ? document : b;
      return b.createElement(String(a).toLowerCase());
    };
    function Qk(a, b, c, d) {
      d = void 0 === d ? false : d;
      a.google_image_requests || (a.google_image_requests = []);
      var e = Ok("IMG", a.document);
      if (c) {
        var f = function() {
          if (c) {
            var g = a.google_image_requests, h = Db(g, e);
            0 <= h && Array.prototype.splice.call(g, h, 1);
          }
          e.removeEventListener && e.removeEventListener("load", f, false);
          e.removeEventListener && e.removeEventListener("error", f, false);
        };
        Ck(e, "load", f);
        Ck(e, "error", f);
      }
      d && (e.attributionSrc = "");
      e.src = b;
      a.google_image_requests.push(e);
    }
    var Sk = function(a) {
      var b;
      b = void 0 === b ? false : b;
      var c = "https://pagead2.googlesyndication.com/pagead/gen_204?id=tcfe";
      Mk(a, function(d, e) {
        if (d || 0 === d)
          c += "&" + e + "=" + encodeURIComponent("" + d);
      });
      Rk(c, b);
    }, Rk = function(a, b) {
      var c = window, d;
      b = void 0 === b ? false : b;
      d = void 0 === d ? false : d;
      if (c.fetch) {
        var e = { keepalive: true, credentials: "include", redirect: "follow", method: "get", mode: "no-cors" };
        d && (e.mode = "cors", "setAttributionReporting" in XMLHttpRequest.prototype ? e.attributionReporting = { eventSourceEligible: "true", triggerEligible: "false" } : e.headers = { "Attribution-Reporting-Eligible": "event-source" });
        c.fetch(a, e);
      } else
        Qk(c, a, void 0 === b ? false : b, void 0 === d ? false : d);
    };
    var Tk = function() {
    };
    var Uk = function(a) {
      void 0 !== a.addtlConsent && "string" !== typeof a.addtlConsent && (a.addtlConsent = void 0);
      void 0 !== a.gdprApplies && "boolean" !== typeof a.gdprApplies && (a.gdprApplies = void 0);
      return void 0 !== a.tcString && "string" !== typeof a.tcString || void 0 !== a.listenerId && "number" !== typeof a.listenerId ? 2 : a.cmpStatus && "error" !== a.cmpStatus ? 0 : 3;
    }, Vk = function(a, b) {
      b = void 0 === b ? {} : b;
      this.s = a;
      this.h = null;
      this.M = {};
      this.Oa = 0;
      var c;
      this.X = null != (c = b.mn) ? c : 500;
      var d;
      this.F = null != (d = b.Un) ? d : false;
      this.C = null;
    };
    sa(Vk, Tk);
    var Xk = function(a) {
      return "function" === typeof a.s.__tcfapi || null != Wk(a);
    };
    Vk.prototype.addEventListener = function(a) {
      var b = this, c = { internalBlockOnErrors: this.F }, d = Bk(function() {
        return a(c);
      }), e = 0;
      -1 !== this.X && (e = setTimeout(function() {
        c.tcString = "tcunavailable";
        c.internalErrorState = 1;
        d();
      }, this.X));
      var f = function(g, h) {
        clearTimeout(e);
        g ? (c = g, c.internalErrorState = Uk(c), c.internalBlockOnErrors = b.F, h && 0 === c.internalErrorState || (c.tcString = "tcunavailable", h || (c.internalErrorState = 3))) : (c.tcString = "tcunavailable", c.internalErrorState = 3);
        a(c);
      };
      try {
        Yk(this, "addEventListener", f);
      } catch (g) {
        c.tcString = "tcunavailable", c.internalErrorState = 3, e && (clearTimeout(e), e = 0), d();
      }
    };
    Vk.prototype.removeEventListener = function(a) {
      a && a.listenerId && Yk(this, "removeEventListener", null, a.listenerId);
    };
    var $k = function(a, b, c) {
      var d;
      d = void 0 === d ? "755" : d;
      var e;
      a: {
        if (a.publisher && a.publisher.restrictions) {
          var f = a.publisher.restrictions[b];
          if (void 0 !== f) {
            e = f[void 0 === d ? "755" : d];
            break a;
          }
        }
        e = void 0;
      }
      var g = e;
      if (0 === g)
        return false;
      var h = c;
      2 === c ? (h = 0, 2 === g && (h = 1)) : 3 === c && (h = 1, 1 === g && (h = 0));
      var m;
      if (0 === h)
        if (a.purpose && a.vendor) {
          var n = Zk(a.vendor.consents, void 0 === d ? "755" : d);
          m = n && "1" === b && a.purposeOneTreatment && "CH" === a.publisherCC ? true : n && Zk(a.purpose.consents, b);
        } else
          m = true;
      else
        m = 1 === h ? a.purpose && a.vendor ? Zk(
          a.purpose.legitimateInterests,
          b
        ) && Zk(a.vendor.legitimateInterests, void 0 === d ? "755" : d) : true : true;
      return m;
    }, Zk = function(a, b) {
      return !(!a || !a[b]);
    }, Yk = function(a, b, c, d) {
      c || (c = function() {
      });
      if ("function" === typeof a.s.__tcfapi) {
        var e = a.s.__tcfapi;
        e(b, 2, c, d);
      } else if (Wk(a)) {
        al(a);
        var f = ++a.Oa;
        a.M[f] = c;
        if (a.h) {
          var g = {};
          a.h.postMessage((g.__tcfapiCall = { command: b, version: 2, callId: f, parameter: d }, g), "*");
        }
      } else
        c({}, false);
    }, Wk = function(a) {
      if (a.h)
        return a.h;
      var b;
      a: {
        for (var c = a.s, d = 0; 50 > d; ++d) {
          var e;
          try {
            e = !(!c.frames || !c.frames.__tcfapiLocator);
          } catch (h) {
            e = false;
          }
          if (e) {
            b = c;
            break a;
          }
          var f;
          b: {
            try {
              var g = c.parent;
              if (g && g != c) {
                f = g;
                break b;
              }
            } catch (h) {
            }
            f = null;
          }
          if (!(c = f))
            break;
        }
        b = null;
      }
      a.h = b;
      return a.h;
    }, al = function(a) {
      a.C || (a.C = function(b) {
        try {
          var c;
          c = ("string" === typeof b.data ? JSON.parse(b.data) : b.data).__tcfapiReturn;
          a.M[c.callId](c.returnValue, c.success);
        } catch (d) {
        }
      }, Ck(a.s, "message", a.C));
    }, bl = function(a) {
      if (false === a.gdprApplies)
        return true;
      void 0 === a.internalErrorState && (a.internalErrorState = Uk(a));
      return "error" === a.cmpStatus || 0 !== a.internalErrorState ? a.internalBlockOnErrors ? (Sk({ e: String(a.internalErrorState) }), false) : true : "loaded" !== a.cmpStatus || "tcloaded" !== a.eventStatus && "useractioncomplete" !== a.eventStatus ? false : true;
    };
    var cl = { 1: 0, 3: 0, 4: 0, 7: 3, 9: 3, 10: 3 };
    function dl() {
      var a = ri.tcf || {};
      return ri.tcf = a;
    }
    var el = function() {
      return new Vk(z, { mn: -1 });
    }, kl = function() {
      var a = dl(), b = el();
      Xk(b) && !fl() && !gl() && L(124);
      if (!a.active && Xk(b)) {
        fl() && (a.active = true, a.Xb = {}, a.cmpId = 0, a.tcfPolicyVersion = 0, Gj().active = true, a.tcString = "tcunavailable");
        gk();
        try {
          b.addEventListener(function(c) {
            if (0 !== c.internalErrorState)
              hl(a), hk([N.g.J, N.g.Ea, N.g.N]), Gj().active = true;
            else if (a.gdprApplies = c.gdprApplies, a.cmpId = c.cmpId, a.enableAdvertiserConsentMode = c.enableAdvertiserConsentMode, gl() && (a.active = true), !il(c) || fl() || gl()) {
              a.tcfPolicyVersion = c.tcfPolicyVersion;
              var d;
              if (false === c.gdprApplies) {
                var e = {}, f;
                for (f in cl)
                  cl.hasOwnProperty(f) && (e[f] = true);
                d = e;
                b.removeEventListener(c);
              } else if (il(c)) {
                var g = {}, h;
                for (h in cl)
                  if (cl.hasOwnProperty(h))
                    if ("1" === h) {
                      var m, n = c, p = { Ll: true };
                      p = void 0 === p ? {} : p;
                      m = bl(n) ? false === n.gdprApplies || "tcunavailable" === n.tcString || void 0 === n.gdprApplies && !p.Ll || "string" !== typeof n.tcString || !n.tcString.length ? true : $k(n, "1", 0) : false;
                      g["1"] = m;
                    } else
                      g[h] = $k(c, h, cl[h]);
                d = g;
              }
              if (d) {
                a.tcString = c.tcString || "tcempty";
                a.Xb = d;
                var q = {}, r = (q[N.g.J] = a.Xb["1"] ? "granted" : "denied", q);
                true !== a.gdprApplies ? (hk([N.g.J, N.g.Ea, N.g.N]), Gj().active = true) : (r[N.g.Ea] = a.Xb["3"] && a.Xb["4"] ? "granted" : "denied", "number" === typeof a.tcfPolicyVersion && 4 <= a.tcfPolicyVersion ? r[N.g.N] = a.Xb["1"] && a.Xb["7"] ? "granted" : "denied" : hk([N.g.N]), Zj(r, { eventId: 0 }, { gdprApplies: a ? a.gdprApplies : void 0, tcString: jl() || "" }));
              }
            } else
              hk([N.g.J, N.g.Ea, N.g.N]);
          });
        } catch (c) {
          hl(a), hk([N.g.J, N.g.Ea, N.g.N]), Gj().active = true;
        }
      }
    };
    function hl(a) {
      a.type = "e";
      a.tcString = "tcunavailable";
    }
    function il(a) {
      return "tcloaded" === a.eventStatus || "useractioncomplete" === a.eventStatus || "cmpuishown" === a.eventStatus;
    }
    var fl = function() {
      return true === z.gtag_enable_tcf_support;
    };
    function gl() {
      return true === dl().enableAdvertiserConsentMode;
    }
    var jl = function() {
      var a = dl();
      if (a.active)
        return a.tcString;
    }, ll = function() {
      var a = dl();
      if (a.active && void 0 !== a.gdprApplies)
        return a.gdprApplies ? "1" : "0";
    }, ml = function(a) {
      if (!cl.hasOwnProperty(String(a)))
        return true;
      var b = dl();
      return b.active && b.Xb ? !!b.Xb[String(a)] : true;
    };
    var nl = [N.g.J, N.g.R], ol = [N.g.J, N.g.R, N.g.N, N.g.Ea], pl = {}, ql = (pl[N.g.J] = 1, pl[N.g.R] = 2, pl);
    function rl(a) {
      if (void 0 === a)
        return 0;
      switch (S(a, N.g.ja)) {
        case void 0:
          return 1;
        case false:
          return 3;
        default:
          return 2;
      }
    }
    var sl = function(a) {
      var b = rl(a);
      if (3 === b)
        return false;
      switch (Nj(N.g.Ea)) {
        case 1:
        case 3:
          return true;
        case 2:
          return false;
        case 4:
          return 2 === b;
        case 0:
          return true;
        default:
          return false;
      }
    }, tl = function() {
      return Pj() || !Mj(N.g.J) || !Mj(N.g.R);
    }, ul = function() {
      var a = {}, b;
      for (b in ql)
        ql.hasOwnProperty(b) && (a[ql[b]] = Nj(b));
      var c = R(28) && nl.every(function(e) {
        return Mj(e);
      }), d = R(26);
      return c || d ? Ne(a, 1) : Ne(a, 0);
    }, vl = {}, wl = (vl[N.g.J] = 0, vl[N.g.R] = 1, vl[N.g.N] = 2, vl[N.g.Ea] = 3, vl);
    function xl(a) {
      switch (a) {
        case void 0:
          return 1;
        case true:
          return 3;
        case false:
          return 2;
        default:
          return 0;
      }
    }
    var yl = function(a) {
      for (var b = "1", c = 0; c < ol.length; c++) {
        var d = b, e, f = ol[c], g = Cj[f];
        e = void 0 === g ? 0 : wl.hasOwnProperty(g) ? 12 | wl[g] : 8;
        var h = Gj();
        h.accessedAny = true;
        var m = h.entries[f] || {};
        e = e << 2 | xl(m.implicit);
        b = d + ("" + "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[e] + "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[xl(m.declare) << 4 | xl(m.default) << 2 | xl(m.update)]);
      }
      var n = b, p;
      p = "" + (Pj() << 2 | rl(a));
      return n + p;
    }, zl = function() {
      if (!Mj(N.g.N))
        return "-";
      var a = Gj(), c = a.cps;
      a.usedSetCps;
      var e = {};
      {
        var g = c, h;
        for (h in g)
          g.hasOwnProperty(h) && (e[h] = { enabled: g[h].enabled, region: g[h].region });
      }
      for (var m = {}, n = ea(Object.keys(e)), p = n.next(); !p.done; p = n.next()) {
        var q = p.value;
        m[q] = e[q].enabled;
      }
      for (var r = "", t = ea(Object.keys(pi)), u = t.next(); !u.done; u = t.next()) {
        var v = u.value;
        false !== m[v] && (r += pi[v]);
      }
      return "" === r ? "-" : r;
    }, Al = function() {
      return pj["6"] || (fl() || gl()) && "1" === ll() ? "1" : "0";
    }, Bl = function() {
      return (pj["6"] ? true : !(!fl() && !gl()) && "1" === ll()) || Gj().usedSetCps || !Mj(N.g.N);
    }, Cl = function() {
      var a = "0", b = "0", c;
      var d = dl();
      c = d.active ? d.cmpId : void 0;
      "number" === typeof c && 0 <= c && 4095 >= c && (a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[c >> 6 & 63], b = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[c & 63]);
      var e = "0", f;
      var g = dl();
      f = g.active ? g.tcfPolicyVersion : void 0;
      "number" === typeof f && 0 <= f && 63 >= f && (e = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[f]);
      var h = 0;
      pj["6"] && (h |= 1);
      "1" === ll() && (h |= 2);
      fl() && (h |= 4);
      var m;
      var n = dl();
      m = void 0 !== n.enableAdvertiserConsentMode ? n.enableAdvertiserConsentMode ? "1" : "0" : void 0;
      "1" === m && (h |= 8);
      Gj().waitPeriodTimedOut && (h |= 16);
      return "1" + a + b + e + "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[h];
    };
    var Dl = function(a) {
      var b = 1, c, d, e;
      if (a)
        for (b = 0, d = a.length - 1; 0 <= d; d--)
          e = a.charCodeAt(d), b = (b << 6 & 268435455) + e + (e << 14), c = b & 266338304, b = 0 !== c ? b ^ c >> 21 : b;
      return b;
    };
    var El = function(a, b, c) {
      for (var d = [], e = b.split(";"), f = 0; f < e.length; f++) {
        var g = e[f].split("="), h = g[0].replace(/^\s*|\s*$/g, "");
        if (h && h == a) {
          var m = g.slice(1).join("=").replace(/^\s*|\s*$/g, "");
          m && c && (m = decodeURIComponent(m));
          d.push(m);
        }
      }
      return d;
    };
    var Hl = function(a, b, c, d) {
      return Fl(d) ? El(a, String(b || Gl()), c) : [];
    }, Kl = function(a, b, c, d, e) {
      if (Fl(e)) {
        var f = Il(a, d, e);
        if (1 === f.length)
          return f[0].id;
        if (0 !== f.length) {
          f = Jl(f, function(g) {
            return g.Gf;
          }, b);
          if (1 === f.length)
            return f[0].id;
          f = Jl(f, function(g) {
            return g.Ne;
          }, c);
          return f[0] ? f[0].id : void 0;
        }
      }
    };
    function Ll(a, b, c, d) {
      var e = Gl(), f = window;
      "null" !== f.origin && (f.document.cookie = a);
      var g = Gl();
      return e != g || void 0 != c && 0 <= Hl(b, g, false, d).indexOf(c);
    }
    var Pl = function(a, b, c, d) {
      function e(w, x, y) {
        if (null == y)
          return delete h[x], w;
        h[x] = y;
        return w + "; " + x + "=" + y;
      }
      function f(w, x) {
        if (null == x)
          return delete h[x], w;
        h[x] = true;
        return w + "; " + x;
      }
      if (!Fl(c.Gb))
        return 2;
      var g;
      void 0 == b ? g = a + "=deleted; expires=" + (/* @__PURE__ */ new Date(0)).toUTCString() : (c.encode && (b = encodeURIComponent(b)), b = Ml(b), g = a + "=" + b);
      var h = {};
      g = e(g, "path", c.path);
      var m;
      c.expires instanceof Date ? m = c.expires.toUTCString() : null != c.expires && (m = "" + c.expires);
      g = e(g, "expires", m);
      g = e(g, "max-age", c.Em);
      g = e(
        g,
        "samesite",
        c.Ym
      );
      c.bn && (g = f(g, "secure"));
      var n = c.domain;
      if (n && "auto" === n.toLowerCase()) {
        for (var p = Nl(), q = void 0, r = false, t = 0; t < p.length; ++t) {
          var u = "none" !== p[t] ? p[t] : void 0, v = e(g, "domain", u);
          v = f(v, c.flags);
          try {
            d && d(a, h);
          } catch (w) {
            q = w;
            continue;
          }
          r = true;
          if (!Ol(u, c.path) && Ll(v, a, b, c.Gb))
            return 0;
        }
        if (q && !r)
          throw q;
        return 1;
      }
      n && "none" !== n.toLowerCase() && (g = e(g, "domain", n));
      g = f(g, c.flags);
      d && d(a, h);
      return Ol(n, c.path) ? 1 : Ll(g, a, b, c.Gb) ? 0 : 1;
    }, Ql = function(a, b, c) {
      null == c.path && (c.path = "/");
      c.domain || (c.domain = "auto");
      return Pl(
        a,
        b,
        c
      );
    };
    function Jl(a, b, c) {
      for (var d = [], e = [], f, g = 0; g < a.length; g++) {
        var h = a[g], m = b(h);
        m === c ? d.push(h) : void 0 === f || m < f ? (e = [h], f = m) : m === f && e.push(h);
      }
      return 0 < d.length ? d : e;
    }
    function Il(a, b, c) {
      for (var d = [], e = Hl(a, void 0, void 0, c), f = 0; f < e.length; f++) {
        var g = e[f].split("."), h = g.shift();
        if (!b || -1 !== b.indexOf(h)) {
          var m = g.shift();
          m && (m = m.split("-"), d.push({ id: g.join("."), Gf: 1 * m[0] || 1, Ne: 1 * m[1] || 1 }));
        }
      }
      return d;
    }
    var Ml = function(a) {
      a && 1200 < a.length && (a = a.substring(0, 1200));
      return a;
    }, Rl = /^(www\.)?google(\.com?)?(\.[a-z]{2})?$/, Sl = /(^|\.)doubleclick\.net$/i, Ol = function(a, b) {
      return Sl.test(window.document.location.hostname) || "/" === b && Rl.test(a);
    }, Gl = function() {
      return "null" !== window.origin ? window.document.cookie : "";
    }, Nl = function() {
      var a = [], b = window.document.location.hostname.split(".");
      if (4 === b.length) {
        var c = b[b.length - 1];
        if (parseInt(c, 10).toString() === c)
          return ["none"];
      }
      for (var d = b.length - 2; 0 <= d; d--)
        a.push(b.slice(d).join("."));
      var e = window.document.location.hostname;
      Sl.test(e) || Rl.test(e) || a.push("none");
      return a;
    }, Fl = function(a) {
      return a && zj().h() ? (k(a) ? [a] : a).every(function(b) {
        return Oj(b) && Mj(b);
      }) : true;
    }, Tl = function(a) {
      if (!a)
        return 1;
      a = 0 === a.indexOf(".") ? a.substr(1) : a;
      return a.split(".").length;
    }, Ul = function(a) {
      if (!a || "/" === a)
        return 1;
      "/" !== a[0] && (a = "/" + a);
      "/" !== a[a.length - 1] && (a += "/");
      return a.split("/").length - 1;
    };
    var Vl = function(a) {
      var b = Math.round(2147483647 * Math.random());
      return a ? String(b ^ Dl(a) & 2147483647) : String(b);
    }, Wl = function(a) {
      return [Vl(a), Math.round(Sa() / 1e3)].join(".");
    }, Xl = function(a, b, c, d, e) {
      var f = Tl(b);
      return Kl(a, f, Ul(c), d, e);
    }, Yl = function(a, b, c, d) {
      var e = "" + Tl(c), f = Ul(d);
      1 < f && (e += "-" + f);
      return [b, e, a].join(".");
    };
    var Zl = function() {
      ri.dedupe_gclid || (ri.dedupe_gclid = "" + Wl());
      return ri.dedupe_gclid;
    };
    var bm = function(a, b) {
      var c = am();
      c.pending || (c.pending = []);
      Ia(c.pending, function(d) {
        return d.target.ctid === a.ctid && d.target.isDestination === a.isDestination;
      }) || c.pending.push({ target: a, onLoad: b });
    }, cm = function() {
      this.container = {};
      this.destination = {};
      this.canonical = {};
      this.pending = [];
      this.siloed = [];
    }, am = function() {
      var a = Ec("google_tag_data", {}), b = a.tidr;
      b || (b = new cm(), a.tidr = b);
      return b;
    };
    var dm = {}, Tf = { ctid: "G-3X9EELR6PB", Ef: "123944013", Lj: "G-3X9EELR6PB|GT-MJP8CLN", Mj: "G-3X9EELR6PB" };
    dm.ie = Oa("");
    var hm = function() {
      var a = fm();
      return a;
    }, jm = function() {
      var a = im();
      return a;
    }, lm = function() {
      return km(Tf.ctid);
    }, mm = function() {
      return km(Tf.Ef);
    }, fm = function() {
      return Tf.Lj.split("|");
    }, im = function() {
      return Tf.Mj.split("|");
    }, nm = function(a) {
      var b = am();
      return a.isDestination ? b.destination[a.ctid] : b.container[a.ctid];
    }, km = function(a) {
      return a;
    }, gm = function(a) {
      return "siloed_" + a;
    }, om = function(a) {
      a = String(a);
      return a;
    }, pm = function() {
    };
    function qm() {
      var a = am();
      if (a.pending) {
        for (var b, c = [], d = false, e = hm(), f = jm(), g = {}, h = 0; h < a.pending.length; g = { Oe: void 0 }, h++)
          g.Oe = a.pending[h], Ia(g.Oe.target.isDestination ? f : e, /* @__PURE__ */ function(m) {
            return function(n) {
              return n === m.Oe.target.ctid;
            };
          }(g)) ? d || (b = g.Oe.onLoad, d = true) : c.push(g.Oe);
        a.pending = c;
        if (b)
          try {
            b(mm());
          } catch (m) {
          }
      }
    }
    var rm = function() {
      for (var a = am(), b = hm(), c = 0; c < b.length; c++) {
        var d = a.container[b[c]];
        d ? (d.state = 2, d.containers = hm(), d.destinations = jm()) : a.container[b[c]] = { state: 2, containers: hm(), destinations: jm() };
      }
      for (var e = jm(), f = 0; f < e.length; f++) {
        var g = a.destination[e[f]];
        g && 0 === g.state && L(93);
        g ? (g.state = 2, g.containers = hm(), g.destinations = jm()) : a.destination[e[f]] = { state: 2, containers: hm(), destinations: jm() };
      }
      a.canonical[mm()] = {};
      qm();
    }, sm = function(a) {
      return !!am().container[a];
    }, tm = function(a) {
      var b = am().destination[a];
      return !!b && !!b.state;
    }, um = function() {
      return { ctid: lm(), isDestination: dm.ie };
    };
    function vm(a) {
      var b = am();
      (b.siloed = b.siloed || []).push(a);
    }
    var wm = function() {
      var a = am().container, b;
      for (b in a)
        if (a.hasOwnProperty(b) && 1 === a[b].state)
          return true;
      return false;
    }, xm = function() {
      var a = {};
      l(am().destination, function(b, c) {
        0 === c.state && (a[b] = c);
      });
      return a;
    }, ym = function(a) {
      return !!(a && a.parent && a.context && 1 === a.context.source && 0 !== a.parent.ctid.indexOf("GTM-"));
    };
    var zm = { UA: 1, AW: 2, DC: 3, G: 4, GF: 5, GT: 12, GTM: 14, HA: 6, MC: 7 }, Am = function(a, b) {
      var c = Tf.ctid.split("-")[0].toUpperCase(), d = {};
      d.ctid = Tf.ctid;
      d.Vm = qi.me;
      d.Xm = qi.Ug;
      d.Am = dm.ie ? 2 : 1;
      d.uc = Tf.Ef;
      d.uc !== a && (d.Tf = a);
      R(75) ? d.Xj = 2 : R(76) && (d.Xj = 1);
      xi ? (d.Rf = zm[c], d.Rf || (d.Rf = 0)) : d.Rf = Di ? 13 : 10;
      Bi ? d.Ch = 1 : d.Ch = 3;
      var e;
      var f = d.Rf, g = d.Ch;
      void 0 === f ? e = "" : (g || (g = 0), e = "" + Hg(1, 1) + "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[f << 2 | g]);
      var h = d.Tn, m = 4 + e + (h ? "" + Hg(2, 1) + "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[h] : ""), n, p = d.Xm;
      n = p && Gg.test(p) ? "" + Hg(3, 2) + p : "";
      var q, r = d.Vm;
      q = r ? "" + Hg(4, 1) + "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[r] : "";
      var t;
      var u = d.ctid;
      if (u && b) {
        var v = u.split("-"), w = v[0].toUpperCase();
        if ("GTM" !== w && "OPT" !== w)
          t = "";
        else {
          var x = v[1];
          t = "" + Hg(5, 3) + "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[1 + x.length] + (d.Am || 0) + x;
        }
      } else
        t = "";
      var y = d.Xj, A = d.uc, B = d.Tf, E = d.Yn;
      return m + n + q + t + (y ? "" + Hg(6, 1) + "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[y] : "") + (A ? "" + Hg(7, 3) + "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[A.length] + A : "") + (B ? "" + Hg(8, 3) + "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[B.length] + B : "") + (E ? "" + Hg(9, 3) + "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[E.length] + E : "");
    };
    var Bm = /:[0-9]+$/, Dm = function(a, b, c, d) {
      function e(r) {
        return Sf(10) ? decodeURIComponent(r.replace(/\+/g, " ")) : decodeURIComponent(r).replace(/\+/g, " ");
      }
      for (var f = [], g = ea(a.split("&")), h = g.next(); !h.done; h = g.next()) {
        var m = ea(h.value.split("=")), n = m.next().value, p = ha(m);
        if (e(n) === b) {
          var q = p.join("=");
          if (!c)
            return d ? q : e(q);
          f.push(d ? q : e(q));
        }
      }
      return c ? f : void 0;
    }, Gm = function(a, b, c, d, e) {
      b && (b = String(b).toLowerCase());
      if ("protocol" === b || "port" === b)
        a.protocol = Em(a.protocol) || Em(z.location.protocol);
      "port" === b ? a.port = String(Number(a.hostname ? a.port : z.location.port) || ("http" === a.protocol ? 80 : "https" === a.protocol ? 443 : "")) : "host" === b && (a.hostname = (a.hostname || z.location.hostname).replace(Bm, "").toLowerCase());
      return Fm(a, b, c, d, e);
    }, Fm = function(a, b, c, d, e) {
      var f, g = Em(a.protocol);
      b && (b = String(b).toLowerCase());
      switch (b) {
        case "url_no_fragment":
          f = Hm(a);
          break;
        case "protocol":
          f = g;
          break;
        case "host":
          f = a.hostname.replace(Bm, "").toLowerCase();
          if (c) {
            var h = /^www\d*\./.exec(f);
            h && h[0] && (f = f.substr(h[0].length));
          }
          break;
        case "port":
          f = String(Number(a.port) || ("http" === g ? 80 : "https" === g ? 443 : ""));
          break;
        case "path":
          a.pathname || a.hostname || Ab("TAGGING", 1);
          f = "/" === a.pathname.substr(0, 1) ? a.pathname : "/" + a.pathname;
          var m = f.split("/");
          0 <= (d || []).indexOf(m[m.length - 1]) && (m[m.length - 1] = "");
          f = m.join("/");
          break;
        case "query":
          f = a.search.replace("?", "");
          e && (f = Dm(f, e, false));
          break;
        case "extension":
          var n = a.pathname.split(".");
          f = 1 < n.length ? n[n.length - 1] : "";
          f = f.split("/")[0];
          break;
        case "fragment":
          f = a.hash.replace(
            "#",
            ""
          );
          break;
        default:
          f = a && a.href;
      }
      return f;
    }, Em = function(a) {
      return a ? a.replace(":", "").toLowerCase() : "";
    }, Hm = function(a) {
      var b = "";
      if (a && a.href) {
        var c = a.href.indexOf("#");
        b = 0 > c ? a.href : a.href.substr(0, c);
      }
      return b;
    }, Im = {}, Jm = 0, Lm = function(a) {
      if (Sf(17)) {
        var b = Im[a];
        b || (b = Km(a), 5 > Jm && (Im[a] = b, Jm++));
        return b;
      }
      return Km(a);
    }, Km = function(a) {
      var b = C.createElement("a");
      a && (b.href = a);
      var c = b.pathname;
      "/" !== c[0] && (a || Ab("TAGGING", 1), c = "/" + c);
      var d = b.hostname.replace(Bm, "");
      return {
        href: b.href,
        protocol: b.protocol,
        host: b.host,
        hostname: d,
        pathname: c,
        search: b.search,
        hash: b.hash,
        port: b.port
      };
    };
    function Om(a, b, c, d) {
      var e, f = Number(null != a.Wb ? a.Wb : void 0);
      0 !== f && (e = new Date((b || Sa()) + 1e3 * (f || 7776e3)));
      return { path: a.path, domain: a.domain, flags: a.flags, encode: !!c, expires: e, Gb: d };
    }
    var Pm;
    var Tm = function() {
      var a = Qm, b = Rm, c = Sm(), d = function(g) {
        a(g.target || g.srcElement || {});
      }, e = function(g) {
        b(g.target || g.srcElement || {});
      };
      if (!c.init) {
        Oc(C, "mousedown", d);
        Oc(C, "keyup", d);
        Oc(C, "submit", e);
        var f = HTMLFormElement.prototype.submit;
        HTMLFormElement.prototype.submit = function() {
          b(this);
          f.call(this);
        };
        c.init = true;
      }
    }, Um = function(a, b, c, d, e) {
      var f = { callback: a, domains: b, fragment: 2 === c, placement: c, forms: d, sameHost: e };
      Sm().decorators.push(f);
    }, Vm = function(a, b, c) {
      for (var d = Sm().decorators, e = {}, f = 0; f < d.length; ++f) {
        var g = d[f], h;
        if (h = !c || g.forms)
          a: {
            var m = g.domains, n = a, p = !!g.sameHost;
            if (m && (p || n !== C.location.hostname)) {
              for (var q = 0; q < m.length; q++)
                if (m[q] instanceof RegExp) {
                  if (m[q].test(n)) {
                    h = true;
                    break a;
                  }
                } else if (0 <= n.indexOf(m[q]) || p && 0 <= m[q].indexOf(n)) {
                  h = true;
                  break a;
                }
            }
            h = false;
          }
        if (h) {
          var r = g.placement;
          void 0 == r && (r = g.fragment ? 2 : 1);
          r === b && Wa(e, g.callback());
        }
      }
      return e;
    };
    function Sm() {
      var a = Ec("google_tag_data", {}), b = a.gl;
      b && b.decorators || (b = { decorators: [] }, a.gl = b);
      return b;
    }
    var Wm = /(.*?)\*(.*?)\*(.*)/, Xm = /^https?:\/\/([^\/]*?)\.?cdn\.ampproject\.org\/?(.*)/, Ym = /^(?:www\.|m\.|amp\.)+/, Zm = /([^?#]+)(\?[^#]*)?(#.*)?/;
    function $m(a) {
      var b = Zm.exec(a);
      if (b)
        return { Ih: b[1], query: b[2], fragment: b[3] };
    }
    function an(a, b) {
      var c = [Cc.userAgent, (/* @__PURE__ */ new Date()).getTimezoneOffset(), Cc.userLanguage || Cc.language, Math.floor(Sa() / 60 / 1e3) - (void 0 === b ? 0 : b), a].join("*"), d;
      if (!(d = Pm)) {
        for (var e = Array(256), f = 0; 256 > f; f++) {
          for (var g = f, h = 0; 8 > h; h++)
            g = g & 1 ? g >>> 1 ^ 3988292384 : g >>> 1;
          e[f] = g;
        }
        d = e;
      }
      Pm = d;
      for (var m = 4294967295, n = 0; n < c.length; n++)
        m = m >>> 8 ^ Pm[(m ^ c.charCodeAt(n)) & 255];
      return ((m ^ -1) >>> 0).toString(36);
    }
    function bn() {
      return function(a) {
        var b = Lm(z.location.href), c = b.search.replace("?", ""), d = Dm(c, "_gl", false, true) || "";
        a.query = cn(d) || {};
        var e = Gm(b, "fragment"), f;
        var g = -1;
        if (Ya(e, "_gl="))
          g = 4;
        else {
          var h = e.indexOf("&_gl=");
          0 < h && (g = h + 3 + 2);
        }
        if (0 > g)
          f = void 0;
        else {
          var m = e.indexOf("&", g);
          f = 0 > m ? e.substring(g) : e.substring(g, m);
        }
        a.fragment = cn(f || "") || {};
      };
    }
    var dn = function(a) {
      var b = bn(), c = Sm();
      c.data || (c.data = { query: {}, fragment: {} }, b(c.data));
      var d = {}, e = c.data;
      e && (Wa(d, e.query), a && Wa(d, e.fragment));
      return d;
    }, cn = function(a) {
      try {
        var b = on(a, 3);
        if (void 0 !== b) {
          for (var c = {}, d = b ? b.split("*") : [], e = 0; e + 1 < d.length; e += 2) {
            var f = d[e], g = yb(d[e + 1]);
            c[f] = g;
          }
          Ab("TAGGING", 6);
          return c;
        }
      } catch (h) {
        Ab("TAGGING", 8);
      }
    };
    function on(a, b) {
      if (a) {
        var c;
        a: {
          for (var d = a, e = 0; 3 > e; ++e) {
            var f = Wm.exec(d);
            if (f) {
              c = f;
              break a;
            }
            d = decodeURIComponent(d);
          }
          c = void 0;
        }
        var g = c;
        if (g && "1" === g[1]) {
          var h = g[3], m;
          a: {
            for (var n = g[2], p = 0; p < b; ++p)
              if (n === an(h, p)) {
                m = true;
                break a;
              }
            m = false;
          }
          if (m)
            return h;
          Ab("TAGGING", 7);
        }
      }
    }
    function pn(a, b, c, d, e) {
      function f(p) {
        var q = p, r = new RegExp("(.*?)(^|&)" + a + "=([^&]*)&?(.*)").exec(q), t = q;
        if (r) {
          var u = r[2], v = r[4];
          t = r[1];
          v && (t = t + u + v);
        }
        p = t;
        var w = p.charAt(p.length - 1);
        p && "&" !== w && (p += "&");
        return p + n;
      }
      d = void 0 === d ? false : d;
      e = void 0 === e ? false : e;
      var g = $m(c);
      if (!g)
        return "";
      var h = g.query || "", m = g.fragment || "", n = a + "=" + b;
      d ? 0 !== m.substring(1).length && e || (m = "#" + f(m.substring(1))) : h = "?" + f(h.substring(1));
      return "" + g.Ih + h + m;
    }
    function qn(a, b) {
      function c(n, p, q) {
        var r;
        a: {
          for (var t in n)
            if (n.hasOwnProperty(t)) {
              r = true;
              break a;
            }
          r = false;
        }
        if (r) {
          var u, v = [], w;
          for (w in n)
            if (n.hasOwnProperty(w)) {
              var x = n[w];
              void 0 !== x && x === x && null !== x && "[object Object]" !== x.toString() && (v.push(w), v.push(xb(String(x))));
            }
          var y = v.join("*");
          u = ["1", an(y), y].join("*");
          d ? (Sf(13) || Sf(11) || !p) && rn("_gl", u, a, p, q) : sn("_gl", u, a, p, q);
        }
      }
      var d = "FORM" === (a.tagName || "").toUpperCase(), e = Vm(b, 1, d), f = Vm(b, 2, d), g = Vm(b, 4, d), h = Vm(b, 3, d);
      c(e, false, false);
      c(f, true, false);
      Sf(11) && c(g, true, true);
      for (var m in h)
        h.hasOwnProperty(m) && tn(m, h[m], a);
    }
    function tn(a, b, c) {
      "a" === c.tagName.toLowerCase() ? sn(a, b, c) : "form" === c.tagName.toLowerCase() && rn(a, b, c);
    }
    function sn(a, b, c, d, e) {
      d = void 0 === d ? false : d;
      e = void 0 === e ? false : e;
      var f;
      if (f = c.href) {
        var g;
        if (!(g = !Sf(16) || d)) {
          var h = z.location.href, m = $m(c.href), n = $m(h);
          g = !(m && n && m.Ih === n.Ih && m.query === n.query && m.fragment);
        }
        f = g;
      }
      if (f) {
        var p = pn(a, b, c.href, d, e);
        sc.test(p) && (c.href = p);
      }
    }
    function rn(a, b, c, d, e) {
      d = void 0 === d ? false : d;
      e = void 0 === e ? false : e;
      if (c && c.action) {
        var f = (c.method || "").toLowerCase();
        if ("get" !== f || d) {
          if ("get" === f || "post" === f) {
            var g = pn(a, b, c.action, d, e);
            sc.test(g) && (c.action = g);
          }
        } else {
          for (var h = c.childNodes || [], m = false, n = 0; n < h.length; n++) {
            var p = h[n];
            if (p.name === a) {
              p.setAttribute("value", b);
              m = true;
              break;
            }
          }
          if (!m) {
            var q = C.createElement("input");
            q.setAttribute("type", "hidden");
            q.setAttribute("name", a);
            q.setAttribute("value", b);
            c.appendChild(q);
          }
        }
      }
    }
    function Qm(a) {
      try {
        var b;
        a: {
          for (var c = a, d = 100; c && 0 < d; ) {
            if (c.href && c.nodeName.match(/^a(?:rea)?$/i)) {
              b = c;
              break a;
            }
            c = c.parentNode;
            d--;
          }
          b = null;
        }
        var e = b;
        if (e) {
          var f = e.protocol;
          "http:" !== f && "https:" !== f || qn(e, e.hostname);
        }
      } catch (g) {
      }
    }
    function Rm(a) {
      try {
        if (a.action) {
          var b = Gm(Lm(a.action), "host");
          qn(a, b);
        }
      } catch (c) {
      }
    }
    var un = function(a, b, c, d) {
      Tm();
      Um(a, b, "fragment" === c ? 2 : 1, !!d, false);
    }, vn = function(a, b) {
      Tm();
      Um(a, [Fm(z.location, "host", true)], b, true, true);
    }, wn = function() {
      var a = C.location.hostname, b = Xm.exec(C.referrer);
      if (!b)
        return false;
      var c = b[2], d = b[1], e = "";
      if (c) {
        var f = c.split("/"), g = f[1];
        e = "s" === g ? decodeURIComponent(f[2]) : decodeURIComponent(g);
      } else if (d) {
        if (0 === d.indexOf("xn--"))
          return false;
        e = d.replace(/-/g, ".").replace(/\.\./g, "-");
      }
      var h = a.replace(Ym, ""), m = e.replace(Ym, ""), n;
      if (!(n = h === m)) {
        var p = "." + m;
        n = h.substring(
          h.length - p.length,
          h.length
        ) === p;
      }
      return n;
    }, xn = function(a, b) {
      return false === a ? false : a || b || wn();
    };
    var On = /^[\w-]+$/;
    var $n = function() {
      var a = Lm(z.location.href), b = Gm(a, "query", false, void 0, "gclid"), c = Gm(a, "query", false, void 0, "gclsrc"), d = Gm(a, "query", false, void 0, "wbraid"), e = Gm(a, "query", false, void 0, "dclid");
      if (!b || !c || !d) {
        var f = a.hash.replace("#", "");
        b = b || Dm(f, "gclid", false);
        c = c || Dm(f, "gclsrc", false);
        d = d || Dm(f, "wbraid", false);
      }
      return Zn(b, c, e, d);
    }, Zn = function(a, b, c, d) {
      var e = {}, f = function(g, h) {
        e[h] || (e[h] = []);
        e[h].push(g);
      };
      e.gclid = a;
      e.gclsrc = b;
      e.dclid = c;
      void 0 !== d && On.test(d) && (e.wbraid = d, f(d, "gb"));
      if (void 0 !== a && a.match(On))
        switch (b) {
          case void 0:
            f(
              a,
              "aw"
            );
            break;
          case "aw.ds":
            f(a, "aw");
            f(a, "dc");
            break;
          case "ds":
            f(a, "dc");
            break;
          case "3p.ds":
            f(a, "dc");
            break;
          case "gf":
            f(a, "gf");
            break;
          case "ha":
            f(a, "ha");
        }
      c && f(c, "dc");
      return e;
    };
    function jo(a, b) {
      for (var c = 0; c < b.length; ++c)
        if (a[b[c]])
          return true;
      return false;
    }
    var ko = function(a) {
      function b(e, f, g) {
        g && (e[f] = g);
      }
      if (Pj()) {
        var c = $n();
        if (jo(c, a)) {
          var d = {};
          b(d, "gclid", c.gclid);
          b(d, "dclid", c.dclid);
          b(d, "gclsrc", c.gclsrc);
          b(d, "wbraid", c.wbraid);
          vn(function() {
            return d;
          }, 3);
          vn(function() {
            var e = {};
            return e._up = "1", e;
          }, 1);
        }
      }
    }, lo = function(a) {
      if (!Sf(11))
        return null;
      var b = dn(true).gad_source;
      if (null != b)
        return z.location.hash = "", b;
      if (Sf(12)) {
        var c = Lm(z.location.href);
        b = Gm(c, "query", false, void 0, "gad_source");
        if (null != b)
          return b;
        var d = $n();
        if (jo(d, a))
          return "0";
      }
      return null;
    }, mo = function(a) {
      var b = lo(a);
      null != b && vn(function() {
        var c = {};
        return c.gad_source = b, c;
      }, 4);
    };
    var wo = /[A-Z]+/, xo = /\s/, yo = function(a, b) {
      if (k(a)) {
        a = Qa(a);
        var c = a.indexOf("-");
        if (!(0 > c)) {
          var d = a.substring(0, c);
          if (wo.test(d)) {
            var e = a.substring(c + 1), f;
            if (b) {
              var g = function(n) {
                var p = n.indexOf("/");
                return 0 > p ? [n] : [n.substring(0, p), n.substring(p + 1)];
              };
              f = g(e);
              if ("DC" === d && 2 === f.length) {
                var h = g(f[1]);
                2 === h.length && (f[1] = h[0], f.push(h[1]));
              }
            } else {
              f = e.split("/");
              for (var m = 0; m < f.length; m++)
                if (!f[m] || xo.test(f[m]) && ("AW" !== d || 1 !== m))
                  return;
            }
            return { id: a, prefix: d, da: d + "-" + f[0], P: f };
          }
        }
      }
    }, Ao = function(a, b) {
      for (var c = {}, d = 0; d < a.length; ++d) {
        var e = yo(a[d], b);
        e && (c[e.id] = e);
      }
      zo(c);
      var f = [];
      l(c, function(g, h) {
        f.push(h);
      });
      return f;
    };
    function zo(a) {
      var b = [], c;
      for (c in a)
        if (a.hasOwnProperty(c)) {
          var d = a[c];
          "AW" === d.prefix && d.P[1] && b.push(d.da);
        }
      for (var e = 0; e < b.length; ++e)
        delete a[b[e]];
    }
    var Bo = function(a, b, c, d) {
      var e = Lc(), f;
      if (1 === e)
        a: {
          var g = Fi;
          g = g.toLowerCase();
          for (var h = "https://" + g, m = "http://" + g, n = 1, p = C.getElementsByTagName("script"), q = 0; q < p.length && 100 > q; q++) {
            var r = p[q].src;
            if (r) {
              r = r.toLowerCase();
              if (0 === r.indexOf(m)) {
                f = 3;
                break a;
              }
              1 === n && 0 === r.indexOf(h) && (n = 2);
            }
          }
          f = n;
        }
      else
        f = e;
      return (2 === f || d || "http:" != z.location.protocol ? a : b) + c;
    };
    var No, Oo = false;
    function Po() {
      Oo = true;
      No = No || {};
    }
    var Qo = function(a) {
      Oo || Po();
      return No[a];
    };
    var Ro = function(a, b, c) {
      this.target = a;
      this.eventName = b;
      this.o = c;
      this.h = {};
      this.metadata = nb(c.eventMetadata || {});
      this.isAborted = false;
    };
    Ro.prototype.copyToHitData = function(a, b, c) {
      var d = S(this.o, a);
      void 0 === d && (d = b);
      if (void 0 !== d && void 0 !== c && k(d) && R(53))
        try {
          d = c(d);
        } catch (e) {
        }
      void 0 !== d && (this.h[a] = d);
    };
    var So = function(a) {
      return a.metadata.source_canonical_id;
    }, To = function(a, b, c) {
      var d = Qo(a.target.da);
      return d && d.hasOwnProperty(b) ? d[b] : c;
    };
    function Uo(a) {
      return { getDestinationId: function() {
        return a.target.da;
      }, getEventName: function() {
        return a.eventName;
      }, setEventName: function(b) {
        a.eventName = b;
      }, getHitData: function(b) {
        return a.h[b];
      }, setHitData: function(b, c) {
        a.h[b] = c;
      }, setHitDataIfNotDefined: function(b, c) {
        void 0 === a.h[b] && (a.h[b] = c);
      }, copyToHitData: function(b, c) {
        a.copyToHitData(b, c);
      }, getMetadata: function(b) {
        return a.metadata[b];
      }, setMetadata: function(b, c) {
        a.metadata[b] = c;
      }, isAborted: function() {
        return a.isAborted;
      }, abort: function() {
        a.isAborted = true;
      }, getFromEventContext: function(b) {
        return S(a.o, b);
      }, Dj: function() {
        return a;
      }, getHitKeys: function() {
        return Object.keys(a.h);
      } };
    }
    var Wo = function(a) {
      var b = Vo[a.target.da];
      if (!a.isAborted && b)
        for (var c = Uo(a), d = 0; d < b.length; ++d) {
          try {
            b[d](c);
          } catch (e) {
            a.isAborted = true;
          }
          if (a.isAborted)
            break;
        }
    }, Xo = function(a, b) {
      var c = Vo[a];
      c || (c = Vo[a] = []);
      c.push(b);
    }, Vo = {};
    function ap(a, b) {
      if (a) {
        var c = "" + a;
        0 !== c.indexOf("http://") && 0 !== c.indexOf("https://") && (c = "https://" + c);
        "/" === c[c.length - 1] && (c = c.substring(0, c.length - 1));
        return Lm("" + c + b).href;
      }
    }
    function bp() {
      return !!qi.zf && "SGTM_TOKEN" !== qi.zf.split("@@").join("");
    }
    function cp(a) {
      for (var b = ea([N.g.Sd, N.g.Pb]), c = b.next(); !c.done; c = b.next()) {
        var d = S(a, c.value);
        if (d)
          return d;
      }
    }
    var dp = function(a) {
      var b = String(a[Oe.na] || "").replace(/_/g, "");
      0 === b.indexOf("cvt") && (b = "cvt");
      return b;
    }, ep = 0 <= z.location.search.indexOf("?gtm_latency=") || 0 <= z.location.search.indexOf("&gtm_latency=");
    var fp = { sampleRate: "0.005000", hk: "", gk: Number("5"), ao: Number("") }, gp = [];
    function hp(a) {
      gp.push(a);
    }
    var ip = false, jp;
    if (!(jp = ep)) {
      var kp = Math.random(), lp = fp.sampleRate;
      jp = kp < Number(lp);
    }
    var mp = jp, np = "https://www.googletagmanager.com/a?id=" + Tf.ctid, op = void 0, pp = {}, qp = void 0, rp = new function() {
      var a = 5;
      0 < fp.gk && (a = fp.gk);
      this.h = 0;
      this.C = [];
      this.s = a;
    }(), sp = 1e3;
    function tp(a, b) {
      var c = op;
      if (void 0 === c)
        if (b)
          c = Li();
        else
          return "";
      for (var d = [np], e = 0; e < gp.length; e++) {
        var f = gp[e]({ eventId: c, Zb: !!a, Vj: function() {
          ip = true;
        } });
        "&" === f[0] && d.push(f);
      }
      d.push("&z=0");
      return d.join("");
    }
    function up() {
      qp && (z.clearTimeout(qp), qp = void 0);
      if (void 0 !== op && vp) {
        var a;
        (a = pp[op]) || (a = rp.h < rp.s ? false : 1e3 > Sa() - rp.C[rp.h % rp.s]);
        if (a || 0 >= sp--)
          L(1), pp[op] = true;
        else {
          var b = rp.h++ % rp.s;
          rp.C[b] = Sa();
          var c = tp(true);
          Nc(c);
          if (ip) {
            var d = c.replace("/a?", "/td?");
            Nc(d);
          }
          vp = ip = false;
        }
      }
    }
    var vp = false;
    function wp(a) {
      pp[a] || (a !== op && (up(), op = a), vp = true, qp || (qp = z.setTimeout(up, 500)), 2022 <= tp().length && up());
    }
    var xp = Ja();
    function yp() {
      xp = Ja();
    }
    function zp() {
      return ["&v=3&t=t", "&pid=" + xp].join("");
    }
    var Ap = "", Bp = [];
    function Cp(a) {
      var b = "";
      Ap && (b = "&dl=" + encodeURIComponent(Ap));
      0 < Bp.length && (b += "&tdp=" + Bp.join("."));
      a.Zb && (Ap = "", Bp.length = 0, b && a.Vj());
      return b;
    }
    var Dp = [];
    function Ep(a) {
      if (!Dp.length)
        return "";
      var b = "&tdc=" + Dp.join("!");
      a.Zb && (a.Vj(), Dp.length = 0);
      return b;
    }
    var Fp = { initialized: 11, complete: 12, interactive: 13 }, Gp = {}, Hp = Object.freeze((Gp[N.g.Sa] = true, Gp)), Ip = 0 <= C.location.search.indexOf("?gtm_diagnostics=") || 0 <= C.location.search.indexOf("&gtm_diagnostics="), Kp = function(a, b, c) {
      if (mp && "config" === a && !(1 < yo(b).P.length)) {
        var d, e = Ec("google_tag_data", {});
        e.td || (e.td = {});
        d = e.td;
        var f = nb(c.F);
        nb(c.h, f);
        var g = [], h;
        for (h in d) {
          var m = Jp(d[h], f);
          m.length && (Ip && console.log(m), g.push(h));
        }
        g.length && (g.length && mp && Dp.push(b + "*" + g.join(".")), Ab("TAGGING", Fp[C.readyState] || 14));
        d[b] = f;
      }
    };
    function Lp(a, b) {
      var c = {}, d;
      for (d in b)
        b.hasOwnProperty(d) && (c[d] = true);
      for (var e in a)
        a.hasOwnProperty(e) && (c[e] = true);
      return c;
    }
    function Jp(a, b, c, d) {
      c = void 0 === c ? {} : c;
      d = void 0 === d ? "" : d;
      if (a === b)
        return [];
      var e = function(q, r) {
        var t = r[q];
        return void 0 === t ? Hp[q] : t;
      }, f;
      for (f in Lp(a, b)) {
        var g = (d ? d + "." : "") + f, h = e(f, a), m = e(f, b), n = "object" === jb(h) || "array" === jb(h), p = "object" === jb(m) || "array" === jb(m);
        if (n && p)
          Jp(h, m, c, g);
        else if (n || p || h !== m)
          c[g] = true;
      }
      return Object.keys(c);
    }
    var Mp = {};
    function Np(a, b, c) {
      mp && void 0 !== a && (Mp[a] = Mp[a] || [], Mp[a].push(c + b), wp(a));
    }
    function Op(a) {
      var b = a.eventId, c = a.Zb, d = "", e = Mp[b] || [];
      e.length && (d += "&epr=" + e.join("."));
      c && delete Mp[b];
      return d;
    }
    var Qp = function(a, b) {
      var c = yo(km(a), true);
      c && Pp.register(c, b);
    }, Rp = function(a, b, c, d) {
      var e = yo(c, d.isGtmEvent);
      e && Pp.push("event", [b, a], e, d);
    }, Sp = function(a, b, c, d) {
      var e = yo(c, d.isGtmEvent);
      e && Pp.push("get", [a, b], e, d);
    }, Up = function(a) {
      var b = yo(km(a), true), c;
      b ? c = Tp(Pp, b).h : c = {};
      return c;
    }, Vp = function(a, b) {
      var c = yo(km(a), true);
      if (c) {
        var d = Pp, e = nb(b);
        nb(Tp(d, c).h, e);
        Tp(d, c).h = e;
      }
    }, Wp = function() {
      this.status = 1;
      this.M = {};
      this.h = {};
      this.s = {};
      this.X = null;
      this.F = {};
      this.C = false;
    }, Xp = function(a, b, c, d) {
      var e = Sa();
      this.type = a;
      this.C = e;
      this.h = b;
      this.s = c;
      this.messageContext = d;
    }, Yp = function() {
      this.s = {};
      this.C = {};
      this.h = [];
    }, Tp = function(a, b) {
      var c = b.da;
      return a.s[c] = a.s[c] || new Wp();
    }, Zp = function(a, b, c, d) {
      if (d.h) {
        var e = Tp(a, d.h), f = e.X;
        if (f) {
          var g = nb(c), h = nb(e.M[d.h.id]), m = nb(e.F), n = nb(e.h), p = nb(a.C), q = {};
          if (mp)
            try {
              q = nb(Pi);
            } catch (v) {
              L(72);
            }
          var r = d.h.prefix, t = function(v) {
            Np(d.messageContext.eventId, r, v);
          }, u = yk(xk(wk(vk(
            uk(sk(rk(tk(qk(pk(ok(new nk(d.messageContext.eventId, d.messageContext.priorityId), g), h), m), n), p), q), d.messageContext.eventMetadata),
            function() {
              if (t) {
                var v = t;
                t = void 0;
                v("2");
                if (d.messageContext.onSuccess)
                  d.messageContext.onSuccess();
              }
            }
          ), function() {
            if (t) {
              var v = t;
              t = void 0;
              v("3");
              if (d.messageContext.onFailure)
                d.messageContext.onFailure();
            }
          }), !!d.messageContext.isGtmEvent));
          try {
            Np(d.messageContext.eventId, r, "1"), Kp(d.type, d.h.id, u), f(d.h.id, b, d.C, u);
          } catch (v) {
            Np(d.messageContext.eventId, r, "4");
          }
        }
      }
    };
    Yp.prototype.register = function(a, b, c) {
      var d = Tp(this, a);
      3 !== d.status && (d.X = b, d.status = 3, c && (nb(d.h, c), d.h = c), this.flush());
    };
    Yp.prototype.push = function(a, b, c, d) {
      void 0 !== c && (1 === Tp(this, c).status && (Tp(this, c).status = 2, this.push("require", [{}], c, {})), Tp(this, c).C && (d.deferrable = false));
      this.h.push(new Xp(a, c, b, d));
      d.deferrable || this.flush();
    };
    Yp.prototype.flush = function(a) {
      for (var b = this, c = [], d = false, e = {}; this.h.length; e = { vc: void 0, lh: void 0 }) {
        var f = this.h[0], g = f.h;
        if (f.messageContext.deferrable)
          !g || Tp(this, g).C ? (f.messageContext.deferrable = false, this.h.push(f)) : c.push(f), this.h.shift();
        else {
          switch (f.type) {
            case "require":
              if (3 !== Tp(this, g).status && !a) {
                this.h.push.apply(this.h, c);
                return;
              }
              break;
            case "set":
              l(f.s[0], function(r, t) {
                nb($a(r, t), b.C);
              });
              break;
            case "config":
              var h = Tp(this, g);
              e.vc = {};
              l(f.s[0], /* @__PURE__ */ function(r) {
                return function(t, u) {
                  nb($a(t, u), r.vc);
                };
              }(e));
              var m = !!e.vc[N.g.Qb];
              delete e.vc[N.g.Qb];
              var n = g.da === g.id;
              m || (n ? h.F = {} : h.M[g.id] = {});
              h.C && m || Zp(this, N.g.sa, e.vc, f);
              h.C = true;
              n ? nb(e.vc, h.F) : (nb(e.vc, h.M[g.id]), L(70));
              d = true;
              break;
            case "event":
              e.lh = {};
              l(f.s[0], /* @__PURE__ */ function(r) {
                return function(t, u) {
                  nb($a(t, u), r.lh);
                };
              }(e));
              Zp(this, f.s[1], e.lh, f);
              break;
            case "get":
              var p = {}, q = (p[N.g.lb] = f.s[0], p[N.g.wb] = f.s[1], p);
              Zp(this, N.g.Pa, q, f);
          }
          this.h.shift();
          $p(this, f);
        }
      }
      this.h.push.apply(this.h, c);
      d && this.flush();
    };
    var $p = function(a, b) {
      if ("require" !== b.type) {
        if (b.h)
          for (var c = Tp(a, b.h).s[b.type] || [], d = 0; d < c.length; d++)
            c[d]();
        else
          for (var e in a.s)
            if (a.s.hasOwnProperty(e)) {
              var f = a.s[e];
              if (f && f.s)
                for (var g = f.s[b.type] || [], h = 0; h < g.length; h++)
                  g[h]();
            }
      }
    }, Pp = new Yp();
    var pq = function() {
      function a(b) {
        ri.pscdl = b;
      }
      if (void 0 === ri.pscdl)
        try {
          "cookieDeprecationLabel" in Cc ? (a("pending"), Cc.cookieDeprecationLabel.getValue().then(a)) : a("noapi");
        } catch (b) {
          a("error");
        }
    };
    function tq(a) {
      var b = S(a.o, N.g.yb), c = S(a.o, N.g.Lb);
      b && !c ? (a.eventName !== N.g.sa && a.eventName !== N.g.xd && L(131), a.isAborted = true) : !b && c && (L(132), a.isAborted = true);
    }
    function uq(a) {
      var b = ck(N.g.J) ? ri.pscdl : "denied";
      a.h[N.g.af] = b;
    }
    var wq = /^(www\.)?google(\.com?)?(\.[a-z]{2}t?)?$/, xq = /^www.googleadservices.com$/, zq = function(a) {
      a || (a = yq());
      return a.rn ? false : a.am || a.bm || a.dm || a.rh || a.If || a.Kl || a.Sl ? true : false;
    }, yq = function() {
      var a = {}, b = dn(true);
      a.rn = !!b._up;
      var c = $n();
      a.am = void 0 !== c.aw;
      a.bm = void 0 !== c.dc;
      a.dm = void 0 !== c.wbraid;
      var d = Lm(z.location.href), e = Gm(d, "query", false, void 0, "gad");
      a.rh = void 0 !== e;
      if (!a.rh) {
        var f = d.hash.replace("#", ""), g = Dm(f, "gad", false);
        a.rh = void 0 !== g;
      }
      a.If = void 0;
      if (R(61)) {
        var h = Gm(d, "query", false, void 0, "gad_source");
        a.If = h;
        if (void 0 === a.If) {
          var m = d.hash.replace("#", ""), n = Dm(m, "gad_source", false);
          a.If = n;
        }
      }
      var p = C.referrer ? Gm(Lm(C.referrer), "host") : "";
      a.Sl = wq.test(p);
      a.Kl = xq.test(p);
      return a;
    };
    var Aq = function() {
      var a = z.screen;
      return { width: a ? a.width : 0, height: a ? a.height : 0 };
    }, Bq = function(a) {
      if (C.hidden)
        return true;
      var b = a.getBoundingClientRect();
      if (b.top == b.bottom || b.left == b.right || !z.getComputedStyle)
        return true;
      var c = z.getComputedStyle(a, null);
      if ("hidden" === c.visibility)
        return true;
      for (var d = a, e = c; d; ) {
        if ("none" === e.display)
          return true;
        var f = e.opacity, g = e.filter;
        if (g) {
          var h = g.indexOf("opacity(");
          0 <= h && (g = g.substring(h + 8, g.indexOf(")", h)), "%" == g.charAt(g.length - 1) && (g = g.substring(0, g.length - 1)), f = Math.min(
            g,
            f
          ));
        }
        if (void 0 !== f && 0 >= f)
          return true;
        (d = d.parentElement) && (e = z.getComputedStyle(d, null));
      }
      return false;
    };
    var Lq = function(a, b, c) {
      var d = a.element, e = { U: a.U, type: a.ma, tagName: d.tagName };
      b && (e.querySelector = Kq(d));
      c && (e.isVisible = !Bq(d));
      return e;
    }, Mq = function(a, b, c) {
      return Lq({ element: a.element, U: a.U, ma: "1" }, b, c);
    }, Nq = function(a) {
      var b = !!a.md + "." + !!a.nd;
      a && a.ue && a.ue.length && (b += "." + a.ue.join("."));
      a && a.ob && (b += "." + a.ob.email + "." + a.ob.phone + "." + a.ob.address);
      return b;
    }, Qq = function(a) {
      if (0 != a.length) {
        var b;
        b = Oq(a, function(c) {
          return !Pq.test(c.U);
        });
        b = Oq(b, function(c) {
          return "INPUT" === c.element.tagName.toUpperCase();
        });
        b = Oq(b, function(c) {
          return !Bq(c.element);
        });
        return b[0];
      }
    }, Rq = function(a, b) {
      if (!b || 0 === b.length)
        return a;
      for (var c = [], d = 0; d < a.length; d++) {
        for (var e = true, f = 0; f < b.length; f++) {
          var g = b[f];
          if (g && zh(a[d].element, g)) {
            e = false;
            break;
          }
        }
        e && c.push(a[d]);
      }
      return c;
    }, Oq = function(a, b) {
      if (1 >= a.length)
        return a;
      var c = a.filter(b);
      return 0 == c.length ? a : c;
    }, Kq = function(a) {
      var b;
      if (a === C.body)
        b = "body";
      else {
        var c;
        if (a.id)
          c = "#" + a.id;
        else {
          var d;
          if (a.parentElement) {
            var e;
            a: {
              var f = a.parentElement;
              if (f) {
                for (var g = 0; g < f.childElementCount; g++)
                  if (f.children[g] === a) {
                    e = g + 1;
                    break a;
                  }
                e = -1;
              } else
                e = 1;
            }
            d = Kq(a.parentElement) + ">:nth-child(" + e + ")";
          } else
            d = "";
          c = d;
        }
        b = c;
      }
      return b;
    }, Tq = function(a) {
      for (var b = [], c = 0; c < a.length; c++) {
        var d = a[c], e = d.textContent;
        "INPUT" === d.tagName.toUpperCase() && d.value && (e = d.value);
        if (e) {
          var f = e.match(Sq);
          if (f) {
            var g = f[0], h;
            if (z.location) {
              var m = Fm(z.location, "host", true);
              h = 0 <= g.toLowerCase().indexOf(m);
            } else
              h = false;
            h || b.push({ element: d, U: g });
          }
        }
      }
      return b;
    }, Xq = function() {
      var a = [], b = C.body;
      if (!b)
        return { elements: a, status: "4" };
      for (var c = b.querySelectorAll("*"), d = 0; d < c.length && 1e4 > d; d++) {
        var e = c[d];
        if (!(0 <= Uq.indexOf(e.tagName.toUpperCase())) && e.children instanceof HTMLCollection) {
          for (var f = false, g = 0; g < e.childElementCount && 1e4 > g; g++)
            if (!(0 <= Vq.indexOf(e.children[g].tagName.toUpperCase()))) {
              f = true;
              break;
            }
          (!f || R(30) && -1 !== Wq.indexOf(e.tagName)) && a.push(e);
        }
      }
      return { elements: a, status: 1e4 < c.length ? "2" : "1" };
    };
    var Sq = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i, Pq = /support|noreply/i, Uq = "SCRIPT STYLE IMG SVG PATH BR NOSCRIPT TEXTAREA".split(" "), Vq = ["BR"], ar = {}, Wq = ["INPUT", "SELECT"];
    var tr = function(a) {
      a = a || { md: true, nd: true };
      a.ob = a.ob || { email: true, phone: false, address: false };
      var b = Nq(a), c = ar[b];
      if (c && 200 > Sa() - c.timestamp)
        return c.result;
      var d = Xq(), e = d.status, f = [], g, h, m = [];
      if (!R(30)) {
        if (a.ob && a.ob.email) {
          var n = Tq(d.elements);
          f = Rq(n, a && a.ue);
          g = Qq(f);
          10 < n.length && (e = "3");
        }
        !a.Th && g && (f = [g]);
        for (var p = 0; p < f.length; p++)
          m.push(Mq(f[p], a.md, a.nd));
        m = m.slice(0, 10);
      } else if (a.ob)
        ;
      g && (h = Mq(g, a.md, a.nd));
      var E = { elements: m, Mh: h, status: e };
      ar[b] = { timestamp: Sa(), result: E };
      return E;
    };
    Ja();
    function Qr(a) {
    }
    function Ur(a, b, c, d) {
    }
    function Xr(a) {
      var b = "";
      return b;
    }
    bc();
    Ek() || Zb("iPod");
    Zb("iPad");
    !Zb("Android") || cc() || bc() || ac() || Zb("Silk");
    cc();
    !Zb("Safari") || cc() || ($b() ? 0 : Zb("Coast")) || ac() || ($b() ? 0 : Zb("Edge")) || ($b() ? Yb("Microsoft Edge") : Zb("Edg/")) || ($b() ? Yb("Opera") : Zb("OPR")) || bc() || Zb("Silk") || Zb("Android") || Fk();
    Object.freeze(new function() {
    }());
    Object.freeze(new function() {
    }());
    var bs = "platform platformVersion architecture model uaFullVersion bitness fullVersionList wow64".split(" ");
    function cs(a) {
      var b;
      return null != (b = a.google_tag_data) ? b : a.google_tag_data = {};
    }
    function ds() {
      var a = z.google_tag_data, b;
      if (null != a && a.uach) {
        var c = a.uach, d = Object.assign({}, c);
        c.fullVersionList && (d.fullVersionList = c.fullVersionList.slice(0));
        b = d;
      } else
        b = null;
      return b;
    }
    function es() {
      var a, b;
      return null != (b = null == (a = z.google_tag_data) ? void 0 : a.uach_promise) ? b : null;
    }
    function fs(a) {
      var b, c;
      return "function" === typeof (null == (b = a.navigator) ? void 0 : null == (c = b.userAgentData) ? void 0 : c.getHighEntropyValues);
    }
    function gs() {
      var a = z;
      if (!fs(a))
        return null;
      var b = cs(a);
      if (b.uach_promise)
        return b.uach_promise;
      var c = a.navigator.userAgentData.getHighEntropyValues(bs).then(function(d) {
        null != b.uach || (b.uach = d);
        return d;
      });
      return b.uach_promise = c;
    }
    var hs, is = function() {
      if (fs(z) && (hs = Sa(), !es())) {
        var a = gs();
        a && (a.then(function() {
          L(95);
        }), a.catch(function() {
          L(96);
        }));
      }
    }, ks = function(a) {
      var b = js.pn, c = function(g, h) {
        try {
          a(g, h);
        } catch (m) {
        }
      }, d = ds();
      if (d)
        c(d);
      else {
        var e = es();
        if (e) {
          b = Math.min(Math.max(isFinite(b) ? b : 0, 0), 1e3);
          var f = z.setTimeout(function() {
            c.He || (c.He = true, L(106), c(null, Error("Timeout")));
          }, b);
          e.then(function(g) {
            c.He || (c.He = true, L(104), z.clearTimeout(f), c(g));
          }).catch(function(g) {
            c.He || (c.He = true, L(105), z.clearTimeout(f), c(null, g));
          });
        } else
          c(null);
      }
    }, ls = function(a, b) {
      a && (b.h[N.g.Wd] = a.architecture, b.h[N.g.Xd] = a.bitness, a.fullVersionList && (b.h[N.g.Yd] = a.fullVersionList.map(function(c) {
        return encodeURIComponent(c.brand || "") + ";" + encodeURIComponent(c.version || "");
      }).join("|")), b.h[N.g.Zd] = a.mobile ? "1" : "0", b.h[N.g.ae] = a.model, b.h[N.g.be] = a.platform, b.h[N.g.ce] = a.platformVersion, b.h[N.g.de] = a.wow64 ? "1" : "0");
    };
    function ms() {
      return "attribution-reporting";
    }
    function ns(a) {
      var b;
      b = void 0 === b ? document : b;
      var c;
      return !(null == (c = b.featurePolicy) || !c.allowedFeatures().includes(a));
    }
    var os = false;
    function ps() {
      if (ns("join-ad-interest-group") && Fa(Cc.joinAdInterestGroup))
        return true;
      os || (Nk("AymqwRC7u88Y4JPvfIF2F37QKylC04248hLCdJAsh8xgOfe/dVJPV3XS3wLFca1ZMVOtnBfVjaCMTVudWM//5g4AAAB7eyJvcmlnaW4iOiJodHRwczovL3d3dy5nb29nbGV0YWdtYW5hZ2VyLmNvbTo0NDMiLCJmZWF0dXJlIjoiUHJpdmFjeVNhbmRib3hBZHNBUElzIiwiZXhwaXJ5IjoxNjk1MTY3OTk5LCJpc1RoaXJkUGFydHkiOnRydWV9"), os = true);
      return ns("join-ad-interest-group") && Fa(Cc.joinAdInterestGroup);
    }
    function qs(a, b) {
      var c = void 0;
      try {
        c = C.querySelector('iframe[data-tagging-id="' + b + '"]');
      } catch (e) {
      }
      if (c) {
        var d = Number(c.dataset.loadTime);
        if (d && 6e4 > Sa() - d) {
          Ab("TAGGING", 9);
          return;
        }
        try {
          c.parentNode.removeChild(c);
        } catch (e) {
        }
        c = void 0;
      } else
        try {
          if (50 <= C.querySelectorAll('iframe[allow="join-ad-interest-group"][data-tagging-id*="-"]').length) {
            Ab("TAGGING", 10);
            return;
          }
        } catch (e) {
        }
      Mc(a, void 0, { allow: "join-ad-interest-group" }, { taggingId: b, loadTime: Sa() }, c);
    }
    function rs() {
      return "https://td.doubleclick.net";
    }
    var Fs = function() {
      if (Fa(z.__uspapi)) {
        var a = "";
        try {
          z.__uspapi("getUSPData", 1, function(b, c) {
            if (c && b) {
              var d = b.uspString;
              d && RegExp("^[\\da-zA-Z-]{1,20}$").test(d) && (a = d);
            }
          });
        } catch (b) {
        }
        return a;
      }
    };
    function ut() {
      function a(c, d) {
        var e = Cb(d);
        e && b.push(c + "=" + e);
      }
      var b = [];
      a("&u", "GTM");
      a("&ut", "TAGGING");
      a("&h", "HEALTH");
      return b.join("");
    }
    var du = function(a, b) {
    }, fu = function(a, b) {
    }, gu = function(a, b) {
    };
    function Ku(a, b) {
      if (data.entities && data.entities[a])
        return data.entities[a][b];
    }
    var Mu = function(a, b, c) {
      c = void 0 === c ? false : c;
      var d = Lu(a);
      d.entity.push(b);
      d._entity || (d._entity = { internal: [], external: [] });
      c ? d._entity.external.push(b) : d._entity.internal.push(b);
    }, Nu = function() {
      var a = Lu(mm());
      if (R(97)) {
        var b, c;
        return [].concat(ia((null == a ? void 0 : null == (b = a._entity) ? void 0 : b.internal) || []), ia((null == a ? void 0 : null == (c = a._entity) ? void 0 : c.external) || []));
      }
      return a.entity;
    }, Ou = function(a, b, c) {
      c = void 0 === c ? false : c;
      var d = Lu(a);
      d.event && (d.event.push(b), d._event || (d._event = { internal: [], external: [] }), c ? d._event.external.push(b) : d._event.internal.push(b));
    }, Pu = function() {
      var a = Lu(mm());
      if (R(97)) {
        var b, c;
        return [].concat(ia((null == a ? void 0 : null == (b = a._event) ? void 0 : b.internal) || []), ia((null == a ? void 0 : null == (c = a._event) ? void 0 : c.external) || []));
      }
      return a.event || [];
    };
    function Lu(a) {
      var b, c = ri.r;
      c || (c = { container: {} }, ri.r = c);
      b = c;
      var d = b.container[a];
      d || (d = { entity: [], event: [], _entity: { internal: [], external: [] }, _event: { internal: [], external: [] } }, b.container[a] = d);
      return d;
    }
    var Qu = new RegExp(/^(.*\.)?(google|youtube|blogger|withgoogle)(\.com?)?(\.[a-z]{2})?\.?$/), Ru = { cl: ["ecl"], customPixels: ["nonGooglePixels"], ecl: ["cl"], ehl: ["hl"], gaawc: ["googtag"], hl: ["ehl"], html: ["customScripts", "customPixels", "nonGooglePixels", "nonGoogleScripts", "nonGoogleIframes"], customScripts: ["html", "customPixels", "nonGooglePixels", "nonGoogleScripts", "nonGoogleIframes"], nonGooglePixels: [], nonGoogleScripts: ["nonGooglePixels"], nonGoogleIframes: ["nonGooglePixels"] }, Su = { cl: ["ecl"], customPixels: [
      "customScripts",
      "html"
    ], ecl: ["cl"], ehl: ["hl"], gaawc: ["googtag"], hl: ["ehl"], html: ["customScripts"], customScripts: ["html"], nonGooglePixels: ["customPixels", "customScripts", "html", "nonGoogleScripts", "nonGoogleIframes"], nonGoogleScripts: ["customScripts", "html"], nonGoogleIframes: ["customScripts", "html", "nonGoogleScripts"] }, Tu = "google customPixels customScripts html nonGooglePixels nonGoogleScripts nonGoogleIframes".split(" "), Wu = function(a) {
      var b = Si("gtm.allowlist") || Si("gtm.whitelist");
      b && L(9);
      xi && (b = [
        "google",
        "gtagfl",
        "lcl",
        "zone"
      ]);
      Uu() && (xi ? L(116) : (L(117), Vu && (b = [], window.console && window.console.log && window.console.log("GTM blocked. See go/13687728."))));
      var c = b && Xa(Pa(b), Ru), d = Si("gtm.blocklist") || Si("gtm.blacklist");
      d || (d = Si("tagTypeBlacklist")) && L(3);
      d ? L(8) : d = [];
      Uu() && (d = Pa(d), d.push("nonGooglePixels", "nonGoogleScripts", "sandboxedScripts"));
      0 <= Pa(d).indexOf("google") && L(2);
      var e = d && Xa(Pa(d), Su), f = {};
      return function(g) {
        var h = g && g[Oe.na];
        if (!h || "string" != typeof h)
          return true;
        h = h.replace(/^_*/, "");
        if (void 0 !== f[h])
          return f[h];
        var m = Ji[h] || [], n = a(h, m);
        if (!R(94))
          for (var p = Nu(), q = 0; q < p.length; q++)
            try {
              n = n && p[q](h, m);
            } catch (y) {
              n = false;
            }
        if (b) {
          var r;
          if (r = n)
            a: {
              if (0 > c.indexOf(h))
                if (m && 0 < m.length)
                  for (var t = 0; t < m.length; t++) {
                    if (0 > c.indexOf(m[t])) {
                      L(11);
                      r = false;
                      break a;
                    }
                  }
                else {
                  r = false;
                  break a;
                }
              r = true;
            }
          n = r;
        }
        var u = false;
        if (d) {
          var v = 0 <= e.indexOf(h);
          if (v)
            u = v;
          else {
            var w = La(e, m || []);
            w && L(10);
            u = w;
          }
        }
        var x = !n || u;
        x || !(0 <= m.indexOf("sandboxedScripts")) || c && -1 !== c.indexOf("sandboxedScripts") || (x = La(e, Tu));
        return f[h] = x;
      };
    }, Vu = false;
    Vu = true;
    var Uu = function() {
      return Qu.test(z.location && z.location.hostname);
    }, Xu = function() {
    };
    var Zu = function(a, b, c, d, e) {
      if (!Yu() && !sm(a)) {
        var f = "?id=" + encodeURIComponent(a) + "&l=" + qi.fa, g = 0 === a.indexOf("GTM-");
        g || (f += "&cx=c");
        R(41) && (f += "&gtm=" + Am());
        var h = bp();
        h && (f += "&sign=" + qi.zf);
        var m = c ? "/gtag/js" : "/gtm.js", n = zi || Bi ? ap(b, m + f) : void 0;
        if (!n) {
          var p = qi.wd + m;
          h && Dc && g && (p = Dc.replace(/^(?:https?:\/\/)?/i, "").split(/[?#]/)[0]);
          n = Bo("https://", "http://", p + f);
        }
        var q = a;
        d.siloed && (vm({ ctid: q, isDestination: false }), q = gm(q));
        var r = q, t = um();
        am().container[r] = { state: 1, context: d, parent: t };
        bm(
          { ctid: r, isDestination: false },
          e
        );
        Jc(n);
      }
    }, $u = function(a, b, c, d) {
      if (!Yu() && !tm(a))
        if (wm())
          am().destination[a] = { state: 0, transportUrl: b, context: c, parent: um() }, bm({ ctid: a, isDestination: true }, d), L(91);
        else {
          var e = "/gtag/destination?id=" + encodeURIComponent(a) + "&l=" + qi.fa + "&cx=c";
          R(41) && (e += "&gtm=" + Am());
          bp() && (e += "&sign=" + qi.zf);
          var f = zi || Bi ? ap(b, e) : void 0;
          f || (f = Bo("https://", "http://", qi.wd + e));
          var g = a;
          c.siloed && (vm({ ctid: g, isDestination: true }), g = gm(g));
          am().destination[g] = { state: 1, context: c, parent: um() };
          bm({ ctid: g, isDestination: true }, d);
          Jc(f);
        }
    };
    function Yu() {
      return false;
    }
    var av = false, bv = 0, cv = [];
    function dv(a) {
      if (!av) {
        var b = C.createEventObject, c = "complete" == C.readyState, d = "interactive" == C.readyState;
        if (!a || "readystatechange" != a.type || c || !b && d) {
          av = true;
          for (var e = 0; e < cv.length; e++)
            F(cv[e]);
        }
        cv.push = function() {
          for (var f = 0; f < arguments.length; f++)
            F(arguments[f]);
          return 0;
        };
      }
    }
    function ev() {
      if (!av && 140 > bv) {
        bv++;
        try {
          C.documentElement.doScroll("left"), dv();
        } catch (a) {
          z.setTimeout(ev, 50);
        }
      }
    }
    var fv = function(a) {
      av ? a() : cv.push(a);
    };
    var hv = function(a, b, c) {
      return { entityType: a, indexInOriginContainer: b, nameInOriginContainer: c, originContainerId: lm() };
    };
    var jv = function(a, b) {
      this.h = false;
      this.F = [];
      this.M = { tags: [] };
      this.X = false;
      this.s = this.C = 0;
      iv(this, a, b);
    }, kv = function(a, b, c, d) {
      if (ui.hasOwnProperty(b) || "__zone" === b)
        return -1;
      var e = {};
      mb(d) && (e = nb(d, e));
      e.id = c;
      e.status = "timeout";
      return a.M.tags.push(e) - 1;
    }, lv = function(a, b, c, d) {
      var e = a.M.tags[b];
      e && (e.status = c, e.executionTime = d);
    }, mv = function(a) {
      if (!a.h) {
        for (var b = a.F, c = 0; c < b.length; c++)
          b[c]();
        a.h = true;
        a.F.length = 0;
      }
    }, iv = function(a, b, c) {
      void 0 !== b && a.Bf(b);
      c && z.setTimeout(function() {
        return mv(a);
      }, Number(c));
    };
    jv.prototype.Bf = function(a) {
      var b = this, c = Va(function() {
        return F(function() {
          a(lm(), b.M);
        });
      });
      this.h ? c() : this.F.push(c);
    };
    var nv = function(a) {
      a.C++;
      return Va(function() {
        a.s++;
        a.X && a.s >= a.C && mv(a);
      });
    }, ov = function(a) {
      a.X = true;
      a.s >= a.C && mv(a);
    };
    var rv = function() {
      return z[qv()];
    };
    function qv() {
      return z.GoogleAnalyticsObject || "ga";
    }
    var Bv = {}, Cv = {};
    function Dv(a, b) {
      if (mp) {
        var c;
        c = b.match(/^(gtm|gtag)\./) ? encodeURIComponent(b) : "*";
        Bv[a] = "&e=" + c + "&eid=" + a;
        wp(a);
      }
    }
    function Ev(a) {
      var b = a.eventId, c = a.Zb;
      if (!Bv[b])
        return "";
      var d = Cv[b] ? "" : "&es=1";
      d += Bv[b];
      c && (Cv[b] = true);
      return d;
    }
    var Fv = {};
    function Gv(a, b) {
      mp && (Fv[a] = Fv[a] || {}, Fv[a][b] = (Fv[a][b] || 0) + 1);
    }
    function Hv(a) {
      var b = a.eventId, c = a.Zb, d = Fv[b] || {}, e = [], f;
      for (f in d)
        d.hasOwnProperty(f) && e.push("" + f + d[f]);
      c && delete Fv[b];
      return e.length ? "&md=" + e.join(".") : "";
    }
    var Iv = {}, Jv = { aev: "1", c: "2", jsm: "3", v: "4", j: "5", smm: "6", rmm: "7", input: "8" };
    function Kv(a, b, c) {
      if (mp) {
        Iv[a] = Iv[a] || [];
        var d = Jv[b] || "0", e;
        e = c instanceof z.Element ? "1" : c instanceof z.Event ? "2" : c instanceof z.RegExp ? "3" : c === z ? "4" : c === C ? "5" : c instanceof z.Promise ? "6" : c instanceof z.Storage ? "7" : c instanceof z.Date ? "8" : c instanceof z.History ? "9" : c instanceof z.Performance ? "a" : c === z.crypto ? "b" : c instanceof z.Location ? "c" : c instanceof z.Navigator ? "d" : "object" !== typeof c || mb(c) ? "0" : "e";
        Iv[a].push("" + d + e);
      }
    }
    function Lv(a) {
      var b = a.eventId, c = Iv[b] || [];
      if (!c.length)
        return "";
      a.Zb && delete Iv[b];
      return "&pcr=" + c.join(".");
    }
    var Mv = {}, Nv = {};
    function Ov(a, b, c) {
      if (mp && b) {
        var d = dp(b);
        Mv[a] = Mv[a] || [];
        Mv[a].push(c + d);
        var e = (Cf(b) ? "1" : "2") + d;
        Nv[a] = Nv[a] || [];
        Nv[a].push(e);
        wp(a);
      }
    }
    function Pv(a) {
      var b = a.eventId, c = a.Zb, d = "", e = Mv[b] || [];
      e.length && (d += "&tr=" + e.join("."));
      var f = Nv[b] || [];
      f.length && (d += "&ti=" + f.join("."));
      c && (delete Mv[b], delete Nv[b]);
      return d;
    }
    function Qv(a, b, c, d) {
      var e = of[a], f = Rv(a, b, c);
      if (!f)
        return null;
      var g = zf(e[Oe.kj], c, []);
      if (g && g.length) {
        var h = g[0];
        f = Qv(h.index, { onSuccess: f, onFailure: 1 === h.Aj ? b.terminate : f, terminate: b.terminate }, c);
      }
      return f;
    }
    function Rv(a, b, c, d) {
      function e() {
        if (f[Oe.Tk])
          h();
        else {
          var w = Af(f, c, []), x = w[Oe.kk];
          if (null != x) {
            for (var y = 0; y < x.length; y++)
              if (!ck(x[y])) {
                h();
                return;
              }
          }
          var A = kv(c.Vb, String(f[Oe.na]), Number(f[Oe.oe]), w[Oe.Uk]), B = false;
          w.vtp_gtmOnSuccess = function() {
            if (!B) {
              B = true;
              var D = Sa() - G;
              Ov(c.id, of[a], "5");
              lv(c.Vb, A, "success", D);
              g();
            }
          };
          w.vtp_gtmOnFailure = function() {
            if (!B) {
              B = true;
              var D = Sa() - G;
              Ov(c.id, of[a], "6");
              lv(c.Vb, A, "failure", D);
              h();
            }
          };
          w.vtp_gtmTagId = f.tag_id;
          w.vtp_gtmEventId = c.id;
          c.priorityId && (w.vtp_gtmPriorityId = c.priorityId);
          Ov(c.id, f, "1");
          var E = function() {
            ij(3);
            var D = Sa() - G;
            Ov(c.id, f, "7");
            lv(c.Vb, A, "exception", D);
            B || (B = true, h());
          };
          var G = Sa();
          try {
            yf(w, { event: c, index: a, type: 1 });
          } catch (D) {
            E(D);
          }
        }
      }
      var f = of[a], g = b.onSuccess, h = b.onFailure, m = b.terminate;
      if (c.isBlocked(f))
        return null;
      var n = zf(f[Oe.pj], c, []);
      if (n && n.length) {
        var p = n[0], q = Qv(p.index, { onSuccess: g, onFailure: h, terminate: m }, c);
        if (!q)
          return null;
        g = q;
        h = 2 === p.Aj ? m : q;
      }
      if (f[Oe.ej] || f[Oe.Wk]) {
        var r = f[Oe.ej] ? pf : c.jn, t = g, u = h;
        if (!r[a]) {
          e = Va(e);
          var v = Sv(a, r, e);
          g = v.onSuccess;
          h = v.onFailure;
        }
        return function() {
          r[a](t, u);
        };
      }
      return e;
    }
    function Sv(a, b, c) {
      var d = [], e = [];
      b[a] = Tv(d, e, c);
      return { onSuccess: function() {
        b[a] = Uv;
        for (var f = 0; f < d.length; f++)
          d[f]();
      }, onFailure: function() {
        b[a] = Vv;
        for (var f = 0; f < e.length; f++)
          e[f]();
      } };
    }
    function Tv(a, b, c) {
      return function(d, e) {
        a.push(d);
        b.push(e);
        c();
      };
    }
    function Uv(a) {
      a();
    }
    function Vv(a, b) {
      b();
    }
    var Yv = function(a, b) {
      return 1 === arguments.length ? Wv("config", a) : Wv("config", a, b);
    }, Zv = function(a, b, c) {
      c = c || {};
      c[N.g.Ob] = a;
      return Wv("event", b, c);
    };
    function Wv(a) {
      return arguments;
    }
    var $v = function() {
      this.h = [];
      this.s = [];
    };
    $v.prototype.enqueue = function(a, b, c) {
      var d = this.h.length + 1;
      a["gtm.uniqueEventId"] = b;
      a["gtm.priorityId"] = d;
      c.eventId = b;
      c.fromContainerExecution = true;
      c.priorityId = d;
      var e = { message: a, notBeforeEventId: b, priorityId: d, messageContext: c };
      this.h.push(e);
      for (var f = 0; f < this.s.length; f++)
        try {
          this.s[f](e);
        } catch (g) {
        }
    };
    $v.prototype.listen = function(a) {
      this.s.push(a);
    };
    $v.prototype.get = function() {
      for (var a = {}, b = 0; b < this.h.length; b++) {
        var c = this.h[b], d = a[c.notBeforeEventId];
        d || (d = [], a[c.notBeforeEventId] = d);
        d.push(c);
      }
      return a;
    };
    $v.prototype.prune = function(a) {
      for (var b = [], c = [], d = 0; d < this.h.length; d++) {
        var e = this.h[d];
        e.notBeforeEventId === a ? b.push(e) : c.push(e);
      }
      this.h = c;
      return b;
    };
    var bw = function(a, b, c) {
      c.eventMetadata = c.eventMetadata || {};
      c.eventMetadata.source_canonical_id = Tf.Ef;
      aw().enqueue(a, b, c);
    }, ww = function() {
      var a = cw;
      aw().listen(a);
    };
    function aw() {
      var a = ri.mb;
      a || (a = new $v(), ri.mb = a);
      return a;
    }
    var Jw = function(a) {
      var b = ri.zones;
      return b ? b.getIsAllowedFn(hm(), a) : function() {
        return true;
      };
    }, Kw = function(a) {
      var b = ri.zones;
      return b ? b.isActive(hm(), a) : true;
    }, Lw = function() {
      R(93) ? Ou(mm(), function(a) {
        return Kw(a.originalEventData["gtm.uniqueEventId"]);
      }) : Ou(mm(), function(a, b) {
        return Kw(b);
      });
      R(94) && R(95) && Mu(mm(), function(a) {
        var b = a.entityId, c = a.securityGroups;
        return Jw(a.originalEventData["gtm.uniqueEventId"])(b, c);
      });
    };
    var Ow = function(a, b) {
      for (var c = [], d = 0; d < of.length; d++)
        if (a[d]) {
          var e = of[d];
          var f = nv(b.Vb);
          try {
            var g = Qv(d, { onSuccess: f, onFailure: f, terminate: f }, b, d);
            if (g) {
              var h = e[Oe.na];
              if (!h)
                throw "Error: No function name given for function call.";
              var m = qf[h];
              c.push({ Yj: d, Oj: (m ? m.priorityOverride || 0 : 0) || Ku(e[Oe.na], 1) || 0, execute: g });
            } else
              Mw(d, b), f();
          } catch (p) {
            f();
          }
        }
      c.sort(Nw);
      for (var n = 0; n < c.length; n++)
        c[n].execute();
      return 0 < c.length;
    };
    function Nw(a, b) {
      var c, d = b.Oj, e = a.Oj;
      c = d > e ? 1 : d < e ? -1 : 0;
      var f;
      if (0 !== c)
        f = c;
      else {
        var g = a.Yj, h = b.Yj;
        f = g > h ? 1 : g < h ? -1 : 0;
      }
      return f;
    }
    function Mw(a, b) {
      if (mp) {
        var c = function(d) {
          var e = b.isBlocked(of[d]) ? "3" : "4", f = zf(of[d][Oe.kj], b, []);
          f && f.length && c(f[0].index);
          Ov(b.id, of[d], e);
          var g = zf(of[d][Oe.pj], b, []);
          g && g.length && c(g[0].index);
        };
        c(a);
      }
    }
    var Rw = false;
    var Yw = function(a) {
      var b = a["gtm.uniqueEventId"], c = a["gtm.priorityId"], d = a.event;
      if ("gtm.js" === d) {
        if (Rw)
          return false;
        Rw = true;
      }
      var e, f = false, g = Pu(), h;
      if (R(93)) {
        var m = nb(a);
        h = g.every(function(w) {
          return w({ originalEventData: m });
        });
      } else
        h = g.every(function(w) {
          return w(d, b);
        });
      if (h)
        e = Jw(b);
      else {
        if ("gtm.js" !== d && "gtm.init" !== d && "gtm.init_consent" !== d)
          return false;
        f = true;
        e = Jw(Number.MAX_SAFE_INTEGER);
      }
      Dv(b, d);
      var n = a.eventCallback, p = a.eventTimeout, q = nb(a), r = { id: b, priorityId: c, name: d, isBlocked: Tw(e, q), jn: [], logMacroError: function() {
        L(6);
        ij(0);
      }, cachedModelValues: Uw(), checkPixieIncompatibility: Vw(b), Vb: new jv(function() {
        n && n.apply(n, [].slice.call(arguments, 0));
      }, p), originalEventData: q };
      R(32) && (r.reportMacroDiscrepancy = Gv);
      R(16) && fu(r.id, r.name);
      var t = Kf(r);
      R(16) && gu(r.id, r.name);
      f && (t = Ww(t));
      var u = Ow(t, r), v = false;
      ov(r.Vb);
      return Xw(t, u) || v;
    };
    function Vw(a) {
      return function(b) {
        pb(b) || Kv(a, "input", b);
      };
    }
    function Uw() {
      var a = {};
      a.event = Xi("event", 1);
      a.ecommerce = Xi("ecommerce", 1);
      a.gtm = Xi("gtm");
      a.eventModel = Xi("eventModel");
      return a;
    }
    function Tw(a, b) {
      var c = Wu(a);
      return R(94) ? function(d) {
        if (c(d))
          return true;
        var e = d && d[Oe.na];
        if (!e || "string" != typeof e)
          return true;
        e = e.replace(/^_*/, "");
        for (var f = Nu(), g = Ji[e] || [], h = ea(f), m = h.next(); !m.done; m = h.next()) {
          var n = m.value;
          try {
            if (!n({ entityId: e, securityGroups: g, originalEventData: b }))
              return true;
          } catch (p) {
            return true;
          }
        }
        return false;
      } : c;
    }
    function Ww(a) {
      for (var b = [], c = 0; c < a.length; c++)
        if (a[c]) {
          var d = String(of[c][Oe.na]);
          if (ti[d] || void 0 !== of[c][Oe.Xk] || Ki[d] || Ku(d, 2))
            b[c] = true;
        }
      return b;
    }
    function Xw(a, b) {
      if (!b)
        return b;
      for (var c = 0; c < a.length; c++)
        if (a[c] && of[c] && !ui[String(of[c][Oe.na])])
          return true;
      return false;
    }
    var Nf;
    var Zw = {}, $w = {}, ax = function(a, b) {
      for (var c = [], d = [], e = {}, f = 0; f < a.length; e = { Kh: void 0, qh: void 0 }, f++) {
        var g = a[f];
        if (0 <= g.indexOf("-")) {
          if (e.Kh = yo(g, b), e.Kh) {
            var h = jm();
            Ia(h, /* @__PURE__ */ function(r) {
              return function(t) {
                return r.Kh.da === t;
              };
            }(e)) ? c.push(g) : d.push(g);
          }
        } else {
          var m = Zw[g] || [];
          e.qh = {};
          m.forEach(/* @__PURE__ */ function(r) {
            return function(t) {
              return r.qh[t] = true;
            };
          }(e));
          for (var n = hm(), p = 0; p < n.length; p++)
            if (e.qh[n[p]]) {
              c = c.concat(jm());
              break;
            }
          var q = $w[g] || [];
          q.length && (c = c.concat(q));
        }
      }
      return { Cm: c, Fm: d };
    }, bx = function(a) {
      l(Zw, function(b, c) {
        var d = c.indexOf(a);
        0 <= d && c.splice(d, 1);
      });
    }, cx = function(a) {
      l($w, function(b, c) {
        var d = c.indexOf(a);
        0 <= d && c.splice(d, 1);
      });
    };
    var dx = "HA GF G UA AW DC MC".split(" "), ex = false, fx = false;
    function gx(a, b) {
      a.hasOwnProperty("gtm.uniqueEventId") || Object.defineProperty(a, "gtm.uniqueEventId", { value: Li() });
      b.eventId = a["gtm.uniqueEventId"];
      b.priorityId = a["gtm.priorityId"];
      return { eventId: b.eventId, priorityId: b.priorityId };
    }
    var hx = void 0, ix = void 0;
    function jx(a, b, c) {
      var d = nb(a);
      d.eventId = void 0;
      d.inheritParentConfig = void 0;
      Object.keys(b).some(function(f) {
        return void 0 !== b[f];
      }) && L(136);
      var e = nb(b);
      nb(c, e);
      bw(Yv(hm()[0], e), a.eventId, d);
    }
    function kx(a) {
      for (var b = ea([N.g.Sd, N.g.Pb]), c = b.next(); !c.done; c = b.next()) {
        var d = c.value, e = a && a[d] || Pp.C[d];
        if (e)
          return e;
      }
    }
    var lx = { config: function(a, b) {
      var c = R(33), d = gx(a, b);
      if (!(2 > a.length) && k(a[1])) {
        var e = {};
        if (2 < a.length) {
          if (void 0 != a[2] && !mb(a[2]) || 3 < a.length)
            return;
          e = a[2];
        }
        var f = yo(a[1], b.isGtmEvent);
        if (f) {
          var g, h, m;
          a: {
            if (!dm.ie) {
              var n = nm(um());
              if (ym(n)) {
                var p = n.parent, q = p.isDestination;
                m = { Lm: nm(p), Bm: q };
                break a;
              }
            }
            m = void 0;
          }
          var r = m;
          r && (g = r.Lm, h = r.Bm);
          Dv(d.eventId, "gtag.config");
          var t = f.da, u = f.id !== t;
          if (u ? -1 === jm().indexOf(t) : -1 === hm().indexOf(t)) {
            if (!(c && b.inheritParentConfig || e[N.g.yb])) {
              var v = kx(e);
              if (u)
                $u(t, v, {
                  source: 2,
                  fromContainerExecution: b.fromContainerExecution
                });
              else if (c && void 0 !== g && -1 !== g.containers.indexOf(t)) {
                var w = e;
                hx ? jx(b, w, hx) : ix || (ix = nb(w));
              } else
                Zu(t, v, true, { source: 2, fromContainerExecution: b.fromContainerExecution });
            }
          } else {
            if (g && (L(128), h && L(130), c && b.inheritParentConfig)) {
              var x;
              var y = e;
              ix ? (jx(b, ix, y), x = false) : (!y[N.g.Qb] && wi && hx || (hx = nb(y)), x = true);
              x && g.containers && g.containers.join(",");
              return;
            }
            if (wi && !u && !e[N.g.Qb]) {
              var A = fx;
              fx = true;
              if (A)
                return;
            }
            ex || L(43);
            if (!b.noTargetGroup)
              if (u) {
                cx(f.id);
                var B = f.id, E = e[N.g.Pd] || "default";
                E = String(E).split(",");
                for (var G = 0; G < E.length; G++) {
                  var D = $w[E[G]] || [];
                  $w[E[G]] = D;
                  0 > D.indexOf(B) && D.push(B);
                }
              } else {
                bx(f.id);
                var M = f.id, P = e[N.g.Pd] || "default";
                P = P.toString().split(",");
                for (var O = 0; O < P.length; O++) {
                  var T = Zw[P[O]] || [];
                  Zw[P[O]] = T;
                  0 > T.indexOf(M) && T.push(M);
                }
              }
            delete e[N.g.Pd];
            var Y = b.eventMetadata || {};
            Y.hasOwnProperty("is_external_event") || (Y.is_external_event = !b.fromContainerExecution);
            b.eventMetadata = Y;
            delete e[N.g.Vc];
            for (var W = u ? [f.id] : jm(), X = 0; X < W.length; X++) {
              var la = e, ka = W[X], fa = nb(b), Da = yo(ka, fa.isGtmEvent);
              Da && Pp.push("config", [la], Da, fa);
            }
          }
        }
      }
    }, consent: function(a, b) {
      if (3 === a.length) {
        L(39);
        var c = gx(a, b), d = a[1], e = a[2];
        b.fromContainerExecution || (e[N.g.N] && L(139), e[N.g.Ea] && L(140));
        "default" === d ? Yj(e) : "update" === d ? Zj(e, c) : "declare" === d ? b.fromContainerExecution && Xj(e) : R(66) && "core_platform_services" === d && ak(e);
      }
    }, event: function(a, b) {
      var c = a[1];
      if (!(2 > a.length) && k(c)) {
        var d;
        if (2 < a.length) {
          if (!mb(a[2]) && void 0 != a[2] || 3 < a.length)
            return;
          d = a[2];
        }
        var e = d, f = {}, g = (f.event = c, f);
        e && (g.eventModel = nb(e), e[N.g.Vc] && (g.eventCallback = e[N.g.Vc]), e[N.g.Kd] && (g.eventTimeout = e[N.g.Kd]));
        var h = gx(a, b), m = h.eventId, n = h.priorityId;
        g["gtm.uniqueEventId"] = m;
        n && (g["gtm.priorityId"] = n);
        if ("optimize.callback" === c)
          return g.eventModel = g.eventModel || {}, g;
        var p;
        var q = d, r = q && q[N.g.Ob];
        void 0 === r && (r = Si(N.g.Ob, 2), void 0 === r && (r = "default"));
        if (k(r) || Ha(r)) {
          var t;
          b.isGtmEvent ? t = k(r) ? [r] : r : t = r.toString().replace(/\s+/g, "").split(",");
          var u = ax(t, b.isGtmEvent), v = u.Cm, w = u.Fm;
          if (w.length)
            for (var x = kx(q), y = 0; y < w.length; y++) {
              var A = yo(w[y], b.isGtmEvent);
              A && $u(A.da, x, { source: 3, fromContainerExecution: b.fromContainerExecution });
            }
          p = Ao(v, b.isGtmEvent);
        } else
          p = void 0;
        var B = p;
        if (B) {
          Dv(m, c);
          for (var E = [], G = 0; G < B.length; G++) {
            var D = B[G], M = nb(b);
            if (-1 !== dx.indexOf(om(D.prefix))) {
              var P = nb(d), O = M.eventMetadata || {};
              O.hasOwnProperty("is_external_event") || (O.is_external_event = !M.fromContainerExecution);
              M.eventMetadata = O;
              delete P[N.g.Vc];
              Rp(c, P, D.id, M);
            }
            E.push(D.id);
          }
          g.eventModel = g.eventModel || {};
          0 < B.length ? g.eventModel[N.g.Ob] = E.join() : delete g.eventModel[N.g.Ob];
          ex || L(43);
          void 0 === b.noGtmEvent && b.eventMetadata && b.eventMetadata.syn_or_mod && (b.noGtmEvent = true);
          g.eventModel[N.g.Lb] && (b.noGtmEvent = true);
          return b.noGtmEvent ? void 0 : g;
        }
      }
    }, get: function(a, b) {
      L(53);
      if (4 === a.length && k(a[1]) && k(a[2]) && Fa(a[3])) {
        var c = yo(a[1], b.isGtmEvent), d = String(a[2]), e = a[3];
        if (c) {
          ex || L(43);
          var f = kx();
          if (!Ia(jm(), function(h) {
            return c.da === h;
          }))
            $u(c.da, f, { source: 4, fromContainerExecution: b.fromContainerExecution });
          else if (-1 !== dx.indexOf(om(c.prefix))) {
            gx(a, b);
            var g = {};
            Uj(nb((g[N.g.lb] = d, g[N.g.wb] = e, g)));
            Sp(d, function(h) {
              F(function() {
                return e(h);
              });
            }, c.id, b);
          }
        }
      }
    }, js: function(a, b) {
      if (2 == a.length && a[1].getTime) {
        ex = true;
        var c = gx(a, b), d = c.eventId, e = c.priorityId, f = {};
        return f.event = "gtm.js", f["gtm.start"] = a[1].getTime(), f["gtm.uniqueEventId"] = d, f["gtm.priorityId"] = e, f;
      }
    }, policy: function(a) {
      if (3 === a.length && k(a[1]) && Fa(a[2])) {
        Of(a[1], a[2]);
        if (L(74), "all" === a[1]) {
          L(75);
          var b = false;
          try {
            b = a[2](lm(), "unknown", {});
          } catch (c) {
          }
          b || L(76);
        }
      } else {
        L(73);
      }
    }, set: function(a, b) {
      var c;
      2 == a.length && mb(a[1]) ? c = nb(a[1]) : 3 == a.length && k(a[1]) && (c = {}, mb(a[2]) || Ha(a[2]) ? c[a[1]] = nb(a[2]) : c[a[1]] = a[2]);
      if (c) {
        var d = gx(a, b), e = d.eventId, f = d.priorityId;
        nb(c);
        var g = nb(c);
        Pp.push("set", [g], void 0, b);
        c["gtm.uniqueEventId"] = e;
        f && (c["gtm.priorityId"] = f);
        R(9) && delete c.event;
        b.overwriteModelFields = true;
        return c;
      }
    } }, mx = { policy: true };
    var nx = function(a) {
      var b = z[qi.fa].hide;
      if (b && void 0 !== b[a] && b.end) {
        b[a] = false;
        var c = true, d;
        for (d in b)
          if (b.hasOwnProperty(d) && true === b[d]) {
            c = false;
            break;
          }
        c && (b.end(), b.end = null);
      }
    };
    var px = false, qx = [];
    function rx() {
      if (!px) {
        px = true;
        for (var a = 0; a < qx.length; a++)
          F(qx[a]);
      }
    }
    var sx = function(a) {
      px ? F(a) : qx.push(a);
    };
    var Jx = function(a) {
      if (Ix(a))
        return a;
      this.h = a;
    };
    Jx.prototype.getUntrustedMessageValue = function() {
      return this.h;
    };
    var Ix = function(a) {
      return !a || "object" !== jb(a) || mb(a) ? false : "getUntrustedMessageValue" in a;
    };
    Jx.prototype.getUntrustedMessageValue = Jx.prototype.getUntrustedMessageValue;
    var Kx = 0, Lx = {}, Mx = [], Nx = [], Ox = false, Px = false;
    function Qx(a, b) {
      return a.messageContext.eventId - b.messageContext.eventId || a.messageContext.priorityId - b.messageContext.priorityId;
    }
    function Ux(a, b) {
      var c = a._clear || b.overwriteModelFields;
      l(a, function(e, f) {
        "_clear" !== e && (c && Vi(e), Vi(e, f));
      });
      Gi || (Gi = a["gtm.start"]);
      var d = a["gtm.uniqueEventId"];
      if (!a.event)
        return false;
      "number" !== typeof d && (d = Li(), a["gtm.uniqueEventId"] = d, Vi("gtm.uniqueEventId", d));
      return Yw(a);
    }
    function Vx(a) {
      if (null == a || "object" !== typeof a)
        return false;
      if (a.event)
        return true;
      if (Ma(a)) {
        var b = a[0];
        if ("config" === b || "event" === b || "js" === b || "get" === b)
          return true;
      }
      return false;
    }
    function Wx() {
      var a;
      if (Nx.length)
        a = Nx.shift();
      else if (Mx.length)
        a = Mx.shift();
      else
        return;
      var b;
      var c = a;
      if (Ox || !Vx(c.message))
        b = c;
      else {
        Ox = true;
        var d = c.message["gtm.uniqueEventId"];
        "number" !== typeof d && (d = c.message["gtm.uniqueEventId"] = Li());
        var e = {}, f = { message: (e.event = "gtm.init_consent", e["gtm.uniqueEventId"] = d - 2, e), messageContext: { eventId: d - 2 } }, g = {}, h = { message: (g.event = "gtm.init", g["gtm.uniqueEventId"] = d - 1, g), messageContext: { eventId: d - 1 } };
        Mx.unshift(h, c);
        if (mp) {
          var m = Tf.ctid;
          if (m) {
            var n, p = nm(um());
            n = p && p.context;
            var q, r = Lm(z.location.href);
            q = r.hostname + r.pathname;
            var t = n && n.fromContainerExecution, u = n && n.source, v = Tf.Ef, w = dm.ie;
            mp && (Ap || (Ap = q), Bp.push(m + ";" + v + ";" + (t ? 1 : 0) + ";" + (u || 0) + ";" + (w ? 1 : 0)));
          }
        }
        b = f;
      }
      return b;
    }
    function Xx() {
      for (var a = false, b; !Px && (b = Wx()); ) {
        Px = true;
        delete Pi.eventModel;
        Ri();
        var c = b, d = c.message, e = c.messageContext;
        if (null == d)
          Px = false;
        else {
          e.fromContainerExecution && Wi();
          try {
            if (Fa(d))
              try {
                d.call(Ti);
              } catch (x) {
              }
            else if (Ha(d)) {
              var f = d;
              if (k(f[0])) {
                var g = f[0].split("."), h = g.pop(), m = f.slice(1), n = Si(g.join("."), 2);
                if (null != n)
                  try {
                    n[h].apply(n, m);
                  } catch (x) {
                  }
              }
            } else {
              var p = void 0, q = false;
              if (Ma(d)) {
                a: {
                  if (d.length && k(d[0])) {
                    var r = lx[d[0]];
                    if (r && (!e.fromContainerExecution || !mx[d[0]])) {
                      p = r(d, e);
                      break a;
                    }
                  }
                  p = void 0;
                }
                (q = p && "set" === d[0] && !!p.event) && L(101);
              } else
                p = d;
              if (p) {
                var t = Ux(p, e);
                a = t || a;
                q && t && L(113);
              }
            }
          } finally {
            e.fromContainerExecution && Ri(true);
            var u = d["gtm.uniqueEventId"];
            if ("number" === typeof u) {
              for (var v = Lx[String(u)] || [], w = 0; w < v.length; w++)
                Nx.push(Yx(v[w]));
              v.length && Nx.sort(Qx);
              delete Lx[String(u)];
              u > Kx && (Kx = u);
            }
            Px = false;
          }
        }
      }
      return !a;
    }
    function Zx() {
      var b = Xx();
      try {
        nx(lm());
      } catch (c) {
      }
      return b;
    }
    function cw(a) {
      if (Kx < a.notBeforeEventId) {
        var b = String(a.notBeforeEventId);
        Lx[b] = Lx[b] || [];
        Lx[b].push(a);
      } else
        Nx.push(Yx(a)), Nx.sort(Qx), F(function() {
          Px || Xx();
        });
    }
    function Yx(a) {
      return { message: a.message, messageContext: a.messageContext };
    }
    var ay = function() {
      function a(f) {
        var g = {};
        if (Ix(f)) {
          var h = f;
          f = Ix(h) ? h.getUntrustedMessageValue() : void 0;
          g.fromContainerExecution = true;
        }
        return { message: f, messageContext: g };
      }
      var b = Ec(qi.fa, []), c = ri[qi.fa] = ri[qi.fa] || {};
      true === c.pruned && L(83);
      Lx = aw().get();
      ww();
      fv(function() {
        if (!c.gtmDom) {
          c.gtmDom = true;
          var f = {};
          b.push((f.event = "gtm.dom", f));
        }
      });
      sx(function() {
        if (!c.gtmLoad) {
          c.gtmLoad = true;
          var f = {};
          b.push((f.event = "gtm.load", f));
        }
      });
      c.subscribers = (c.subscribers || 0) + 1;
      var d = b.push;
      b.push = function() {
        var f;
        if (0 < ri.SANDBOXED_JS_SEMAPHORE) {
          f = [];
          for (var g = 0; g < arguments.length; g++)
            f[g] = new Jx(arguments[g]);
        } else
          f = [].slice.call(arguments, 0);
        var h = f.map(function(q) {
          return a(q);
        });
        Mx.push.apply(Mx, h);
        var m = d.apply(b, f), n = Math.max(100, Number("1000") || 300);
        if (this.length > n)
          for (L(4), c.pruned = true; this.length > n; )
            this.shift();
        var p = "boolean" !== typeof m || m;
        return Xx() && p;
      };
      var e = b.slice(0).map(function(f) {
        return a(f);
      });
      Mx.push.apply(Mx, e);
      {
        F(Zx);
      }
    };
    function by(a) {
      if (null == a || 0 === a.length)
        return false;
      var b = Number(a), c = Sa();
      return b < c + 3e5 && b > c - 9e5;
    }
    function cy(a) {
      return a && 0 === a.indexOf("pending:") ? by(a.substr(8)) : false;
    }
    var xy = function() {
    };
    var yy = function() {
    };
    yy.prototype.toString = function() {
      return "undefined";
    };
    var zy = new yy();
    var nz = function(a, b) {
      return Si(a, b || 2);
    }, vz = function(a, b, c) {
      pb(a) || Kv(c, b, a);
    };
    function Sz(a, b) {
      function c(g) {
        var h = Lm(g), m = Gm(h, "protocol"), n = Gm(h, "host", true), p = Gm(h, "port"), q = Gm(h, "path").toLowerCase().replace(/\/$/, "");
        if (void 0 === m || "http" === m && "80" === p || "https" === m && "443" === p)
          m = "web", p = "default";
        return [m, n, p, q];
      }
      for (var d = c(String(a)), e = c(String(b)), f = 0; f < d.length; f++)
        if (d[f] !== e[f])
          return false;
      return true;
    }
    function Tz(a) {
      return Uz(a) ? 1 : 0;
    }
    function Uz(a) {
      var b = a.arg0, c = a.arg1;
      if (a.any_of && Array.isArray(c)) {
        for (var d = 0; d < c.length; d++) {
          var e = nb(a, {});
          nb({ arg1: c[d], any_of: void 0 }, e);
          if (Tz(e))
            return true;
        }
        return false;
      }
      switch (a["function"]) {
        case "_cn":
          return tg(b, c);
        case "_css":
          var f;
          a: {
            if (b)
              try {
                for (var g = 0; g < pg.length; g++) {
                  var h = pg[g];
                  if (b[h]) {
                    f = b[h](c);
                    break a;
                  }
                }
              } catch (m) {
              }
            f = false;
          }
          return f;
        case "_ew":
          return qg(b, c);
        case "_eq":
          return ug(b, c);
        case "_ge":
          return vg(b, c);
        case "_gt":
          return xg(b, c);
        case "_lc":
          return 0 <= String(b).split(",").indexOf(String(c));
        case "_le":
          return wg(b, c);
        case "_lt":
          return yg(b, c);
        case "_re":
          return sg(b, c, a.ignore_case);
        case "_sw":
          return zg(b, c);
        case "_um":
          return Sz(b, c);
      }
      return false;
    }
    function Vz() {
      var a = ["&cv=2", "&rv=" + qi.Ug, "&tc=" + of.filter(function(b) {
        return b;
      }).length];
      qi.me && a.push("&x=" + qi.me);
      return a.join("");
    }
    function Wz() {
      var a = qj();
      return a.length ? "&exp_geo=" + a : "";
    }
    var Xz;
    function Yz() {
      try {
        null != Xz || (Xz = new Intl.DateTimeFormat().resolvedOptions().timeZone);
      } catch (b) {
      }
      var a;
      return (null == (a = Xz) ? 0 : a.length) ? "&exp_tz=" + Xz : "";
    }
    function aA() {
      var a = bA;
      return function(b, c, d) {
        var e = d && d.event;
        cA(c);
        var f = 0 === b.indexOf("__cvt_") ? void 0 : 1, g = new sb();
        l(c, function(r, t) {
          var u = md(t, void 0, f);
          void 0 === u && void 0 !== t && L(44);
          g.set(r, u);
        });
        a.h.h.F = Hf();
        var h = { uj: Xf(b), eventId: void 0 !== e ? e.id : void 0, priorityId: void 0 !== e ? e.priorityId : void 0, Bf: void 0 !== e ? function(r) {
          return e.Vb.Bf(r);
        } : void 0, wc: function() {
          return b;
        }, log: function() {
        }, Fl: { index: d && d.index, type: d && d.type, name: d && d.name }, Wm: !!Ku(b, 3), originalEventData: null == e ? void 0 : e.originalEventData };
        e && e.cachedModelValues && (h.cachedModelValues = { gtm: e.cachedModelValues.gtm, ecommerce: e.cachedModelValues.ecommerce });
        var q = Ke(a, h, [b, g]);
        a.h.h.F = void 0;
        q instanceof wa && "return" === q.h && (q = q.s);
        return nd(q, void 0, f);
      };
    }
    function cA(a) {
      var b = a.gtmOnSuccess, c = a.gtmOnFailure;
      Fa(b) && (a.gtmOnSuccess = function() {
        F(b);
      });
      Fa(c) && (a.gtmOnFailure = function() {
        F(c);
      });
    }
    function dA(a, b) {
    }
    dA.O = "addConsentListener";
    function gA(a, b, c) {
      var e;
      return e;
    }
    gA.D = "internal.addDataLayerEventListener";
    function jA(a) {
    }
    jA.O = "addEventCallback";
    function oA(a, b, c, d) {
    }
    oA.D = "internal.addFormData";
    function AA(a, b) {
    }
    AA.D = "internal.addFormInteractionListener";
    function HA(a, b) {
    }
    HA.D = "internal.addFormSubmitListener";
    var IA = function(a) {
      return null != a && void 0 !== a.length && Fa(a.push);
    }, LA = function(a) {
      var b = JA.exec(a[0]);
      if (!b)
        return null;
      var c = b[2];
      if (void 0 !== c && c.match(/^(gtm\d+|gtag_.+)$/))
        return null;
      var d, e;
      k(a[1]) ? (d = a[1], e = [].slice.call(a, 2)) : (d = a[1] && a[1].hitType, e = [].slice.call(a, 1));
      if (!d)
        return null;
      var f;
      var g = KA[d], h = e;
      if (1 == h.length && null != h[0] && "object" === typeof h[0])
        f = h[0];
      else {
        for (var m = {}, n = Math.min(g ? g.length + 1 : 1, h.length), p = 0; p < n; p++)
          if ("object" === typeof h[p]) {
            for (var q in h[p])
              h[p].hasOwnProperty(q) && (m[q] = h[p][q]);
            break;
          } else
            g && p < g.length && (m[g[p]] = h[p]);
        f = m;
      }
      var r = f;
      r.hitType = d;
      return { Be: d, ve: r };
    }, JA = /^((.+)\.)?send$/, KA = { pageview: ["page"], event: ["eventCategory", "eventAction", "eventLabel", "eventValue"], social: ["socialNetwork", "socialAction", "socialTarget"], timing: ["timingCategory", "timingVar", "timingValue", "timingLabel"] };
    function MA(a) {
      J(I(this), ["dustCallback:!Fn"], arguments);
      K(this, "access_globals", "read", "GoogleAnalyticsObject");
      K(this, "access_globals", "readwrite", "ga.q");
      K(this, "access_globals", "execute", "ga.q");
      var b = 0, c = nd(a);
      F(function() {
        var d = rv();
        if (d && IA(d.q)) {
          for (var e = d.q, f = 0; f < e.length; f++) {
            var g = LA(e[f]);
            b++;
            null !== g && c(g.Be, g.ve);
          }
          var h = e.push;
          e.push = function() {
            var m = rv(), n = [].slice.call(arguments, 0);
            h.apply(e, n);
            if (!(b >= m.q.length + (m.qd || 0))) {
              var p = LA.apply(this, n);
              b++;
              null !== p && c(p.Be, p.ve);
            }
          };
        }
      });
    }
    MA.D = "internal.addGaSendListener";
    function OA(a, b, c) {
    }
    OA.D = "internal.loadGoogleTag";
    function QA(a, b, c) {
    }
    QA.D = "internal.addGoogleTagRestriction";
    var ZA = function(a, b) {
    };
    ZA.D = "internal.addHistoryChangeListener";
    function aB(a, b) {
      return true;
    }
    aB.O = "aliasInWindow";
    function bB(a, b, c) {
    }
    bB.D = "internal.appendRemoteConfigParameter";
    function cB() {
      var a = 2;
      return a;
    }
    function dB(a, b) {
      var c;
      return c;
    }
    dB.O = "callInWindow";
    function eB(a) {
    }
    eB.O = "callLater";
    function fB(a) {
    }
    fB.D = "callOnDomReady";
    function gB(a) {
    }
    gB.D = "callOnWindowLoad";
    function iB(a, b) {
      var c;
      var d = md(c, this.h, cB());
      void 0 === d && void 0 !== c && L(45);
      return d;
    }
    iB.O = "copyFromDataLayer";
    function jB(a) {
      var b = void 0;
      return b;
    }
    jB.D = "internal.copyFromDataLayerCache";
    function kB(a) {
      var b;
      return b;
    }
    kB.O = "copyFromWindow";
    function lB(a) {
      var b = void 0;
      return md(b, this.h, cB());
    }
    lB.D = "internal.copyKeyFromWindow";
    function mB(a, b) {
      var c;
      J(I(this), ["preHit:!PixieMap", "dustOptions:?PixieMap"], arguments);
      var d = nd(b) || {}, e = nd(a, this.h, 1).Dj(), f = e.o;
      d.omitEventContext && (f = yk(new nk(e.o.eventId, e.o.priorityId)));
      var g = new Ro(e.target, e.eventName, f);
      d.omitHitData || nb(e.h, g.h);
      d.omitMetadata ? g.metadata = {} : nb(e.metadata, g.metadata);
      g.isAborted = e.isAborted;
      c = md(Uo(g), this.h, 1);
      return c;
    }
    mB.D = "internal.copyPreHit";
    function nB(a, b) {
      var c = null, d = cB();
      return md(c, this.h, d);
    }
    nB.O = "createArgumentsQueue";
    function oB(a) {
      var b;
      return md(b, this.h, 1);
    }
    oB.D = "internal.createGaCommandQueue";
    function pB(a) {
      var b;
      return md(
        b,
        this.h,
        cB()
      );
    }
    pB.O = "createQueue";
    function qB(a, b) {
      var c = null;
      J(I(this), ["pattern:!string", "flags:?string"], arguments);
      try {
        var d = (b || "").split("").filter(function(e) {
          return 0 <= "ig".indexOf(e);
        }).join("");
        c = new jd(new RegExp(a, d));
      } catch (e) {
      }
      return c;
    }
    qB.D = "internal.createRegex";
    function rB(a) {
      if (!a)
        return {};
      var b = a.Fl;
      return hv(b.type, b.index, b.name);
    }
    function tB(a) {
    }
    tB.D = "internal.declareConsentState";
    function uB(a) {
      var b = "";
      return b;
    }
    uB.D = "internal.decodeUrlHtmlEntities";
    function vB(a, b, c) {
      var d;
      return d;
    }
    vB.D = "internal.decorateUrlWithGaCookies";
    function wB(a) {
      var b;
      K(this, "detect_user_provided_data", "auto");
      var c = nd(a) || {}, d = tr({ md: !!c.includeSelector, nd: !!c.includeVisibility, ue: c.excludeElementSelectors, ob: c.fieldFilters, Th: !!c.selectMultipleElements });
      b = new sb();
      var e = new rb();
      b.set("elements", e);
      for (var f = d.elements, g = 0; g < f.length; g++)
        e.push(xB(f[g]));
      void 0 !== d.Mh && b.set("preferredEmailElement", xB(d.Mh));
      b.set("status", d.status);
      return b;
    }
    var xB = function(a) {
      var b = new sb();
      b.set("userData", a.U);
      b.set("tagName", a.tagName);
      void 0 !== a.querySelector && b.set("querySelector", a.querySelector);
      void 0 !== a.isVisible && b.set("isVisible", a.isVisible);
      if (R(30))
        ;
      else
        switch (a.type) {
          case "1":
            b.set("type", "email");
        }
      return b;
    };
    wB.D = "internal.detectUserProvidedData";
    function AB(a, b) {
      return b;
    }
    AB.D = "internal.enableAutoEventOnClick";
    function FB(a, b) {
      return b;
    }
    FB.D = "internal.enableAutoEventOnElementVisibility";
    function GB() {
    }
    GB.D = "internal.enableAutoEventOnError";
    function RB(a, b) {
      return b;
    }
    RB.D = "internal.enableAutoEventOnFormInteraction";
    function WB(a, b) {
      return b;
    }
    WB.D = "internal.enableAutoEventOnFormSubmit";
    function aC() {
    }
    aC.D = "internal.enableAutoEventOnGaSend";
    function jC(a, b) {
      return b;
    }
    jC.D = "internal.enableAutoEventOnHistoryChange";
    function oC(a, b) {
      return b;
    }
    oC.D = "internal.enableAutoEventOnLinkClick";
    function BC(a, b) {
      return b;
    }
    BC.D = "internal.enableAutoEventOnScroll";
    function DC(a, b) {
      return b;
    }
    DC.D = "internal.enableAutoEventOnTimer";
    ca(["data-gtm-yt-inspected-"]);
    function QC(a, b) {
      return b;
    }
    QC.D = "internal.enableAutoEventOnYouTubeActivity";
    function SC(a) {
      var b = false;
      return b;
    }
    SC.D = "internal.evaluateMatchingRules";
    var wD = function() {
      var a = true;
      ml(7) && ml(9) && ml(10) || (a = false);
      return a;
    };
    function rE(a, b, c, d) {
    }
    rE.D = "internal.executeEventProcessor";
    function sE(a) {
      var b = void 0;
      return md(b, this.h, 1);
    }
    sE.D = "internal.executeJavascriptString";
    var tE = function(a) {
      var b;
      return b;
    };
    function uE() {
      var a = new sb();
      K(this, "read_container_data"), a.set("containerId", "G-3X9EELR6PB"), a.set("version", "2"), a.set("environmentName", ""), a.set("debugMode", $f), a.set("previewMode", bg), a.set("environmentMode", ag), a.set("firstPartyServing", zi || Bi), a.set("containerUrl", Dc), a.Eb();
      return a;
    }
    uE.O = "getContainerVersion";
    function vE(a, b) {
      var c;
      return c;
    }
    vE.O = "getCookieValues";
    function wE() {
      return qj();
    }
    wE.D = "internal.getCountryCode";
    function xE() {
      var a = [];
      a = jm();
      return md(a);
    }
    xE.D = "internal.getDestinationIds";
    function yE(a, b) {
      var c = "";
      return c;
    }
    yE.D = "internal.getElementAttribute";
    function zE(a) {
      var b = null;
      return b;
    }
    zE.D = "internal.getElementById";
    function AE(a) {
      var b = "";
      return b;
    }
    AE.D = "internal.getElementInnerText";
    function BE(a, b) {
      var c = null;
      return c;
    }
    BE.D = "internal.getElementProperty";
    function CE(a) {
      var b;
      return b;
    }
    CE.D = "internal.getElementValue";
    function DE(a) {
      var b = 0;
      return b;
    }
    DE.D = "internal.getElementVisibilityRatio";
    function EE(a) {
      var b = null;
      return b;
    }
    EE.D = "internal.getElementsByCssSelector";
    function FE(a) {
      var b = void 0;
      return b;
    }
    FE.D = "internal.getEventData";
    var GE = {};
    GE.enableAWFledge = R(6);
    GE.enableAdsConversionValidation = R(21);
    GE.enableAutoPiiOnPhoneAndAddress = R(30);
    GE.enableCachedEcommerceData = R(89);
    GE.enableCcdPreAutoPiiDetection = R(11);
    GE.enableCloudRecommentationsErrorLogging = R(73);
    GE.enableCloudRecommentationsSchemaIngestion = R(72);
    GE.enableCloudRetailInjectPurchaseMetadata = R(71);
    GE.enableCloudRetailLogging = R(70);
    GE.enableCloudRetailPageCategories = R(17);
    GE.enableConsentDisclosureActivity = R(35);
    GE.enableDCFledge = R(7);
    GE.enableDecodeUri = R(53);
    GE.enableDeferAllEnhancedMeasurement = R(37);
    GE.enableDirectTagLoadingInGoogleTag = R(64);
    GE.enableEuidAutoMode = R(10);
    GE.enableFormSkipValidation = R(31);
    GE.enableLoadGoogleTagOptionsObject = R(68);
    GE.enableUrlDecodeEventUsage = R(47);
    GE.enableV1HistoryEventInApi = R(78);
    GE.loadContainerForGtmEventTags = R(34);
    GE.useEnableAutoEventOnFormApis = R(22);
    GE.autoPiiEligible = uj();
    function HE() {
      return md(GE);
    }
    HE.D = "internal.getFlags";
    function IE() {
      return new jd(zy);
    }
    IE.D = "internal.getHtmlId";
    function JE(a, b) {
      var c;
      J(I(this), ["targetId:!string", "name:!string"], arguments);
      var d = Qo(a) || {};
      c = md(d[b], this.h);
      return c;
    }
    JE.D = "internal.getProductSettingsParameter";
    function KE(a, b) {
      var c;
      return c;
    }
    KE.O = "getQueryParameters";
    function LE(a, b) {
      var c;
      return c;
    }
    LE.O = "getReferrerQueryParameters";
    function ME(a) {
      var b = "";
      return b;
    }
    ME.O = "getReferrerUrl";
    function NE() {
      return rj();
    }
    NE.D = "internal.getRegionCode";
    function OE(a, b) {
      var c;
      return c;
    }
    OE.D = "internal.getRemoteConfigParameter";
    function PE(a) {
      var b = "";
      return b;
    }
    PE.O = "getUrl";
    var RE = function(a) {
      return To(a, N.g.Kb, S(a.o, N.g.Kb)) || To(a, "google_ono", false);
    }, SE = function(a) {
      if (a.metadata.is_merchant_center || !cp(a.o))
        return false;
      if (!S(a.o, N.g.Sd)) {
        var b = S(a.o, N.g.Ld);
        return true === b || "true" === b;
      }
      return true;
    }, TE = function(a) {
      var b = a.metadata.user_data;
      if (mb(b))
        return b;
    }, UE = function(a, b) {
      var c = To(a, N.g.Jd, a.o.s[N.g.Jd]);
      if (c && void 0 !== c[b || a.eventName])
        return c[b || a.eventName];
    }, VE = function(a, b, c) {
      a.h[N.g.ne] || (a.h[N.g.ne] = {});
      a.h[N.g.ne][b] = c;
    };
    var WE = false, XE = function(a) {
      var b = a.eventName === N.g.ic && Pj() && SE(a), c = a.metadata.is_sgtm_service_worker, d = a.metadata.batch_on_navigation, e = a.metadata.is_conversion, f = a.metadata.is_session_start, g = a.metadata.create_dc_join, h = a.metadata.create_google_join, m = a.metadata.euid_mode_enabled && !!TE(a);
      return !(!Cc.sendBeacon || e || m || f || g || h || b || c || !d && WE);
    };
    var YE = function(a) {
      var b = 0, c = 0;
      return { start: function() {
        b = Sa();
      }, stop: function() {
        c = this.get();
      }, get: function() {
        var d = 0;
        a.wh() && (d = Sa() - b);
        return d + c;
      } };
    }, ZE = function() {
      this.h = void 0;
      this.s = 0;
      this.isActive = this.isVisible = this.C = false;
      this.M = this.F = void 0;
    };
    aa = ZE.prototype;
    aa.Pk = function(a) {
      var b = this;
      if (!this.h) {
        this.C = C.hasFocus();
        this.isVisible = !C.hidden;
        this.isActive = true;
        var c = function(d, e, f) {
          Oc(d, e, function(g) {
            b.h.stop();
            f(g);
            b.wh() && b.h.start();
          });
        };
        c(z, "focus", function() {
          b.C = true;
        });
        c(z, "blur", function() {
          b.C = false;
        });
        c(z, "pageshow", function(d) {
          b.isActive = true;
          d.persisted && L(56);
          b.M && b.M();
        });
        c(z, "pagehide", function() {
          b.isActive = false;
          b.F && b.F();
        });
        c(C, "visibilitychange", function() {
          b.isVisible = !C.hidden;
        });
        SE(a) && -1 === (Cc.userAgent || "").indexOf("Firefox") && -1 === (Cc.userAgent || "").indexOf("FxiOS") && c(z, "beforeunload", function() {
          WE = true;
        });
        this.Qh();
        this.s = 0;
      }
    };
    aa.Qh = function() {
      this.s += this.Jf();
      this.h = YE(this);
      this.wh() && this.h.start();
    };
    aa.nn = function(a) {
      var b = this.Jf();
      0 < b && (a.h[N.g.Fd] = b);
    };
    aa.Zl = function(a) {
      a.h[N.g.Fd] = void 0;
      this.Qh();
      this.s = 0;
    };
    aa.wh = function() {
      return this.C && this.isVisible && this.isActive;
    };
    aa.Ql = function() {
      return this.s + this.Jf();
    };
    aa.Jf = function() {
      return this.h && this.h.get() || 0;
    };
    aa.Um = function(a) {
      this.F = a;
    };
    aa.Rj = function(a) {
      this.M = a;
    };
    var $E = function(a) {
      Ab("GA4_EVENT", a);
    };
    function aF() {
      return z.gaGlobal = z.gaGlobal || {};
    }
    var bF = function() {
      var a = aF();
      a.hid = a.hid || Ja();
      return a.hid;
    }, cF = function(a, b) {
      var c = aF();
      if (void 0 == c.vid || b && !c.from_cookie)
        c.vid = a, c.from_cookie = b;
    };
    var dF = function(a, b, c) {
      var d = a.metadata.client_id_source;
      if (void 0 === d || c <= d)
        a.h[N.g.ub] = b, a.metadata.client_id_source = c;
    }, gF = function(a, b) {
      var c;
      var d = b.metadata.cookie_options, e = d.prefix + "_ga", f = Om(d, void 0, void 0, N.g.R);
      if (false === S(b.o, N.g.mc) && eF(b) === a)
        c = true;
      else {
        var g = Yl(a, fF[0], d.domain, d.path);
        c = 1 !== Ql(e, g, f);
      }
      return c;
    }, eF = function(a) {
      var b = a.metadata.cookie_options, c = b.prefix + "_ga", d = Xl(c, b.domain, b.path, fF, N.g.R);
      if (!d) {
        var e = String(S(a.o, N.g.kc, ""));
        e && e != c && (d = Xl(e, b.domain, b.path, fF, N.g.R));
      }
      return d;
    }, fF = ["GA1"], hF = function(a, b) {
      var c = a.h[N.g.ub];
      if (S(a.o, N.g.yb) && S(a.o, N.g.Lb) || b && c === b)
        return c;
      if (c) {
        c = "" + c;
        if (!gF(c, a))
          return L(31), a.isAborted = true, "";
        cF(c, ck(N.g.R));
        return c;
      }
      L(32);
      a.isAborted = true;
      return "";
    };
    var kF = function(a, b, c) {
      if (!b)
        return a;
      if (!a)
        return b;
      var d = iF(a);
      if (!d)
        return b;
      var e, f = Na(null != (e = S(c.o, N.g.ad)) ? e : 30);
      if (!(Math.floor(c.metadata.event_start_timestamp_ms / 1e3) > d.Ke + 60 * f))
        return a;
      var g = iF(b);
      if (!g)
        return a;
      g.Gc = d.Gc + 1;
      var h;
      return null != (h = jF(g.sessionId, g.Gc, g.pd, g.Ke, g.Ah, g.Bc, g.te)) ? h : b;
    }, nF = function(a, b) {
      var c = b.metadata.cookie_options, d = lF(b, c), e = Yl(a, mF[0], c.domain, c.path), f = { Gb: N.g.R, domain: c.domain, path: c.path, expires: c.Wb ? new Date(Sa() + 1e3 * c.Wb) : void 0, flags: c.flags };
      Ql(
        d,
        void 0,
        f
      );
      return 1 !== Ql(d, e, f);
    }, oF = function(a) {
      var b = a.metadata.cookie_options, c = lF(a, b), d = Xl(c, b.domain, b.path, mF, N.g.R);
      if (!d)
        return d;
      var e = Hl(c, void 0, void 0, N.g.R);
      if (d && 1 < e.length) {
        L(114);
        for (var f = void 0, g = void 0, h = 0; h < e.length; h++) {
          var m = e[h].split(".");
          if (!(7 > m.length)) {
            var n = Number(m[5]);
            n && (!g || n > g) && (g = n, f = e[h]);
          }
        }
        f && f.substring(f.length - d.length, f.length) !== d && (L(115), d = f.split(".").slice(2).join("."));
      }
      return d;
    }, jF = function(a, b, c, d, e, f, g) {
      if (a && b) {
        var h = [a, b, Na(c), d, e];
        h.push(f ? "1" : "0");
        h.push(g || "0");
        return h.join(".");
      }
    }, mF = ["GS1"], lF = function(a, b) {
      return b.prefix + "_ga_" + a.target.P[0];
    }, iF = function(a) {
      if (a) {
        var b = a.split(".");
        if (!(5 > b.length || 7 < b.length)) {
          7 > b.length && L(67);
          var c = Number(b[1]), d = Number(b[3]), e = Number(b[4] || 0);
          c || L(118);
          d || L(119);
          isNaN(e) && L(120);
          if (c && d && !isNaN(e))
            return { sessionId: b[0], Gc: c, pd: !!Number(b[2]), Ke: d, Ah: e, Bc: "1" === b[5], te: "0" !== b[6] ? b[6] : void 0 };
        }
      }
    }, pF = function(a) {
      return jF(a.h[N.g.Cb], a.h[N.g.Ud], a.h[N.g.Td], Math.floor(a.metadata.event_start_timestamp_ms / 1e3), a.metadata.join_timer_sec || 0, !!a.metadata[N.g.ef], a.h[N.g.Gd]);
    };
    var qF = function(a) {
      var b = S(a.o, N.g.Ma), c = a.o.s[N.g.Ma];
      if (c === b)
        return c;
      var d = nb(b);
      c && c[N.g.W] && (d[N.g.W] = (d[N.g.W] || []).concat(c[N.g.W]));
      return d;
    }, rF = function(a, b) {
      var c = dn(true);
      return "1" !== c._up ? {} : { clientId: c[a], Sf: c[b] };
    }, sF = function(a, b, c) {
      var d = dn(true), e = d[b];
      e && (dF(a, e, 2), gF(e, a));
      var f = d[c];
      f && nF(f, a);
      return { clientId: e, Sf: f };
    }, tF = false, uF = function(a) {
      var b = qF(a) || {}, c = a.metadata.cookie_options, d = c.prefix + "_ga", e = lF(a, c), f = {};
      xn(b[N.g.qc], !!b[N.g.W]) && (f = sF(a, d, e), f.clientId && f.Sf && (tF = true));
      b[N.g.W] && un(function() {
        var g = {}, h = eF(a);
        h && (g[d] = h);
        var m = oF(a);
        m && (g[e] = m);
        var n = Hl("FPLC", void 0, void 0, N.g.R);
        n.length && (g._fplc = n[0]);
        return g;
      }, b[N.g.W], b[N.g.Mb], !!b[N.g.zb]);
      return f;
    }, wF = function(a) {
      if (!S(a.o, N.g.Db))
        return {};
      var b = a.metadata.cookie_options, c = b.prefix + "_ga", d = lF(a, b);
      vn(function() {
        var e;
        if (ck("analytics_storage"))
          e = {};
        else {
          var f = {};
          e = (f._up = "1", f[c] = a.h[N.g.ub], f[d] = pF(a), f);
        }
        return e;
      }, 1);
      return !ck("analytics_storage") && vF() ? rF(c, d) : {};
    }, vF = function() {
      var a = Fm(z.location, "host"), b = Fm(
        Lm(C.referrer),
        "host"
      );
      return a && b ? a === b || 0 <= a.indexOf("." + b) || 0 <= b.indexOf("." + a) ? true : false : false;
    };
    var xF = function() {
      var a = Sa(), b = a + 864e5, c = 20, d = 5e3;
      return function() {
        var e = Sa();
        e >= b && (b = e + 864e5, d = 5e3);
        if (1 > d)
          return false;
        c = Math.min(c + (e - a) / 1e3 * 5, 20);
        a = e;
        if (1 > c)
          return false;
        d--;
        c--;
        return true;
      };
    };
    var yF = function(a, b) {
      tl() && (a.gcs = ul(), b.metadata.is_consent_update && (a.gcu = "1"));
      a.gcd = yl(b.o);
      sl(b.o) ? R(29) && (a.npa = "0") : a.npa = "1";
    }, BF = function(a) {
      if (a.metadata.is_merchant_center)
        return "https://www.merchant-center-analytics.goog/mc/collect";
      var b = ap(cp(a.o), "/g/collect");
      if (b)
        return b;
      var c = RE(a), d = S(a.o, N.g.ib);
      return c && !sj() && false !== d && wD() && ck(N.g.J) && ck(N.g.R) ? zF() : AF();
    }, CF = false;
    CF = true;
    var DF = {};
    DF[N.g.ub] = "cid";
    DF[N.g.ff] = "_fid";
    DF[N.g.wg] = "_geo";
    DF[N.g.xb] = "gdid";
    DF[N.g.Wc] = "ir";
    DF[N.g.La] = "ul";
    DF[N.g.Rd] = "_rdi";
    DF[N.g.Bb] = "sr";
    DF[N.g.Ri] = "tid";
    DF[N.g.rf] = "tt";
    DF[N.g.ee] = "ec_mode";
    DF[N.g.aj] = "gtm_up";
    DF[N.g.Wd] = "uaa";
    DF[N.g.Xd] = "uab";
    DF[N.g.Yd] = "uafvl";
    DF[N.g.Zd] = "uamb";
    DF[N.g.ae] = "uam";
    DF[N.g.be] = "uap";
    DF[N.g.ce] = "uapv";
    DF[N.g.de] = "uaw";
    DF[N.g.Jb] = "are";
    DF[N.g.Si] = "ur";
    DF[N.g.jf] = "lps";
    DF[N.g.Hg] = "pae";
    var EF = {};
    EF[N.g.Ic] = "cc";
    EF[N.g.Jc] = "ci";
    EF[N.g.Kc] = "cm";
    EF[N.g.Lc] = "cn";
    EF[N.g.Nc] = "cs";
    EF[N.g.Oc] = "ck";
    EF[N.g.xa] = "cu";
    EF[N.g.Aa] = "dl";
    EF[N.g.Na] = "dr";
    EF[N.g.Ab] = "dt";
    EF[N.g.Td] = "seg";
    EF[N.g.Cb] = "sid";
    EF[N.g.Ud] = "sct";
    EF[N.g.Ta] = "uid";
    R(20) && (EF[N.g.Yc] = "dp");
    var FF = {};
    FF[N.g.Fd] = "_et";
    FF[N.g.vb] = "edid";
    var GF = {};
    GF[N.g.Ic] = "cc";
    GF[N.g.Jc] = "ci";
    GF[N.g.Kc] = "cm";
    GF[N.g.Lc] = "cn";
    GF[N.g.Nc] = "cs";
    GF[N.g.Oc] = "ck";
    var HF = {}, IF = Object.freeze((HF[N.g.Ba] = 1, HF)), AF = function() {
      var a = "www";
      CF && tj() && (a = tj());
      return "https://" + a + ".google-analytics.com/g/collect";
    }, zF = function() {
      var a;
      CF && "" !== tj() && (a = tj());
      return "https://" + (a ? a + "." : "") + "analytics.google.com/g/collect";
    }, JF = function(a, b, c) {
      var d = {}, e = {}, f = {};
      d.v = "2";
      d.tid = a.target.da;
      To(a, "google_ono", false) && !sj() && (d._ono = 1);
      d.gtm = Am(So(a));
      d._p = R(74) ? Gi : bF();
      c && (d.em = c);
      a.metadata.create_google_join && (d._gaz = 1);
      yF(d, a);
      Bl() && (d.dma_cps = zl());
      d.dma = Al();
      Xk(el()) && (d.tcfd = Cl());
      var g = a.h[N.g.xb];
      g && (d.gdid = g);
      e.en = String(a.eventName);
      a.metadata.is_first_visit && (e._fv = a.metadata.is_first_visit_conversion ? 2 : 1);
      a.metadata.is_new_to_site && (e._nsi = 1);
      a.metadata.is_session_start && (e._ss = a.metadata.is_session_start_conversion ? 2 : 1);
      a.metadata.is_conversion && (e._c = 1);
      a.metadata.is_external_event && (e._ee = 1);
      if (a.metadata.is_ecommerce) {
        var h = a.h[N.g.Z] || S(a.o, N.g.Z);
        if (Ha(h))
          for (var m = 0; m < h.length && 200 > m; m++)
            e["pr" + (m + 1)] = fg(h[m]);
      }
      var n = a.h[N.g.vb];
      n && (e.edid = n);
      var p = function(t, u) {
        if ("object" !== typeof u || !IF[t]) {
          var v = "ep." + t, w = "epn." + t;
          t = Ga(u) ? w : v;
          var x = Ga(u) ? v : w;
          e.hasOwnProperty(x) && delete e[x];
          e[t] = String(u);
        }
      }, q = R(62) && SE(a);
      l(a.h, function(t, u) {
        if (void 0 !== u && !bi.hasOwnProperty(t)) {
          null === u && (u = "");
          var v;
          t !== N.g.Gd ? v = false : a.metadata.euid_mode_enabled || q ? (d.ecid = u, v = true) : v = void 0;
          if (!v && t !== N.g.ef) {
            var w = u;
            true === u && (w = "1");
            false === u && (w = "0");
            w = String(w);
            var x;
            if (DF[t])
              x = DF[t], d[x] = w;
            else if (EF[t])
              x = EF[t], f[x] = w;
            else if (FF[t])
              x = FF[t], e[x] = w;
            else if ("_" === t.charAt(0))
              d[t] = w;
            else {
              var y;
              GF[t] ? y = true : t !== N.g.Mc ? y = false : ("object" !== typeof u && p(t, u), y = true);
              y || p(t, u);
            }
          }
        }
      });
      (function(t) {
        SE(a) && "object" === typeof t && l(t || {}, function(u, v) {
          "object" !== typeof v && (d["sst." + u] = String(v));
        });
      })(a.h[N.g.ne]);
      var r = a.h[N.g.Ya] || {};
      R(8) && false === S(a.o, N.g.ib, void 0, 4) && (d.ngs = "1");
      l(r, function(t, u) {
        void 0 !== u && ((null === u && (u = ""), t !== N.g.Ta || f.uid) ? b[t] !== u && (e[(Ga(u) ? "upn." : "up.") + String(t)] = String(u), b[t] = u) : f.uid = String(u));
      });
      return hg.call(this, { la: d, Hc: f, kh: e }, BF(a), SE(a)) || this;
    };
    sa(JF, hg);
    var KF = function(a) {
      this.s = a;
      this.C = "";
      this.h = this.s;
    }, LF = function(a, b) {
      a.h = b;
      return a;
    };
    function MF(a) {
      var b = a.search;
      return a.protocol + "//" + a.hostname + a.pathname + (b ? b + "&richsstsse" : "?richsstsse");
    }
    function NF(a, b, c) {
      if (a) {
        var d = a || [], e = mb(b) ? b : {};
        if (Array.isArray(d))
          for (var f = 0; f < d.length; f++)
            c(d[f], e);
      }
    }
    var OF = function(a, b) {
      return a.replace(/\$\{([^\}]+)\}/g, function(c, d) {
        return b[d] || c;
      });
    }, PF = function(a) {
      var b = {}, c = "", d = a.pathname.indexOf("/g/collect");
      0 <= d && (c = a.pathname.substring(0, d));
      b.transport_url = a.protocol + "//" + a.hostname + c;
      return b;
    }, QF = function(a, b, c) {
      var d = LF(new KF(function(g) {
        var h = OF(g, c);
        Nc(h);
      }), function(g) {
        var h = OF(g, c);
        Uc(h);
      }), e = 0, f = new z.XMLHttpRequest();
      f.withCredentials = true;
      f.onprogress = function(g) {
        if (200 === f.status) {
          var h = f.responseText.substring(e);
          e = g.loaded;
          var m;
          m = d.C + h;
          for (var n = m.indexOf("\n\n"); -1 !== n; ) {
            var p;
            a: {
              var q = ea(m.substring(0, n).split("\n")), r = q.next().value, t = q.next().value;
              if (0 === r.indexOf("event: message") && 0 === t.indexOf("data: "))
                try {
                  p = JSON.parse(t.substring(t.indexOf(":") + 1));
                  break a;
                } catch (w) {
                }
              p = void 0;
            }
            var u = d, v = p;
            v && (NF(v.send_pixel, v.options, u.s), NF(v.send_beacon, void 0, u.h));
            m = m.substring(n + 2);
            n = m.indexOf("\n\n");
          }
          d.C = m;
        }
      };
      f.open(b ? "POST" : "GET", a);
      f.send(b);
    }, RF = function(a, b) {
      var c = Lm(a), d = PF(c), e = MF(c);
      R(82) && R(75) ? Ur() : QF(e, b, d);
    };
    var UF = function(a, b, c, d) {
      var e = R(50) && d;
      if (R(49) || e) {
        var f = b, g = Xc();
        void 0 !== g && (f += "&tfd=" + Math.round(g));
        b = f;
      }
      var h = a + "?" + b;
      d && !WE ? RF(h, c) : TF(a, b, c);
    }, VF = function(a, b) {
      function c(v) {
        q.push(v + "=" + encodeURIComponent("" + a.la[v]));
      }
      var d = b.dn, e = b.fn, f = b.Tl, g = b.rl, h = b.ql, m = b.jm, n = b.im, p = b.Sm;
      if (d || e) {
        var q = [];
        a.la._ono && c("_ono");
        c("tid");
        c("cid");
        c("gtm");
        q.push("aip=1");
        a.Hc.uid && !n && q.push("uid=" + encodeURIComponent("" + a.Hc.uid));
        var r = function() {
          c("dma");
          null != a.la.dma_cps && c("dma_cps");
          null != a.la.gcs && c("gcs");
          c("gcd");
          null != a.la.npa && c("npa");
        };
        r();
        d && (TF("https://stats.g.doubleclick.net/g/collect", "v=2&" + q.join("&")), Vj("https://stats.g.doubleclick.net/g/collect?v=2&" + q.join("&")));
        if (e) {
          var t = function() {
            var v = rs() + "/td/ga/rul?";
            q = [];
            c("tid");
            q.push("gacid=" + encodeURIComponent(String(a.la.cid)));
            c("gtm");
            r();
            R(100) && c("pscdl");
            q.push("aip=1");
            q.push("fledge=1");
            q.push("z=" + Ja());
            qs(v + q.join("&"), a.la.tid);
          };
          q.push("z=" + Ja());
          if (!m) {
            var u = f && 0 === f.indexOf("google.") && "google.com" != f ? "https://www.%/ads/ga-audiences?v=1&t=sr&slf_rd=1&_r=4&".replace("%", f) : void 0;
            u && Nc(u + q.join("&"));
          }
          R(8) && (R(87) ? p && !WE && t() : !WE && g && h && ps() && t());
        }
      }
    };
    var WF = function() {
      this.F = 1;
      this.M = {};
      this.h = new ig();
      this.s = -1;
    };
    WF.prototype.C = function(a, b) {
      var c = this, d = new JF(a, this.M, b), e = XE(a);
      e && this.h.X(d) || this.flush();
      if (e && this.h.add(d)) {
        if (0 > this.s) {
          var f = z.setTimeout, g;
          SE(a) ? XF ? (XF = false, g = YF) : g = ZF : g = 5e3;
          this.s = f.call(z, function() {
            return c.flush();
          }, g);
        }
      } else {
        var h = kg(d, this.F++);
        UF(d.s, h.params, h.body, d.F);
        var m = a.metadata.create_dc_join, n = a.metadata.create_google_join, p = false !== S(a.o, N.g.Ga), q = sl(a.o), r = { eventId: a.o.eventId, priorityId: a.o.priorityId }, t = false;
        R(87) && (t = a.h[N.g.Hg]);
        var u = { dn: m, fn: n, Tl: vj(), rl: p, ql: q, jm: sj(), im: a.metadata.euid_mode_enabled, Wn: r, Sm: t, o: a.o };
        VF(d, u);
      }
      du(a.o.eventId, a.eventName);
    };
    WF.prototype.add = function(a) {
      a.metadata.euid_mode_enabled && !WE ? this.X(a) : this.C(a);
    };
    WF.prototype.flush = function() {
      if (this.h.events.length) {
        var a = lg(this.h, this.F++);
        UF(this.h.s, a.params, a.body, this.h.C);
        this.h = new ig();
        0 <= this.s && (z.clearTimeout(this.s), this.s = -1);
      }
    };
    WF.prototype.X = function(a) {
      var b = this, c = TE(a);
      c ? Zh(c, function(d) {
        b.C(a, 1 === d.split("~").length ? void 0 : d);
      }) : this.C(a);
    };
    var TF = function(a, b, c) {
      var d = a + "?" + b;
      if (c)
        try {
          Cc.sendBeacon && Cc.sendBeacon(d, c);
        } catch (e) {
          Ab("TAGGING", 15);
        }
      else
        Uc(d);
    }, YF = zk(
      "",
      500
    ), ZF = zk("", 5e3), XF = true;
    var $F = function(a, b, c) {
      void 0 === c && (c = {});
      if ("object" === typeof b)
        for (var d in b)
          $F(a + "." + d, b[d], c);
      else
        c[a] = b;
      return c;
    }, aG = function(a) {
      if (SE(a)) {
        if (R(62)) {
          var b = To(a, "ccd_add_1p_data", false) ? 1 : 0;
          VE(a, "ude", b);
        }
        var c = function(e) {
          var f = $F(N.g.Ba, e);
          l(f, function(g, h) {
            a.h[g] = h;
          });
        }, d = S(a.o, N.g.Ba);
        void 0 !== d ? (c(d), R(57) && (a.h[N.g.ee] = "c")) : c(a.metadata.user_data);
        a.metadata.user_data = void 0;
      }
    };
    var bG = window, cG = document, dG = function(a) {
      var b = bG._gaUserPrefs;
      if (b && b.ioo && b.ioo() || cG.documentElement.hasAttribute("data-google-analytics-opt-out") || a && true === bG["ga-disable-" + a])
        return true;
      try {
        var c = bG.external;
        if (c && c._gaUserPrefs && "oo" == c._gaUserPrefs)
          return true;
      } catch (f) {
      }
      for (var d = El("AMP_TOKEN", String(cG.cookie), true), e = 0; e < d.length; e++)
        if ("$OPT_OUT" == d[e])
          return true;
      return cG.getElementById("__gaOptOutExtension") ? true : false;
    };
    var fG = function(a) {
      return !a || eG.test(a) || di.hasOwnProperty(a);
    }, gG = function(a) {
      var b = N.g.Bb, c;
      c || (c = function() {
      });
      void 0 !== a.h[b] && (a.h[b] = c(a.h[b]));
    }, hG = function(a) {
      var b = a.indexOf("?"), c = -1 === b ? a : a.substring(0, b);
      try {
        c = decodeURIComponent(c);
      } catch (d) {
      }
      return -1 === b ? c : "" + c + a.substring(b);
    }, iG = function(a, b, c) {
      ck(c) || ek(function() {
        b.metadata.is_consent_update = true;
        var d = li[c || ""];
        d && VE(b, "gcut", d);
        a.rj(b);
      }, c);
    }, js = { Dl: "", pn: Number("") }, jG = {}, kG = (jG[N.g.Ic] = 1, jG[N.g.Jc] = 1, jG[N.g.Kc] = 1, jG[N.g.Lc] = 1, jG[N.g.Nc] = 1, jG[N.g.Oc] = 1, jG), eG = /^(_|ga_|google_|gtag\.|firebase_).*$/, lG = function(a) {
      this.Oa = a;
      this.Rb = new WF();
      this.h = void 0;
      this.F = new ZE();
      this.s = this.C = void 0;
      this.Sb = this.X = false;
      this.ed = 0;
      this.M = false;
    };
    aa = lG.prototype;
    aa.Qm = function(a, b, c) {
      var d = this, e = yo(this.Oa);
      if (e)
        if (c.eventMetadata.is_external_event && "_" === a.charAt(0))
          c.onFailure();
        else {
          a !== N.g.sa && a !== N.g.Pa && fG(a) && L(58);
          mG(c.h);
          var f = new Ro(e, a, c);
          f.metadata.event_start_timestamp_ms = b;
          var g = [N.g.R];
          (To(f, N.g.Kb, S(f.o, N.g.Kb)) || SE(f)) && g.push(N.g.J);
          R(44) && SE(f) && g.push(N.g.N);
          ks(function() {
            fk(function() {
              d.Rm(f);
            }, g);
          });
        }
      else
        c.onFailure();
    };
    aa.Rm = function(a) {
      this.s = a;
      try {
        if (dG(a.target.da))
          L(28), a.isAborted = true;
        else if (R(24)) {
          var b;
          var c = nm(um()), d = c && c.parent;
          b = d ? nm(d) : void 0;
          if (b && Ha(b.destinations)) {
            for (var e = 0; e < b.destinations.length; e++)
              if (dG(b.destinations[e])) {
                L(125);
                a.isAborted = true;
                break;
              }
          }
        }
        if (0 <= js.Dl.replace(/\s+/g, "").split(",").indexOf(a.eventName))
          a.isAborted = true;
        else {
          var f = UE(a);
          f && f.blacklisted && (a.isAborted = true);
        }
        var g = C.location.protocol;
        "http:" != g && "https:" != g && (L(29), a.isAborted = true);
        Cc && "preview" == Cc.loadPurpose && (L(30), a.isAborted = true);
        R(27) && (a.isAborted = true);
        tq(a);
        var h = ri.grl;
        h || (h = xF(), ri.grl = h);
        h() || (L(35), a.isAborted = true);
        if (a.isAborted) {
          a.o.onFailure();
          Bb();
          return;
        }
        var m = { prefix: String(S(a.o, N.g.Ra, "")), path: String(S(a.o, N.g.Qc, "/")), flags: String(S(a.o, N.g.Xa, "")), domain: String(S(a.o, N.g.Wa, "auto")), Wb: Number(S(a.o, N.g.Ka, 63072e3)) };
        a.metadata.cookie_options = m;
        nG(a);
        this.Qk(a);
        this.F.nn(a);
        a.metadata.is_merchant_center ? a.metadata.euid_mode_enabled = false : To(a, "ccd_add_1p_data", false) && (a.metadata.euid_mode_enabled = true);
        if (a.metadata.euid_mode_enabled && To(a, "ccd_add_1p_data", false)) {
          var n = a.o.s[N.g.fe];
          if ($i(n)) {
            var p = S(a.o, N.g.Ba);
            null === p ? a.metadata.user_data_from_code = null : (n.enable_code && mb(p) && (a.metadata.user_data_from_code = p), mb(n.selectors) && !a.metadata.user_data_from_manual && (a.metadata.user_data_from_manual = Zi(n.selectors)));
          }
        }
        var q = this.Qj, r;
        S(a.o, N.g.Db) && (ck(N.g.R) || S(a.o, N.g.ub) || (a.h[N.g.aj] = true));
        var t;
        var u;
        u = void 0 === u ? 3 : u;
        var v = z.location.href;
        if (v) {
          var w = Lm(v).search.replace("?", ""), x = Dm(w, "_gl", false, true) || "";
          t = x ? void 0 !== on(x, u) : false;
        } else
          t = false;
        t && SE(a) && VE(a, "glv", 1);
        if (a.eventName !== N.g.sa)
          r = {};
        else {
          S(a.o, N.g.Db) && ko(["aw", "dc"]);
          mo(["aw", "dc"]);
          var y = uF(a), A = wF(a);
          r = Object.keys(y).length ? y : A;
        }
        q.call(this, r);
        var B = a.eventName === N.g.sa;
        B && (this.M = true);
        a.eventName == N.g.sa && (S(a.o, N.g.Sa, true) ? (a.o.h[N.g.ba] && (a.o.C[N.g.ba] = a.o.h[N.g.ba], a.o.h[N.g.ba] = void 0, a.h[N.g.ba] = void 0), a.eventName = N.g.ic) : a.isAborted = true);
        B && !a.isAborted && 0 < this.ed++ && $E(17);
        var E = bb(lk(a.o, N.g.ba, 1), ".");
        E && (a.h[N.g.xb] = E);
        var G = bb(lk(a.o, N.g.ba, 2), ".");
        G && (a.h[N.g.vb] = G);
        var D = this.C, M = this.F, P = !this.Sb, O = this.h, T = S(a.o, N.g.ub);
        if (S(a.o, N.g.yb) && S(a.o, N.g.Lb))
          T ? dF(a, T, 1) : (L(127), a.isAborted = true);
        else {
          var Y = T ? 1 : 8;
          a.metadata.is_new_to_site = false;
          T || (T = eF(a), Y = 3);
          T || (T = O, Y = 5);
          if (!T) {
            var W = ck(N.g.R), X = aF();
            T = !X.from_cookie || W ? X.vid : void 0;
            Y = 6;
          }
          T ? T = "" + T : (T = Wl(), Y = 7, a.metadata.is_first_visit = a.metadata.is_new_to_site = true);
          dF(a, T, Y);
        }
        var la = Math.floor(a.metadata.event_start_timestamp_ms / 1e3), ka = void 0;
        a.metadata.is_new_to_site || (ka = oF(a) || D);
        var fa = Na(S(a.o, N.g.ad, 30));
        fa = Math.min(475, fa);
        fa = Math.max(5, fa);
        var Da = Na(S(a.o, N.g.pf, 1e4)), pa = iF(ka);
        a.metadata.is_first_visit = false;
        a.metadata.is_session_start = false;
        a.metadata.join_timer_sec = 0;
        pa && pa.Ah && (a.metadata.join_timer_sec = Math.max(0, pa.Ah - Math.max(0, la - pa.Ke)));
        var Ea = false;
        pa || (Ea = a.metadata.is_first_visit = true, pa = { sessionId: String(la), Gc: 1, pd: false, Ke: la, Bc: false, te: void 0 });
        la > pa.Ke + 60 * fa && (Ea = true, pa.sessionId = String(la), pa.Gc++, pa.pd = false, pa.te = void 0);
        if (Ea)
          a.metadata.is_session_start = true, M.Zl(a);
        else if (M.Ql() > Da || a.eventName == N.g.ic)
          pa.pd = true;
        a.metadata.euid_mode_enabled ? S(a.o, N.g.Ta) ? pa.Bc = true : (pa.Bc && (pa.te = void 0), pa.Bc = false) : pa.Bc = false;
        var Ua = pa.te, lb = R(62) && SE(a);
        if (a.metadata.euid_mode_enabled || lb) {
          var Ib = S(a.o, N.g.Gd), Kc = Ib ? 1 : 8;
          Ib || (Ib = Ua, Kc = 4);
          Ib || (Ib = Vl(), Kc = 7);
          var ae = Ib.toString(), eh = Kc, jj = a.metadata.enhanced_client_id_source;
          if (void 0 === jj || eh <= jj)
            a.h[N.g.Gd] = ae, a.metadata.enhanced_client_id_source = eh;
        }
        P ? (a.copyToHitData(N.g.Cb, pa.sessionId), a.copyToHitData(N.g.Ud, pa.Gc), a.copyToHitData(N.g.Td, pa.pd ? 1 : 0)) : (a.h[N.g.Cb] = pa.sessionId, a.h[N.g.Ud] = pa.Gc, a.h[N.g.Td] = pa.pd ? 1 : 0);
        a.metadata[N.g.ef] = pa.Bc ? 1 : 0;
        oG(a);
        if (!S(a.o, N.g.Lb) || !S(a.o, N.g.yb)) {
          var fh = "", gh = C.location;
          if (gh) {
            var kj = gh.pathname || "";
            "/" != kj.charAt(0) && (kj = "/" + kj);
            fh = gh.protocol + "//" + gh.hostname + kj + gh.search;
          }
          a.copyToHitData(N.g.Aa, fh, hG);
          var vI = a.copyToHitData, wI = N.g.Na, lj;
          a: {
            var dw = Hl(
              "_opt_expid",
              void 0,
              void 0,
              N.g.R
            )[0];
            if (dw) {
              var ew = decodeURIComponent(dw).split("$");
              if (3 === ew.length) {
                lj = ew[2];
                break a;
              }
            }
            if (void 0 !== ri.ga4_referrer_override)
              lj = ri.ga4_referrer_override;
            else {
              var fw = Si("gtm.gtagReferrer." + a.target.da), xI = C.referrer;
              lj = fw ? "" + fw : xI;
            }
          }
          vI.call(a, wI, lj || void 0, hG);
          a.copyToHitData(N.g.Ab, C.title);
          a.copyToHitData(N.g.La, (Cc.language || "").toLowerCase());
          var gw = Aq();
          a.copyToHitData(N.g.Bb, gw.width + "x" + gw.height);
          R(20) && a.copyToHitData(N.g.Yc, void 0, hG);
          R(51) && zq() && a.copyToHitData(
            N.g.jf,
            "1"
          );
        }
        a.metadata.create_dc_join = false;
        a.metadata.create_google_join = false;
        if (!(R(36) && SE(a) || a.metadata.is_merchant_center || false === S(a.o, N.g.ib)) && wD() && ck(N.g.J)) {
          var hw = RE(a);
          (a.metadata.is_session_start || S(a.o, N.g.vg)) && (a.metadata.create_dc_join = !!hw);
          var iw;
          iw = a.metadata.join_timer_sec;
          hw && 0 === (iw || 0) && (a.metadata.join_timer_sec = 60, a.metadata.create_google_join = true);
        }
        pG(a);
        fi.hasOwnProperty(a.eventName) && (a.metadata.is_ecommerce = true, a.copyToHitData(N.g.Z), a.copyToHitData(N.g.xa));
        a.copyToHitData(N.g.rf);
        for (var jw = S(a.o, N.g.hf) || [], en = 0; en < jw.length; en++) {
          var kw = jw[en];
          if (kw.rule_result) {
            a.copyToHitData(N.g.rf, kw.traffic_type);
            $E(3);
            break;
          }
        }
        if (!a.metadata.is_merchant_center && cp(a.o)) {
          var lw = qF(a) || {}, zI = (xn(lw[N.g.qc], !!lw[N.g.W]) ? dn(true)._fplc : void 0) || (0 < Hl("FPLC", void 0, void 0, N.g.R).length ? void 0 : "0");
          a.h._fplc = zI;
        }
        if (void 0 !== S(a.o, N.g.Wc))
          a.copyToHitData(N.g.Wc);
        else {
          var mw = S(a.o, N.g.lf), fn, mj;
          a: {
            if (tF) {
              var gn = qF(a) || {};
              if (gn && gn[N.g.W]) {
                for (var nw = Gm(Lm(a.h[N.g.Na]), "host", true), nj = gn[N.g.W], hh = 0; hh < nj.length; hh++)
                  if (nj[hh] instanceof RegExp) {
                    if (nj[hh].test(nw)) {
                      mj = true;
                      break a;
                    }
                  } else if (0 <= nw.indexOf(nj[hh])) {
                    mj = true;
                    break a;
                  }
              }
            }
            mj = false;
          }
          if (!(fn = mj)) {
            var oj;
            if (oj = mw)
              a: {
                for (var ow = mw.include_conditions || [], AI = Gm(Lm(a.h[N.g.Na]), "host", true), hn = 0; hn < ow.length; hn++)
                  if (ow[hn].test(AI)) {
                    oj = true;
                    break a;
                  }
                oj = false;
              }
            fn = oj;
          }
          fn && (a.h[N.g.Wc] = "1", $E(4));
        }
        SE(a) && (VE(a, "uc", qj()), Pj() && VE(a, "rnd", Zl()));
        if (R(14) && SE(a)) {
          To(a, N.g.Kb, false) && VE(a, "gse", 1);
          false === S(a.o, N.g.ib, void 0, 4) && VE(a, "ngs", 1);
          sj() && VE(a, "ga_rd", 1);
          wD() || VE(a, "ngst", 1);
          var pw = vj();
          pw && VE(a, "etld", pw);
        }
        if (SE(a)) {
          var qw = CF ? tj() : "";
          qw && VE(a, "gcsub", qw);
        }
        SE(a) && (VE(a, "gcd", yl(a.o)), Pj() && S(a.o, N.g.wa) && VE(a, "adr", 1));
        if (SE(a)) {
          var rw = Fs();
          rw && VE(a, "us_privacy", rw);
          var sw = ll();
          sw && VE(a, "gdpr", sw);
          var tw = jl();
          tw && VE(a, "gdpr_consent", tw);
        }
        R(46) && SE(a) && (a.h[N.g.Si] = rj() || qj());
        if (SE(a) && R(50)) {
          var uw = Gi;
          uw && VE(a, "tft", Number(uw));
        }
        R(55) && SE(a) && (a.metadata.speculative && VE(a, "sp", 1), a.metadata.is_syn && VE(a, "syn", 1), a.metadata.em_event && (VE(a, "em_event", 1), VE(a, "sp", 1)));
        if (!fs(z))
          L(87);
        else if (void 0 !== hs) {
          L(85);
          var vw = ds();
          vw ? S(a.o, N.g.Rd) && !SE(a) || ls(vw, a) : L(86);
        }
        if (R(19)) {
          var jn = ns(ms());
          jn || qG || (qG = true, Nk("AymqwRC7u88Y4JPvfIF2F37QKylC04248hLCdJAsh8xgOfe/dVJPV3XS3wLFca1ZMVOtnBfVjaCMTVudWM//5g4AAAB7eyJvcmlnaW4iOiJodHRwczovL3d3dy5nb29nbGV0YWdtYW5hZ2VyLmNvbTo0NDMiLCJmZWF0dXJlIjoiUHJpdmFjeVNhbmRib3hBZHNBUElzIiwiZXhwaXJ5IjoxNjk1MTY3OTk5LCJpc1RoaXJkUGFydHkiOnRydWV9"), jn = ns(ms()));
          jn && (a.h[N.g.Jb] = "1");
        }
        if (R(87) && false !== S(a.o, N.g.Ga) && sl(a.o)) {
          var BI = RE(a), CI = S(a.o, N.g.ib);
          BI && false !== CI && wD() && ck(N.g.J) && ns("join-ad-interest-group") && Fa(Cc.joinAdInterestGroup) && (a.h[N.g.Hg] = true);
        }
        R(100) && uq(a);
        if (a.eventName == N.g.Pa) {
          var xw = S(a.o, N.g.lb), DI = S(a.o, N.g.wb), yw = void 0;
          yw = a.h[xw];
          DI(yw || S(a.o, xw));
          a.isAborted = true;
        }
        a.copyToHitData(N.g.Ta);
        a.copyToHitData(N.g.Ya);
        Wo(a);
        aG(a);
        R(55) && SE(a) && (a.metadata.speculative = false);
        var zw = S(a.o, N.g.yb);
        zw && $E(12);
        a.metadata.em_event && $E(14);
        var ih = nm(um());
        (zw || ym(ih) || ih && ih.parent && ih.context && 5 === ih.context.source) && $E(19);
        !this.M && a.metadata.em_event && $E(18);
        var kn = a.metadata.event_usage;
        if (Ha(kn))
          for (var ln = 0; ln < kn.length; ln++)
            $E(kn[ln]);
        var Aw = Cb("GA4_EVENT");
        Aw && (a.h._eu = Aw);
        if (a.metadata.speculative || a.isAborted) {
          a.o.onFailure();
          Bb();
          return;
        }
        var EI = this.Qj, Bw, FI = this.h, mn;
        a: {
          var nn = pF(a);
          if (nn) {
            if (nF(nn, a)) {
              mn = nn;
              break a;
            }
            L(25);
            a.isAborted = true;
          }
          mn = void 0;
        }
        var GI = mn;
        Bw = { clientId: hF(a, FI), Sf: GI };
        EI.call(this, Bw);
        this.Sb = true;
        this.kn(a);
        R(77) && ck(N.g.R) && (SE(a) && R(82) && (R(75) || R(76)) && (a.metadata.is_sgtm_service_worker = true), R(75) && (R(82) && SE(a) ? Qr(ap(cp(a.o), "/_")) : R(86) && (zi || Bi || SE(a) || Qr())));
        if (SE(a)) {
          var HI = a.metadata.is_conversion;
          if ("page_view" === a.eventName || HI)
            iG(this, a, N.g.J), R(44) && iG(this, a, N.g.N);
        }
        this.F.Qh();
        a.copyToHitData(N.g.wg);
        S(a.o, N.g.Rd) && (a.h[N.g.Rd] = true, SE(a) || gG(a));
        if (a.isAborted) {
          a.o.onFailure();
          Bb();
          return;
        }
        this.rj(a);
        a.o.onSuccess();
      } catch (jJ) {
        a.o.onFailure();
      }
      Bb();
    };
    aa.rj = function(a) {
      this.Rb.add(a);
    };
    aa.Qj = function(a) {
      var b = a.clientId, c = a.Sf;
      b && c && (this.h = b, this.C = c);
    };
    aa.flush = function() {
      this.Rb.flush();
    };
    aa.kn = function(a) {
      var b = this;
      if (!this.X) {
        var c = ck(N.g.R);
        dk([N.g.R], function() {
          var d = ck(N.g.R);
          if (c ^ d && b.s && b.C && b.h) {
            var e = b.h;
            if (d) {
              var f = eF(b.s);
              if (f) {
                b.h = f;
                var g = oF(b.s);
                g && (b.C = kF(g, b.C, b.s));
              } else
                gF(b.h, b.s), cF(b.h, true);
              nF(b.C, b.s);
              var h = {};
              h[N.g.vg] = e;
              var m = Zv(b.Oa, N.g.xd, h);
              bw(m, a.o.eventId, {});
            } else
              b.C = void 0, b.h = void 0, z.gaGlobal = {};
            c = d;
          }
        });
        this.X = true;
      }
    };
    aa.Qk = function(a) {
      a.eventName !== N.g.Pa && this.F.Pk(a);
    };
    var nG = function(a) {
      function b(c, d) {
        bi[c] || void 0 === d || (a.h[c] = d);
      }
      l(a.o.C, b);
      l(a.o.h, b);
    }, oG = function(a) {
      var b = mk(a.o), c = function(d, e) {
        kG[d] && (a.h[d] = e);
      };
      mb(b[N.g.Mc]) ? l(b[N.g.Mc], function(d, e) {
        c((N.g.Mc + "_" + d).toLowerCase(), e);
      }) : l(b, c);
    }, pG = function(a) {
      var b = function(c) {
        return !!c && c.conversion;
      };
      a.metadata.is_conversion = b(UE(a));
      a.metadata.is_first_visit && (a.metadata.is_first_visit_conversion = b(UE(a, "first_visit")));
      a.metadata.is_session_start && (a.metadata.is_session_start_conversion = b(UE(a, "session_start")));
    }, qG = false;
    function mG(a) {
      l(a, function(c) {
        "_" === c.charAt(0) && delete a[c];
      });
      var b = a[N.g.Ya] || {};
      l(b, function(c) {
        "_" === c.charAt(0) && delete b[c];
      });
    }
    var rG = function(a) {
      if (R(40) && "prerendering" in C ? C.prerendering : "prerender" === C.visibilityState)
        return false;
      a();
      return true;
    }, sG = function(a) {
      if (!rG(a)) {
        var b = false, c = function() {
          !b && rG(a) && (b = true, Pc(C, "visibilitychange", c), R(40) && Pc(C, "prerenderingchange", c), L(55));
        };
        Oc(C, "visibilitychange", c);
        R(40) && Oc(C, "prerenderingchange", c);
        L(54);
      }
    };
    var uG = function(a, b) {
      sG(function() {
        var c = yo(a);
        if (c) {
          var d = tG(c, b);
          Qp(a, d);
        }
      });
    };
    function tG(a, b) {
      var c = function() {
      };
      var d = new lG(a.id), e = "MC" === a.prefix;
      c = function(f, g, h, m) {
        e && (m.eventMetadata.is_merchant_center = true);
        d.Qm(g, h, m);
      };
      vG(a, d, b);
      return c;
    }
    function vG(a, b, c) {
      var d = b.F, e = {}, f = { eventId: c, eventMetadata: (e.batch_on_navigation = true, e) };
      R(37) && (f.deferrable = true);
      d.Um(function() {
        WE = true;
        Pp.flush();
        1e3 <= d.Jf() && Cc.sendBeacon && Rp(N.g.xd, {}, a.id, f);
        b.flush();
        d.Rj(function() {
          WE = false;
          d.Rj();
        });
      });
    }
    function yG(a, b, c) {
    }
    yG.D = "internal.gtagConfig";
    function zG() {
      var a = {};
      return a;
    }
    function BG(a, b) {
    }
    BG.O = "gtagSet";
    function CG(a, b) {
    }
    CG.O = "injectHiddenIframe";
    function DG(a, b, c, d, e) {
    }
    DG.D = "internal.injectHtml";
    function JG(a, b, c, d) {
    }
    function MG(a, b, c, d) {
    }
    JG.O = "injectScript";
    MG.D = "internal.injectScript";
    function NG(a) {
      var b = true;
      return b;
    }
    NG.O = "isConsentGranted";
    var OG = function() {
      var a = kh(function(b) {
        this.h.h.log("error", b);
      });
      a.O = "JSON";
      return a;
    };
    function PG(a) {
      var b = void 0;
      return md(b);
    }
    PG.D = "internal.legacyParseUrl";
    var QG = function() {
      return false;
    }, RG = { getItem: function(a) {
      var b = null;
      return b;
    }, setItem: function(a, b) {
      return false;
    }, removeItem: function(a) {
    } };
    function SG() {
    }
    SG.O = "logToConsole";
    function TG(a, b) {
    }
    TG.D = "internal.mergeRemoteConfig";
    function UG(a, b, c) {
      var d = [];
      return d;
    }
    UG.D = "internal.parseCookieValuesFromString";
    function VG(a) {
      var b = void 0;
      if ("string" !== typeof a)
        return;
      a && 0 === a.indexOf("//") && (a = C.location.protocol + a);
      if ("function" === typeof URL) {
        var c;
        a: {
          var d;
          try {
            d = new URL(a);
          } catch (w) {
            c = void 0;
            break a;
          }
          for (var e = {}, f = Array.from(d.searchParams), g = 0; g < f.length; g++) {
            var h = f[g][0], m = f[g][1];
            e.hasOwnProperty(h) ? "string" === typeof e[h] ? e[h] = [e[h], m] : e[h].push(m) : e[h] = m;
          }
          c = md({
            href: d.href,
            origin: d.origin,
            protocol: d.protocol,
            username: d.username,
            password: d.password,
            host: d.host,
            hostname: d.hostname,
            port: d.port,
            pathname: d.pathname,
            search: d.search,
            searchParams: e,
            hash: d.hash
          });
        }
        return c;
      }
      var n;
      try {
        n = Lm(a);
      } catch (w) {
        return;
      }
      if (!n.protocol || !n.host)
        return;
      var p = {};
      if (n.search)
        for (var q = n.search.replace("?", "").split("&"), r = 0; r < q.length; r++) {
          var t = q[r].split("="), u = t[0], v = decodeURIComponent(t.splice(1).join("=")).replace(/\+/g, " ");
          p.hasOwnProperty(u) ? "string" === typeof p[u] ? p[u] = [p[u], v] : p[u].push(v) : p[u] = v;
        }
      n.searchParams = p;
      n.origin = n.protocol + "//" + n.host;
      n.username = "";
      n.password = "";
      b = md(n);
      return b;
    }
    VG.O = "parseUrl";
    function WG(a) {
    }
    WG.D = "internal.processAsNewEvent";
    function XG(a, b, c) {
      var d;
      return d;
    }
    XG.D = "internal.pushToDataLayer";
    function YG(a, b) {
      var c = false;
      return c;
    }
    YG.O = "queryPermission";
    function ZG() {
      var a = "";
      return a;
    }
    ZG.O = "readCharacterSet";
    function $G() {
      return qi.fa;
    }
    $G.D = "internal.readDataLayerName";
    function aH() {
      var a = "";
      return a;
    }
    aH.O = "readTitle";
    function bH(a, b) {
      var c = this;
      J(I(this), ["destinationId:!string", "callback:!Fn"], arguments), Xo(a, function(d) {
        b.invoke(c.h, md(d, c.h, 1));
      });
    }
    bH.D = "internal.registerCcdCallback";
    function cH(a) {
      return true;
    }
    cH.D = "internal.registerDestination";
    function eH(a, b, c) {
    }
    eH.D = "internal.registerGtagCommandListener";
    function fH(a, b) {
      var c = false;
      return c;
    }
    fH.D = "internal.removeDataLayerEventListener";
    function gH(a, b) {
    }
    gH.D = "internal.removeFormData";
    function iH(a, b, c, d) {
      J(I(this), ["destinationIds:!*", "eventName:!*", "eventParameters:?PixieMap", "messageContext:?PixieMap"], arguments);
      var e = c ? nd(c) : {}, f = nd(a);
      Array.isArray(f) || (f = [f]);
      b = String(b);
      var g = d ? nd(d) : {}, h = this.h.h;
      g.originatingEntity = rB(h);
      for (var m = 0; m < f.length; m++) {
        var n = f[m];
        if ("string" === typeof n) {
          var p = nb(e), q = nb(g), r = Zv(n, b, p);
          bw(r, g.eventId || h.eventId, q);
        }
      }
    }
    iH.D = "internal.sendGtagEvent";
    function jH(a, b, c) {
    }
    jH.O = "sendPixel";
    function kH(a, b) {
    }
    kH.D = "internal.setAnchorHref";
    function lH(a, b, c, d) {
      var f = false;
      return f;
    }
    lH.O = "setCookie";
    function mH(a, b) {
    }
    mH.D = "internal.setCorePlatformServices";
    function nH(a, b) {
    }
    nH.D = "internal.setDataLayerValue";
    function oH(a) {
    }
    oH.O = "setDefaultConsentState";
    function pH(a, b) {
    }
    pH.D = "internal.setDelegatedConsentType";
    function qH(a, b) {
    }
    qH.D = "internal.setFormAction";
    function rH(a, b, c) {
      return false;
    }
    rH.O = "setInWindow";
    function sH(a, b, c) {
      J(I(this), ["targetId:!string", "name:!string", "value:!*"], arguments);
      var d = Qo(a) || {};
      d[b] = nd(c, this.h);
      var e = a;
      Oo || Po();
      No[e] = d;
    }
    sH.D = "internal.setProductSettingsParameter";
    function tH(a, b, c) {
      J(I(this), ["targetId:!string", "name:!string", "value:!*"], arguments);
      for (var d = b.split("."), e = Up(a), f = 0; f < d.length - 1; f++) {
        if (void 0 === e[d[f]])
          e[d[f]] = {};
        else if (!mb(e[d[f]]))
          throw Error("setRemoteConfigParameter failed, path contains a non-object type: " + d[f]);
        e = e[d[f]];
      }
      e[d[f]] = nd(c, this.h, 1);
    }
    tH.D = "internal.setRemoteConfigParameter";
    function uH(a, b) {
    }
    uH.D = "internal.setupConversionLinker";
    function vH(a, b, c, d) {
    }
    vH.O = "sha256";
    function wH(a, b, c) {
    }
    wH.D = "internal.sortRemoteConfigParameters";
    var xH = {};
    xH.O = "templateStorage";
    xH.getItem = function(a) {
      var b = null;
      return b;
    };
    xH.setItem = function(a, b) {
    };
    xH.removeItem = function(a) {
    };
    xH.clear = function() {
    };
    function zH(a, b) {
      var c = false;
      return c;
    }
    zH.D = "internal.testRegex";
    var AH = function(a) {
      var b;
      return b;
    };
    function BH(a) {
      var b;
      return b;
    }
    BH.D = "internal.unsiloId";
    function CH(a) {
    }
    CH.O = "updateConsentState";
    var DH;
    function EH(a, b, c) {
      DH = DH || new uh();
      DH.add(a, b, c);
    }
    function FH(a, b) {
      var c = DH = DH || new uh();
      if (c.s.hasOwnProperty(a))
        throw "Attempting to add a private function which already exists: " + a + ".";
      if (c.h.hasOwnProperty(a))
        throw "Attempting to add a private function with an existing API name: " + a + ".";
      c.s[a] = Fa(b) ? Mg(a, b) : Ng(a, b);
    }
    function GH() {
      return function(a) {
        var b;
        var c = DH;
        if (c.h.hasOwnProperty(a))
          b = c.get(a, this);
        else {
          var d;
          if (d = c.s.hasOwnProperty(a)) {
            var e = false, f = this.h.h;
            if (f) {
              var g = f.wc();
              if (g) {
                0 !== g.indexOf("__cvt_") && (e = true);
              }
            } else
              e = true;
            d = e;
          }
          if (d) {
            var h = c.s.hasOwnProperty(a) ? c.s[a] : void 0;
            b = h;
          } else
            throw Error(a + " is not a valid API name.");
        }
        return b;
      };
    }
    var HH = function() {
      var a = function(c) {
        return FH(c.D, c);
      }, b = function(c) {
        return EH(c.O, c);
      };
      b(dA);
      b(jA);
      b(aB);
      b(dB);
      b(eB);
      b(iB);
      b(kB);
      b(nB);
      b(OG());
      b(pB);
      b(uE);
      b(vE);
      b(KE);
      b(LE);
      b(ME);
      b(PE);
      b(BG);
      b(CG);
      b(JG);
      b(NG);
      b(SG);
      b(VG);
      b(YG);
      b(ZG);
      b(aH);
      b(jH);
      b(lH);
      b(oH);
      b(rH);
      b(vH);
      b(xH);
      b(CH);
      EH("Math", Sg());
      EH("Object", sh);
      EH("TestHelper", wh());
      EH("assertApi", Og);
      EH("assertThat", Pg);
      EH("decodeUri", Tg);
      EH("decodeUriComponent", Ug);
      EH("encodeUri", Vg);
      EH("encodeUriComponent", Wg);
      EH("fail", bh);
      EH(
        "generateRandom",
        ch
      );
      EH("getTimestamp", dh);
      EH("getTimestampMillis", dh);
      EH("getType", jh);
      EH("makeInteger", lh);
      EH("makeNumber", mh);
      EH("makeString", nh);
      EH("makeTableMap", oh);
      EH("mock", rh);
      EH("fromBase64", tE, !("atob" in z));
      EH("localStorage", RG, !QG());
      EH("toBase64", AH, !("btoa" in z));
      a(gA);
      a(oA);
      a(AA);
      a(HA);
      a(MA);
      a(QA);
      a(ZA);
      a(bB);
      a(fB);
      a(gB);
      a(jB);
      a(lB);
      a(mB);
      a(oB);
      a(qB);
      a(tB);
      a(uB);
      a(wB);
      a(AB);
      a(FB);
      a(GB);
      a(RB);
      a(WB);
      a(aC);
      a(jC);
      a(oC);
      a(BC);
      a(DC);
      a(QC);
      a(Xg);
      a(SC);
      a(rE);
      a(sE);
      a(wE);
      a(xE);
      a(yE);
      a(zE);
      a(AE);
      a(BE);
      a(CE);
      a(DE);
      a(EE);
      a(FE);
      a(HE);
      a(IE);
      a(JE);
      a(NE);
      a(OE);
      a(yG);
      a(MG);
      a(PG);
      a(OA);
      a(TG);
      a(UG);
      a(WG);
      a(XG);
      a($G);
      a(bH);
      a(cH);
      a(eH);
      a(fH);
      a(gH);
      a(iH);
      a(kH);
      a(mH);
      a(pH);
      a(qH);
      a(sH);
      a(tH);
      a(wH);
      a(zH);
      FH("internal.GtagSchema", zG());
      R(56) && a(DG);
      R(84) && a(vB);
      R(90) && a(BH);
      R(88) && a(nH);
      R(101) && a(uH);
      return GH();
    };
    var bA;
    function IH() {
      bA.h.h.M = function(a, b, c) {
        ri.SANDBOXED_JS_SEMAPHORE = ri.SANDBOXED_JS_SEMAPHORE || 0;
        ri.SANDBOXED_JS_SEMAPHORE++;
        try {
          return a.apply(b, c);
        } finally {
          ri.SANDBOXED_JS_SEMAPHORE--;
        }
      };
    }
    function JH(a) {
      void 0 !== a && l(a, function(b, c) {
        for (var d = 0; d < c.length; d++) {
          var e = c[d].replace(/^_*/, "");
          Ji[e] = Ji[e] || [];
          Ji[e].push(b);
        }
      });
    }
    var Z = { securityGroups: {} };
    Z.securityGroups.c = ["google"], function() {
      (function(a) {
        Z.__c = a;
        Z.__c.m = "c";
        Z.__c.isVendorTemplate = true;
        Z.__c.priorityOverride = 0;
        Z.__c.isInfrastructure = false;
        Z.__c.runInSiloedMode = true;
      })(function(a) {
        vz(a.vtp_value, "c", a.vtp_gtmEventId);
        return a.vtp_value;
      });
    }();
    Z.securityGroups.e = ["google"], function() {
      (function(a) {
        Z.__e = a;
        Z.__e.m = "e";
        Z.__e.isVendorTemplate = true;
        Z.__e.priorityOverride = 0;
        Z.__e.isInfrastructure = false;
        Z.__e.runInSiloedMode = true;
      })(function(a) {
        return String(a.vtp_gtmCachedValues.event);
      });
    }();
    Z.securityGroups.access_globals = ["google"], function() {
      function a(b, c, d) {
        var e = { key: d, read: false, write: false, execute: false };
        switch (c) {
          case "read":
            e.read = true;
            break;
          case "write":
            e.write = true;
            break;
          case "readwrite":
            e.read = e.write = true;
            break;
          case "execute":
            e.execute = true;
            break;
          default:
            throw Error("Invalid " + b + " request " + c);
        }
        return e;
      }
      (function(b) {
        Z.__access_globals = b;
        Z.__access_globals.m = "access_globals";
        Z.__access_globals.isVendorTemplate = true;
        Z.__access_globals.priorityOverride = 0;
        Z.__access_globals.isInfrastructure = false;
        Z.__access_globals.runInSiloedMode = false;
      })(function(b) {
        for (var c = b.vtp_keys || [], d = b.vtp_createPermissionError, e = [], f = [], g = [], h = 0; h < c.length; h++) {
          var m = c[h], n = m.key;
          m.read && e.push(n);
          m.write && f.push(n);
          m.execute && g.push(n);
        }
        return { assert: function(p, q, r) {
          if (!k(r))
            throw d(p, {}, "Key must be a string.");
          if ("read" === q) {
            if (-1 < e.indexOf(r))
              return;
          } else if ("write" === q) {
            if (-1 < f.indexOf(r))
              return;
          } else if ("readwrite" === q) {
            if (-1 < f.indexOf(r) && -1 < e.indexOf(r))
              return;
          } else if ("execute" === q) {
            if (-1 < g.indexOf(r))
              return;
          } else
            throw d(
              p,
              {},
              "Operation must be either 'read', 'write', or 'execute', was " + q
            );
          throw d(p, {}, "Prohibited " + q + " on global variable: " + r + ".");
        }, K: a };
      });
    }();
    Z.securityGroups.v = ["google"], function() {
      (function(a) {
        Z.__v = a;
        Z.__v.m = "v";
        Z.__v.isVendorTemplate = true;
        Z.__v.priorityOverride = 0;
        Z.__v.isInfrastructure = false;
        Z.__v.runInSiloedMode = false;
      })(function(a) {
        var b = a.vtp_name;
        if (!b || !b.replace)
          return false;
        var c = nz(b.replace(/\\\./g, "."), a.vtp_dataLayerVersion || 1), d = void 0 !== c ? c : a.vtp_defaultValue;
        vz(d, "v", a.vtp_gtmEventId);
        return d;
      });
    }();
    Z.securityGroups.read_container_data = ["google"], function() {
      (function(a) {
        Z.__read_container_data = a;
        Z.__read_container_data.m = "read_container_data";
        Z.__read_container_data.isVendorTemplate = true;
        Z.__read_container_data.priorityOverride = 0;
        Z.__read_container_data.isInfrastructure = false;
        Z.__read_container_data.runInSiloedMode = false;
      })(function() {
        return { assert: function() {
        }, K: function() {
          return {};
        } };
      });
    }();
    Z.securityGroups.detect_user_provided_data = ["google"], function() {
      function a(b, c) {
        return { dataSource: c };
      }
      (function(b) {
        Z.__detect_user_provided_data = b;
        Z.__detect_user_provided_data.m = "detect_user_provided_data";
        Z.__detect_user_provided_data.isVendorTemplate = true;
        Z.__detect_user_provided_data.priorityOverride = 0;
        Z.__detect_user_provided_data.isInfrastructure = false;
        Z.__detect_user_provided_data.runInSiloedMode = false;
      })(function(b) {
        var c = b.vtp_createPermissionError;
        return { assert: function(d, e) {
          if ("auto" !== e && "manual" !== e && "code" !== e)
            throw c(d, {}, "Unknown user provided data source.");
          if (b.vtp_limitDataSources)
            if ("auto" !== e || b.vtp_allowAutoDataSources) {
              if ("manual" === e && !b.vtp_allowManualDataSources)
                throw c(d, {}, "Detection of user provided data via manually specified CSS selectors is not allowed.");
              if ("code" === e && !b.vtp_allowCodeDataSources)
                throw c(d, {}, "Detection of user provided data from an in-page variable is not allowed.");
            } else
              throw c(d, {}, "Automatic detection of user provided data is not allowed.");
        }, K: a };
      });
    }();
    Z.securityGroups.gct = ["google"], function() {
      function a(b) {
        for (var c = [], d = 0; d < b.length; d++)
          try {
            c.push(new RegExp(b[d]));
          } catch (e) {
          }
        return c;
      }
      (function(b) {
        Z.__gct = b;
        Z.__gct.m = "gct";
        Z.__gct.isVendorTemplate = true;
        Z.__gct.priorityOverride = 0;
        Z.__gct.isInfrastructure = false;
        Z.__gct.runInSiloedMode = true;
      })(function(b) {
        var c = {}, d = b.vtp_sessionDuration;
        0 < d && (c[N.g.ad] = d);
        c[N.g.Jd] = b.vtp_eventSettings;
        c[N.g.ig] = b.vtp_dynamicEventSettings;
        c[N.g.Kb] = 1 === b.vtp_googleSignals;
        c[N.g.xg] = b.vtp_foreignTld;
        c[N.g.ug] = 1 === b.vtp_restrictDomain;
        c[N.g.hf] = b.vtp_internalTrafficResults;
        var e = N.g.Ma, f = b.vtp_linker;
        f && f[N.g.W] && (f[N.g.W] = a(f[N.g.W]));
        c[e] = f;
        var g = N.g.lf, h = b.vtp_referralExclusionDefinition;
        h && h.include_conditions && (h.include_conditions = a(h.include_conditions));
        c[g] = h;
        var m = om(b.vtp_trackingId);
        Vp(m, c);
        uG(m, b.vtp_gtmEventId);
        F(b.vtp_gtmOnSuccess);
      });
    }();
    Z.securityGroups.get = ["google"], function() {
      (function(a) {
        Z.__get = a;
        Z.__get.m = "get";
        Z.__get.isVendorTemplate = true;
        Z.__get.priorityOverride = 0;
        Z.__get.isInfrastructure = false;
        Z.__get.runInSiloedMode = false;
      })(function(a) {
        var b = a.vtp_settings, c = b.eventParameters || {}, d = String(a.vtp_eventName), e = {};
        e.eventId = a.vtp_gtmEventId;
        e.priorityId = a.vtp_gtmPriorityId;
        a.vtp_deferrable && (e.deferrable = true);
        var f = Zv(String(b.streamId), d, c);
        bw(f, e.eventId, e);
        a.vtp_gtmOnSuccess();
      });
    }();
    var hJ = {};
    hJ.dataLayer = Ti;
    hJ.callback = function(a) {
      Ii.hasOwnProperty(a) && Fa(Ii[a]) && Ii[a]();
      delete Ii[a];
    };
    hJ.bootstrap = 0;
    hJ._spx = false;
    function iJ() {
      ri[lm()] = ri[lm()] || hJ;
      rm();
      wm() || l(xm(), function(d, e) {
        $u(d, e.transportUrl, e.context);
        L(92);
      });
      Wa(Ji, Z.securityGroups);
      var a = nm(um()), b, c = null == a ? void 0 : null == (b = a.context) ? void 0 : b.source;
      2 !== c && 4 !== c && 3 !== c || L(142);
      vf = Lf;
    }
    (function(a) {
      function b() {
        m = C.documentElement.getAttribute("data-tag-assistant-present");
        by(m) && (h = g.Mk);
      }
      if (!z["__TAGGY_INSTALLED"]) {
        var c = false;
        if (C.referrer) {
          var d = Lm(C.referrer);
          c = "cct.google" === Fm(d, "host");
        }
        if (!c) {
          var e = Hl("googTaggyReferrer");
          c = e.length && e[0].length;
        }
        c && (z["__TAGGY_INSTALLED"] = true, Jc("https://cct.google/taggy/agent.js"));
      }
      if (Di)
        a();
      else {
        var f = function(u) {
          var v = "GTM", w = "GTM";
          xi ? (v = "OGT", w = "GTAG") : Di && (w = v = "OPT");
          var x = z["google.tagmanager.debugui2.queue"];
          x || (x = [], z["google.tagmanager.debugui2.queue"] = x, Jc("https://" + qi.wd + "/debug/bootstrap?id=" + Tf.ctid + "&src=" + w + "&cond=" + u + "&gtm=" + Am()));
          var y = { messageType: "CONTAINER_STARTING", data: { scriptSource: Dc, containerProduct: v, debug: false, id: Tf.ctid, targetRef: { ctid: Tf.ctid, isDestination: dm.ie }, aliases: fm(), destinations: im() } };
          y.data.resume = function() {
            a();
          };
          qi.lk && (y.data.initialPublish = true);
          x.push(y);
        }, g = { Bn: 1, Nk: 2, Zk: 3, nk: 4, Mk: 5 }, h = void 0, m = void 0, n = Gm(z.location, "query", false, void 0, "gtm_debug");
        by(n) && (h = g.Nk);
        if (!h && C.referrer) {
          var p = Lm(C.referrer);
          "tagassistant.google.com" === Fm(p, "host") && (h = g.Zk);
        }
        if (!h) {
          var q = Hl("__TAG_ASSISTANT");
          q.length && q[0].length && (h = g.nk);
        }
        h || b();
        if (!h && cy(m)) {
          var r = function() {
            if (t)
              return true;
            t = true;
            b();
            h && Dc ? f(h) : a();
          }, t = false;
          Oc(C, "TADebugSignal", function() {
            r();
          }, false);
          z.setTimeout(function() {
            r();
          }, 200);
        } else
          h && Dc ? f(h) : a();
      }
    })(function() {
      try {
        pm();
        if (R(16)) {
        }
        zj().s();
        kl();
        (R(98) || R(99) || R(100)) && pq();
        var a = mm();
        if (am().canonical[a]) {
          var b = ri.zones;
          b && b.unregisterChild(hm());
          var c = Lu(mm());
          c._event && (c._event.external = []);
          c._entity && (c._entity.external = []);
        } else {
          is();
          Xu();
          for (var d = data.resource || {}, e = d.macros || [], f = 0; f < e.length; f++)
            lf.push(e[f]);
          for (var g = d.tags || [], h = 0; h < g.length; h++)
            of.push(g[h]);
          for (var m = d.predicates || [], n = 0; n < m.length; n++)
            nf.push(m[n]);
          for (var p = d.rules || [], q = 0; q < p.length; q++) {
            for (var r = p[q], t = {}, u = 0; u < r.length; u++) {
              var v = r[u][0];
              t[v] = Array.prototype.slice.call(r[u], 1);
              "if" !== v && "unless" !== v || uf(t[v]);
            }
            mf.push(t);
          }
          qf = Z;
          rf = Tz;
          Nf = new Wf();
          var w = data.sandboxed_scripts, x = data.security_groups, y = data.infra;
          a: {
            var A = data.runtime || [], B = data.runtime_lines;
            bA = new Ie();
            IH();
            kf = aA();
            var E = bA, G = HH(), D = new ed("require", G);
            D.Eb();
            E.h.h.set("require", D);
            for (var M = [], P = 0; P < A.length; P++) {
              var O = A[P];
              if (!Ha(O) || 3 > O.length) {
                if (0 === O.length)
                  continue;
                break a;
              }
              B && B[P] && B[P].length && Ef(O, B[P]);
              try {
                bA.execute(O), R(32) && mp && 50 === O[0] && M.push(O[1]);
              } catch (fh) {
              }
            }
            R(32) && (wf = M);
          }
          if (void 0 !== w)
            for (var T = ["sandboxedScripts"], Y = 0; Y < w.length; Y++) {
              var W = w[Y].replace(/^_*/, "");
              Ji[W] = T;
            }
          JH(x);
          if (void 0 !== y)
            for (var X = 0; X < y.length; X++)
              Ki[y[X]] = true;
          iJ();
          if (R(25) && !Di) {
            for (var la = pj["7"], ka = la ? la.split("|") : [], fa = {}, Da = 0; Da < ka.length; Da++)
              fa[ka[Da]] = true;
            for (var pa = 0; pa < Wj.length; pa++) {
              var Ea = Wj[pa], Ua = Ea, lb = fa[Ea] ? "granted" : "denied";
              Gj().implicit(
                Ua,
                lb
              );
            }
          }
          ay();
          av = false;
          bv = 0;
          if ("interactive" == C.readyState && !C.createEventObject || "complete" == C.readyState)
            dv();
          else {
            Oc(C, "DOMContentLoaded", dv);
            Oc(C, "readystatechange", dv);
            if (C.createEventObject && C.documentElement.doScroll) {
              var Ib = true;
              try {
                Ib = !z.frameElement;
              } catch (fh) {
              }
              Ib && ev();
            }
            Oc(z, "load", dv);
          }
          px = false;
          "complete" === C.readyState ? rx() : Oc(z, "load", rx);
          mp && (hp(zp), z.setInterval(yp, 864e5));
          hp(Vz);
          hp(Ev);
          hp(ut);
          hp(Op);
          hp(Pv);
          hp(Ep);
          hp(Xr);
          hp(Cp);
          hp(Lv);
          R(32) && hp(Hv);
          R(106) && (hp(Wz), hp(Yz));
          xy();
          ij(1);
          Lw();
          Hi = Sa();
          hJ.bootstrap = Hi;
          if (R(16)) {
          }
        }
      } catch (fh) {
        if (ij(4), mp) {
          var jj = tp(true, true);
          Nc(jj);
        }
      }
    });
  })();
  const definition = defineBackground({
    persistent: false,
    main() {
      console.log("Hello background!", { id: browser.runtime.id });
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", /* @__PURE__ */ new Date());
      window.gtag("config", "G-3X9EELR6PB");
      window.gtag("event", "background event", {
        url: window.location.href
      });
      browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === "generated_new_note") {
          window.gtag("event", "pageview", {
            url: request.url,
            id: browser.runtime.id
          });
        }
      });
      browser.runtime.onInstalled.addListener(function(details) {
        if (details.reason === "install") {
          browser.storage.local.set({ id: 0 }).then(() => {
            console.log("set initial id");
          });
          browser.storage.local.set({ defaultTheme: "monokai" }).then(() => {
            console.log("set default theme");
          });
          browser.storage.local.set({ defaultEditorFontFamily: '"Consolas","monaco",monospace' }).then(() => {
            console.log("set default font family");
          });
          browser.storage.local.set({ defaultEditorFontSize: 14 }).then(() => {
            console.log("set default font size");
          });
          browser.storage.local.set({ defaultOpacity: 0.9 }).then(() => {
            console.log("set default opacity");
          });
        }
      });
      browser.browserAction.onClicked.addListener((tab) => {
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
          let activeTab = tabs[0];
          if (!activeTab.id)
            return;
          browser.tabs.sendMessage(activeTab.id, {
            message: "clicked_extension_action"
          });
        });
      });
    }
  });
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
  function keepServiceWorkerAlive() {
    setInterval(async () => {
      await browser.runtime.getPlatformInfo();
    }, 5e3);
  }
  function reloadContentScript(contentScript) {
    const manifest = browser.runtime.getManifest();
    if (manifest.manifest_version == 2) {
      void reloadContentScriptMv2();
    } else {
      void reloadContentScriptMv3(contentScript);
    }
  }
  async function reloadContentScriptMv3(contentScript) {
    const id = `wxt:${contentScript.js[0]}`;
    logger.log("Reloading content script:", contentScript);
    const registered = await browser.scripting.getRegisteredContentScripts();
    logger.debug("Existing scripts:", registered);
    const existing = registered.find((cs) => cs.id === id);
    if (existing) {
      logger.debug("Updating content script", existing);
      await browser.scripting.updateContentScripts([{ ...contentScript, id }]);
    } else {
      logger.debug("Registering new content script...");
      await browser.scripting.registerContentScripts([{ ...contentScript, id }]);
    }
    const allTabs = await browser.tabs.query({});
    const matchPatterns = contentScript.matches.map(
      (match) => new MatchPattern(match)
    );
    const matchingTabs = allTabs.filter((tab) => {
      const url = tab.url;
      if (!url)
        return false;
      return !!matchPatterns.find((pattern) => pattern.includes(url));
    });
    await Promise.all(matchingTabs.map((tab) => browser.tabs.reload(tab.id)));
  }
  async function reloadContentScriptMv2(contentScript) {
    throw Error("TODO: reloadContentScriptMv2");
  }
  {
    try {
      const ws = setupWebSocket((message) => {
        if (message.event === "wxt:reload-extension")
          browser.runtime.reload();
        if (message.event === "wxt:reload-content-script" && message.data != null)
          reloadContentScript(message.data);
      });
      if (false)
        ;
    } catch (err) {
      logger.error("Failed to setup web socket connection with dev server", err);
    }
    browser.commands.onCommand.addListener((command) => {
      if (command === "wxt:reload-extension") {
        browser.runtime.reload();
      }
    });
  }
  try {
    const res = definition.main();
    if (res instanceof Promise) {
      console.warn(
        "The background's main() function return a promise, but it must be synchonous"
      );
    }
  } catch (err) {
    logger.error("The background crashed on startup!");
    throw err;
  }
})();
