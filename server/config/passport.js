import passport from 'passport'
import localStrategy from './strategies/local'
import googleStrategy from './strategies/google'
import config from './index.js'

export default function() {
  const {User} = require('../models')
  // Serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, {_id: user._id, roles: user.roles})
  })

  // Deserialize sessions
  passport.deserializeUser(async function({_id}, done) {
    try {
      const user = await User.findById(_id, '-salt -password')
      done(null, user)
    } catch (err) {
      done(err)
    }

  })

  // Initialize strategies
  localStrategy()

  if (config.oauth) {
    googleStrategy()
  } else if (process.env.NODE_ENV !== 'test') {
    /* eslint-disable no-console */
    console.log()
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log('!!!  Google oauth API keys not set. Google login is disabled  !!!')
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log()
    /* eslint-enable no-console */
  }
}
