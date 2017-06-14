import {extend} from 'lodash'

const env = process.env.NODE_ENV || 'development'

export default extend(
  require('./env/all').default,
  require(`./env/${env}`).default
)
