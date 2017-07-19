import passport from 'passport'
import localStrategy from './strategies/local'
import googleStrategy from './strategies/google'
import config from './index.js'
import User from '../models/user'

export default function() {
  // Serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, {_id: user._id, roles: user.roles})
  })

  // Deserialize sessions
  passport.deserializeUser(async function({_id}, done) {
    try {
      const user = await User.findById(_id)
      done(null, user)
    } catch (err) {
      done(err)
    }

  })

  // Initialize strategies
  localStrategy()

  if (config.oauth.googleClientID && config.oauth.googleClientSecret) {
    googleStrategy()
  } else if (process.env.NODE_ENV !== 'test') {
    console.warn()
    console.warn('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.warn('!!!  Google oauth API keys not set. Google login is disabled  !!!')
    console.warn('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.warn()
  }
}
