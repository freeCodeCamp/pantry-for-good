import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth2'

import User from '../../models/user'
import config from '../index'

export default function() {
  passport.use(new GoogleStrategy(
    {
      clientID: config.oauth.googleClientID,
      clientSecret: config.oauth.googleClientSecret,
      callbackURL: config.oauth.googleCallbackURL,
      passReqToCallback: true
    },
    async function(req, accessToken, refreshToken, profile, cb) {
      const query = JSON.parse(req.query.state)
      const action = query.action

      try {
        const user = await User.findOne({'google.id': profile.id})
        if (action === 'login') {
          cb(null, user, profile)
        } else if (action === 'signup') {
          signup(user, profile, cb)
        } else {
          throw new Error('An action of type "login" or "signup" must be specified')
        }
      } catch (err) {
        cb(err)
      }
    }
  ))
}

const signup = (user, profile, cb) => {
  if (user) {
    throw new Error("An account already exists with that google ID")
  } else {
    User.create(
      {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.email,
        provider: 'google',
        roles: [],
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
