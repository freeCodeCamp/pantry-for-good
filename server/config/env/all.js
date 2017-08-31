const production = process.env.NODE_ENV === 'production'

const protocol = production ? 'https' : 'http'
const host = process.env.HOST_NAME || 'localhost'
const port = process.env.PORT || 3000

const url = `${protocol}://${host}` + production ? '' : `:${port}`

export default {
  protocol: process.env.PROTOCOL || protocol,
  host,
  port,
  sessionCollection: 'sessions',
  sessionIdleTimeout: 3600000,
  mailFrom: `no-reply@${host}`,
  oauth: {
    googleCallbackURL: `${url}/api/auth/google/callback`
  }
}
