describe("iframe", () => {
  it("can set outerHTML by using document.write()", () => {
    const iframe = document.createElement("iframe");
    document.body.append(iframe);
    const contentWindow = iframe.contentWindow!;
    expect(contentWindow).not.toBeNull();
    contentWindow.document.open();
    contentWindow.document.write(
      "<html><head><title>title</title></head><body>hello</body></html>",
    );
    contentWindow.document.close();

    expect(iframe.contentDocument?.documentElement.outerHTML).toEqual(
      "<html><head><title>title</title></head><body>hello</body></html>",
    );
  });
});
