export default {
  gmapsApiKey: process.env.GMAPS_API_KEY || '',
  oauth: {
    googleClientID: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  sendgrid: {
    API_KEY: process.env.SENDGRID_API_KEY || ''
  }
}
