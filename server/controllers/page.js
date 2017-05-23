import sanitizeHtml from 'sanitize-html'
import {extend} from 'lodash'
import {writeFileSync} from 'fs'
import {last} from 'lodash'

import Page from '../models/page'

const allowedTags = sanitizeHtml.defaults.allowedTags.concat(['img'])

export default {
  async list(req, res) {
    const pages = await Page.find()
    res.json(pages)
  },

  async update(req, res) {
    const {body} = req.body
    const sanitizedBody = sanitizeHtml(body, {
      allowedTags,
      allowedAttributes: {
        img: ['src'],
        a: ['href']
      },
      transformTags: {
        img: function(tagName, attribs, x) {
          console.log('tagName, attribs, x', tagName, attribs, x)
          const filename = new Date().getTime()
          const parts = attribs.src.split(';')
          const ext = last(parts[0].split('/'))
          const data = last(parts).replace('base64,', '')
          writeFileSync(`assets/media/${filename}.${ext}`, data, 'base64')

          return {
            tagName,
            attribs: {
              src: `/media/${filename}.${ext}`
            }
          }
        }
      },
      allowedSchemes: ['data', 'http', 'https'],
      parser: {
        lowerCaseTags: false
      }
    })

    const page = extend(req.page, {body: sanitizedBody})

    const updatedPage = await page.save()

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
