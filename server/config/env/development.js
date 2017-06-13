let secrets

try {
  secrets = require('./secrets').default
} catch (err) {
  console.warn('No secrets file found - copy server/config/env/secrets-template.js to server/config/env/secrets.js to add keys for development')
}

export default {
  db: process.env.MONGODB_URI || 'mongodb://localhost/fb-dev',
  // to seed settings collection for dev
  sessionSecret: 'foodbank-app',
  ...secrets
}
