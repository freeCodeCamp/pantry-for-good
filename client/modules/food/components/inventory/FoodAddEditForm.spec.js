import React from 'react'
import { shallow } from 'enzyme'

import FoodAddEditForm from './FoodAddEditForm'

describe('FoodAddEditForm', () => {
  let props

  beforeEach(() => {
    props = {
      FoodAddEditForm: [],
      foodCategories: [],
      loading: false,
      saving: false,
      saveFoodItem: sinon.spy(),
      formType: "Add",
      closeModal: sinon.spy()
    }
  })

  it('sets state when constructed', () => {
    const wrapper = shallow(<FoodAddEditForm {...props} />)
    expect(wrapper.state().formInputFields).to.deep.equal({ name: "", categoryId: "", quantity: "" })
    expect(wrapper.state().validInput).to.be.false
    expect(wrapper.state().touched).to.deep.equal({foodName: false, foodCategory: false, foodQuantity: false})
  })

  it('componentWillReceiveProps closes modal if a save is complete', () => {
    const wrapper = shallow(<FoodAddEditForm {...props} />)
    wrapper.setProps({ saving: true })
    const nextProps = {
      saving: false,
      saveError: undefined
    }
    expect(props.closeModal.called).to.be.false
    wrapper.setProps(nextProps)
    expect(props.closeModal.called).to.be.true
  })

  it('componentWillReceiveProps will not close a modal if in process of saving', () => {
    const wrapper = shallow(<FoodAddEditForm {...props} />)
    wrapper.setProps({ saving: false })
    const nextProps = {
      saving: true
    }
    wrapper.setProps(nextProps)
    expect(props.closeModal.called).to.be.false
  })

  it('componentWillReceiveProps will not close a modal if there is a save error', () => {
    const wrapper = shallow(<FoodAddEditForm {...props} />)
    wrapper.setProps({ saving: true })
    const nextProps = {
      saving: false,
      saveError: { message: 'error' }
    }
    wrapper.setProps(nextProps)
    expect(props.closeModal.called).to.be.false
  })

  describe('getValidationState', () => {
    it('foodName() returns null for a valid name', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      instance.setState({ formInputFields: { name: 'abc' } })
      expect(instance.getValidationState.foodName()).to.be.null
    })

    it('foodName() returns error for an empty string', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      instance.setState({ formInputFields: { name: '' }, touched: { foodName: true } })
      expect(instance.getValidationState.foodName()).to.equal('error')
    })

    it('foodName() returns error for a whitespace string', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      instance.setState({ formInputFields: { name: ' ' }, touched: { foodName: true } })
      expect(instance.getValidationState.foodName()).to.equal('error')
    })

    it('foodQuantity() returns null for 0', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      instance.setState({ formInputFields: { name: 'abc', quantity: '0' }, touched: { foodQuantity: true } })
      expect(instance.getValidationState.foodQuantity()).to.be.null
    })

    it('foodQuantity() returns null for 1', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      instance.setState({ formInputFields: { name: 'abc', quantity: '1' }, touched: { foodQuantity: true } })
      expect(instance.getValidationState.foodQuantity()).to.be.null
    })

    it('foodQuantity() returns null for 623', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      instance.setState({ formInputFields: { name: 'abc', quantity: '623' }, touched: { foodQuantity: true } })
      expect(instance.getValidationState.foodQuantity()).to.be.null
    })

    it('foodQuantity() returns error for -1', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      instance.setState({ formInputFields: { name: 'abc', quantity: '-1' }, touched: { foodQuantity: true } })
      expect(instance.getValidationState.foodQuantity()).to.equal('error')
    })

    it('foodQuantity() returns error for an empty string', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      instance.setState({ formInputFields: { name: 'abc', quantity: '' }, touched: { foodQuantity: true } })
      expect(instance.getValidationState.foodQuantity()).to.equal('error')
    })

    it('foodQuantity() returns error for a non-numeric string', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      instance.setState({ formInputFields: { name: 'abc', quantity: 'a1' }, touched: { foodQuantity: true } })
      expect(instance.getValidationState.foodQuantity()).to.equal('error')
    })

    it('foodCategory() returns null for a non-empty string', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      instance.setState({ formInputFields: { name: 'abc', categoryId: '11' }, touched: { foodCategory: true } })
      expect(instance.getValidationState.foodCategory()).to.be.null
    })

    it('foodCategory() returns error for an empty string', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      instance.setState({ formInputFields: { name: 'abc', categoryId: '' }, touched: { foodCategory: true } })
      expect(instance.getValidationState.foodCategory()).to.equal('error')
    })

    it('getAll() returns true when name, category and quantity are all valid', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      const state = {
        formInputFields: { name: 'abc', categoryId: '12', quantity: '5' },
        touched: { foodName: true, foodCategory: true, foodQuantity: true }
      }
      instance.setState(state)
      expect(instance.getValidationState.all()).to.be.true
    })

    it('getAll() returns false when name is not valid', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      const state = {
        formInputFields: { name: '', categoryId: '12', quantity: '5' },
        touched: { foodName: true, foodCategory: true, foodQuantity: true }
      }
      instance.setState(state)
      expect(instance.getValidationState.all()).to.be.false
    })

    it('getAll() returns false when category is not valid', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      const state = {
        formInputFields: { name: 'abc', categoryId: '', quantity: '5' },
        touched: { foodName: true, foodCategory: true, foodQuantity: true }
      }
      instance.setState(state)
      expect(instance.getValidationState.all()).to.be.false
    })

    it('getAll() returns false when quantity is not valid', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      const state = {
        formInputFields: { name: 'abc', categoryId: '12', quantity: '-5' },
        touched: { foodName: true, foodCategory: true, foodQuantity: true }
      }
      instance.setState(state)
      expect(instance.getValidationState.all()).to.be.false
    })

  })

  describe('validate()', () => {
    it('sets state.validInput true when getValidationState.all() and checkChanged()', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      sinon.stub(instance.getValidationState, "all").callsFake(() => true)
      sinon.stub(instance, "checkChanged").callsFake(() => true)
      instance.validate()
      expect(instance.state.validInput).to.equal(true)
    })

    it('sets state.validInput false when !getValidationState.all() and checkChanged()', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      sinon.stub(instance.getValidationState, "all").callsFake(() => false)
      sinon.stub(instance, "checkChanged").callsFake(() => true)
      instance.validate()
      expect(instance.state.validInput).to.equal(false)
    })

    it('sets state.validInput false when getValidationState.all() and !checkChanged()', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      sinon.stub(instance.getValidationState, "all").callsFake(() => true)
      sinon.stub(instance, "checkChanged").callsFake(() => false)
      instance.validate()
      expect(instance.state.validInput).to.equal(false)
    })

    it('sets state.validInput false when !getValidationState.all() and !checkChanged()', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      sinon.stub(instance.getValidationState, "all").callsFake(() => false)
      sinon.stub(instance, "checkChanged").callsFake(() => false)
      instance.validate()
      expect(instance.state.validInput).to.equal(false)
    })
  })

  describe('checkChanged()', () => {
    it('is false when formInputFields are the same as initialformInputFields', () => {
      const instance = shallow(<FoodAddEditForm {...props} editFood={{name: 'abc', quantity: '5', categoryId: '123'}} />).instance()
      instance.setState({formInputFields: { name: 'abc', quantity: '5', categoryId: '123'}})
      expect(instance.checkChanged()).to.be.false
    })

    it('is true when formInputFields.name differs from initialformInputFields', () => {
      const instance = shallow(<FoodAddEditForm {...props} editFood={{name: 'abc', quantity: '5', categoryId: '123'}} />).instance()
      instance.setState({formInputFields: { name: 'xyz', quantity: '5', categoryId: '123'}})
      expect(instance.checkChanged()).to.be.true
    })

    it('is true when formInputFields.quantity differs from initialformInputFields', () => {
      const instance = shallow(<FoodAddEditForm {...props} editFood={{name: 'abc', quantity: '5', categoryId: '123'}} />).instance()
      instance.setState({formInputFields: { name: 'abc', quantity: '3', categoryId: '123'}})
      expect(instance.checkChanged()).to.be.true
    })

    it('is true when formInputFields.categoryId differs from initialformInputFields', () => {
      const instance = shallow(<FoodAddEditForm {...props} editFood={{name: 'abc', quantity: '5', categoryId: '123'}} />).instance()
      instance.setState({formInputFields: { name: 'abc', quantity: '5', categoryId: '456'}})
      expect(instance.checkChanged()).to.be.true
    })
  })

  describe('handleChange', () => {
    it('foodName() when called with a string sets state.formInputFields.name', () => {
      const instance = shallow(<FoodAddEditForm {...props} />).instance()
      instance.handleChange.foodName('abcde')
      expect(instance.state.formInputFields.name).to.equal('abcde')
    })

    it('foodName() when called with a string calls validate()', () => {
      const instance = shallow(<FoodAddEditForm {...props} />).instance()
      sinon.spy(instance, "validate")
      instance.handleChange.foodName('abcde')
      expect(instance.validate.called).to.be.true
    })

    it('foodName() when called with an object sets name and categoryId', () => {
      const instance = shallow(<FoodAddEditForm {...props} />).instance()
      instance.quantity = { focus: () => { } }
      instance.handleChange.foodName({ name: 'xyz', categoryId: '5832' })
      expect(instance.state.formInputFields.name).to.equal('xyz')
      expect(instance.state.formInputFields.categoryId).to.equal('5832')
    })

    it('foodName() when called with null sets state.formInputFields.name to ""', () => {
      const instance = shallow(<FoodAddEditForm {...props} />).instance()
      instance.setState({ formInputFields: { name: 'abc' } })
      instance.handleChange.foodName(null)
      expect(instance.state.formInputFields.name).to.equal("")
    })

    it('foodName() when called with null calls validate()', () => {
      const instance = shallow(<FoodAddEditForm {...props} />).instance()
      sinon.spy(instance, "validate")
      instance.handleChange.foodName(null)
      expect(instance.validate.called).to.be.true
    })

    it('foodQuantity() sets state.formInputFields.quantity', () => {
      const instance = shallow(<FoodAddEditForm {...props} />).instance()
      instance.handleChange.foodQuantity({ target: { value: '20' } })
      expect(instance.state.formInputFields.quantity).to.equal('20')
    })

    it('foodQuantity() calls validate()', () => {
      const instance = shallow(<FoodAddEditForm {...props} />).instance()
      sinon.spy(instance, "validate")
      instance.handleChange.foodQuantity({ target: { value: '20' } })
      expect(instance.validate.called).to.be.true
    })

    it('foodCategory() sets state.formInputFields.categoryId', () => {
      const instance = shallow(<FoodAddEditForm {...props} />).instance()
      instance.handleChange.foodCategory({ target: { value: '3732' } })
      expect(instance.state.formInputFields.categoryId).to.equal('3732')
    })

    it('foodCategory() calls validate()', () => {
      const instance = shallow(<FoodAddEditForm {...props} />).instance()
      sinon.spy(instance, "validate")
      instance.handleChange.foodCategory({ target: { value: '42623' } })
      expect(instance.validate.called).to.be.true
    })
  })

  describe('saveFood()', () => {
    it('Calls props.saveFoodItem() when an editing a food', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} editFood={{id: '001', name: 'abc', categoryId: '123', quantity: '13'}}/>)
      const instance = wrapper.instance()
      instance.setState({
        formInputFields: { name: 'xyz', categoryId: '456', quantity: '11' }
      })
      instance.saveFood()
      expect(instance.props.saveFoodItem.called).to.be.true
      expect(instance.props.saveFoodItem.args[0][0]).to.equal('123')
      expect(instance.props.saveFoodItem.args[0][1]).to.deep.equal({ id: '001', name: 'xyz', categoryId: '456', quantity: '11' })
    })

    it('Calls props.saveFoodItem() when adding a food', () => {
      const wrapper = shallow(<FoodAddEditForm {...props} />)
      const instance = wrapper.instance()
      instance.setState({
        formInputFields: { name: 'abc', categoryId: '123', quantity: '11' }
      })
      instance.saveFood()
      expect(instance.props.saveFoodItem.called).to.be.true
      expect(instance.props.saveFoodItem.args[0][0]).to.equal('123')
      expect(instance.props.saveFoodItem.args[0][1]).to.deep.equal({ name: 'abc', categoryId: '123', quantity: '11' })
    })
  })
})
