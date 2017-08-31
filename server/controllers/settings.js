import {intersection} from 'lodash'

import {ForbiddenError} from '../lib/errors'
import {ADMIN_ROLE, volunteerRoles} from '../../common/constants'
import config from '../config'
import Settings from '../models/settings'

import nodeGeocoder from 'node-geocoder'
import {fieldTypes} from '../../common/constants'
import {getFieldsByType} from '../lib/questionnaire-helpers'
import locationSchema from '../models/location-schema'
import {ValidationError} from '../lib/errors'

// Initialize geocoder options for pre save method
const geocoder = nodeGeocoder({
  provider: 'google',
  formatter: null
})

/**
 * Hook a method to construct the geolocation of the address
 */
async function updateLocationSettings(address, id, next){
  const [result] = await geocoder.geocode(address)
  if (result && result != undefined && result != null && result != {}) {
    const {latitude, longitude} = result
    await Settings.findByIdAndUpdate(id, {location: {lat: latitude, lng: longitude}})
    return 0
  } else if (!result) return next(new ValidationError({address: 'Address not found'}))
}


export default {
  async read (req, res) {
    const {user} = req
    const mapRoles = [ADMIN_ROLE, volunteerRoles.DRIVER]
    const projection = user && intersection(user.roles, mapRoles).length ?
      '+gmapsApiKey +gmapsClientId ' : ''

    let settings = await Settings.findOne().select(projection).lean()

    // Add property to indicate if google authentication is available
    Object.assign(settings, {
      googleAuthentication: !!(config.oauth.googleClientID && config.oauth.googleClientSecret)
    })

    // Remove unnecessary info before sending off the object to the client
    delete settings.__v

    res.json(settings)
  },

  async save (req, res, next) {
    const {user} = req

    if (!user || !user.roles.find(role => role === ADMIN_ROLE)) {
      throw new ForbiddenError
    }
    let updateLocation = updateLocationSettings(req.body.address, req.body._id, next)
    if (updateLocation === 0){
      const count = await Settings.count()

      const query = count ?
        Settings.findByIdAndUpdate(req.body._id, req.body, {new: true}) :
        Settings.create(req.body)

      const settings = await query.select('+gmapsApiKey +gmapsClientId')
      res.json(settings)
    } else return updateLocation
  }
}
