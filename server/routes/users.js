import Router from 'express-promise-router'
import passport from 'passport'
import users from '../controllers/users'

const userRouter = Router({mergeParams: true})

export default () => {
  // Setting up the users profile api
  userRouter.route('/users/me').get(users.me)
  userRouter.route('/users').put(users.update)

  // Setting up the users password api
  userRouter.route('/users/password').post(users.changePassword)
  userRouter.route('/auth/forgot').post(users.forgot)
  userRouter.route('/auth/reset/:token').post(users.reset)

  // Setting up the users authentication api
  userRouter.route('/auth/signup').post(users.signup)
  userRouter.route('/auth/signin').post(users.signin)
  userRouter.route('/auth/signout').get(users.signout)

  // Setting the google oauth routes
  userRouter.route('/auth/google').get(
    (req, res, next) => {
      const action = req.query.action || 'login'
      passport.authenticate('google',
        {
          scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'],
          state: JSON.stringify({action: action, accountType: req.query.accountType})
        }
      )(req, res, next)
    }
  )

  userRouter.route('/auth/google/callback').get(
    (req, res, next) => passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }, (err, user) => {
      if (err) {
        return res.status(500).send(err.message)
      } else if (!user) {
        return res.status(500).send("Server error. Could not login the user")        
      } else {
        req.login(user, err => {
          if (err) return res.status(500).send(err.message)
          return res.redirect('/')
        })
      }
    })(req, res, next)
  )

  // Finish by binding the user middleware
  userRouter.param('userId', users.userByID)

  return userRouter
}
