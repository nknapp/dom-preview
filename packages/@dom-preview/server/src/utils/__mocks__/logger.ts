/// <reference types="vite/client" />
/* eslint-disable no-console */

const MUTE_LOGGER = import.meta.env.MUTE_LOGGER === "true";

export const logError = vi.fn(
  MUTE_LOGGER ? () => {} : console.error.bind(console),
);
export const logInfo = vi.fn(
  MUTE_LOGGER ? () => {} : console.log.bind(console),
);
