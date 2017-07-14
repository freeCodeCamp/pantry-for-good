import * as qEditor from './index'
import {actions as apiActions} from '../api'

describe('questionnaire editor reducer', function() {
  describe('action creators', function() {
    it('init normalizes a questionnaire', function() {
      const questionnaire = {_id: 1, sections: [{_id: 1, fields: [{_id: 1, type: 'foo'}]}]}
      const action = qEditor.init(questionnaire)

      expect(action.fields).to.have.key('1')
      expect(action.fields[1]).to.have.property('type', 'foo')
      expect(action.sections).to.have.key('1')
      expect(action.sections[1].fields.length).to.equal(1)
      expect(action.questionnaires).to.have.key('1')
    })

    it('addSection', function() {
      const dispatch = sinon.spy()
      qEditor.addSection({_id: 1})(dispatch)

      expect(dispatch.firstCall).to.have.been.calledWithMatch({
        type: qEditor.actions.ADD_SECTION,
        section: {_id: 1}
      })

      expect(dispatch.secondCall).to.have.been.calledWithMatch({
        type: qEditor.actions.EDIT_SECTION,
        sectionId: 1
      })
    })

    it('addField', function() {
      const dispatch = sinon.spy()
      qEditor.addField({_id: 1}, 1)(dispatch)

      expect(dispatch.firstCall).to.have.been.calledWithMatch({
        type: qEditor.actions.ADD_FIELD,
        field: {_id: 1},
        sectionId: 1
      })

      expect(dispatch.secondCall).to.have.been.calledWithMatch({
        type: qEditor.actions.EDIT_FIELD,
        fieldId: 1
      })
    })

    it('moveFieldToSection', function() {
      const dispatch = sinon.spy()
      const addFieldMock = sinon.stub()

      qEditor.default.__Rewire__('addField', addFieldMock)
      qEditor.moveFieldToSection({_id: 1}, 1, 2)(dispatch)

      qEditor.default.__ResetDependency__('addField')

      expect(dispatch.firstCall).to.have.been.calledWithMatch({
        type: qEditor.actions.DELETE_FIELD,
        fieldId: 1,
        sectionId: 1
      })

      expect(addFieldMock).to.have.been.calledWith({_id: 1}, 2)

      expect(dispatch.thirdCall).to.have.been.calledWithMatch({
        type: qEditor.actions.SELECT_SECTION,
        sectionId: 2
      })
    })
  })

  describe('reducer', function() {
    it('initializes with a questionnaire', function() {
      const questionnaire = {_id: 1, sections: [{_id: 1, fields: [{_id: 1, type: 'foo'}]}]}
      const state = qEditor.default(null, qEditor.init(questionnaire))

      expect(state.questionnaires).to.have.keys([1])
      expect(state.sections.allIds).to.eql(['1'])
      expect(state.fields.allIds).to.eql(['1'])
      expect(state.selectedSection).to.eql('1')
      expect(state.dirty).to.be.false
    })

    it('sets section edit state', function() {
      const state = qEditor.default(null, {
        type: qEditor.actions.EDIT_SECTION,
        sectionId: 1
      })
      expect(state.editingSection).to.equal(1)
    })

    it('sets field edit state', function() {
      const state = qEditor.default(null, {
        type: qEditor.actions.EDIT_FIELD,
        fieldId: 1
      })
      expect(state.editingField).to.equal(1)
    })

    it('sets section selected state', function() {
      const state = qEditor.default(null, {
        type: qEditor.actions.SELECT_SECTION,
        sectionId: 1
      })
      expect(state.selectedSection).to.equal(1)
    })

    it('sets dirty state if fields or sections change', function() {
      const initialState = {
        fields: {allIds: []},
        sections: {
          byId: {1: {}},
          allIds: [1]
        }
      }

      const state = qEditor.default(initialState, {
        type: qEditor.actions.ADD_FIELD,
        field: {_id: 1},
        sectionId: 1
      })

      expect(state.dirty).to.be.true
    })

    it('clears dirty state on save', function() {
      const state = qEditor.default({dirty: true}, {
        type: apiActions.SAVE_SUCCESS
      })

      expect(state.dirty).to.be.false
    })
  })

  describe('selectors', function() {
    let state, selectors
    before(function() {
      state = {
        qEdit: {
          questionnaires: {1: {_id: 1, sections: [1, 2]}},
          sections: {
            byId: {
              1: {_id: 1, fields: [1, 2]},
              2: {_id: 2, fields: [3]}
            },
            allIds: [1, 2]
          },
          fields: {
            byId: {
              1: {_id: 1},
              2: {_id: 2},
              3: {_id: 3}
            },
            allIds: [1, 2, 3]
          },
          editingSection: 1
        }
      }

      selectors = qEditor.createSelectors('qEdit')
    })

    it('getSectionIds', function() {
      const sectionIds = selectors.getSectionIds(state)
      expect(sectionIds).to.eql([1, 2])
    })

    it('getSectionById', function() {
      const section = selectors.getSectionById(state)(2)
      expect(section).to.eql({_id: 2, fields: [3]})
    })

    it('getFieldIds', function() {
      const fieldIds = selectors.getFieldIds(state)(1)
      expect(fieldIds).to.eql([1, 2])
    })

    it('getFieldById', function() {
      const field = selectors.getFieldById(state)(3)
      expect(field).to.eql({_id: 3})
    })

    it('getEditingQuestionnaire', function() {
      const questionnaire = selectors.getEditingQuestionnaire(state)
      expect(questionnaire).to.eql({_id: 1, sections: [1, 2]})
    })

    it('getEditingSection', function() {
      const section = selectors.getEditingSection(state)
      expect(section).to.equal(1)
    })

    it('getCompleteQuestionnaire', function() {
      const questionnaire = selectors.getCompleteQuestionnaire(state)

      expect(questionnaire).to.have.property('_id', 1)
      expect(questionnaire.sections.length).to.equal(2)
      expect(questionnaire.sections[0].fields.length).to.equal(2)
    })
  })
})
