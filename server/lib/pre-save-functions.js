import nodeGeocoder from 'node-geocoder'
import {fieldTypes} from '../../common/constants'
import {getFieldsByType} from '../lib/questionnaire-helpers'
import locationSchema from '../models/location-schema'
import {modelTypes, questionnaireIdentifiers} from '../../common/constants'

// Initialize geocoder options for pre save method
const geocoder = nodeGeocoder({
  provider: 'google',
  formatter: null
})

/**
 * Hook a pre save method to construct the geolocation of the address
 */
export async function preFunction(ModelSchema, questionnaireIdentifiers){
  ModelSchema.pre('save', async function(next) {
    if (process.env.NODE_ENV === 'test') return next()

    const addressFields = await getFieldsByType(
      questionnaireIdentifiers, this.fields, fieldTypes.ADDRESS)

    const address = addressFields.map(field => field.value).join(', ')

    const [result] = await geocoder.geocode(address)

    if (!result) return next(new ValidationError({
      fields: Object.assign({}, ...addressFields.map((field, i) => ({
        [field.meta]: i === 0 ? 'Address not found' : ' '}
      )))
    }))

    const {latitude, longitude} = result
    this.location = {lat: latitude, lng: longitude}
    return next()
  })
}
