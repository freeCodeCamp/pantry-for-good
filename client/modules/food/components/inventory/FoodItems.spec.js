import React from 'react'
import { mount, shallow } from 'enzyme'
import { Button, Modal } from 'react-bootstrap'
import { normalize } from 'normalizr'

import { arrayOfFoodItems, arrayOfFoodCategories } from '../../../../../common/schemas'
import ConnectedFoodItems, { FoodItems } from './FoodItems'
import { saveFoodItem, deleteFoodItem, clearFlags } from '../../reducers/item'
import { showConfirmDialog, hideDialog } from '../../../core/reducers/dialog'

describe('FoodItems', () => {
  let props

  beforeEach(() => {
    props = {
      foodItems: [],
      foodCategories: [],
      clearFlags: sinon.spy()
    }
  })

  it('sets state when constructed', () => {
    const wrapper = shallow(<FoodItems {...props} />)
    expect(wrapper.state().showModal).to.equal(false)
    expect(wrapper.state().editModalFood).to.equal(undefined)
    expect(wrapper.state().modalInputFields).to.deep.equal({ name: "", categoryId: "", quantity: "" })
    expect(wrapper.state().validInput).to.equal(false)
    expect(wrapper.state().initialModalInputFields).to.deep.equal({ name: "", categoryId: "", quantity: "" })
  })

  it('componentWillReceiveProps closes modal if a save is complete', () => {
    const wrapper = shallow(<FoodItems {...props} />)
    wrapper.setProps({ saving: true })
    const instance = wrapper.instance()
    sinon.spy(instance, "closeModal")
    instance.setState({ showModal: true })
    const nextProps = {
      saving: false,
      saveError: undefined
    }
    instance.componentWillReceiveProps(nextProps)
    expect(instance.closeModal.called).to.be.true
  })

  it('componentWillReceiveProps will not close a modal if in process of saving', () => {
    const wrapper = shallow(<FoodItems {...props} />)
    wrapper.setProps({ saving: false })
    const instance = wrapper.instance()
    sinon.spy(instance, "closeModal")
    instance.setState({ showModal: true })
    const nextProps = {
      saving: true,
    }
    instance.componentWillReceiveProps(nextProps)
    expect(instance.closeModal.called).to.be.false
  })

  it('componentWillReceiveProps will not close a modal if there is a save error', () => {
    const wrapper = shallow(<FoodItems {...props} />)
    wrapper.setProps({ saving: true })
    const instance = wrapper.instance()
    sinon.spy(instance, "closeModal")
    instance.setState({ showModal: true })
    const nextProps = {
      saving: false,
      saveError: { message: 'error' }
    }
    instance.componentWillReceiveProps(nextProps)
    expect(instance.closeModal.called).to.be.false
  })

  it('openModal sets the showModal, editModalFood and modalInput fields to add mode', () => {
    const wrapper = shallow(<FoodItems {...props} />)
    const instance = wrapper.instance()
    instance.openModal()()
    expect(instance.state.showModal).to.eql('Add')
    expect(instance.state.editModalFood).to.equal(undefined)
    expect(instance.state.modalInputFields).to.deep.equal({ name: "", categoryId: "", quantity: "" })
  })

  it('openModal sets the showModal, editModalFood and modalInput fields to edit mode', () => {
    const wrapper = shallow(<FoodItems {...props} />)
    wrapper.setProps({
      foodItems: [
        { _id: '123', name: 'apple', quantity: 5, categoryId: '55' },
        { _id: '456', name: 'banana', quantity: 13, categoryId: '66' }
      ]
    })
    const instance = wrapper.instance()
    instance.openModal('456')()
    expect(instance.state.showModal).to.eql('Edit')
    expect(instance.state.editModalFood).to.deep.equal({ _id: '456', name: 'banana', quantity: 13, categoryId: '66' })
    expect(instance.state.modalInputFields).to.deep.equal({ name: "banana", categoryId: "66", quantity: "13" })
  })

  it('openModal calls props.clearFlags', () => {
    const wrapper = shallow(<FoodItems {...props} />)
    const instance = wrapper.instance()
    instance.openModal()()
    expect(instance.props.clearFlags.called).to.be.true
  })

  it('closeModal sets the showModal, editModalFood, modalInput and validInput fields', () => {
    const wrapper = shallow(<FoodItems {...props} />)
    wrapper.setProps({
      foodItems: [
        { _id: '456', name: 'banana', quantity: 13, categoryId: '66' }
      ]
    })
    const instance = wrapper.instance()
    instance.openModal('456')()
    instance.closeModal()
    expect(instance.state.showModal).to.be.false
    expect(instance.state.editModalFood).to.equal(undefined)
    expect(instance.state.modalInputFields).to.deep.equal({ name: "", categoryId: "", quantity: "" })
    expect(instance.state.validInput).to.be.false
  })

  it('closeModal calls props.clearFlags', () => {
    const wrapper = shallow(<FoodItems {...props} />)
    const instance = wrapper.instance()
    instance.closeModal()
    expect(instance.props.clearFlags.called).to.be.true
  })

  it('categoryFormatter returns the category of the _id', () => {
    const wrapper = shallow(<FoodItems {...props} />)
    wrapper.setProps({
      foodCategories: [
        { _id: '11', category: 'fruits' },
        { _id: '12', category: 'vegetables' },
        { _id: '13', category: 'seafood' }
      ]
    })
    const instance = wrapper.instance()
    expect(instance.categoryFormatter('12')).to.equal('vegetables')
  })

  it('createCustomToolbar contains an add to inventory button', () => {
    const wrapper = shallow(<FoodItems {...props} />)
    const instance = wrapper.instance()
    const panel = (<div>panel</div>)
    const toolBar = instance.createCustomToolBar({ foodCategories: [], components: { searchPanel: panel } })
    const button = shallow(toolBar).find(Button).at(0)
    expect(button.prop('children')).to.equal('Add to Inventory')
  })

  it('createCustomToolbar displays the components.searchPanel parameter', () => {
    const wrapper = shallow(<FoodItems {...props} />)
    const instance = wrapper.instance()
    const panel = '123456789abcdef'
    const toolBar = instance.createCustomToolBar({ foodCategories: [], components: { searchPanel: panel } })
    expect(shallow(toolBar).html()).to.have.string(panel)
  })

  it('updateSearchText() sets state.searchText when differing text', () => {
    const instance = shallow(<FoodItems {...props} />).instance()
    instance.setState({ searchText: 'abc' })
    instance.updateSearchText('xyz')
    expect(instance.state.searchText).to.equal('xyz')
  })

  it('updateSearchText() does not setState when called with the same text', () => {
    const instance = shallow(<FoodItems {...props} />).instance()
    instance.setState({ searchText: 'abc' })
    sinon.spy(instance, "setState")
    instance.updateSearchText('abc')
    expect(instance.setState.called).to.be.false
  })

  describe('getActionButtons()', () => {
    it('creates 2 Buttons', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      const buttons = shallow(instance.getActionButtons(undefined, { _id: '11', categoryId: '12' }))
      expect(buttons.find(Button)).to.have.length(2)
    })

    it('first button calls openModal', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      const onClickHandler = () => { }
      sinon.stub(instance, "openModal").returns(onClickHandler)
      const buttons = shallow(instance.getActionButtons(undefined, { _id: '11', categoryId: '12' }))
      expect(instance.openModal.called).to.be.true
      expect(instance.openModal.args[0][0]).to.equal('11')
      const button1 = buttons.find(Button).at(0)
      expect(button1.prop('onClick')).to.equal(onClickHandler)
    })

    it('second button opens confirm delete dialog', () => {
      const showConfirmDialogSpy = sinon.spy()
      const wrapper = shallow(<FoodItems
        {...props}
        showConfirmDialog={showConfirmDialogSpy}
      />)
      const instance = wrapper.instance()
      const buttons = shallow(instance.getActionButtons(undefined, { _id: '11', categoryId: '12' }))
      const button = buttons.find(Button).at(1)
      const buttonOnClick = button.prop('onClick')

      // Activate the button action
      buttonOnClick()
      expect(showConfirmDialogSpy.called).to.be.true
    })

    it('confirm delete dialog with cancel action', () => {
      const showConfirmDialogSpy = sinon.spy()
      const deleteFoodItemSpy = sinon.spy()
      const hideDialogSpy = sinon.spy()
      const wrapper = shallow(<FoodItems
        {...props}
        showConfirmDialog={showConfirmDialogSpy}
        deleteFoodItem={deleteFoodItemSpy}
        hideDialog={hideDialogSpy}
      />)
      const instance = wrapper.instance()
      const buttons = shallow(instance.getActionButtons(undefined, { _id: '11', categoryId: '12' }))
      const button = buttons.find(Button).at(1)
      const buttonOnClick = button.prop('onClick')

      // Activate the button action to call showConfirmDialog
      buttonOnClick()

      // The first parameter to showConfirmDialog in called when user clicks cancel
      const cancelAction = showConfirmDialogSpy.args[0][0]
      cancelAction()
      expect(deleteFoodItemSpy.called).to.be.false
      expect(hideDialogSpy.called).to.be.true
    })

    it('confirm delete dialog with confirm action', () => {
      const showConfirmDialogSpy = sinon.spy()
      const deleteFoodItemSpy = sinon.spy()
      const hideDialogSpy = sinon.spy()
      const wrapper = shallow(<FoodItems
        {...props}
        showConfirmDialog={showConfirmDialogSpy}
        deleteFoodItem={deleteFoodItemSpy}
        hideDialog={hideDialogSpy}
      />)
      const instance = wrapper.instance()
      const buttons = shallow(instance.getActionButtons(undefined, { _id: '11', categoryId: '12' }))
      const button = buttons.find(Button).at(1)
      const buttonOnClick = button.prop('onClick')

      // Activate the button action to call showConfirmDialog
      buttonOnClick()

      // The second parameter to showConfirmDialog in called when user clicks confirm
      const confirmAction = showConfirmDialogSpy.args[0][1]
      confirmAction()
      expect(deleteFoodItemSpy.called).to.be.true
      // the first argument to props.deleteFoodItem should be the categoryId
      expect(deleteFoodItemSpy.args[0][0]).to.eql('12')
      // the second argument to props.deleteFoodItem should be the food item _id
      expect(deleteFoodItemSpy.args[0][1]).to.eql('11')
      expect(hideDialogSpy.called).to.be.true
    })
  })

  describe('getValidationState', () => {
    it('foodName() returns null for a valid name', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      instance.setState({ modalInputFields: { name: 'abc' } })
      expect(instance.getValidationState.foodName()).to.be.null
    })

    it('foodName() returns error for an empty string', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      instance.setState({ modalInputFields: { name: '' }, touched: { foodName: true } })
      expect(instance.getValidationState.foodName()).to.equal('error')
    })

    it('foodName() returns error for a whitespace string', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      instance.setState({ modalInputFields: { name: ' ' }, touched: { foodName: true } })
      expect(instance.getValidationState.foodName()).to.equal('error')
    })

    it('foodQuantity() returns null for 0', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      instance.setState({ modalInputFields: { name: 'abc', quantity: '0' }, touched: { foodQuantity: true } })
      expect(instance.getValidationState.foodQuantity()).to.be.null
    })

    it('foodQuantity() returns null for 1', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      instance.setState({ modalInputFields: { name: 'abc', quantity: '1' }, touched: { foodQuantity: true } })
      expect(instance.getValidationState.foodQuantity()).to.be.null
    })

    it('foodQuantity() returns null for 623', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      instance.setState({ modalInputFields: { name: 'abc', quantity: '623' }, touched: { foodQuantity: true } })
      expect(instance.getValidationState.foodQuantity()).to.be.null
    })

    it('foodQuantity() returns error for -1', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      instance.setState({ modalInputFields: { name: 'abc', quantity: '-1' }, touched: { foodQuantity: true } })
      expect(instance.getValidationState.foodQuantity()).to.equal('error')
    })

    it('foodQuantity() returns error for an empty string', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      instance.setState({ modalInputFields: { name: 'abc', quantity: '' }, touched: { foodQuantity: true } })
      expect(instance.getValidationState.foodQuantity()).to.equal('error')
    })

    it('foodQuantity() returns error for a non-numeric string', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      instance.setState({ modalInputFields: { name: 'abc', quantity: 'a1' }, touched: { foodQuantity: true } })
      expect(instance.getValidationState.foodQuantity()).to.equal('error')
    })

    it('foodCategory() returns null for a non-empty string', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      instance.setState({ modalInputFields: { name: 'abc', categoryId: '11' }, touched: { foodCategory: true } })
      expect(instance.getValidationState.foodCategory()).to.be.null
    })

    it('foodCategory() returns error for an empty string', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      instance.setState({ modalInputFields: { name: 'abc', categoryId: '' }, touched: { foodCategory: true } })
      expect(instance.getValidationState.foodCategory()).to.equal('error')
    })

    it('getAll() returns true when name, category and quantity are all valid', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      const state = {
        modalInputFields: { name: 'abc', categoryId: '12', quantity: '5' },
        touched: { foodName: true, foodCategory: true, foodQuantity: true }
      }
      instance.setState(state)
      expect(instance.getValidationState.all()).to.be.true
    })

    it('getAll() returns false when name is not valid', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      const state = {
        modalInputFields: { name: '', categoryId: '12', quantity: '5' },
        touched: { foodName: true, foodCategory: true, foodQuantity: true }
      }
      instance.setState(state)
      expect(instance.getValidationState.all()).to.be.false
    })

    it('getAll() returns false when category is not valid', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      const state = {
        modalInputFields: { name: 'abc', categoryId: '', quantity: '5' },
        touched: { foodName: true, foodCategory: true, foodQuantity: true }
      }
      instance.setState(state)
      expect(instance.getValidationState.all()).to.be.false
    })

    it('getAll() returns false when quantity is not valid', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      const state = {
        modalInputFields: { name: 'abc', categoryId: '12', quantity: '-5' },
        touched: { foodName: true, foodCategory: true, foodQuantity: true }
      }
      instance.setState(state)
      expect(instance.getValidationState.all()).to.be.false
    })

  })

  describe('validate()', () => {
    it('sets state.validInput true when getValidationState.all() and checkChanged()', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      sinon.stub(instance.getValidationState, "all").callsFake(() => true)
      sinon.stub(instance, "checkChanged").callsFake(() => true)
      instance.validate()
      expect(instance.state.validInput).to.equal(true)
    })

    it('sets state.validInput false when !getValidationState.all() and checkChanged()', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      sinon.stub(instance.getValidationState, "all").callsFake(() => false)
      sinon.stub(instance, "checkChanged").callsFake(() => true)
      instance.validate()
      expect(instance.state.validInput).to.equal(false)
    })

    it('sets state.validInput false when getValidationState.all() and !checkChanged()', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      sinon.stub(instance.getValidationState, "all").callsFake(() => true)
      sinon.stub(instance, "checkChanged").callsFake(() => false)
      instance.validate()
      expect(instance.state.validInput).to.equal(false)
    })

    it('sets state.validInput false when !getValidationState.all() and !checkChanged()', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      sinon.stub(instance.getValidationState, "all").callsFake(() => false)
      sinon.stub(instance, "checkChanged").callsFake(() => false)
      instance.validate()
      expect(instance.state.validInput).to.equal(false)
    })
  })

  describe('touch()', () => {
    it('touch.foodName() sets state touched.foodName to true', () => {
      const instance = shallow(<FoodItems {...props} />).instance()
      instance.setState({ touched: { foodName: false } })
      instance.touch.foodName()
      expect(instance.state.touched.foodName).to.be.true
    })

    it('touch.foodCategory() sets state touched.foodCategory to true', () => {
      const instance = shallow(<FoodItems {...props} />).instance()
      instance.setState({ touched: { foodCategory: false } })
      instance.touch.foodCategory()
      expect(instance.state.touched.foodCategory).to.be.true
    })

    it('touch.foodQuantity() sets state touched.foodQuantity to true', () => {
      const instance = shallow(<FoodItems {...props} />).instance()
      instance.setState({ touched: { foodQuantity: false } })
      instance.touch.foodQuantity()
      expect(instance.state.touched.foodQuantity).to.be.true
    })
  })

  describe('checkChanged()', () => {
    it('is false when modalInputFields are the same as initialModalInputFields', () => {
      const instance = shallow(<FoodItems {...props} />).instance()
      const state = {
        initialModalInputFields: { name: 'abc', quantity: '5' },
        modalInputFields: { name: 'abc', quantity: '5' }
      }
      instance.setState(state)
      expect(instance.checkChanged()).to.be.false
    })

    it('is true when modalInputFields differ from initialModalInputFields', () => {
      const instance = shallow(<FoodItems {...props} />).instance()
      const state = {
        initialModalInputFields: { name: 'abc', quantity: '5' },
        modalInputFields: { name: 'abc', quantity: '15' }
      }
      instance.setState(state)
      expect(instance.checkChanged()).to.be.true
    })
  })

  describe('handleChange', () => {
    it('foodName() when called with a string sets state.modalInputFields.name', () => {
      const instance = shallow(<FoodItems {...props} />).instance()
      instance.handleChange.foodName('abcde')
      expect(instance.state.modalInputFields.name).to.equal('abcde')
    })

    it('foodName() when called with a string calls validate()', () => {
      const instance = shallow(<FoodItems {...props} />).instance()
      sinon.spy(instance, "validate")
      instance.handleChange.foodName('abcde')
      expect(instance.validate.called).to.be.true
    })

    it('foodName() when called with an object calls this.quantity.focus()', () => {
      const instance = shallow(<FoodItems {...props} />).instance()
      instance.quantity = { focus: sinon.spy() }
      instance.handleChange.foodName({ name: 'xyz', categoryId: '5832' })
      expect(instance.quantity.focus.called).to.be.true

    })

    it('foodName() when called with an object sets name and categoryId', () => {
      const instance = shallow(<FoodItems {...props} />).instance()
      instance.quantity = { focus: () => { } }
      instance.handleChange.foodName({ name: 'xyz', categoryId: '5832' })
      expect(instance.state.modalInputFields.name).to.equal('xyz')
      expect(instance.state.modalInputFields.categoryId).to.equal('5832')
    })

    it('foodName() when called with null sets state.modalInputFields.name to ""', () => {
      const instance = shallow(<FoodItems {...props} />).instance()
      instance.setState({ modalInputFields: { name: 'abc' } })
      instance.handleChange.foodName(null)
      expect(instance.state.modalInputFields.name).to.equal("")
    })

    it('foodName() when called with null calls validate()', () => {
      const instance = shallow(<FoodItems {...props} />).instance()
      sinon.spy(instance, "validate")
      instance.handleChange.foodName(null)
      expect(instance.validate.called).to.be.true
    })

    it('foodQuantity() sets state.modalInputFields.quantity', () => {
      const instance = shallow(<FoodItems {...props} />).instance()
      instance.handleChange.foodQuantity({ target: { value: '20' } })
      expect(instance.state.modalInputFields.quantity).to.equal('20')
    })

    it('foodQuantity() calls validate()', () => {
      const instance = shallow(<FoodItems {...props} />).instance()
      sinon.spy(instance, "validate")
      instance.handleChange.foodQuantity({ target: { value: '20' } })
      expect(instance.validate.called).to.be.true
    })

    it('foodCategory() sets state.modalInputFields.categoryId', () => {
      const instance = shallow(<FoodItems {...props} />).instance()
      instance.handleChange.foodCategory({ target: { value: '3732' } })
      expect(instance.state.modalInputFields.categoryId).to.equal('3732')
    })

    it('foodCategory() calls validate()', () => {
      const instance = shallow(<FoodItems {...props} />).instance()
      sinon.spy(instance, "validate")
      instance.handleChange.foodCategory({ target: { value: '42623' } })
      expect(instance.validate.called).to.be.true
    })


  })

  describe('saveFood()', () => {
    it('Calls props.saveFoodItem() when an edit modal is open', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      wrapper.setProps({ saveFoodItem: sinon.spy() })
      const instance = wrapper.instance()
      instance.setState({
        showModal: 'Edit',
        editModalFood: { id: '123', categoryId: '456' },
        modalInputFields: { name: 'abc', categoryId: '789', quantity: '42' }
      })
      instance.saveFood()
      expect(instance.props.saveFoodItem.called).to.be.true
      expect(instance.props.saveFoodItem.args[0][0]).to.equal('456')
      expect(instance.props.saveFoodItem.args[0][1]).to.deep.equal({ id: '123', name: 'abc', categoryId: '789', quantity: '42' })
    })

    it('Calls props.saveFoodItem() when an add modal is open', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      wrapper.setProps({ saveFoodItem: sinon.spy() })
      const instance = wrapper.instance()
      instance.setState({
        showModal: 'Add',
        modalInputFields: { name: 'abc', categoryId: '123', quantity: '42' }
      })
      instance.saveFood()
      expect(instance.props.saveFoodItem.called).to.be.true
      expect(instance.props.saveFoodItem.args[0][0]).to.equal('123')
      expect(instance.props.saveFoodItem.args[0][1]).to.deep.equal({ name: 'abc', categoryId: '123', quantity: '42' })
    })
  })

  describe('handleSubmit()', () => {
    it('calls saveFood when validInput and not saving', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      wrapper.setProps({ saving: false })
      const instance = wrapper.instance()
      sinon.spy(instance, "saveFood")
      instance.setState({ validInput: true })
      const e = { preventDefault: () => { } }
      instance.handelModalSubmit(e)
      expect(instance.saveFood.called).to.be.true
    })

    it('does not call saveFood when not validInput', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      const instance = wrapper.instance()
      sinon.spy(instance, "saveFood")
      instance.setState({ validInput: false })
      const e = { preventDefault: () => { } }
      instance.handelModalSubmit(e)
      expect(instance.saveFood.called).to.be.false
    })
    it('does not call saveFood when saving', () => {
      const wrapper = shallow(<FoodItems {...props} />)
      wrapper.setProps({ saving: true })
      const instance = wrapper.instance()
      sinon.spy(instance, "saveFood")
      instance.setState({ validInput: true })
      const e = { preventDefault: () => { } }
      instance.handelModalSubmit(e)
      expect(instance.saveFood.called).to.be.false
    })

  })

  describe('render()', () => {
    it('hides modal when state.showModal is false, shows when "Add" or "Edit"', () => {
      let wrapper = mount(<FoodItems {...props} />)

      let modal = wrapper.find(Modal)
      expect(modal.length).to.equal(1)
      expect(modal.props().show).to.be.false
      wrapper.setState({ showModal: 'Add' })
      expect(modal.props().show).to.be.true
      wrapper.setState({ showModal: false })
      expect(modal.props().show).to.be.false
      wrapper.setState({ showModal: 'Edit' })
      expect(modal.props().show).to.be.true
    })

    it('has an Add to Inventory button', () => {
      let wrapper = mount(<FoodItems {...props} />)
      const button = wrapper.find(Button).filterWhere(node => node.props().children === 'Add to Inventory')
      expect(button).to.have.length(1)
    })

    it('renders props.foodItems in a table', () => {
      const props = {
        foodItems: [
          { _id: '11', categoryId: '1', name: 'Apple', quantity: 20, deleted: false, frequency: 1 },
          { _id: '12', categoryId: '2', name: 'Carrot', quantity: 21, deleted: false, frequency: 1 }
        ],
        foodCategories: [
          { _id: '1', category: 'fruits', deleted: false, items: [] },
          { _id: '2', category: 'vegetables', deleted: false, items: [] }
        ]
      }
      const wrapper = mount(<FoodItems {...props} />)

      const appleRow = wrapper.find('tr').filterWhere(node => node.html().includes('Apple'))
      expect(appleRow).to.have.length(1)
      expect(appleRow.find('td').at(0).text()).to.equal('Apple')
      expect(appleRow.find('td').at(1).text()).to.equal('fruits')
      expect(appleRow.find('td').at(2).text()).to.equal('20')

      const carrotRow = wrapper.find('tr').filterWhere(node => node.html().includes('Carrot'))
      expect(carrotRow).to.have.length(1)
      expect(carrotRow.find('td').at(0).text()).to.equal('Carrot')
      expect(carrotRow.find('td').at(1).text()).to.equal('vegetables')
      expect(carrotRow.find('td').at(2).text()).to.equal('21')
    })

    it('has an edit button for each food item', () => {
      const props = {
        foodItems: [
          { _id: '11', categoryId: '1', name: 'Apple', quantity: 20, deleted: false, frequency: 1 },
          { _id: '12', categoryId: '2', name: 'Carrot', quantity: 21, deleted: false, frequency: 1 }
        ],
        foodCategories: [
          { _id: '1', category: 'fruits', deleted: false, items: [] },
          { _id: '2', category: 'vegetables', deleted: false, items: [] }
        ]
      }
      const wrapper = mount(<FoodItems {...props} />)

      const appleRow = wrapper.find('tr').filterWhere(node => node.html().includes('Apple'))
      expect(appleRow).to.have.length(1)

      expect(appleRow.find('button').filterWhere(node => node.html().includes('Edit'))).to.have.length(1)

      const carrotRow = wrapper.find('tr').filterWhere(node => node.html().includes('Carrot'))
      expect(carrotRow).to.have.length(1)
      expect(carrotRow.find('button').filterWhere(node => node.html().includes('Edit'))).to.have.length(1)
    })

    it('has a delete button for each food item', () => {
      const props = {
        foodItems: [
          { _id: '11', categoryId: '1', name: 'Apple', quantity: 20, deleted: false, frequency: 1 },
          { _id: '12', categoryId: '2', name: 'Carrot', quantity: 21, deleted: false, frequency: 1 }
        ],
        foodCategories: [
          { _id: '1', category: 'fruits', deleted: false, items: [] },
          { _id: '2', category: 'vegetables', deleted: false, items: [] }
        ]
      }
      const wrapper = mount(<FoodItems {...props} />)

      const appleRow = wrapper.find('tr').filterWhere(node => node.html().includes('Apple'))
      expect(appleRow).to.have.length(1)

      expect(appleRow.find('button').filterWhere(node => node.html().includes('Delete'))).to.have.length(1)

      const carrotRow = wrapper.find('tr').filterWhere(node => node.html().includes('Carrot'))
      expect(carrotRow).to.have.length(1)
      expect(carrotRow.find('button').filterWhere(node => node.html().includes('Delete'))).to.have.length(1)
    })

  })
})

