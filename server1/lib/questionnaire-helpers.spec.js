import {
  getFieldsByType,
  getValidator,
  default as qHelpers
} from './questionnaire-helpers'

describe('Questionnaire helpers', function() {
  const qFields = [
    {_id: 1, type: 'address'},
    {_id: 2, type: 'text'}
  ]

  const clientFields = [
    {meta: 2, value: 'Some text'},
    {meta: 1, value: 'An address'}
  ]

  describe('getFieldsByType', function() {
    afterEach(function() {
      qHelpers.__ResetDependency__('getQuestionnaireFields')
    })

    it('maps questionnaire fields to model fields', async function() {
      const getQuestionnaireFields = sinon.stub().returns(Promise.resolve(qFields))
      qHelpers.__Rewire__('getQuestionnaireFields', getQuestionnaireFields)

      const fields = await getFieldsByType('qClient', clientFields)

      expect(fields).to.eql([clientFields[1], clientFields[0]])
      expect(getQuestionnaireFields).to.have.been.calledWith('qClient')
    })

    it('returns fields by type', async function() {
      const getQuestionnaireFields = sinon.stub().returns(Promise.resolve([qFields[0]]))
      qHelpers.__Rewire__('getQuestionnaireFields', getQuestionnaireFields)

      const fields = await getFieldsByType('qClient', clientFields, 'address')

      expect(fields).to.eql([clientFields[1]])
      expect(getQuestionnaireFields).to.have.been.calledWith('qClient', 'address')
    })
  })

  describe('getValidator', function() {
    afterEach(function() {
      qHelpers.__ResetDependency__('getQuestionnaireFields')
      qHelpers.__ResetDependency__('validate')
    })

    it('validator passes valid fields', async function() {
      const getQuestionnaireFields = sinon.stub().returns(Promise.resolve(qFields))
      const validate = sinon.stub().returns({})

      qHelpers.__Rewire__('getQuestionnaireFields', getQuestionnaireFields)
      qHelpers.__Rewire__('validate', validate)

      const validator = getValidator('qClient')
      const valid = await validator(clientFields)

      expect(valid).to.be.true
      expect(getQuestionnaireFields).to.have.been.calledWith('qClient')
      expect(validate).to.have.been.calledWith('Some text', qFields[1])
      expect(validate).to.have.been.calledWith('An address', qFields[0])
    })

    it('validator fails with undeclared fields', async function() {
      const getQuestionnaireFields = sinon.stub().returns(Promise.resolve(qFields))
      qHelpers.__Rewire__('getQuestionnaireFields', getQuestionnaireFields)

      const validator = getValidator('qClient')
      const valid = await validator([
        ...clientFields,
        {meta: 3, value: 'Undeclared field'}
      ])

      expect(valid).to.be.false
      expect(getQuestionnaireFields).to.have.been.calledWith('qClient')
    })

    it('validator fails if validation function returns errors', async function() {
      const getQuestionnaireFields = sinon.stub().returns(Promise.resolve(qFields))
      const validate = sinon.stub()
        .onFirstCall().returns({})
        .onSecondCall().returns({'2': 'Required'})

      qHelpers.__Rewire__('getQuestionnaireFields', getQuestionnaireFields)
      qHelpers.__Rewire__('validate', validate)

      const validator = getValidator('qClient')
      const valid = await validator(clientFields)

      expect(valid).to.be.false
      expect(getQuestionnaireFields).to.have.been.calledWith('qClient')
      expect(validate).to.have.been.calledWith('Some text', qFields[1])
      expect(validate).to.have.been.calledWith('An address', qFields[0])
    })
  })
})
