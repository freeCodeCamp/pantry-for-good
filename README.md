# This branch is outdated
Please switch to the staging branch for the latest version
---
[![Build Status](https://travis-ci.org/freeCodeCamp/pantry-for-good.svg?branch=staging)](https://travis-ci.org/freeCodeCamp/pantry-for-good)
[![Join the chat at https://gitter.im/FreeCodeCamp/pantry-for-good](https://badges.gitter.im/FreeCodeCamp/pantry-for-good.svg)](https://gitter.im/FreeCodeCamp/pantry-for-good?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/freeCodeCamp/Pantry-for-Good/tree/staging)

This repository is for the Pantry-for-Good application designed by Open Source for Good Contributors at [freeCodeCamp](http://www.freecodecamp.com). If you'd like to contribute, the [contributing guide](CONTRIBUTING.md) explains the git workflow and the [developers guide](https://github.com/freeCodeCamp/pantry-for-good/wiki/developer's-guide) gives an overview of how the app works.

The [open issues](https://github.com/freeCodeCamp/pantry-for-good/issues) are a good place to start, or you can try the app and add your own issues. If you get stuck or need help with something, feel free to leave a comment.

Some issues are quite large, don't feel like you have to finish them, it's ok. Little bits help too!

There's a demo app hosted at https://pantry-for-good.herokuapp.com, though it might be a bit behind the current version.

## Installation

The app is designed to be installed locally (mac, linux or windows) or on [Heroku](https://www.heroku.com).

You can deploy it to Heroku by clicking the deploy button above. An admin account with `admin@example.com` as email and `password` as password will be created.

------------
### Local installation summary:
1. Install [Node.js](http://nodejs.org) and [MongoDB](https://docs.mongodb.com/manual/installation/#mongodb-community-edition)
2. Start MongoDB
3. `git clone https://github.com/freeCodeCamp/Pantry-for-Good.git`
4. `cd Pantry-for-Good`
5. Make sure you're on the 'staging' branch (`git branch`), otherwise run `git checkout staging`
6. `npm install`
7. `npm run dev`
8. Open <http://localhost:8080> in your web browser
9. Login with username `admin@example.com` password `password`

------------
### Detailed local development installation steps

You'll need to have a **Node.js** version >= 6 installed. Either use your OS's package manager or follow the installation instructions on the [official website](http://nodejs.org).

This app uses **MongoDB** as its database engine. Follow [these instructions](https://docs.mongodb.com/manual/installation/#mongodb-community-edition) to install it locally and start the MongoDB server on your machine.

Install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) if it is not already installed. To clone this repository to your local machine, open a command line interface and navigate to the directory where you would like to install the app. Then run
`git clone https://github.com/freeCodeCamp/Pantry-for-Good.git`

Move to the `Pantry-for-Good` directory and run the `npm install` command to install the application dependencies.

Type `npm run dev` to start the application in development mode. If all goes well, it will be available at `http://localhost:8080`.  The application is pre-populated with an administrator account with `admin@example.com` as username  and `password` as password.


------------
### Installing API keys

To use all the features of this application you will need to obtain API keys and install them in the application. After following the instructions below to obtain API Keys, put your keys in the file `server/config/env/secrets.js`.

#### 1. [gmapsApiKey](https://developers.google.com/maps/documentation/javascript/get-api-key)
Google Maps API key for the deliveries feature
#### 2. [oauth](https://developers.google.com/identity/sign-in/web/devconsole-project)
Google+ API for allowing users to register/login with google.
#### 3. [sendgrid](https://sendgrid.com)
Sendgrid email API for sending emails.
- Register for a trial account or deploy the app and get the username/password from the heroku config vars
- Go to [Settings > API Keys](https://app.sendgrid.com/settings/api_keys) and create a key
- Paste the key in `secrets.js` or the `SENDGRID_API_KEY` config var of your deployed app.
