import {values} from 'lodash'

import * as reducer from './reducer'
import {pageTypes, pageIdentifiers} from '../../../common/constants'
import {page as pageSchema, arrayOfPages} from '../../../common/schemas'
import {CALL_API} from '../../store/middleware/api'

describe('page reducer', function() {
  describe('action creators', function() {
    it('loads all pages', function() {
      const action = reducer.loadPages('foo')

      expect(action).to.have.property(CALL_API)
      const {endpoint, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('admin/pages?type=foo')
      expect(schema).to.equal(arrayOfPages)
      expect(types.length).to.equal(3)
    })

    it('loads a page', function() {
      const action = reducer.loadPage('foo')

      expect(action).to.have.property(CALL_API)
      const {endpoint, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('pages/foo')
      expect(schema).to.equal(pageSchema)
      expect(types.length).to.equal(3)
    })

    it('saves a page', function() {
      const action = reducer.savePage({identifier: 'foo'})

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, body, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('admin/pages/foo')
      expect(method).to.equal('PUT')
      expect(body).to.eql({identifier: 'foo'})
      expect(schema).to.equal(pageSchema)
      expect(types.length).to.equal(3)
    })
  })

  describe('selectors', function() {
    let state, selectors
    before(function() {
      state = {
        page: {ids: [1, 2, 3, 4]},
        entities: {
          pages: {
            1: {_id: 1, identifier: pageIdentifiers.HOME, type: pageTypes.PAGE},
            2: {_id: 2, identifier: pageIdentifiers.CUSTOMER, type: pageTypes.PAGE},
            3: {_id: 3, identifier: pageIdentifiers.CUSTOMER_ACCEPTED, type: pageTypes.EMAIL},
            4: {_id: 4, identifier: pageIdentifiers.CUSTOMER_REJECTED, type: pageTypes.EMAIL}
          }
        }
      }

      selectors = reducer.createSelectors('page')
    })

    it('getAll pages', function() {
      const selected = selectors.getAll(state)(pageTypes.PAGE)
      const pages = values(state.entities.pages).filter(p => p.type === pageTypes.PAGE)
      expect(selected).to.eql(pages)
    })

    it('getAll emails', function() {
      const selected = selectors.getAll(state)(pageTypes.EMAIL)
      const emails = values(state.entities.pages).filter(p => p.type === pageTypes.EMAIL)
      expect(selected).to.eql(emails)
    })

    it('getOne page', function() {
      const selected = selectors.getOne(state)(pageIdentifiers.HOME)
      expect(selected).to.eql(state.entities.pages[1])
    })
  })
})
