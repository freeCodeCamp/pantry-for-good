import {includes, intersection} from 'lodash'

import {ForbiddenError, ValidationError} from '../lib/errors'
import {ADMIN_ROLE, volunteerRoles} from '../../common/constants'
import config from '../config'
import Settings from '../models/settings'

import {locateAddress} from '../lib/geolocate'

export default {
  async read (req, res) {
    const {user} = req
    const mapRoles = [ADMIN_ROLE, volunteerRoles.DRIVER]
    const projection = user && intersection(user.roles, mapRoles).length ?
      '+gmapsApiKey +gmapsClientId ' : ''

    let settings = await Settings.findOne().select(projection).lean()

    // Add property to indicate if google authentication is available
    settings.googleAuthentication = !!(config.oauth.googleClientID && config.oauth.googleClientSecret)

    // Remove unnecessary info before sending off the object to the client
    delete settings.__v

    res.json(settings)
  },

  async save (req, res) {
    const {user} = req

    if (!includes(user.roles, ADMIN_ROLE)) {
      throw new ForbiddenError
    }

    const location = await locateAddress(req.body.address)

    if (!location) {
      throw new ValidationError({address: 'Address not found'})
    }

    const settings = {
      ...req.body,
      location,
    }

    const count = await Settings.count()

    const query = count ?
      Settings.findByIdAndUpdate(settings._id, settings, {new: true}) :
      Settings.create(settings)

    const savedSettings = await query.select('+gmapsApiKey +gmapsClientId')
    res.json(savedSettings)
  }
}
