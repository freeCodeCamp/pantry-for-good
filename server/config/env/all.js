module.exports = {
  protocol: process.env.PROTOCOL || 'http',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  templateEngine: 'nunjucks',
  sessionCollection: 'sessions',
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    to: process.env.MAILER_TO || 'MAILER_TO',
    sendgridKey: process.env.SENDGRID_API_KEY || 'SEND_GRID_API_KEY'
  }
}
