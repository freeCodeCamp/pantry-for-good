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
  userRouter.route('/auth/google').get(passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }))
  userRouter.route('/auth/google/callback').get(
    (req, res, next) => passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }, (err, user, info) => {
      if (err || !user) return res.status(400).json(info)
      req.login(user, err => {
        if (err) return res.status(400).json(err)
        return res.redirect('/')
      })
    })(req, res, next)
  )

  // Finish by binding the user middleware
  userRouter.param('userId', users.userByID)

  return userRouter
}
