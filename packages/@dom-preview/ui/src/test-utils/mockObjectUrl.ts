const objectUrls: Record<string, Blob> = {};

let counter = 0;

export function mockObjectUrl() {
  Object.defineProperty(window.URL, "createObjectURL", {
    value: (blob: Blob) => {
      const result = `blob:${window.origin}/${counter++}`;
      objectUrls[result] = blob;
      return result;
    },
  });

  Object.defineProperty(window.URL, "revokeObjectURL", {
    value: (url: string) => {
      delete objectUrls[url];
    },
  });
}

export async function getObjectUrl(objectUrl: string): Promise<string | null> {
  return (await objectUrls[objectUrl]?.text()) ?? null;
}
