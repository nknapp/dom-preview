---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "DOM-Preview"
  text: "Unit & Component test visualizer"
  tagline: "See what your components actually look like when your tests fail."
  actions:
    - theme: brand
      text: Getting started
      link: /getting-started
    - theme: alt
      text: Why?
      link: /motivation

features:
  - title: Visualize you test state
    details: Show the components in your test case like they look in the browser
  - title: Framework agnostic
    details: In principal, it works with any test-framework, as long as it uses a global "window" object.
  - title: Multiple snapshots
    details: Keep track of multiple snapshots, grouped by test-case
---
