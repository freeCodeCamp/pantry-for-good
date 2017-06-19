import sanitizeHtml from 'sanitize-html'

export default {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'span']),
  allowedAttributes: {
    img: ['src', 'width', 'style'],
    span: ['style', 'data-id', 'data-label'],
    a: ['href']
  },
  allowedClasses: {
    p: ['ql-align-center', 'ql-align-right', 'ql-align-justify'],
    span: ['ql-placeholder-content']
  }
}
