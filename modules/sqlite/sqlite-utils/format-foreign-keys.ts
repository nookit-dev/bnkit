import { SQLiteSchemaToTypeScript } from "../sqlite-factory";
import { ForeignKeysT } from "../sqlite-table-factory";

export function formatForeignKeys<Schema extends SQLiteSchemaToTypeScript<any>>(
  foreignKeys: ForeignKeysT<Schema> | undefined
): string {
  if (!foreignKeys) return "";
  return foreignKeys
    .map(
      (fk) => `FOREIGN KEY (${String(fk.column)}) REFERENCES ${fk.references}`
    )
    .join(", ");
}
