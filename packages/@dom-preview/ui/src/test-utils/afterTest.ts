type AfterTestFn = () => Promise<void> | void;

let afterTestFns: Array<AfterTestFn> = [];

export function afterTest(fn: AfterTestFn) {
  afterTestFns.push(fn);
}

afterEach(async () => {
  await Promise.all(afterTestFns.map((fn) => fn()));
  afterTestFns = [];
});
