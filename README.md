[![Build Status](https://travis-ci.org/freeCodeCamp/pantry-for-good.svg?branch=staging)](https://travis-ci.org/freeCodeCamp/pantry-for-good)
[![Docker Repository on Quay](https://quay.io/repository/painejs/pantry-for-good/status "Docker Repository on Quay")](https://quay.io/repository/painejs/pantry-for-good)
[![Join the chat at https://gitter.im/FreeCodeCamp/pantry-for-good](https://badges.gitter.im/FreeCodeCamp/pantry-for-good.svg)](https://gitter.im/FreeCodeCamp/pantry-for-good?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This repository is for the Pantry-for-Good application designed by Open Source for Good Contributors at [freeCodeCamp](http://www.freecodecamp.com). For deployment instructions see the [deployment guide](DEPLOYMENT.md).

If you'd like to contribute, the [contributing guide](CONTRIBUTING.md) explains the git workflow and the [developers guide](https://github.com/freeCodeCamp/pantry-for-good/wiki/developer's-guide) gives an overview of how the app works. The [open issues](https://github.com/freeCodeCamp/pantry-
Google Maps API key for the deliveries feature. Currently, this key needs to be entered in the general settings page of your local instance of the applicaiton.
#### 2. [oauth](https://developers.google.com/identity/sign-in/web/devconsole-project)
Google+ API for allowing users to register/login with google.
#### 3. [sendgrid](https://sendgrid.com)
Sendgrid email API for sending emails.
- Register for a trial account or deploy the app and get the username/password from the heroku config vars
- Go to [Settings > API Keys](https://app.sendgrid.com/settings/api_keys) and create a key
- Paste the key in `secrets.js` or the `SENDGRID_API_KEY` config var of your deployed app.
