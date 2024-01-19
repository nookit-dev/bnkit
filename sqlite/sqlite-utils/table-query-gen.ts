import { FieldDef, SchemaMap } from '../sqlite-factory'

export function assembleCreateTableQuery(
  tableName: string,
  columns: string[],
  tableLevelConstraints: string[],
): string {
  if (columns.length === 0) throw new Error(`No columns for table ${tableName}`)
  const tableDefinition = [...columns, ...tableLevelConstraints].filter(Boolean).join(', ')
  return `CREATE TABLE IF NOT EXISTS \`${tableName}\` (${tableDefinition});`
}

export function createTableLevelConstraint(fieldName: string, definition: FieldDef): string | null {
  if (definition.foreignKey) {
    const [referencedTable, referencedField]: string[] = definition.foreignKey.split('(')

    if (!referencedField) throw new Error(`No referenced field for foreign key ${definition.foreignKey}`)
    if (!referencedTable) throw new Error(`No referenced table for foreign key ${definition.foreignKey}`)
    return `FOREIGN KEY (\`${fieldName}\`) REFERENCES ${referencedTable.trim()}(${referencedField}`.trim()
  }
  return null
}

export function createColumnDefinition(fieldName: string, definition: FieldDef): string {
  if (!definition) throw new Error(`No definition for field ${fieldName}`)
  const type = definition.type
  const constraints = []

  if (definition.primaryKey) constraints.push('PRIMARY KEY')
  if (definition.unique) constraints.push('UNIQUE')
  if (definition.required) constraints.push('NOT NULL')
  if (definition.defaultValue !== undefined) {
    constraints.push(`DEFAULT ${definition.defaultValue}`)
  }

  return `\`${fieldName}\` ${type} ${constraints.join(' ')}`.trim()
}

export function createTableQuery<Schema extends SchemaMap>({
  schema,
  tableName,
  debug = false,
}: {
  tableName: string
  schema: Schema
  debug?: boolean
}): string {
  if (debug) {
    console.info({ schema, tableName })
  }

  if (!schema) throw new Error(`No schema provided for table ${tableName}`)

  const columns = Object.keys(schema).map((fieldName) => {
    return createColumnDefinition(fieldName, schema[fieldName] as FieldDef)
  })
  const tableLevelConstraints = Object.keys(schema)
    .map((fieldName) => createTableLevelConstraint(fieldName, schema[fieldName] as FieldDef) || '')
    .filter(Boolean)

  const query = assembleCreateTableQuery(tableName, columns, tableLevelConstraints)

  if (debug) {
    console.info({ query, schema, tableName })
  }

  return query
}
