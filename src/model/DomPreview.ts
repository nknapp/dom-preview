export interface DomPreview {
  id: string;
  timestamp: number;
  context: string;
  alias?: string;
  html: string;
  inputValues: string[];
}
