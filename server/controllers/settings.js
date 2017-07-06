import {intersection} from 'lodash'

import {ForbiddenError} from '../lib/errors'
import {ADMIN_ROLE, volunteerRoles} from '../../common/constants'
import config from '../config'
import Settings from '../models/settings'


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

  async save (req, res) {
    const {user} = req

    if (!user || !user.roles.find(role => role === ADMIN_ROLE)) {
      throw new ForbiddenError
    }

    const count = await Settings.count()
    const query = count ?
      Settings.findByIdAndUpdate(req.body._id, req.body, {new: true}) :
      Settings.create(req.body)

    const settings = await query.select('+gmapsApiKey +gmapsClientId')
    res.json(settings)
  }
}
