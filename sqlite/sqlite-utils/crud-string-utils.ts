export function insertQueryString<Item extends Record<string, any>>(
  tableName: string,
  item: Item
): string {
  // Define a whitelist for table names if they are dynamic or ensure tableName is sanitized.
  const safeTableName = escapeIdentifier(tableName);

  // Get the column names and placeholders.
  const columns = Object.keys(item)
    .map((column) => escapeIdentifier(column))
    .join(", ");
  const placeholders = Object.values(item)
    .map(() => "?")
    .join(", ");

  // Handle the case where the item might be empty.
  if (columns.length === 0 || placeholders.length === 0) {
    throw new Error("No data provided for insert.");
  }

  return `INSERT INTO ${safeTableName} (${columns}) VALUES (${placeholders})`;
}

function escapeIdentifier(identifier: string): string {
  // This is a simplistic approach and might not cover all edge cases.
  if (!identifier.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
    throw new Error("Invalid identifier");
  }
  return identifier; // Assuming the identifier is safe, otherwise escape it properly.
}
export function selectAllTableQueryString(tableName: string): string {
  // Validate or escape the tableName to prevent SQL injection
  const safeTableName = escapeIdentifier(tableName);
  return `SELECT * FROM ${safeTableName};`;
}

export function deleteQueryString(tableName: string): string {
  // Validate or escape the tableName to prevent SQL injection
  const safeTableName = escapeIdentifier(tableName);
  return `DELETE FROM ${safeTableName} WHERE id = $id;`;
}

export function updateQueryString(
  tableName: string,
  item: Record<string, any>
): string {
  // Validate or escape the tableName to prevent SQL injection
  const safeTableName = escapeIdentifier(tableName);

  const updateFields = Object.keys(item)
    .map((key) => `${escapeIdentifier(key)} = $${key}`)
    .join(", ");

  // Check if the updateFields string is empty and throw an error if it is
  if (updateFields.length === 0) {
    throw new Error("No fields to update were provided.");
  }

  return `UPDATE ${safeTableName} SET ${updateFields} WHERE id = $id;`;
}
