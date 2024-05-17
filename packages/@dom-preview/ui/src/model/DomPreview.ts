// TODO: Sync with DomPreview in server package, or extract "shared" package.
export interface DomPreview {
  id: string;
  timestamp: number;
  context: string;
  alias?: string;
  html: string;
  inputValues: string[];
}
