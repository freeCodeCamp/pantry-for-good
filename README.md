This repository is for the Food Bank application designed by Open Source for Good Contributors at Free Code Camp

You can test it out by deploying to [Heroku](https://www.heroku.com):

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

The button creates an admin account with username "admin" and password "password".

To use Google Maps with the driver and route assignment, add a Config Setting of `GOOGLE_MAPS_API_KEY` with your API key.

New deployments are provisioned with a Sendgrid addon to facilitate sending email notifications. To enable email, click on the "Resources" tab in the Heroku web page for your app. Then click on "Sendgrid" under addons and your Sendgrid account page will open. Select "API Keys" from the "Settings" dropdown menu and click "Create API key". Add a Config Setting in Heroku of `SENDGRID_API_KEY` with the API key you create. You will also need to add a `MAILER_FROM` setting with the email account you wish to send the reminders from.
