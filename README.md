This repository is for the Food Bank application designed by Open Source for Good Contributors at [freeCodeCamp](http://www.freecodecamp.com).

We have a [live demo](https://food-bank-app-demo.herokuapp.com). Login with username `admin` and password `password`.

You can also test it out by deploying to [Heroku](https://www.heroku.com):

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

The button creates an admin account with username `admin` and password `password`.

To use Google Maps with the driver and route assignment, add a Config Setting of `GOOGLE_MAPS_API_KEY` with your API key.

New deployments are provisioned with a Sendgrid addon to facilitate sending email notifications. To enable email, click on the "Resources" tab in the Heroku web page for your app. Then click on "Sendgrid" under addons and your Sendgrid account page will open. Select "API Keys" from the "Settings" dropdown menu and click "Create API key". Add a Config Setting in Heroku of `SENDGRID_API_KEY` with the API key you create. You will also need to add a `MAILER_FROM` setting with the email account you wish to send the reminders from.

Contributing
------------

We welcome pull requests from seasoned Javascript developers. Please read our [guide](CONTRIBUTING.md) first, then check out our open issues.

**Please Note: This app is currently undergoing an overhaul to use React in place of Angular. Any current contributions made to the front end will be overwritten with this change.** 

Local Installation
------------------

You'll need to have the latest verison of node.js installed. Either use your OS's package manager or follow the installation instructions on the [official website](http://nodejs.org).

Next, [install git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) if it is not already installed. To clone this repository to your local machine, open a command line interface and navigate to your projects directory. Then type

`$ git clone https://github.com/FreeCodeCamp/food-bank-app.git`

Move to the `food-bank-app` subdirectory and type `npm install`. This installs all of Foodbank Template's dependencies.

Foodbank Template uses the Grunt taskrunner to automate build processes. Install it globally with `npm install -g grunt-cli`

Now use a text editor to create a file named `.env`. Foodbank Template loads this file at startup to read your configuration settings. Add the following line

`NODE_ENV=development`

to indicate that you are running the app in development mode.

This app uses MongoDB as its database engine. Follow [the instructions](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-linux/) to install it locally. By default, it attaches to `mongodb://localhost:27017/fb-dev`. If you want to use a differently named database, or connect to a remote MongoDB instance, add the address to the `MONGODB_URI` variable in your `.env` file.

Once MongoDB is set up, you should create an admin account. Edit the admin-config.json file to create a custom user, then run

`$ grunt create-admin-user`

to add him to your database.

Finally, type `npm start` to start the application. If all goes well, it will be available at `http://localhost:3000`.
