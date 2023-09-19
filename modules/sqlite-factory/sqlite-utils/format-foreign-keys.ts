import { TypeMapping } from "mod/types";
import { ForeignKeysType } from "../create-sqlite-table-factory";

export function formatForeignKeys<
  Schema extends Record<string, keyof TypeMapping>
>(foreignKeys: ForeignKeysType<Schema> | undefined): string {
  if (!foreignKeys) return "";
  return foreignKeys
    .map(
      (fk) => `FOREIGN KEY (${String(fk.column)}) REFERENCES ${fk.references}`
    )
    .join(", ");
}
