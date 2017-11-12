import keys from '../config/index'
import nodeGeocoder from 'node-geocoder'
import {fieldTypes} from '../../common/constants'
import {getFieldsByType} from '../lib/questionnaire-helpers'
import {ValidationError} from '../lib/errors'

const geocoder = nodeGeocoder({
  provider: 'google',
  apiKey: keys.gmapsApiKey,
  formatter: null
})

export async function locateAddress(address) {
  const [result] = await geocoder.geocode(address)
  if (!result) return

  const {latitude, longitude} = result
  return {lat: latitude, lng: longitude}
}

export async function locateQuestionnaire(fields, identifier) {
  if (process.env.NODE_ENV === 'test') return

  const addressFields = await getFieldsByType(
    identifier, fields, fieldTypes.ADDRESS)

  const address = addressFields.map(field => field.value).join(', ')

  const location = await locateAddress(address)

  // Mark all address fields as invalid, add error text to first field
  if (!location) return new ValidationError({
    fields: Object.assign({}, ...addressFields.map((field, i) => ({
      [field.meta]: i === 0 ? 'Address not found' : ' '}
    )))
  })

  return location
}
