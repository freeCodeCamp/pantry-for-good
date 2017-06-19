// import juice from 'juice'
import {readFileSync} from 'fs'
import {resolve} from 'path'
import {parseFragment, serialize} from 'parse5'
import striptags from 'striptags'

import Page from '../models/page'
import placeholders from '../../common/placeholders'

const templatePath = resolve(__dirname, '..', 'views', 'templates', 'email-template.html')
const template = readFileSync(templatePath).toString()

/**
 * bind placeholders, insert mail into template and inline styles
 *
 * @export
 * @param {string} identifier
 * @param {object} bindings
 * @returns
 */
export default async function generate(identifier, bindings) {
  const page = await Page.findOne({identifier}).lean()
  if (!page || page.disabled) return

  const boundBody = bindPlaceholders(parseFragment(page.body), bindings)
  const boundSubject = bindPlaceholders(parseFragment(page.subject), bindings)

  const body = template.replace(/\{content\}/, serialize(boundBody))
  const subject = striptags(serialize(boundSubject))

  return {
    body,//: juice(body),
    subject
  }
}

function bindPlaceholders(node, bindings) {
  if (!node.childNodes) return node

  return {
    ...node,
    childNodes: node.childNodes.map(child => {
      if (isPlaceholder(child)) {
        const id = getAttr(child, 'data-id')
        const placeholder = placeholders.find(pl => pl.id === id)

        return typeof placeholder.format === 'function' ?
          parseFragment(placeholder.format(bindings[id])).childNodes[0] :
          textNode(bindings[id])
      }

      return bindPlaceholders(child, bindings)
    })
  }
}

function isPlaceholder(node) {
  return node.nodeName === 'span' && hasClass(node, 'ql-placeholder-content')
}

function hasClass(node, name) {
  const classes = getAttr(node, 'class')
  return classes && classes.split(' ').find(c => c === name)
}

function getAttr(node, name) {
  const attr = node.attrs.find(attr => attr.name === name)
  return attr && attr.value
}

function textNode(value) {
  return {
    nodeName: '#text',
    value
  }
}
