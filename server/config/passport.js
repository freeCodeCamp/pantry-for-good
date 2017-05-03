import passport from 'passport'
import localStrategy from './strategies/local'

export default function() {
  const {User} = require('../models')
  // Serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  // Deserialize sessions
  passport.deserializeUser(async function(id, done) {
    try {
      const user = await User.findById(id, '-salt -password')
      done(null, user)
    } catch (err) {
      done(err)
    }

  })

  // Initialize strategies
  localStrategy()
}
