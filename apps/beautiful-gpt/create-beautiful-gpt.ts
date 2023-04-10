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

  // function validateApiData(apiData: any, validationSchema: any): any {
  //   try {
  //     const validatedData = validationSchema.parse(apiData);
  //     return validatedData;
  //   } catch (error) {
  //     // Handle validation errors here, e.g. throw an error or return a default value
  //     console.error("Validation failed:", error);
  //     return null;
  //   }
  // }

  const getTestPrompt = (prompt: string) => {
    return `
${prompt}
Return Data as JSON format, below is expected JSON format. The keys are the field names and the value is the expect type of that field::

${getFormattedJsonTypesForPrompt()}
     `;
  };

  return {
    setJsonFields,
    getFormattedJsonTypesForPrompt,
    // validateApiData,
    getTestPrompt,
  };
}
