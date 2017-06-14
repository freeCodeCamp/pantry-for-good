import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth2'

import User from '../../models/user'
import config from '../index'

const VALID_ACCOUNT_TYPES = ['customer', 'volunteer', 'donor']

export default function() {
  const appUrl = config.host === 'localhost' ?
    `${config.protocol}://${config.host}:8080` :
    `${config.protocol}://${config.host}`

  passport.use(new GoogleStrategy(
    {
      clientID: config.oauth.googleClientID,
      clientSecret: config.oauth.googleClientSecret,
      callbackURL: appUrl + config.oauth.googleCallbackURL,
      passReqToCallback: true
    }, 
    async function(req, accessToken, refreshToken, profile, cb) {
      const query = JSON.parse(req.query.state)
      const action = query.action
      const accountType = query.accountType
      
      try {
        const user = await User.findOne({'google.id': profile.id})
        if (action === 'login') {
          login(user, cb)
        } else if (action === 'signup') {
          signup(user, profile, accountType, cb)
        } else {
          throw new Error('An action of type "login" or "signup" must be specified')
        }
      } catch (err) {
        cb(err)
      }
    }
  ))
}

const login = (user, cb) => {
  if (user) {
    cb(null, user)
  } else {
    throw new Error("Could not find account with that googleID")
  }
}

const signup = (user, profile, accountType, cb) => {
  if (user) {
    throw new Error("An account already exists with that google ID")
  } else if (VALID_ACCOUNT_TYPES.indexOf(accountType) < 0) {
    throw new Error(`Invalid account type. Only ${VALID_ACCOUNT_TYPES.join(', ')} accounts can be self-registered`)
  } else {
    User.create(
      {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.email,
        provider: 'google',
        accountType: [accountType],
        roles: [accountType],
        google: {id: profile.id}
      }, 
      (err, newUser) => {
        if (err) {
          throw err
        } else {
          cb(null, newUser)
        }
      } 
    )
  }
}
