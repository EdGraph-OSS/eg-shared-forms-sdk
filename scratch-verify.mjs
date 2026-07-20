import { groupBy } from 'lodash-es'
import sampleForm from './src/sample-form.ts'
import { aggregateForm } from './src/utils/form.ts'

const { form, sections, questions } = sampleForm
const grouped = groupBy(questions, 'sectionId')
const result = aggregateForm(form, sections, grouped, [])

const secId = 'f9d2b6a4-3c1e-4a7b-8e5d-0f1a2b3c4d5e'
const qId = 'd0e1f2a3-4b5c-4d6e-9f7a-8b9c0d1e2f3a'
console.log('UI field:', result.uiSchema[secId][qId]['ui:field'])
console.log('UI cards:', JSON.stringify(result.uiSchema[secId][qId]['ui:options'].cards, null, 1))
console.log('JSON schema props:', Object.keys(result.jsonSchema.properties[secId].properties[qId].properties))
console.log('additionalProperties:', result.jsonSchema.properties[secId].properties[qId].additionalProperties)
