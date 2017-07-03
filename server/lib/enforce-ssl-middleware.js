export default function(req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    if (req.method === 'GET') {
      return res.redirect(301, `https://${req.hostname}${req.url}`)
    } else {
      return res.status(400).end()
    }
  }
  next()
}
