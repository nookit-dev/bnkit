export function insertQueryString<Item extends object>(
  tableName: string,
  item: Item
) {
  const valuesArray = Object.values(item);
  const placeholders = valuesArray.map(() => "?").join(", ");
  return `INSERT INTO ${tableName} VALUES (${placeholders})`;
}

export function selectAllTableQueryString(tableName: string) {
  return `SELECT * FROM ${tableName};`;
}

export function deleteQueryString(tableName: string) {
  return `DELETE FROM ${tableName} WHERE id = $id;`;
}

export function updateQueryString(tableName: string, item: any) {
    const updateFields = Object.keys(item)
      .map((key) => `${key} = $${key}`)
      .join(", ");
    return `UPDATE ${tableName} SET ${updateFields} WHERE id = $id;`;
  }