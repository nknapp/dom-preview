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
- The frontend that shows a list of received previews and shows them in an iframe element.
- The `debug()` function that dumps the current DOM and sends it to the server.

## Installation and configuration

```bash
npm install dom-preview-monorepo
```

Make sure that your test-framework emits css into the DOM. In vitest, you need to set

```javascript
test: {
  css: true;
}
```

(see https://vitest.dev/config/#css for details)

## Usage

Run the server

```bash
npx dom-preview
```

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
  await user.type(screen.getByLabelText("First name:"), "Max");
  await user.type(screen.getByLabelText("Last name:"), "Mustermann");

  debug("Inputs");
});
```

Another convenient way is to use [npm-run-all](https://npmjs.com/package/npm-run-all) to run vite dev-server, tests in watch mode

```json

"scripts": {
    "dev:server": "vite",
    "dev:unit": "vitest --ui",
    "dev:live-server": "dom-preview",
    "dev": "run-p dev:*",
}

```

In my view, this is the ideal setup for doing test-driven development in frontend projects

## License

This project is licensed under the [MIT License](./LICENSE)

## Maintainance

I want to be honest. I am not good at maintaining OS projects these days. There is just to much going on in my life.

I tried to design this project to make it easily maintainable.

- There are no dependendies except for development.
- The only runtime dependencies (which are bundled) are [sirv](https://npmjs.com/package/sirv), [zod](https://npmjs.com/package/zod), [@shoelace-style/shoelace](https://npmjs.com/package/@shoelace-style/shoelace)
  and [tailwind](https://npmjs.com/package/tailwind). The rest is for building, linting, formatting and testing. I didn't even use a server-framework.
- The library is small and has a clear scope. There might be some features missing, but I think of it as almost complete.
- I don't see any way this library may impact security.

If you like to help me maintain and update dependencies, please contact me.

## Funding :coffee:

You can also send me money, if you like my work:

- [Liberapay](https://de.liberapay.com/nils.knappmeier/)
- [Paypal](https://www.paypal.com/donate/?hosted_button_id=GB656ZSAEQEXN)
