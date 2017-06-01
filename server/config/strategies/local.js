import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'

export default function() {
  const {User} = require('../../models')

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async function(email, password, done) {
    try {
      const user = await User.findOne({email})
      if (!user || !user.authenticate(password)) {
        return done(null, false, {
          message: 'Unknown user or invalid password'
        })
      }
      return done(null, user)
    } catch (err) {
      done(err)
    }
  }))
}
