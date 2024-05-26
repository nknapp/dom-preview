import { setDomPreviewContext } from "dom-preview";

beforeEach(() => {
  setDomPreviewContext(expect.getState().currentTestName);
});
