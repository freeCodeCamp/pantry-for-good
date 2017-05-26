import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'

export default function() {
  const {User} = require('../../models')

  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, async function(username, password, done) {
    try {
      const user = await User.findOne({username})
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
