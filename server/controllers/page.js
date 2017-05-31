import sanitizeHtml from 'sanitize-html'
import {extend} from 'lodash'
import {writeFileSync, mkdirSync} from 'fs'
import del from 'del'

import Page from '../models/page'

const allowedTags = sanitizeHtml.defaults.allowedTags.concat(['img', 'span'])
const allowedAttributes = {
  img: ['src', 'width', 'style'],
  span: ['style'],
  a: ['href']
}
const allowedClasses = {
  p: ['ql-align-center', 'ql-align-right', 'ql-align-justify']
}

const clientPath = '/media/pages'
const serverPath = process.env.NODE_ENV === 'production' ?
      'dist/client/media/pages' :
      'assets/media/pages'

try {
  mkdirSync(serverPath)
} catch (err) {
  if (err.code !== 'EEXIST') throw err
}

export default {
  async list(req, res) {
    const pages = await Page.find()
    res.json(pages)
  },

  async update(req, res) {
    const {body, identifier} = req.body
    let keepImages = []

    const sanitizedBody = sanitizeHtml(body, {
      allowedTags,
      allowedAttributes,
      allowedClasses,
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
    if (!page) return res.status(404).json({
      message: 'Not found'
    })

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
