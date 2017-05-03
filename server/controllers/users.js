import {extend} from 'lodash'

module.exports = extend(
  require('./users/authentication'),
  require('./users/authorization'),
  require('./users/password'),
  require('./users/profile')
)
