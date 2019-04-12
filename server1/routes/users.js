import Router from 'express-promise-router'
import passport from 'passport'
import users from '../controllers/users'

const {requiresLogin} = users
const userRouter = Router({mergeParams: true})

export default () => {
  userRouter.route('/users').get(users.list)

  // Current logged in user
  userRouter.route('/users/me')
    .get(users.me)
    .put(requiresLogin, users.updateProfile)

  userRouter.route('/users/me/notifications')
    .get(requiresLogin, users.listNotifications)
    .delete(requiresLogin, users.removeNotification)

  userRouter.route('/admin/users/:userId')
    .get(users.getById)
    .put(users.update)

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
          state: JSON.stringify({action})
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
    }, (err, user, googleProfile) => {
      if (err) {
        return res.status(500).send(err.message)
      } else if (user) {
        req.login(user, err => {
          if (err) return res.status(500).send(err.message)
          return res.redirect('/')
        })
      } else if (googleProfile) {
        //google login but no account exists
        return res.redirect('/users/confirm-new-google-account')
      } else {
        return res.status(500).send("Server error. Could not login the user")
      }
    })(req, res, next)
  )

  // Finish by binding the user middleware
  userRouter.param('userId', users.userByID)

  return userRouter
}
