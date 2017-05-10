import {intersection} from 'lodash'
import Settings from '../models/settings'

export default {
  async read (req, res) {
    const {user} = req
    const projection = user && intersection(user.roles, ['admin', 'driver']).length ?
      '+gmapsApiKey +gmapsClientId' : ''

    const settings = await Settings.findOne().select(projection)
    res.json(settings)
  },

  async save (req, res) {
    const {user} = req

    if (!user || !user.roles.find(role => role === 'admin'))
      return res.status(403).json({
        message: 'User is not authorized'
      })

    const count = await Settings.count()
    const settings = count ?
      await Settings.findByIdAndUpdate(req.body._id, req.body, {new: true}) :
      await Settings.create(req.body)

    res.json(settings)
  }
}
