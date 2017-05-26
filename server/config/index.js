import {extend} from 'lodash'

const env = process.env.NODE_ENV || 'development'

export default extend(
  require('./env/all'),
  require(`./env/${env}`)
)
