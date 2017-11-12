import sanitizeHtml from 'sanitize-html'
import {extend} from 'lodash'
import {writeFileSync, mkdirSync} from 'fs'
import del from 'del'

import {NotFoundError} from '../lib/errors'
import Page from '../models/page'

const clientPath = '/media/pages'
const serverPath = process.env.NODE_ENV === 'production' ?
  'dist/client/media/pages' :
  'assets/media/pages'

try {
  mkdirSync(serverPath)
} catch (err) {
  if (err.code !== 'EEXIST') throw err
}

const sanitizeHtmlConfig = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'span', 'h1', 'h2', 's', 'u']),
  allowedAttributes: {
    img: ['src', 'width', 'style'],
    span: ['style', 'data-id', 'data-label', 'class'],
    a: ['href'],
    p: ['class']
  }
}

export default {
  async list(req, res) {
    const {type} = req.query
    const pages = await Page.find(type ? {type} : {})
    res.json(pages)
  },

  async update(req, res) {
    const {body, identifier} = req.body
    let keepImages = []

    const sanitizedBody = sanitizeHtml(body, {
      ...sanitizeHtmlConfig,
      transformTags: {
        img: processImageTag(identifier, keepImages)
      }
    })

    const page = extend(req.page, {body: sanitizedBody})
    const updatedPage = await page.save()

    // delete stale images
    await del([
      `${serverPath}/${identifier}-*`,
      ...keepImages.map(img => `!${img}`)
    ])

    res.json(updatedPage)
  },

  async read(req, res) {
    res.json(req.page)
  },

  async pageByIdentifier(req, res, next, identifier) {
    const page = await Page.findOne({identifier})
    if (!page) throw new NotFoundError

    req.page = page
    next()
  }
}

/**
 * create a sanitizeHtml transform function to save image data and update 'src'
 * attribute to the path of the saved image
 *
 * @param {string} identifier page identifier
 * @param {array} keepImages
 * @returns {object}
 */
function processImageTag(identifier, keepImages) {
  return (tagName, attribs) => {
    const src = attribs.src.startsWith(clientPath) ?
      attribs.src :
      saveImage(identifier, attribs.src)

    keepImages.push(src.replace(clientPath, serverPath))

    return {
      tagName,
      attribs: {...attribs, src}
    }
  }
}

/**
 * save a base64 image for a given page identifier
 *
 * @param {string} identifier
 * @param {string} src
 * @returns {string} updated src attribute
 */
function saveImage(identifier, src) {
  // eslint-disable-next-line no-unused-vars
  const [_, ext, data] = src.match(/^data:image\/(.+);base64(.+)/)
  const filename = `${identifier}-${new Date().getTime()}.${ext}`

  writeFileSync(`${serverPath}/${filename}`, data, 'base64')

  return `${clientPath}/${filename}`
}
