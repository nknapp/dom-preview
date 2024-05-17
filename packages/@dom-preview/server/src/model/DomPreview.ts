import { z } from "zod";

export const DomPreviewValidator = z.object({
  timestamp: z.number(),
  context: z.string(),
  alias: z.optional(z.string()),
  html: z.string(),
  inputValues: z.array(z.string()),
});

export type DomPreview = z.TypeOf<typeof DomPreviewValidator>;
