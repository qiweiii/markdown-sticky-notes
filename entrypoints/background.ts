// TODO: when offscreen api is available, add google analytics back
// import "url:https://www.googletagmanager.com/gtag/js?id=G-3X9EELR6PB";

// declare global {
//   interface Window {
//     dataLayer: any[];
//     gtag: (...args: any[]) => void;
//   }
// }

export default defineBackground({
  main() {
    console.log("Hello background!", { id: browser.runtime.id });

    type ContentScriptStatus = {
      canInject: boolean;
      isCssLoaded: boolean;
      isScriptLoaded: boolean;
    };

    const getUrlWithoutHash = (href: string) => href.split("#")[0];

    const isSupportedPageUrl = (url: string | undefined): url is string => {
      return (
        url !== undefined &&
        (url.startsWith("https://") || url.startsWith("http://"))
      );
    };

    const isMissingReceivingEnd = (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      return message.includes("Receiving end does not exist");
    };
    const pendingMountTimeouts = new Map<number, ReturnType<typeof setTimeout>>();

    const getContentScriptStatus = async (
      tabId: number
    ): Promise<ContentScriptStatus> => {
      const [result] = await browser.scripting.executeScript({
        target: { tabId },
        func: () => {
          const pageWindow = window as typeof window & {
            __markdownStickyNotesContentLoaded?: boolean;
            __markdownStickyNotesCssLoaded?: boolean;
          };
          const isCloudflareChallenge =
            window.location.pathname.startsWith("/cdn-cgi/") ||
            document.title === "Just a moment..." ||
            !!document.querySelector(
              'script[src*="/cdn-cgi/challenge-platform/"], ' +
                'iframe[src*="cdn-cgi/challenge-platform"], ' +
                'iframe[src*="challenges.cloudflare.com"], ' +
                "#challenge-form, #challenge-running, #cf-challenge-running, " +
                "#cf-chl-widget, .cf-challenge, .cf-turnstile"
            );

          return {
            canInject: !isCloudflareChallenge,
            isCssLoaded: pageWindow.__markdownStickyNotesCssLoaded === true,
            isScriptLoaded:
              pageWindow.__markdownStickyNotesContentLoaded === true,
          };
        },
      });

      return (
        result.result ?? {
          canInject: false,
          isCssLoaded: false,
          isScriptLoaded: false,
        }
      );
    };

    const markCssLoaded = async (tabId: number) => {
      await browser.scripting.executeScript({
        target: { tabId },
        func: () => {
          const pageWindow = window as typeof window & {
            __markdownStickyNotesCssLoaded?: boolean;
          };
          pageWindow.__markdownStickyNotesCssLoaded = true;
        },
      });
    };

    const injectContentScript = async (tabId: number) => {
      const status = await getContentScriptStatus(tabId);
      if (!status.canInject) {
        return false;
      }

      if (!status.isCssLoaded) {
        await browser.scripting.insertCSS({
          target: { tabId },
          files: ["/content-scripts/content.css"],
        });
        await markCssLoaded(tabId);
      }

      if (status.isScriptLoaded) {
        return true;
      }

      await browser.scripting.executeScript({
        target: { tabId },
        files: ["/content-scripts/content.js"],
      });
      return true;
    };

    const sendCreateNoteMessage = async (tabId: number) => {
      await browser.tabs.sendMessage(tabId, {
        message: "clicked_extension_action",
      });
    };

    const ensureContentScript = async (tabId: number) => {
      try {
        return await injectContentScript(tabId);
      } catch (error) {
        console.debug("Skipping content script injection on this page", error);
        return false;
      }
    };

    const mountNotesForTab = async (tabId: number, url: string | undefined) => {
      if (!isSupportedPageUrl(url)) {
        return;
      }

      const key = getUrlWithoutHash(url);
      const result = await browser.storage.local.get(key);
      if (
        ((result as Partial<Record<string, unknown[]>>)[key] ?? []).length > 0
      ) {
        await ensureContentScript(tabId);
      }
    };

    const clearScheduledMount = (tabId: number) => {
      const timeoutId = pendingMountTimeouts.get(tabId);
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
        pendingMountTimeouts.delete(tabId);
      }
    };

    const scheduleMountNotesForTab = (
      tabId: number,
      options: {
        delayMs?: number;
        requireComplete?: boolean;
        maxAttempts?: number;
        attempt?: number;
      } = {}
    ) => {
      const {
        delayMs = 250,
        requireComplete = false,
        maxAttempts = 8,
        attempt = 0,
      } = options;

      clearScheduledMount(tabId);
      const timeoutId = setTimeout(() => {
        pendingMountTimeouts.delete(tabId);

        browser.tabs
          .get(tabId)
          .then((tab) => {
            if (requireComplete && tab.status !== "complete") {
              if (attempt >= maxAttempts) {
                return;
              }
              scheduleMountNotesForTab(tabId, {
                delayMs: Math.min(delayMs * 2, 1000),
                requireComplete,
                maxAttempts,
                attempt: attempt + 1,
              });
              return;
            }

            return mountNotesForTab(tabId, tab.url);
          })
          .catch((error) => {
            console.debug("Skipping scheduled saved notes mount", error);
          });
      }, delayMs);

      pendingMountTimeouts.set(tabId, timeoutId);
    };

    browser.runtime.onInstalled.addListener(function (details) {
      if (details.reason === "install") {
        browser.storage.local.set({ id: 0 }).then(() => {
          console.log("set initial id");
        });
        browser.runtime.openOptionsPage();
        // FIXME: comment out this note after testing
        // browser.storage.local
        //   .set({
        //     "https://www.google.com/": [
        //       {
        //         content: "",
        //         font: '"Consolas", "monaco", monospace',
        //         height: 250,
        //         id: "3",
        //         opacity: 1,
        //         theme: "monokai",
        //         width: 200,
        //         fontSize: 14,
        //         x: 399,
        //         y: 178,
        //       },
        //     ],
        //   })
      }
      // if (details.OnInstalledReason === "update") {
      //    // on extension update
      // }
    });

    const createNote = () => {
      // Send a message to the active tab
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        let activeTab = tabs[0];
        if (!activeTab.id) return;
        const tabId = activeTab.id;
        ensureContentScript(tabId)
          .then((didInject) => {
            if (didInject) {
              return sendCreateNoteMessage(tabId);
            }
          })
          .catch((error) => {
            if (isMissingReceivingEnd(error)) {
              console.debug("Skipping note creation on this page", error);
              return;
            }

            console.error("Failed to send create-note message", error);
          });
      });
    };

    // extension icon clicked
    browser.action.onClicked.addListener((tab) => {
      createNote();
    });

    // extension shortcut key pressed
    browser.commands.onCommand.addListener((command) => {
      console.log(`Command: ${command}`);
      if (command === "create-note") {
        createNote();
      }
    });

    browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
      if (changeInfo.url) {
        scheduleMountNotesForTab(tabId, { requireComplete: true });
        return;
      }

      if (changeInfo.status === "complete") {
        scheduleMountNotesForTab(tabId);
      }
    });

    browser.tabs.onActivated.addListener(({ tabId }) => {
      scheduleMountNotesForTab(tabId, { requireComplete: true });
    });

    browser.tabs.onRemoved.addListener((tabId) => {
      clearScheduledMount(tabId);
    });

    browser.runtime.onMessage.addListener((message) => {
      if (message?.action === "open-options") {
        browser.runtime.openOptionsPage();
      }
    });
  },
});
