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

    // TODO: when offscreen api is available, add google analytics back
    // window.dataLayer = window.dataLayer || [];
    // // NOTE: This line is different from Google's documentation
    // window.gtag = function () {
    //   window.dataLayer.push(arguments);
    // };
    // window.gtag("js", new Date());
    // window.gtag("config", "G-3X9EELR6PB");
    // window.gtag("event", "background event", {
    //   url: window.location.href,
    // });

    // browser.runtime.onMessage.addListener(function (
    //   request,
    //   sender,
    //   sendResponse
    // ) {
    //   if (request.action === "generated_new_note") {
    //     window.gtag("event", "pageview", {
    //       url: request.url,
    //       id: browser.runtime.id,
    //     });
    //   }
    // });

    browser.runtime.onInstalled.addListener(function (details) {
      if (details.reason === "install") {
        browser.storage.local.set({ id: 0 }).then(() => {
          console.log("set initial id");
        });
        browser.storage.local.set({ defaultTheme: "monokai" }).then(() => {
          console.log("set default theme to monokai");
        });
        browser.storage.local
          .set({ defaultEditorFontFamily: '"Consolas", "monaco", monospace' })
          .then(() => {
            console.log("set default font family to consolas");
          });
        browser.storage.local.set({ defaultEditorFontSize: 14 }).then(() => {
          console.log("set default font size to 14");
        });
        browser.storage.local.set({ defaultOpacity: 0.9 }).then(() => {
          console.log("set default opacity to 0.9");
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
        browser.tabs.sendMessage(activeTab.id, {
          message: "clicked_extension_action",
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
  },
});
