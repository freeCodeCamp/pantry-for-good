This repository is for the Food Bank application designed by Open Source for Good Contributors at [Free Code Camp](http://www.freecodecamp.com).

------------
### Quick Start Steps:
1. Install [Node.js](http://nodejs.org) and [MongoDB](https://docs.mongodb.com/manual/installation/#mongodb-community-edition)
2. Start MongoDB
3. `git clone git@github.com:jspaine/food-bank-app.git`
4. `cd food-bank-app`
5. `npm install`
6. `npm run dev`
7. Open <http://localhost:8080> in your web browser
8. Login with username `admin` password `password`

------------
### Detailed local development installation steps

You'll need to have the latest verison of **Node.js** installed. Either use your OS's package manager or follow the installation instructions on the [official website](http://nodejs.org).

This app uses **MongoDB** as its database engine. Follow [these instructions](https://docs.mongodb.com/manual/installation/#mongodb-community-edition) to install it locally and start the MongoDB server on your machine.

Install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) if it is not already installed. To clone this repository to your local machine, open a command line interface and navigate to the directory where you would like to the food-bank app directory to be in. Then run
`git clone https://github.com/FreeCodeCamp/food-bank-app.git`

Move to the `food-bank-app` directory and run the `npm install` command to install the application dependencies.

Type `npm run dev` to start the application in development mode. If all goes well, it will be available at `http://localhost:8080`.  The application is pre-populated with an administrator account with username `admin` and password `password`.


------------
### Installing API keys

To use all the features of this application you will need to obtain API keys and install them in the application. Make a copy of the `server/config/env/secrets-template.js` file in the same directory and rename it `secrets.js`.  After following the instructions below to obtain API Keys, put your keys in this file.

#### 1. [gmapsApiKey](https://developers.google.com/maps/documentation/javascript/get-api-key) 
Google Maps API key required for the deliveries feature
#### 2. [oauth](https://developers.google.com/identity/sign-in/web/devconsole-project)
Google API that will allow the application to work with google accounts.  
When you create your Client ID for Web Application, add `http://localhost:8080/api/auth/google/callback` to the **Authorized Redirect URIs** section
#### 3. [sendpulse](https://sendpulse.com/register)
Sendpulse email service API.  Required for the password reset by email to work.
- [Register](https://sendpulse.com/register) for an account
- Go to [Settings](https://login.sendpulse.com/settings/)
- Click the **API** tab
- Click **Activate REST API**
- Click **Save**


------------
### Contributing

We welcome pull requests from seasoned Javascript developers. Please read our [guide](CONTRIBUTING.md) first, then check out our open issues.
