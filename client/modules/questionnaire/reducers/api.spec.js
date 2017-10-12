import {values} from 'lodash'

import {fieldTypes, widgetTypes} from '../../../../common/constants'
import {questionnaire as questionnaireSchema, arrayOfQuestionnaires} from '../../../../common/schemas'
import {CALL_API} from '../../../store/middleware/api'
import * as reducer from './api'

describe('questionnaire api reducer', function() {
  describe('action creators', function() {
    it('loads all questionnaires', function() {
      const action = reducer.loadQuestionnaires()

      expect(action).to.have.property(CALL_API)
      const {endpoint, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('questionnaires')
      expect(schema).to.equal(arrayOfQuestionnaires)
      expect(types.length).to.equal(3)
    })

    it('loads one questionnaire', function() {
      const action = reducer.loadQuestionnaire(1)

      expect(action).to.have.property(CALL_API)
      const {endpoint, schema, types} = action[CALL_API]

      expect(endpoint).to.equal('questionnaires/1')
      expect(schema).to.equal(questionnaireSchema)
      expect(types.length).to.equal(3)
    })

    it('saves a questionnaire', function() {
      const questionnaire = {_id: 1, foo: 'foo'}
      const action = reducer.saveQuestionnaire(questionnaire)

      expect(action).to.have.property(CALL_API)
      const {endpoint, method, body, responseSchema, types} = action[CALL_API]

      expect(endpoint).to.equal('questionnaires/1')
      expect(method).to.equal('PUT')
      expect(body).to.equal(questionnaire)
      expect(responseSchema).to.equal(questionnaireSchema)
      expect(types.length).to.equal(3)
    })
  })

  describe('selectors', function() {
    let selectors, state

    before(function() {
      selectors = reducer.createSelectors('questionnaires')
      state = {
        entities: {
          questionnaires: {
            1: {_id: 1, identifier: 1},
            2: {_id: 2, identifier: 2},
            3: {_id: 3, identifier: 3}
          }
        },
        questionnaires: {ids: [1, 2, 3]}
      }
    })

    it('getAll', function() {
      const questionnaires = selectors.getAll(state)
      expect(questionnaires).to.eql(values(state.entities.questionnaires))
    })

    it('getOne', function() {
      const questionnaire = selectors.getOne(state)(2)
      expect(questionnaire).to.eql(state.entities.questionnaires[2])
    })

    it('getLinkableFields', function() {
      const state = {
        entities: {
          questionnaires: {
            1: {_id: 1, identifier: 1, sections: [1]},
            2: {_id: 2, identifier: 2, sections: [2]},
            3: {_id: 3, identifier: 3}
          },
          sections: {
            1: {_id: 1, fields: [1]},
            2: {_id: 2, fields: [1, 2, 3]},
          },
          fields: {
            1: {_id: 1, type: fieldTypes.TEXT},
            2: {_id: 2, type: widgetTypes.HOUSEHOLD},
            3: {_id: 3, type: fieldTypes.DATE},
          }
        },
        questionnaires: {ids: [1, 2, 3]},
        sections: {ids: [1, 2]},
        fields: {ids: [1, 2, 3]}
      }

      const questionnaires = selectors.getLinkableFields(state)(1)
      expect(questionnaires.length).to.equal(1)
      expect(questionnaires[0].fields).to.eql([{_id: 3, type: fieldTypes.DATE}])
    })
  })
})
