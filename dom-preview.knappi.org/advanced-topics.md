# Advanced topics

## Assets and Images

`dom-preview` does not know about your project setup. If you are using `vite` and your component
is showing an image that is loaded via an import or from the `public` folder, then `dom-preview`
will probably not show the image.

But, the `vite` dev-server knows where to find this image. It knows the rules. And in other frameworks, you
will have dev-servers as well...

The solution is to run the dev-server

```bash
vite --port 5173
```

and then run `dom-preview` with the `--proxy-to` option

```bash
dom-preview --proxy-to=http://localhost:5173
```

(it is important NOT to put a `/` at the end).

Now, `dom-preview` will proxy all requests that do not go to `/__dom-preview__/` to the vite dev-server,
which allows it to show images correctly.

## Global CSS

We often import CSS either directly in the `index.html` file or in the `main.ts` file of our frontend.
That CSS will not be loaded into JSDOM, if we only import our test and the component under test.

We do not want to import the css in a `setupFile`, because this might slow down tests.

Since you only need the CSS when calling the debug function, I suggest that you
create a file `showMe.ts` that delegates to `debug` and imports the global styles:

**showMe.ts**

<<< @/examples/global-css/showMe.ts

Then, you always use that file instead of using `debug` directly.

## Attaching inside an `app` element

I encountered a caveat where not all styles where applied to the element, because
the CSS contained rules like

```css
#app {
  text-align: center;
}
```

In this case, you need to make sure that your component is also attached inside an `#app` element. With the
`@testing-library/vue`, you can do this by providing a `container` element.
