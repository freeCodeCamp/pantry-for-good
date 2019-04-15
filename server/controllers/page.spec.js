const sinon = require('sinon')
const sandbox = sinon.createSandbox()
import pageCtrl from './page'
import Page from '../models/page'
import {pageTypes} from '../../common/constants'

describe('Page controller', function() {
  describe('list', function() {
    let res = {}

    beforeEach(function() {
      res = {
        json: sandbox.spy()
      }
    })

    afterEach(function() {
      res = {}
      sandbox.restore()
    })

    it('should query Page collection with type filter if request contains page type', async function() {
      const req = {
        query: {
          type: pageTypes.PAGE
        }
      }
      const pageFindStub = sandbox.stub(Page, 'find')

      await pageCtrl.list(req, res)

      expect(pageFindStub.calledOnce).to.be.true
      expect(pageFindStub.calledWith(sinon.match.has('type')))
    })

    it('should query all documents in Page collection if request query does not contain page type', async function() {
      const req = {
        query: {}
      }
      const pageFindStub = sandbox.stub(Page, 'find')

      await pageCtrl.list(req, res)

      expect(pageFindStub.calledOnce).to.be.true
      expect(pageFindStub.calledWith(sinon.match({})))
    })
 
    it('should return requested pages', async function() {
      const req = {
        query: {
          type: pageTypes.PAGE
        }
      }
      const dummyPages = [{ title: 'home' }]
      sandbox.stub(Page, 'find').returns(dummyPages)

      await pageCtrl.list(req, res)

      expect(res.json.calledWith(sinon.match(dummyPages)))
    })
  })

  describe('update', function() {
    let res = {}

    beforeEach(function() {
      res = {
        json: sandbox.spy()
      }
    })

    afterEach(function() {
      res = {}
      sandbox.restore()
    })

    it('should update requested page and return updateed page', async function() {
      const req = {
        page: {
          identifier: 'home',
          title: 'home',
          type: pageTypes.PAGE,
          disabled: false
        },
        body: {
          body: 'testing',
          identifier: 'home'
        }
      }
      pageCtrl.__Rewire__('sanitizeHtmlConfig', () => req.body.body)
      const dummyUpdatedPage = {
        identifier: 'home',
        title: 'home',
        type: pageTypes.PAGE,
        disabled: false,
        body: 'testing'
      }
      const pageSaveStub = sandbox.stub(Page.prototype, 'save').returns(dummyUpdatedPage)
      pageCtrl.__Rewire__('del', () => {})

      await pageCtrl.update(req, res)

      expect(pageSaveStub.calledOnce).to.be.true
      expect(res.json.calledWith(sinon.match({ title: dummyUpdatedPage.title }))).to.be.true

      pageCtrl.__ResetDependency__('sanitizeHtmlConfig')
      pageCtrl.__ResetDependency__('')
    })
  })

  describe('read', function() {
    afterEach(function() {
      sandbox.restore()
    })

    it('should return requested page', async function() {
      const req = {
        page: {
          title: 'home'
        }
      }
      const res = {
        json: sandbox.spy()
      }
      
      await pageCtrl.read(req, res)

      expect(res.json.calledWith(sinon.match({ title: req.page.title })))
    })
  })
})