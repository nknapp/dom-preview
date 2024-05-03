import packageJson from "../package.json" assert { type: "json" };
import { editFile } from "./tools/editFile.js";

function fences(name, contents) {
  return "```" + name + "\n" + contents + "\n```";
}

function npmPackage(name) {
  return `[${name}](https://npmjs.com/package/${name})`;
}

await editFile("README.md", () => {
  return `
# dom-preview


<sub>This README is generated via [./scripts/build-readme.js](./scripts/build-readme.js)</sub>

## Introduction

\`vitest-preview\` was a creates help debugging our test-cases, but some things are missing, and some things
I would consider not necessary.

** Missing: values of input fields are not shown in the preview 
** Missing: the active element is not shown
** Unnecessary: the integrated live-server is not necessary in my opinion. There are projects like \`live-server\`
   on npm that can be used for this.

This project only provides the \`debug()\` command, like \`vitest-preview\`. But it adds the missing things.
Bring your own live-server, the \`debug()\` command just dumps to current dom into \`.dom-preview/index.html\`.

## Installation

${fences("bash", `npm install ${packageJson.name}`)}

## Usage

Run the command

${fences("javascript", "debug()")}

in any of your tests. It uses the global \`documentElement\` to dump the DOM, to the file \`.dom-preview/index.html\`
You can then use the ${npmPackage("live-server")} package to watch the \`.dom-preview\` directory and 
show an auto-updated version of the preview in the browser

${fences("bash", "npm install live-server\nnpx live-server .dom-preview")}

Another convenient way is to use ${npmPackage("npm-run-all")} to run dev-server, tests in watch mode 
and the preview live-server in parallel

\`\`\`json
"scripts": {
    "dev:server": "vite",
    "dev:unit": "vitest --ui",
    "dev:live-server": "live-server .dom-preview",
    "dev": "run-p dev:*",
}
\`\`\`


## License

This project is licensed under the [MIT License](./LICENSE)

## Maintainance-free

I want to be honest. I am not good at maintaining OS projects these days. I have my turn with Handlebars.js, but now there is just to much going on in my life.
That is why I tried to make this project as "maintenance-free" as possible.

That said: If you find this package in 2026 or so and you tell yourself: "This is a dead project". Think about how much maintenance is  really required for it:

* There are no dependendies except for development, and I tried to keep them at a minimum.
* The library is small and has a clear scope. There might be some features missing, but I think of it as almost complete.
* I don't see any way this library may impact security.

If you like to help me maintain and update dependencies, please contact me. At the moment, I tend not to be very active 
though.

## Funding :coffee:

You can support me at 

* [Liberapay](https://de.liberapay.com/nils.knappmeier/)
* [Paypal](https://www.paypal.com/donate/?hosted_button_id=GB656ZSAEQEXN)

`;
});
