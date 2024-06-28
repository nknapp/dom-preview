# dom-preview

<sub>This README is generated via [./scripts/build-readme.js](./scripts/build-readme.js)</sub>

## Introduction

[vitest-preview](https://npmjs.com/package/vitest-preview) is a great help for debugging our test-cases, but some things are missing.

- Missing: values of input fields are not shown in the preview
- Missing: the active element is not shown
- Unable to collect multiple screenshots
- Tied to `vitest` or `jest` depending on which package you use.

This is an attempt to improve this behavior and make it more convenient to make screenshots of your tests.

## Concept

I started out with a simple solution that does not need any dependencies, but it has gotten a little more complicated.

There are three components

- A small Node.js server that accepts preview data on an endpoint and provides a [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
  endpoint to push live-updates to a frontend
- The frontend (runs on the server), that shows a list of received previews and shows them in an iframe element.
- The `debug()` function that dumps the current DOM and sends it to the server.

## Installation and configuration

```bash
npm install dom-preview
```

## Usage

Run the server

```bash
npx dom-preview
```

<!-- prettier-ignore-start -->
Open http://localhost:5007/__dom-preview__/
<!-- prettier-ignore-end -->

In your test, call the debug function

```javascript
import { screen } from "@testing-library/dom";
import { userEvent } from "@testing-library/user-event";
import { debug } from "dom-preview";

test("input fields", async () => {
  const user = userEvent.setup();
  document.body.innerHTML = `
      <label for="firstname">First name:</label><input id="firstname" type="text" value="" />
      <label for="lastname">Last name:</label><input id="lastname" type="text" value="" />
    `;
  debug("empty inputs");
  await user.type(screen.getByLabelText("First name:"), "Max");
  debug("firstname entered");
  await user.type(screen.getByLabelText("Last name:"), "Mustermann");
  debug("form complete");
});
```

### CSS

If you want nicely styled previews, you need to make sure that your test-framework emits css into the DOM. In vitest, you
can do this by setting

```javascript
test: {
  css: true;
}
```

(see https://vitest.dev/config/#css for details)

### Static assets

Sometimes your previews show images or use other files that would usually be delivered by your web-server.
Since the `dom-preview` server is framework independent, it does not have information about those assets.
It does not have access to your build configuration.
As a workaround, the server has the ability to proxy all requests that do not go to the `/__dom-preview__/`-path
to another URL. You can do this by using the option `--proxy-to=<url>`:

- Run your usual vite- or webpack-dev-server on port '5173'
- Run `npx dom-preview --proxy-to-http://localhost:4000`

### Context

A preview can have context. `dom-preview` does not make assumptions about what it is. It is just a string.
In the UI it is used to group tests together.

The intended use is to store the name of the currrent test. In vitest, you can use configure a "setupFile":

```javascript

test: {
  css: true,
  globals: true,
  setupFiles: ["./src/setupTests,js"]
}

```

and then create "setupTests" like this:

```javascript
import { setDomPreviewContext } from "dom-preview";

beforeEach(() => {
  setDomPreviewContext(expect.getState().currentTestName);
});
```

## Optimal setup for vite

Another convenient way is to use [npm-run-all](https://npmjs.com/package/npm-run-all) to run vite dev-server, tests in watch mode:

```json

"scripts": {
    "dev:server": "vite --port=5173",
    "dev:unit": "vitest --ui",
    "dev:dom-preview": "dom-preview --proxy-to=http://localhost:5173",
    "dev": "run-p dev:*",
}

```

In my view, this is the ideal setup for doing test-driven development in frontend projects

## License

This project is licensed under the [MIT License](./LICENSE)

## Maintainance

I want to be honest. There is just to much going on in my life at the moment and I might not have much time maintaining this project.
I wanted to do it anyway. I tried to design this project to make it easily maintainable.

- There are no dependendies except for development.
- Only the following runtime dependencies are bundle
  - [sirv](https://npmjs.com/package/sirv)
  - [zod](https://npmjs.com/package/zod)
  - [tailwind](https://npmjs.com/package/tailwind).
  - [@heroicons/vue](https://npmjs.com/package/@heroicons/vue).
    The rest is for building, linting, formatting and testing. I didn't even use a server-framework.
- The library is small and has a clear scope. There might be some features missing, but I think of it as almost complete.
- I don't see any way this library may impact security.

If you like to help me maintain and update dependencies, please contact me.

## Funding :coffee:

You can also send me money, if you like my work:

- [Liberapay](https://de.liberapay.com/nils.knappmeier/)
- [Paypal](https://www.paypal.com/donate/?hosted_button_id=GB656ZSAEQEXN)
