interface WithEventListeners {
  addEventListener(
    name: string,
    handler: (event: Event) => void,
    options: { once: boolean },
  ): void;
}

export function waitForEvent(
  obj: WithEventListeners,
  name: string,
): Promise<Event> {
  return new Promise<Event>((resolve) => {
    obj.addEventListener(name, (event) => resolve(event), {
      once: true,
    });
  });
}
