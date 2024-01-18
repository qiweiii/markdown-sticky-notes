import { defineConfig } from "wxt";
import react from "@vitejs/plugin-react";

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [react()],
  }),
  manifest: {
    short_name: "markdown-sticky-notes",
    name: "Markdown Sticky Notes",
    icons: {
      "16": "notes16.png",
      "32": "notes32.png",
      "64": "notes64.png",
      "128": "notes128.png",
    },
    permissions: ["storage", "tabs"],
    web_accessible_resources: [
      // "/static/css/content.css", // TODO: check
      // "index.html", // TODO: check
      "fonts/Anonymous_Pro/AnonymousPro-Regular.ttf",
      "fonts/B612_Mono/B612Mono-Regular.ttf",
      "fonts/Fira_Code/static/FiraCode-Regular.ttf",
      "fonts/Inconsolata/Inconsolata-Regular.ttf",
      "fonts/Nanum_Gothic_Coding/NanumGothicCoding-Regular.ttf",
      "fonts/PT_Mono/PTMono-Regular.ttf",
      "fonts/Roboto_Mono/RobotoMono-Regular.ttf",
      "fonts/Share_Tech_Mono/ShareTechMono-Regular.ttf",
      "fonts/Source_Code_Pro/SourceCodePro-Regular.ttf",
      "fonts/Space_Mono/SpaceMono-Regular.ttf",
      "fonts/Ubuntu_Mono/UbuntuMono-Regular.ttf",
    ],
    // TODO: check: I think don't need this anymore, because now I don't use `https://www.google-analytics.com`, see background.ts
    // content_security_policy:
    // "script-src 'self' https://www.google-analytics.com 'sha256-GgRxrVOKNdB4LrRsVPDSbzvfdV4UqglmviH9GoBJ5jk='; object-src 'self'",
  },
});
