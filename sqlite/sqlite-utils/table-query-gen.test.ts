import { describe, expect, it, test } from "bun:test";
import { FieldDef, SchemaMap } from "../sqlite-factory";
import {
  assembleCreateTableQuery,
  createColumnDefinition,
  createTableLevelConstraint,
  createTableQuery,
} from "./table-query-gen";

test("createTableQuery constructs SQL query correctly with foreign keys", () => {
  const schema = {
    id: { type: "INTEGER" },
    name: { type: "TEXT" },
    fkTest: { type: "TEXT", foreignKey: "other_table(id)" },
  } satisfies SchemaMap;

  const result = createTableQuery({
    schema,
    tableName: "test_table",
  });

  expect(result).toBe(
    "CREATE TABLE IF NOT EXISTS `test_table` (`id` INTEGER, `name` TEXT, `fkTest` TEXT, FOREIGN KEY (`fkTest`) REFERENCES other_table(id));",
  );
});

test("createTableQuery constructs SQL query correctly without foreign keys", () => {
  const schema = {
    id: { type: "INTEGER" },
    name: { type: "TEXT" },
  } satisfies SchemaMap;

  const result = createTableQuery({
    schema,
    tableName: "test_table",
  });

  expect(result).toBe("CREATE TABLE IF NOT EXISTS `test_table` (`id` INTEGER, `name` TEXT);");
});

describe("createColumnDefinition", () => {
  it("should generate a column definition for a simple TEXT field", () => {
    const definition: FieldDef = { type: "TEXT" };
    const result = createColumnDefinition("name", definition);
    expect(result).toBe("`name` TEXT");
  });

  it("should generate a column definition for an INTEGER field with a PRIMARY KEY", () => {
    const definition: FieldDef = { type: "INTEGER", primaryKey: true };
    const result = createColumnDefinition("id", definition);
    expect(result).toBe("`id` INTEGER PRIMARY KEY");
  });

  // Add tests for unique, notNull, and defaultValue...

  it("should throw an error if the definition is not provided", () => {
    expect(() => {
      createColumnDefinition("age", undefined as unknown as FieldDef);
    }).toThrow();
  });

  it("should generate a column definition with a UNIQUE constraint", () => {
    const definition: FieldDef = { type: "TEXT", unique: true };
    const result = createColumnDefinition("username", definition);
    expect(result).toBe("`username` TEXT UNIQUE");
  });

  it("should generate a column definition with a NOT NULL constraint", () => {
    const definition: FieldDef = { type: "INTEGER", required: true };
    const result = createColumnDefinition("age", definition);
    expect(result).toBe("`age` INTEGER NOT NULL");
  });

  it("should generate a column definition with a DEFAULT value", () => {
    const definition: FieldDef = { type: "TEXT", defaultValue: "N/A" };
    const result = createColumnDefinition("status", definition);
    expect(result).toBe("`status` TEXT DEFAULT N/A");
  });

  it("should correctly quote a DEFAULT string value", () => {
    const definition: FieldDef = {
      type: "TEXT",
      defaultValue: "'active'",
    };
    const result = createColumnDefinition("state", definition);
    expect(result).toBe("`state` TEXT DEFAULT 'active'");
  });

  it("should generate a column definition with multiple constraints", () => {
    const definition: FieldDef = {
      type: "INTEGER",
      required: true,
      unique: true,
      defaultValue: 0,
    };
    const result = createColumnDefinition("count", definition);
    expect(result).toContain("`count` INTEGER");
    expect(result).toContain("NOT NULL");
    expect(result).toContain("DEFAULT 0");
  });

  it("should not include DEFAULT when defaultValue is not provided", () => {
    const definition: FieldDef = { type: "REAL" };
    const result = createColumnDefinition("price", definition);
    expect(result).toBe("`price` REAL");
  });

  it("should handle numeric DEFAULT values correctly", () => {
    const definition: FieldDef = { type: "INTEGER", defaultValue: 10 };
    const result = createColumnDefinition("quantity", definition);
    expect(result).toBe("`quantity` INTEGER DEFAULT 10");
  });

  // Test for an edge case where type is unknown
  // it("should throw an error if an invalid type is provided", () => {
  //   const definition = { type: "INVALID_TYPE" } as unknown as FieldDefinition;
  //   expect(() => {
  //     createColumnDefinition("invalid", definition);
  //   }).toThrow();
  // });

  // Test for proper escaping of field names that are SQL keywords
  it("should escape field names that are SQL keywords", () => {
    const definition: FieldDef = { type: "TEXT" };
    const result = createColumnDefinition("group", definition);
    expect(result).toBe("`group` TEXT");
  });
});

