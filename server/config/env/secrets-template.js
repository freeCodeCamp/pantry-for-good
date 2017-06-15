export default {
  oauth: {
    googleClientID: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  // Account info for using the sendpulse.com email service
  sendpulse: {
    API_USER_ID: process.env.SENDPULSE_USER_ID || '',
    API_SECRET: process.env.SENDPULSE_API_SECRET || ''
  }
}
