import { z } from "zod";

export const DomPreviewCreateModel = z.object({
  timestamp: z.number(),
  context: z.string(),
  alias: z.optional(z.string()),
  html: z.string(),
  inputValues: z.array(z.string()),
});

export const DomPreviewReadModel = DomPreviewCreateModel.extend({
  id: z.string(),
});

export type DomPreviewCreate = z.infer<typeof DomPreviewCreateModel>;
export type DomPreview = z.infer<typeof DomPreviewReadModel>;
