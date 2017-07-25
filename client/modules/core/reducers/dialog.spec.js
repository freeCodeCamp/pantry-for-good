import * as reducer from './dialog'

describe('dialog reducer', function() {
  describe('action creators', function() {
    it('showNavDialog', function() {
      const action = reducer.showNavDialog('cancel', 'confirm')
      expect(action).to.be.an('object')
      expect(action.type).to.equal(reducer.SHOW_DIALOG)
      expect(action.dialog).to.be.an('object')
      expect(action.dialog.actions).to.be.an('array')
      expect(action.dialog.actions.length).to.equal(2)
    })

    it('showConfirmDialog', function() {
      const action = reducer.showConfirmDialog('cancel', 'confirm', 'msg', 'label')
      expect(action).to.be.an('object')
      expect(action.type).to.equal(reducer.SHOW_DIALOG)
      expect(action.dialog).to.be.an('object')
      expect(action.dialog.actions).to.be.an('array')
      expect(action.dialog.actions.length).to.equal(2)
    })
  })
})
