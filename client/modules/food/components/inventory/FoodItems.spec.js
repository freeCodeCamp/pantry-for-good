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
    expect(wrapper.state().modalType).to.equal(undefined)
    expect(wrapper.state().editModalFood).to.equal(undefined)
    expect(wrapper.state().searchText).to.equal("")
  })

  it('openModal sets the showModal and editModalFood to add mode', () => {
    const wrapper = shallow(<FoodItems {...props} />)
    const instance = wrapper.instance()
    instance.openModal()()
    expect(instance.state.modalType).to.eql('Add')
    expect(instance.state.editModalFood).to.equal(undefined)
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
    expect(instance.state.modalType).to.eql('Edit')
    expect(instance.state.editModalFood).to.deep.equal({ _id: '456', name: 'banana', quantity: 13, categoryId: '66' })
  })

  it('openModal calls props.clearFlags', () => {
    const wrapper = shallow(<FoodItems {...props} />)
    const instance = wrapper.instance()
    instance.openModal()()
    expect(instance.props.clearFlags.called).to.be.true
  })

  it('closeModal sets the modalType and editModalFood to undefined', () => {
    const wrapper = shallow(<FoodItems {...props} />)
    wrapper.setProps({
      foodItems: [
        { _id: '456', name: 'banana', quantity: 13, categoryId: '66' }
      ]
    })
    const instance = wrapper.instance()
    instance.openModal('456')()
    instance.closeModal()
    expect(instance.state.modalType).to.equal(undefined)
    expect(instance.state.editModalFood).to.equal(undefined)
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

  describe('render()', () => {
    it('hides modal when state.modalType is undefined, shows when "Add" or "Edit"', () => {
      let wrapper = mount(<FoodItems {...props} />)

      let modal = wrapper.find(Modal)
      expect(modal.length).to.equal(1)
      expect(modal.props().show).to.be.false
      wrapper.setState({ modalType: 'Add' })
      expect(modal.props().show).to.be.true
      wrapper.setState({ modalType: undefined })
      expect(modal.props().show).to.be.false
      wrapper.setState({ modalType: 'Edit' })
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
