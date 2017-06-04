import {normalize} from 'normalizr'
import {intersection} from 'lodash'

import * as schemas from '../../common/schemas'

let users = []

export default (req, res, next) => {
  const {websocket, body} = req.body || {}
  if (!websocket) return next()

  req.body = body
  const oldJson = res.json

  res.json = json => {
    oldJson.call(res, json)
    if (res.statusCode !== 200) return

    json = JSON.parse(JSON.stringify(json))
    let response

    if (!websocket.schema) {
      response = json
    } else if (typeof websocket.schema === 'string') {
      response = normalize(json, schemas[websocket.schema])
    } else {
      const entities = Object.assign({},
        ...Object.keys(websocket.schema).map(k => {
          const schema = schemas[websocket.schema[k]]
          return {[k]: normalize(json[k], schema).entities[k]}
        })
      )
      response = {entities}
    }

    const action = {type: websocket.successType, response}
    const syncTo = ['admin', ...websocket.syncTo]

    users.forEach(user => {
      if (user.socket.id === req.headers['socket-id']) return
      if (intersection(user.roles, syncTo).length) {
        user.socket.emit('action', action)
      }
    })
  }

  next()
}

export const addUser = (user, socket) => users.push({...user, socket})
