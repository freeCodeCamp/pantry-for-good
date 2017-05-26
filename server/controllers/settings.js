import {intersection} from 'lodash'
import Settings from '../models/settings'
import config from '../config'

export default {
  async read (req, res) {
    const {user} = req
    const projection = user && intersection(user.roles, ['admin', 'driver']).length ?
      '+gmapsApiKey +gmapsClientId' : ''

    const settings = await Settings.findOne().select(projection).lean()

    // Add property to indicate if google authentication is available
    Object.assign(settings, {googleAuthentication: !!(config.oauth)})

    // Remove unnecessary info before sending off the object to the client
    delete settings.__v


    res.json(settings)
  },

  async save (req, res) {
    const {user} = req

    if (!user || !user.roles.find(role => role === 'admin'))
      return res.status(403).json({
        message: 'User is not authorized'
      })

    const count = await Settings.count()
    const query = count ?
      Settings.findByIdAndUpdate(req.body._id, req.body, {new: true}) :
      Settings.create(req.body)

    const settings = await query.select('+gmapsApiKey +gmapsClientId')
    res.json(settings)
  }
}