describe('FoodItems redux tests', () => {
  let reduxState
  let mockStore
  let foodItems
  let categories

  beforeEach(() => {

    categories = [
      { _id: 100, category: "fruit", deleted: false, items: [] },
      { _id: 101, category: "vegetables", deleted: false, items: [] }
    ]
    const normalizedCategories = normalize(categories, arrayOfFoodCategories)

    foodItems = [
      { _id: 200, name: 'Apple', categoryId: "100", deleted: false, quantity: 41 },
      { _id: 201, name: 'Banana', categoryId: "100", deleted: false, quantity: 42 }
    ]
    const normalizedFoodItems = normalize(foodItems, arrayOfFoodItems)

    reduxState = {
      entities: { ...normalizedFoodItems.entities, ...normalizedCategories.entities },
      food: {
        category: {
          ids: normalizedCategories.result,
          fetching: 11,
          fetchError: 12,
        },
        item: {
          ids: normalizedFoodItems.result,
          saving: 13,
          saveError: 14
        }
      }
    }

    mockStore = {
      getState: () => reduxState,
      subscribe: () => { },
      dispatch: sinon.spy()
    }
  })

  it('props.foodItems returns the foodItems from the redux store with a nameLowerCased attribute', () => {
    const wrapper = shallow(<ConnectedFoodItems />, { context: { store: mockStore } })
    const expected = foodItems.map(item => ({ ...item, nameLowerCased: item.name.toLowerCase() }))
    expect(wrapper.props().foodItems).to.deep.equal(expected)
  })

  it('props.foodCategories returns the foodCategories from the redux store with a nameLowerCased attribute', () => {
    const wrapper = shallow(<ConnectedFoodItems />, { context: { store: mockStore } })
    expect(wrapper.props().foodCategories).to.deep.equal(categories)
  })

  it('props.loading returns the fetching value from the food category of the redux store', () => {
    const wrapper = shallow(<ConnectedFoodItems />, { context: { store: mockStore } })
    expect(wrapper.props().loading).to.equal(mockStore.getState().food.category.fetching)
  })

  it('props.loadError returns the fetchError value from the food category of the redux store', () => {
    const wrapper = shallow(<ConnectedFoodItems />, { context: { store: mockStore } })
    expect(wrapper.props().loadError).to.equal(mockStore.getState().food.category.fetchError)
  })

  it('props.saving returns the saving value from the food item of the redux store', () => {
    const wrapper = shallow(<ConnectedFoodItems />, { context: { store: mockStore } })
    expect(wrapper.props().saving).to.equal(mockStore.getState().food.item.saving)
  })

  it('props.saveError returns the saveError value from the food item of the redux store', () => {
    const wrapper = shallow(<ConnectedFoodItems />, { context: { store: mockStore } })
    expect(wrapper.props().saveError).to.equal(mockStore.getState().food.item.saveError)
  })

  it('props.SaveFoodItem dispatches action from saveFoodItem', () => {
    const wrapper = shallow(<ConnectedFoodItems />, { context: { store: mockStore } })
    wrapper.props().saveFoodItem('123', foodItems[0])
    expect(mockStore.dispatch.args[0][0]).to.deep.eql(saveFoodItem('123', foodItems[0]))
  })

  it('props.deleteFoodItem dispatches action from deleteFoodItem', () => {
    const wrapper = shallow(<ConnectedFoodItems />, { context: { store: mockStore } })
    wrapper.props().deleteFoodItem('123', '456')
    expect(mockStore.dispatch.args[0][0]).to.deep.eql(deleteFoodItem('123', '456'))
  })

  it('props.clearFlags dispatches action from clearFlags', () => {
    const wrapper = shallow(<ConnectedFoodItems />, { context: { store: mockStore } })
    wrapper.props().clearFlags()
    expect(mockStore.dispatch.args[0][0]).to.deep.eql(clearFlags())
  })

  it('props.hideDialog dispatches action from hideDialog', () => {
    const wrapper = shallow(<ConnectedFoodItems />, { context: { store: mockStore } })
    wrapper.props().hideDialog()
    expect(mockStore.dispatch.args[0][0]).to.deep.eql(hideDialog())
  })

  it('props.showConfirmDialog dispatches action from showConfirmDialog', () => {
    const wrapper = shallow(<ConnectedFoodItems />, { context: { store: mockStore } })
    const cb1 = () => { }
    const cb2 = () => { }
    wrapper.props().showConfirmDialog(cb1, cb2, 'mes', 'lab')
    expect(mockStore.dispatch.args[0][0]).to.deep.eql(showConfirmDialog(cb1, cb2, 'mes', 'lab'))
  })
})