describe("createTableLevelConstraint", () => {
  it("should generate a foreign key constraint", () => {
    const definition: FieldDef = {
      type: "INTEGER",
      foreignKey: "other_table(id)",
    };
    const result = createTableLevelConstraint("fkTest", definition);
    expect(result).toBe("FOREIGN KEY (`fkTest`) REFERENCES other_table(id)");
  });

  it("should return null if no foreign key is defined", () => {
    const definition: FieldDef = { type: "INTEGER" };
    const result = createTableLevelConstraint("fkTest", definition);
    expect(result).toBeNull();
  });

  it("should generate a foreign key constraint with a custom reference field", () => {
    const definition: FieldDef = {
      type: "INTEGER",
      foreignKey: "other_table(custom_id)",
    };
    const result = createTableLevelConstraint("fkCustomId", definition);
    expect(result).toBe("FOREIGN KEY (`fkCustomId`) REFERENCES other_table(custom_id)");
  });

  it("should properly trim the foreign key definition", () => {
    const definition: FieldDef = {
      type: "INTEGER",
      foreignKey: " other_table (custom_id) ",
    };
    const result = createTableLevelConstraint("fkCustomId", definition);
    expect(result).toBe("FOREIGN KEY (`fkCustomId`) REFERENCES other_table(custom_id)");
  });

  it("should handle foreign keys that include spaces or special characters", () => {
    const definition: FieldDef = {
      type: "TEXT",
      foreignKey: "`other table`(`special id`)",
    };
    const result = createTableLevelConstraint("fkSpecial", definition);
    expect(result).toBe("FOREIGN KEY (`fkSpecial`) REFERENCES `other table`(`special id`)");
  });

  it("should return null for a malformed foreign key definition", () => {
    const definition: FieldDef = {
      type: "INTEGER",
      foreignKey: "malformed",
    };
    expect(() => createTableLevelConstraint("fkMalformed", definition)).toThrow();
  });

  // Test for a case where the foreign key reference does not include a field
  it("should return null if foreign key reference is incomplete", () => {
    const definition: FieldDef = {
      type: "INTEGER",
      foreignKey: "other_table",
    };
    expect(() => createTableLevelConstraint("fkIncomplete", definition)).toThrow();
  });

  // Test for proper escaping of table and column names in foreign key definitions
  it("should escape table and column names in foreign key definitions", () => {
    const definition: FieldDef = {
      type: "INTEGER",
      foreignKey: "`other-table`(`id`)",
    };
    const result = createTableLevelConstraint("fkEscaped", definition);
    expect(result).toBe("FOREIGN KEY (`fkEscaped`) REFERENCES `other-table`(`id`)");
  });
});

