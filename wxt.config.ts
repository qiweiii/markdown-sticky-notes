import { WxtViteConfig, defineConfig } from "wxt";
import react from "@vitejs/plugin-react";

import toUtf8 from "./scripts/vite-plugin-to-utf8";

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: (env) => {
    // const contentJsPath = `.output/${env.browser}-mv${env.manifestVersion}/content-scripts`;
    return {
      plugins: [toUtf8(), react()],
    } as WxtViteConfig;
  },
  manifest: {
    short_name: "markdown-sticky-notes",
    name: "Markdown Sticky Notes",
    icons: {
      "16": "icon/notes16.png",
      "32": "icon/notes32.png",
      "64": "icon/notes64.png",
      "128": "icon/notes128.png",
    },
    commands: {
      "create-note": {
        suggested_key: {
          default: "Alt+M",
        },
        description: 'Run "create-note" on the current page.',
      },
    },
    // this must be hrer in order to have action clicked listeners
    action: {},
    permissions: ["storage", "tabs"],
    // optional_permissions: ["unlimitedStorage"],
    host_permissions: ["<all_urls>"],
    web_accessible_resources: [
      {
        resources: ["fonts/**/*"],
        matches: ["*://*/*"],
      },
    ],
    browser_specific_settings: {
      gecko: {
        id: "uw35r9kd81w3h4f737h5zrz12itlvzknxz0upkj4kdf9wu90scuk209skasb72qxm5z7givqha4rtj8t",
      },
    },
  },
});
