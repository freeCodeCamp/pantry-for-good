import transformHtml, {h, getAttr, hasClass} from './html-transform'

describe('Html transform', function() {
  it('does nothing', function() {
    const html = '<p>Something</p>'

    const res = transformHtml(html)
    expect(res).to.equal(html)
  })

  it('omits tags and their contents', function() {
    const input = '<div><h1>Title</h1><p>Text</p></div>'
    const output = '<div><p>Text</p></div>'

    const res = transformHtml(input, {omitTags: ['h1']})
    expect(res).to.equal(output)
  })

  it('replaces tags with a string', function() {
    const input = '<div><p>A paragraph<span>Nested span</span></p></div>'
    const output = '<div>\nA paragraph<span>Nested span</span></div>'
    const replaceTags = {p: '\n'}

    const res = transformHtml(input, {replaceTags})
    expect(res).to.equal(output)
  })

  it('replaces tags with an array', function() {
    const input = '<div><p>A paragraph<span>Nested span</span></p></div>'
    const output = '<div>\nA paragraph<span>Nested span</span>\n</div>'
    const replaceTags = {p: ['\n', '\n']}

    const res = transformHtml(input, {replaceTags})
    expect(res).to.equal(output)
  })

  it('replaces tags with a function', function() {
    const input = '<div><p>A paragraph<span>Nested span</span></p></div>'
    const output = '<div><div>A paragraph<span>Nested span</span></div></div>'
    const replaceTags = {
      p: node => h('div', [], node.childNodes)
    }

    const res = transformHtml(input, {replaceTags})
    expect(res).to.equal(output)
  })

  it('runs a custom reducer on all tags', function() {
    const input = '<div><a href="foo.com"><b>Link</b></a></div>'
    const output = '<div>[foo.com] <b>Link</b></div>'
    const replaceTags = {'*': stringifyLinks}

    const res = transformHtml(input, {replaceTags})
    expect(res).to.equal(output)
  })

  it('handles complex cases', function() {
    const input = '<div><p class="text-center text">Some text with a <a href="foo.com">Link</a></p></div>'
    const output = '<div><tr><td align="center">Some text with a [foo.com] Link</td></tr></div>'

    function replaceParagraph(node) {
      const tdAttrs = hasClass(node, 'text-center') ?
        [{name: 'align', value: 'center'}] : []

      return h('tr', [], [
        h('td', tdAttrs, node.childNodes)
      ])
    }

    const replaceTags = {
      p: replaceParagraph,
      '*': stringifyLinks
    }

    const res = transformHtml(input, {replaceTags})
    expect(res).to.equal(output)
  })
})

function stringifyLinks(acc, node) {
  if (node.tagName !== 'a') return acc.concat(node)
  return acc.concat([
    h('#text', `[${getAttr(node, 'href')}] `),
    ...node.childNodes
  ])
}
