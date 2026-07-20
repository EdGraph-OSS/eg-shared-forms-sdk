import { getDefaultFormState } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'

const fieldSchema = {
  type: 'object',
  properties: { a: { type: 'boolean' }, b: { type: 'boolean' }, c: { type: 'boolean' } },
  additionalProperties: false,
}
const schema = {
  type: 'object',
  properties: { sec: { type: 'object', properties: { q: fieldSchema } } },
}

for (const data of [
  { sec: { q: { a: true } } },
  { sec: { q: { a: true, b: true } } },
  { sec: { q: { a: true, b: true, c: true } } },
]) {
  const out = getDefaultFormState(validator, schema, data, schema)
  console.log(JSON.stringify(data.sec.q), '=>', JSON.stringify(out.sec?.q))
}