describe("assembleCreateTableQuery", () => {
  it("should assemble a create table query with a single column", () => {
    const columns = ["`id` INTEGER PRIMARY KEY"];
    const result = assembleCreateTableQuery("test_table", columns, []);
    expect(result).toBe("CREATE TABLE IF NOT EXISTS `test_table` (`id` INTEGER PRIMARY KEY);");
  });

  it("should assemble a create table query with foreign key constraints", () => {
    const columns = ["`id` INTEGER", "`name` TEXT"];
    const constraints = ["FOREIGN KEY (`id`) REFERENCES other_table(id)"];
    const result = assembleCreateTableQuery("test_table", columns, constraints);
    expect(result).toBe(
      "CREATE TABLE IF NOT EXISTS `test_table` (`id` INTEGER, `name` TEXT, FOREIGN KEY (`id`) REFERENCES other_table(id));",
    );
  });

  it("should handle tables with multiple foreign key constraints", () => {
    const columns = ["`id` INTEGER", "`parent_id` INTEGER", "`owner_id` INTEGER"];
    const constraints = [
      "FOREIGN KEY (`parent_id`) REFERENCES parents(id)",
      "FOREIGN KEY (`owner_id`) REFERENCES owners(id)",
    ];
    const result = assembleCreateTableQuery("test_table", columns, constraints);
    expect(result).toBe(
      "CREATE TABLE IF NOT EXISTS `test_table` (`id` INTEGER, `parent_id` INTEGER, `owner_id` INTEGER, FOREIGN KEY (`parent_id`) REFERENCES parents(id), FOREIGN KEY (`owner_id`) REFERENCES owners(id));",
    );
  });

  it("should include unique constraints at the table level", () => {
    const columns = ["`id` INTEGER", "`email` TEXT"];
    const constraints = ["UNIQUE (`email`)"];
    const result = assembleCreateTableQuery("users", columns, constraints);
    expect(result).toBe("CREATE TABLE IF NOT EXISTS `users` (`id` INTEGER, `email` TEXT, UNIQUE (`email`));");
  });

  it("should return a query without any constraints if none are provided", () => {
    const columns = ["`id` INTEGER", "`name` TEXT"];
    const result = assembleCreateTableQuery("simple_table", columns, []);
    expect(result).toBe("CREATE TABLE IF NOT EXISTS `simple_table` (`id` INTEGER, `name` TEXT);");
  });

  it("should escape table names that are SQL keywords", () => {
    const columns = ["`id` INTEGER"];
    const result = assembleCreateTableQuery("group", columns, []);
    expect(result).toBe("CREATE TABLE IF NOT EXISTS `group` (`id` INTEGER);");
  });

  it("should throw an error if columns are empty", () => {
    expect(() => {
      assembleCreateTableQuery("empty_table", [], []);
    }).toThrow();
  });

  it("should properly format a table with default values", () => {
    const columns = ["`id` INTEGER", "`name` TEXT DEFAULT 'Unknown'"];
    const result = assembleCreateTableQuery("default_values_table", columns, []);
    expect(result).toBe(
      "CREATE TABLE IF NOT EXISTS `default_values_table` (`id` INTEGER, `name` TEXT DEFAULT 'Unknown');",
    );
  });

  it("should assemble a create table query with check constraints", () => {
    const columns = ["`age` INTEGER"];
    const constraints = ["CHECK (`age` >= 18)"];
    const result = assembleCreateTableQuery("check_constraints_table", columns, constraints);
    expect(result).toBe("CREATE TABLE IF NOT EXISTS `check_constraints_table` (`age` INTEGER, CHECK (`age` >= 18));");
  });

  it("should handle a table with composite primary keys", () => {
    const columns = ["`id` INTEGER", "`revision` INTEGER"];
    const constraints = ["PRIMARY KEY (`id`, `revision`)"];
    const result = assembleCreateTableQuery("composite_keys_table", columns, constraints);
    expect(result).toBe(
      "CREATE TABLE IF NOT EXISTS `composite_keys_table` (`id` INTEGER, `revision` INTEGER, PRIMARY KEY (`id`, `revision`));",
    );
  });

  // Test to ensure that backticks are used consistently
  it("should use backticks for all identifiers", () => {
    const columns = ["`id` INTEGER", "`name` TEXT"];
    const constraints = ["FOREIGN KEY (`id`) REFERENCES `other_table`(`id`)"];
    const result = assembleCreateTableQuery("backtick_test", columns, constraints);
    expect(result).toBe(
      "CREATE TABLE IF NOT EXISTS `backtick_test` (`id` INTEGER, `name` TEXT, FOREIGN KEY (`id`) REFERENCES `other_table`(`id`));",
    );
  });

  // Add more tests for complex tables, edge cases, etc...
});
