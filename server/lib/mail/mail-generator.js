import juice from 'juice'
import {readFileSync} from 'fs'
import {resolve} from 'path'
import striptags from 'striptags'
import transformHtml, {h, getAttr, hasClass} from './html-transform'
import {trim} from 'lodash'

import Page from '../../models/page'
import placeholders from '../../../common/placeholders'

const templatePath = resolve(__dirname, 'email-template.html')
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

  const body = transformBody(page.body, bindings)
  const subject = transformSubject(page.subject, bindings)
  const text = transformText(body)
  const html = template.replace(/\{content\}/, body)
    .replace(/\{subject\}/g, subject)
// console.log('html', html)
// console.log('juice(html)', juice(html))


  return {
    html: juice(html),
    text,
    subject
  }
}

function transformText(body) {
  const replaceTags = {
    td: '\n\n',
    img: replaceWithAltText,
    '*': stringifyLinks
  }

  return trim(striptags(transformHtml(body, {replaceTags})))
}

function transformBody(body, bindings) {
  const replaceTags = {
    span: node => isPlaceholder(node) ? bindPlaceholder(node, bindings) : node,
    p: replaceWithTrTd,
    blockquote: nestInTrTd,
    h1: nestInTrTd,
    h2: nestInTrTd,
    h3: nestInTrTd
  }

  return transformHtml(body, {replaceTags})
}

function transformSubject(subject, bindings) {
  const replaceTags = {
    span: node => isPlaceholder(node) ? bindPlaceholder(node, bindings) : node
  }

  return striptags(transformHtml(subject, {replaceTags}))
}

function bindPlaceholder(node, bindings) {
  const id = getAttr(node, 'data-id')
  const placeholder = placeholders.find(pl => pl.id === id)

  if (!placeholder) throw new Error('Invalid placeholder', id)
  if (!bindings[id]) throw new Error('Missing binding for placeholder', id)

  return typeof placeholder.format === 'function' ?
    h(placeholder.format(bindings[id])) :
    h('#text', bindings[id])
}

function isPlaceholder(node) {
  return node.nodeName === 'span' && hasClass(node, 'ql-placeholder-content')
}

function stringifyLinks(acc, node) {
  if (node.tagName !== 'a') return acc.concat(node)
  return acc.concat([
    ...node.childNodes,
    h('#text', `\n[${getAttr(node, 'href')}]\n`),
  ])
}

function replaceWithAltText(node) {
  const text = getAttr(node, 'alt')
  return h('#text', text ? `\n[${text}]\n` : '')
}

function replaceWithTrTd(node) {
  return h('tr', [], [
    h('td', node.attrs, node.childNodes)
  ])
}

function nestInTrTd(node) {
  return h('tr', [], [
    h('td', [], [
      h(node)
    ])
  ])
}
