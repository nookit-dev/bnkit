import { expect, test } from 'bun:test'
import { SchemaMap } from '../sqlite-factory'
import { formatSchema } from './format-schema'

test('formatSchema formats schema correctly', () => {
  const schema = {
    id: { type: 'INTEGER' },
    name: { type: 'TEXT' },
  } satisfies SchemaMap

  // TODO need to fix schema type
  const result = formatSchema(schema)

  expect(result[0]).toBe('id INTEGER')
  expect(result[1]).toBe('name TEXT')
})
