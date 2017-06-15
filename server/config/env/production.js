if (!process.env.SECRET) throw new Error('environment variable SECRET must be set')

export default {
  db: process.env.MONGODB_URI || 'mongodb://localhost:27017/fb-prod',
  sessionSecret: process.env.SECRET
}
