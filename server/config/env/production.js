if (!process.env.SECRET) throw new Error('environment variable SECRET must be set')

module.exports = {
  db: process.env.MONGODB_URI || 'mongodb://localhost:27017/fb-prod',
  sessionSecret: process.env.SECRET,
}
