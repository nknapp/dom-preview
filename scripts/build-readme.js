import packageJson from "../package.json" assert { type: "json" };
import { editFile } from "./tools/editFile.js";
import fs from "node:fs";

function fences(type, contents) {
  return "```" + type + "\n" + contents + "\n```";
}

function include(type, file) {
  return fences(type, fs.readFileSync(file, "utf-8"));
}

function npmPackage(name) {
  return `[${name}](https://npmjs.com/package/${name})`;
}

await editFile("README.md", () => {
  return `
# dom-preview


<sub>This README is generated via [./scripts/build-readme.js](./scripts/build-readme.js)</sub>

## Introduction

${npmPackage(`vitest-preview`)} is a great help for debugging our test-cases, but some things are missing.

* Missing: values of input fields are not shown in the preview 
* Missing: the active element is not shown
* Unable to collect multiple screenshots
* Tied to \`vitest\` or \`jest\` depending on which package you use.

This is an attempt to improve this behavior and make it more convenient to make screenshots of your tests.

## Concept

I started out with a simple solution that does not need any dependencies, but it has gotten a little more complicated.

There are three components

* A small Node.js server that accepts preview data on an endpoint and provides a [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
endpoint to push live-updates to a frontend
* The frontend that shows a list of received previews and shows them in an iframe element.
* The \`debug()\` function that dumps the current DOM and sends it to the server.

## Installation and configuration

${fences("bash", `npm install ${packageJson.name}`)}

Make sure that your test-framework emits css into the DOM. In vitest, you need to set 

${fences(
  "javascript",
  `
test: {
  css: true
}
`,
)}

(see https://vitest.dev/config/#css for details)

## Usage

Run the server

${fences("bash", "npx dom-preview")}

In your test, call the debug function

${include("javascript", "playground/example.test.js")}

Another convenient way is to use ${npmPackage("npm-run-all")} to run vite dev-server, tests in watch mode 

${fences(
  "json",
  `
"scripts": {
    "dev:server": "vite",
    "dev:unit": "vitest --ui",
    "dev:live-server": "dom-preview",
    "dev": "run-p dev:*",
}
`,
)}

In my view, this is the ideal setup for doing test-driven development in frontend projects


## License

This project is licensed under the [MIT License](./LICENSE)

## Maintainance

I want to be honest. I am not good at maintaining OS projects these days. There is just to much going on in my life.

I tried to design this project to make it easily maintainable.  

* There are no dependendies except for development.
* The only runtime dependencies (which are bundled) are ${npmPackage("sirv")}, ${npmPackage("zod")}, ${npmPackage("@shoelace-style/shoelace")}
  and ${npmPackage("tailwind")}. The rest is for building, linting,  formatting and testing. I didn't even use a server-framework.
* The library is small and has a clear scope. There might be some features missing, but I think of it as almost complete.
* I don't see any way this library may impact security.

If you like to help me maintain and update dependencies, please contact me.

## Funding :coffee:

You can also send me money, if you like my work: 

* [Liberapay](https://de.liberapay.com/nils.knappmeier/)
* [Paypal](https://www.paypal.com/donate/?hosted_button_id=GB656ZSAEQEXN)

`;
});
