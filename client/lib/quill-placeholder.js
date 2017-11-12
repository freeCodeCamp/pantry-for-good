import {Quill} from 'react-quill'

const Embed = Quill.import('blots/embed')
const Parchment = Quill.import('parchment')

class PlaceholderBlot extends Embed {
  static create(value) {
    let node = super.create(value)

    if (value.required) node.setAttribute('data-required', true)
    node.setAttribute('data-id', value.id)
    node.setAttribute('data-label', value.label)
    node.setAttribute('spellcheck', false)

    node.innerHTML = `<span contenteditable="false">&lt;${value.label}&gt;</span>`

    return node
  }

  static value(domNode) {
    return domNode.dataset
  }

  length() {
    return 1
  }

  deleteAt(index, length) {
    if (this.domNode.dataset.required) return false
    return super.deleteAt(index, length)
  }
}

PlaceholderBlot.blotName = 'placeholder'
PlaceholderBlot.tagName = 'span'
PlaceholderBlot.className = 'ql-placeholder-content'

Quill.register(PlaceholderBlot)

class Placeholder {
  constructor(quill, options) {
    this.quill = quill
    this.placeholders = options.placeholders
    this.quill.getModule('toolbar').addHandler('placeholder', this.toolbarHandler)
    this.quill.root.addEventListener('click', this.onClick)
    this.quill.on(Quill.events.TEXT_CHANGE, this.onTextChange)
  }

  onTextChange = (_, oldDelta, source) => {
    if (source === Quill.sources.USER) {
      const currrentContents = this.quill.getContents()
      const delta = currrentContents.diff(oldDelta)

      const shouldRevert = delta.ops.filter(op => op.insert &&
        op.insert.placeholder && op.insert.placeholder.required).length

      if (shouldRevert) {
        this.quill.updateContents(delta, Quill.sources.SILENT)
      }
    }
  }

  onClick = ev => {
    const blot = Parchment.find(ev.target.parentNode)

    if (blot instanceof PlaceholderBlot) {
      const index = this.quill.getIndex(blot)
      this.quill.setSelection(index, blot.length(), Quill.sources.USER)
    }
  }

  toolbarHandler = identifier => {
    const selection = this.quill.getSelection()
    const placeholder = this.placeholders.find(pl => pl.id === identifier)
    if (!placeholder) throw new Error(`no placeholder found for ${identifier}`)

    this.quill.deleteText(selection.index, selection.length)
    this.quill.insertEmbed(selection.index, 'placeholder', placeholder, Quill.sources.USER)
    this.quill.setSelection(selection.index + 1, 0)
  }
}

export default Placeholder
