import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth2'

import config from '../index'

export default function() {
  const {User} = require('../../models')
  const appUrl = config.host === 'localhost' ?
    `${config.protocol}://${config.host}:8080` :
    `${config.protocol}://${config.host}`

  passport.use(new GoogleStrategy({
    clientID: config.oauth.googleClientID,
    clientSecret: config.oauth.googleClientSecret,
    callbackURL: appUrl + config.oauth.googleCallbackURL
  }, async function(accessToken, refreshToken, profile, cb) {
    try {
      const user = await User.findOne({'google.id': profile.id})
      // console.log('profile', profile)

      if (!user) {
        const newUser = new User({
          username: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.email,
          provider: 'google',
          // TODO: how to
          accountType: ['customer'],
          roles: ['customer'],
          google: {id: profile.id}
        })

        await newUser.save()
        return cb(null, newUser)
      }

      cb(null, user)
    } catch (err) {
      cb(err)
    }
  }))
}
