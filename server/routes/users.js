// import express from 'express'
import Router from 'express-promise-router'
import passport from 'passport'
import * as users from '../controllers/users'

const userRouter = Router({mergeParams: true})

// User Routes
// var users = require('../../app/controllers/users.server.controller');

export default () => {
  // var users = require('../controllers/users.server.controller');
  // Setting up the users profile api
  userRouter.route('/users/me').get(users.me)
  userRouter.route('/users').put(users.update)
  // userRouter.route('/users/accounts').delete(users.removeOAuthProvider);

  // Setting up the users password api
  userRouter.route('/users/password').post(users.changePassword)
  userRouter.route('/auth/forgot').post(users.forgot)
  userRouter.route('/auth/reset/:token').post(users.reset)

  // Setting up the users authentication api
  userRouter.route('/auth/signup').post(users.signup)
  userRouter.route('/auth/signin').post(users.signin)
  userRouter.route('/auth/signout').get(users.signout)

  // // Setting the facebook oauth routes
  // userRouter.route('/auth/facebook').get(passport.authenticate('facebook', {
  //   scope: ['email']
  // }));
  // userRouter.route('/auth/facebook/callback').get(users.oauthCallback('facebook'));

  // // Setting the twitter oauth routes
  // userRouter.route('/auth/twitter').get(passport.authenticate('twitter'));
  // userRouter.route('/auth/twitter/callback').get(users.oauthCallback('twitter'));

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

  // // Setting the linkedin oauth routes
  // userRouter.route('/auth/linkedin').get(passport.authenticate('linkedin'));
  // userRouter.route('/auth/linkedin/callback').get(users.oauthCallback('linkedin'));

  // // Setting the github oauth routes
  // userRouter.route('/auth/github').get(passport.authenticate('github'));
  // userRouter.route('/auth/github/callback').get(users.oauthCallback('github'));

  // Finish by binding the user middleware
  userRouter.param('userId', users.userByID)

  return userRouter
}
