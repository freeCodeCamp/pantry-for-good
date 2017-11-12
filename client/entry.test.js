import {JSDOM} from 'jsdom'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

const {window} = new JSDOM('')
global.window = window
global.document = window.document

Object.keys(document.defaultView).forEach(property => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property]
  }
})

global.navigator = {
  userAgent: 'node.js'
}

global.expect = chai.expect
global.sinon = sinon

chai.use(sinonChai)
chai.use(require('chai-enzyme')())
