type HTMLProcessor = {
  prettify: (html: string) => string;
  // add more methods as needed
};
export function createHTMLProcessor(): HTMLProcessor {
  return {
    prettify: () => {
      return "test";
    },
    // add more methods as needed
  };
}
