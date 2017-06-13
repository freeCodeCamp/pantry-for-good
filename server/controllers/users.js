import {extend} from 'lodash'

import * as authentication from './users/authentication'
import * as authorization from './users/authorization'
import * as password from './users/password'
import * as profile from './users/profile'

export default extend(
  authentication,
  authorization,
  password,
  profile
)
