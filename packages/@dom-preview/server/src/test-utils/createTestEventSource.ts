export async function createTestEventSource(baseUrl: string) {
  const eventSource = new EventSource(baseUrl);
  const previewAddedEvents = collectEvents(eventSource, "preview-added");
  const previewsClearedEvents = collectEvents(eventSource, "previews-cleared");

  await new Promise((resolve) => eventSource.addEventListener("open", resolve));

  return { previewAddedEvents, previewsClearedEvents, eventSource };
}

function collectEvents<T>(eventSource: EventSource, eventName: string): T[] {
  const data: T[] = [];
  eventSource.addEventListener(eventName, (event) => {
    data.push(JSON.parse(event.data));
  });
  return data;
}
