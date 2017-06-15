export default {
  protocol: process.env.PROTOCOL || 'http',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  templateEngine: 'nunjucks',
  sessionCollection: 'sessions',
  oauth: {
    googleCallbackURL: '/api/auth/google/callback'
  },
  sendpulse: {
    name: 'FoodBank App', // TODO: get this from settings
    email: process.env.SENDPULSE_EMAIL || 'a2388865@mvrht.net',
    TOKEN_STORAGE: '/tmp/'
  }
}
