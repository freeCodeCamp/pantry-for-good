import {take} from 'lodash'

export default (client, num) => {
  const fields = client.fields.filter(field =>
    field.meta && field.meta.type === 'address')

  return take(fields, num || fields.length)
    .map(field => field.value)
    .join(', ')
}
