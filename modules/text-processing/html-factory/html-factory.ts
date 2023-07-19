import { prettifyHTMLString } from "utils/text-utils";

type HTMLProcessor = {
  prettify: (html: string) => string;
  // add more methods as needed
};
export function createHTMLProcessor(): HTMLProcessor {
  return {
    prettify: (html: string) => {
      return prettifyHTMLString(html);
    },
    // add more methods as needed
  };
}
