import sanitizeHtml from 'sanitize-html'

export default {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'span', 'h1', 'h2', 's', 'u']),
  allowedAttributes: {
    img: ['src', 'width', 'style'],
    span: ['style', 'data-id', 'data-label'],
    a: ['href'],
    p: ['class']
  },
  allowedClasses: {
    span: ['ql-placeholder-content']
  }
}
