import {normalize, schema} from 'normalizr'
import {intersection} from 'lodash'

let users = []

export default sync => {
  if (!sync.syncTo) sync.syncTo = []
  if (typeof(sync.type) !== 'string')
    throw new Error('action type must be a string')

  return (req, res, next) => {
    const oldJson = res.json

    res.json = json => {
      oldJson.call(res, json)
      if (res.statusCode !== 200) return

      json = JSON.parse(JSON.stringify(json))
      let response

      if (!sync.schema) {
        response = json
      } else if (Object.keys(schema).some(type => sync.schema instanceof schema[type])) {
        // schema is a normalizr schema
        response = normalize(json, sync.schema)
      } else {
        // schema is a map of entity types to schemas
        const entities = Object.assign({},
          ...Object.keys(sync.schema).map(k => ({
            [k]: normalize(json[k], sync.schema[k]).entities[k]
          }))
        )
        response = {entities}
      }

      const action = {type: sync.type, response}
      const syncTo = sync.syncTo.concat('admin')

      users.forEach(user => {
        if (user.socket.id === req.headers['socket-id']) return
        if (intersection(user.roles, syncTo).length) {
          user.socket.emit('action', action)
        }
      })
    }

    next()
  }
}

export const addUser = (user, socket) => users.push({...user, socket})
