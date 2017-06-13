export default {
  db: process.env.MONGODB_URI || 'mongodb://localhost:27017/fb-test',
  port: 3001,
  sessionSecret: 'foodbank-app'
}

