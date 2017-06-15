export default {
  db: process.env.MONGODB_URI || 'mongodb://localhost/fb-dev',
  sessionSecret: 'foodbank-app'
}
