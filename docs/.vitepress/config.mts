import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "DOM-Preview",
  description: "A tool for visualizing your component tests",
  head: [
    ["link", { rel: "icon", href: "/favicon.svg" }],
    [
      "script",
      {
        defer: true,
        "data-domain": "dom-preview.knappi.org",
        src: "https://plausible.io/js/script.js",
      },
    ],
  ],
  themeConfig: {
    logo: "/images/logo.svg",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting started", link: "/getting-started" },
      { text: "Impress", link: "/impress" },
    ],

    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Motivation", link: "/motivation" },
          { text: "Getting started", link: "/getting-started" },
          { text: "Advanced topics", link: "/advanced-topics" },
          { text: "The ultimate setup", link: "/ultimate-setup" },
        ],
      },
      {
        text: "Impress",
        items: [{ text: "Impress", link: "/impress" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/nknapp/dom-preview" },
    ],
  },
});
