import { convertMarkdownToHTML } from "../../utils/text-utils";

type MarkdownProcessor = {
  toHTML: (markdown: string) => string;
  // add more methods as needed
};

export function createMarkdownProcessor(): MarkdownProcessor {
  return {
    toHTML: (markdown: string) => {
      return convertMarkdownToHTML(markdown);
    },
    // add more methods as needed
  };
}
