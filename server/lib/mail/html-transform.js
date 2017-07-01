import {parseFragment, parse, serialize} from 'parse5'
import {trim} from 'lodash'

/**
 * @export
 * @param {string} html
 * @param {Object} options
 * @returns string
 */
export default function transformHtml(html, {
  replaceTags = {},
  omitTags = [],
  fragment = true
} = {}) {
  const node = fragment ? parseFragment(html) : parse(html)
  const transformed = transform(node)

  return serialize(transformed)

  function transform(node) {
    if (!node.childNodes) return node

    return {
      ...node,
      childNodes: node.childNodes.reduce(reduceChildren, [])
    }
  }

  function reduceChildren(acc, node) {
    const shouldOmit = omitTags.find(tag => tag === node.nodeName)
    const empty = node.value && !trim(node.value)
    if (shouldOmit || empty) return acc
    return acc.concat(replace(node))
  }

  function replace(node) {
    const replacement = replaceTags[node.nodeName]
    const replaceAll = replaceTags['*']

    let childNodes = node.childNodes
    if (childNodes) {
      childNodes = replaceAll ? childNodes.reduce(replaceAll, []) : childNodes
      childNodes = childNodes.reduce(reduceChildren, [])
    }

    if (typeof replacement === 'string') {
      return [h('#text', replacement), ...childNodes]
    }

    if (Array.isArray(replacement)) {
      const leading = replacement[0]
      const trailing = replacement[1] || ''
      return [h('#text', leading), ...childNodes, h('#text', trailing)]
    }

    if (typeof replacement === 'function') {
      return replacement({...node, childNodes})
    }

    return {...node, childNodes}
  }
}

// utils

export function getAttr(node, name) {
  const attr = node.attrs.find(attr => attr.name === name)
  return attr && attr.value
}

export function hasClass(node, className) {
  const classes = getAttr(node, 'class')
  return classes && classes.split(' ').find(name => name === className)
}

/**
 * Node factory, usage:
 *
 * h(htmlString)
 *
 * h(node)
 *
 * h('#text', textString)
 *
 * h(tagName, attrs, children)
 *
 * @param {[string]|[object]|[string, string]|[string, [object], [object]]} args
 * @returns {object}
 */
export function h(...args) {
  if (args.length === 1) {
    const [node] = typeof args[0] === 'string' ?
      parseFragment(args[0]).childNodes :
      args

    return h(node.tagName, node.attrs, node.childNodes)
  }

  if (args.length === 2) {
    const [type, value] = args

    return {
      nodeName: type,
      value: value || ''
    }
  }

  const [type, attrs, childNodes] = args

  return {
    nodeName: type,
    tagName: type,
    attrs,
    childNodes
  }
}
