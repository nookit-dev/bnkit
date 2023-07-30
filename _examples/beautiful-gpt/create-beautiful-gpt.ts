type JsonField = {
  name: string;
  type: string;
};

// Implement your validation logic here

export function createBeautifulGpt() {
  let jsonFields: JsonField[] = [];

  function setJsonFields(fields: JsonField[]): void {
    jsonFields = fields;
  }

  function getFormattedJsonTypesForPrompt(): string {
    if (jsonFields.length > 0) {
      return `\n\n

${JSON.stringify(
  jsonFields.reduce((acc, field) => {
    // @ts-ignore
    acc[field.name] = field.type;
    return acc;
  }, {}),
  null,
  2
)}\n\n\n
`;
    }
    throw new Error("No JSON fields have been added");
  }
  
  return {
    setJsonFields,
    getFormattedJsonTypesForPrompt,
  };
}
