import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "DOM-Preview",
  description: "A tool for visualizing your component tests",
  head: [["link", { rel: "icon", href: "/favicon.svg" }]],
  themeConfig: {
    logo: "/images/logo.svg",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting started", link: "/getting-started" },
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
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/nknapp/dom-preview" },
    ],
  },
});
