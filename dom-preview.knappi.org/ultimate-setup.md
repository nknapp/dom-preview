# Ultimate setup

So far, we have been running `vitest`, `vite` and `dom-preview` in separate shells.

The package <NpmLink package="npm-run-all" /> provides a way to simplify this and `vitest --ui`
provides a nice way to see the test results.

What I have been ending up is the following setup

```bash
npm install --save-dev npm-run-all @vitest/ui
```

**In the package.json:**

```json
{
  "scripts": {
    "dev": "run-p dev:*",
    "dev:unit": "vitest --ui",
    "dev:server": "vite --port=5173",
    "dev:dom-preview": "dom-preview --proxy-to=http://localhost:5173"
  }
}
```

No, when you run

```bash
npm run dev
```

it will start the `vite` dev-server, the `vitest` ui and the `dom-preview` server.
It will run tests as the files change, show previews in `dom-preview` and you are also able to
test your app in the live-server.

This is what I usually use and this is what I would recommend.
