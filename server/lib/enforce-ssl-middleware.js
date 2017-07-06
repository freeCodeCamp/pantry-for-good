import {BadRequestError} from './errors'

export default function(req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    if (req.method === 'GET') {
      return res.redirect(301, `https://${req.hostname}${req.url}`)
    } else {
      throw new BadRequestError
    }
  }
  next()
}
