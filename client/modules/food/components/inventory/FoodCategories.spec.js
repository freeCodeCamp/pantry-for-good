import React from 'react'
import { mount, shallow } from 'enzyme'
import {normalize} from 'normalizr'

import {arrayOfFoodCategories} from '../../../../../common/schemas'
import { CALL_API } from '../../../../store/middleware/api'
import ConnectedFoodCategories, { FoodCategories } from './FoodCategories'
import Category from './Category'
import { loadFoods, saveFood, deleteFood } from '../../reducers/category'

describe('FoodCategories', () => {
  let props

  beforeEach(() => {
    props = {
      foods: [],
      loadingFoods: false,
      loadFoodsError: undefined,
      savingFoods: false,
      saveFoodsError: undefined,
      loadFoods: () => { },
      createCategory: () => { },
      updateCategory: () => { },
      deleteCategory: () => { }
    }
  })

  it('calls props.loadFoods when created', () => {
    var loadFoods = sinon.spy()
    mount(<FoodCategories {...props} loadFoods={loadFoods} />)
    expect(loadFoods.called).to.eql(true)
  })

  it('has a Category element for each food category', () => {
    const foods = [{_id: 1 , category: 'a'}, {_id: 2 , category: 'b'}, {_id: 3 , category: 'c'}]
    const wrapper = shallow(<FoodCategories {...props} foods={foods}/>)
    expect(wrapper.find(Category)).to.have.length(3)
  })

  it('displays no categories when there are no categories', () => {
    const foods = []
    const wrapper = shallow(<FoodCategories {...props} foods={foods}/>)
    expect(wrapper.find(Category)).to.have.length(0)
  })

  it('it\'s createCategory method calls props.createCategory' , () => {
    const createCategory = sinon.spy()
    const wrapper = shallow(<FoodCategories {...props} createCategory={createCategory}/>)
    const instance = wrapper.instance()
    instance.createCategory('abc')
    expect(createCategory.called).to.eql(true)
    expect(createCategory.args[0][0]).to.eql('abc')
  })

  it('it\'s createCategory method trims whitespace' , () => {
    const createCategory = sinon.spy()
    const wrapper = shallow(<FoodCategories {...props} createCategory={createCategory}/>)
    const instance = wrapper.instance()
    instance.createCategory('   abc   ')
    expect(createCategory.called).to.eql(true)
    expect(createCategory.args[0][0]).to.eql('abc')
  })

  it('it\'s doesCategoryExist method returns true if a category exists' , () => {
    const foods = [{_id: 1 , category: 'a'}, {_id: 2 , category: 'b'}, {_id: 3 , category: 'c'}]
    const createCategory = sinon.spy()
    const wrapper = shallow(<FoodCategories {...props} foods={foods} createCategory={createCategory}/>)
    const instance = wrapper.instance()
    expect(instance.doesCategoryExist('b')).to.eql(true)
  })

  it('it\'s doesCategoryExist method is not case sensitive' , () => {
    const foods = [{_id: 1, category: 'abc'}]
    const createCategory = sinon.spy()
    const wrapper = shallow(<FoodCategories {...props} foods={foods} createCategory={createCategory}/>)
    const instance = wrapper.instance()
    expect(instance.doesCategoryExist('ABC')).to.eql(true)
  })

  it('it\'s doesCategoryExist method returns false when a category does not exist' , () => {
    const foods = [{_id: 1, category: 'abc'}]
    const createCategory = sinon.spy()
    const wrapper = shallow(<FoodCategories {...props} foods={foods} createCategory={createCategory}/>)
    const instance = wrapper.instance()
    expect(instance.doesCategoryExist('xyz')).to.eql(false)
  })

  it('it\'s onItemEdit method calls props.updateCategory for a new name' , () => {
    const foods = [{_id: 3, category: 'abc'}]
    const updateCategory = sinon.spy()

    const wrapper = shallow(<FoodCategories {...props} foods={foods} updateCategory={updateCategory}/>)
    const instance = wrapper.instance()
    instance.onItemEdit(3, 'xyz')
    expect(updateCategory.called).to.eql(true)
    expect(updateCategory.args[0][0]).to.eql({_id: 3, category: 'xyz'})
  })

  it('it\'s onItemEdit method calls props.updateCategory for a new name' , () => {
    const foods = [{_id: 3, category: 'abc'}]
    const updateCategory = sinon.spy()

    const wrapper = shallow(<FoodCategories {...props} foods={foods} updateCategory={updateCategory}/>)
    const instance = wrapper.instance()
    instance.onItemEdit(3, 'xyz')
    expect(updateCategory.called).to.eql(true)
    expect(updateCategory.args[0][0]).to.eql({_id: 3, category: 'xyz'})
  })

  it('it\'s onItemEdit method does not call props.updateCategory for an unchanged name' , () => {
    const foods = [{_id: 3, category: 'abc'}]
    const updateCategory = sinon.spy()

    const wrapper = shallow(<FoodCategories {...props} foods={foods} updateCategory={updateCategory}/>)
    const instance = wrapper.instance()
    instance.onItemEdit(3, 'abc')
    expect(updateCategory.called).to.eql(false)
  })

  it('it\'s onItemRemove method calls props.deleteCategory' , () => {
    const foods = [{_id: 3, category: 'abc'}]
    const deleteCategory = sinon.spy()

    const wrapper = shallow(<FoodCategories {...props} foods={foods} deleteCategory={deleteCategory}/>)
    const instance = wrapper.instance()
    instance.onItemRemove(3)
    expect(deleteCategory.called).to.eql(true)
    expect(deleteCategory.args[0][0]).to.eql(3)
  })

  describe('FoodCategories redux tests', function () {
    let reduxState
    let mockStore
    let categories

    beforeEach(() => {
      categories = [
        { _id: 100, category: "fruit", deleted: false, items: [] },
        { _id: 101, category: "vegetables", deleted: false, items: [] }
      ]

      const normalized = normalize(categories, arrayOfFoodCategories)

      reduxState = {
        entities: normalized.entities,
        food: {
          category: {
            ids: normalized.result,
            fetching: 11,
            saving: 12,
            fetchError: 13,
            saveError: 14
          }
        }
      }

      mockStore = {
        getState: () => reduxState,
        subscribe: () => {},
        dispatch: sinon.spy()
      }

    })

    it('props.foods is the same as the data from the redux store', () => {
      const wrapper = shallow(<ConnectedFoodCategories />, {context: {store: mockStore}})
      expect(wrapper.props().foods).to.eql(categories)
    })

    it('props.loadingFoods is the same as the data from the redux store', () => {
      const wrapper = shallow(<ConnectedFoodCategories />, {context: {store: mockStore}})
      expect(wrapper.props().loadingFoods).to.eql(11)
    })

    it('props.loadFoodsError is the same as the data from the redux store', () => {
      const wrapper = shallow(<ConnectedFoodCategories />, {context: {store: mockStore}})
      expect(wrapper.props().loadFoodsError).to.eql(13)
    })

    it('props.savingFoods is the same as the data from the redux store', () => {
      const wrapper = shallow(<ConnectedFoodCategories />, {context: {store: mockStore}})
      expect(wrapper.props().savingFoods).to.eql(12)
    })

    it('props.saveFoodsError is the same as the data from the redux store', () => {
      const wrapper = shallow(<ConnectedFoodCategories />, {context: {store: mockStore}})
      expect(wrapper.props().saveFoodsError).to.eql(14)
    })

    it ('dispatches the loadFoods action', () => {
      const wrapper = shallow(<ConnectedFoodCategories />, {context: {store: mockStore}})
      wrapper.props().loadFoods()
      const actualDispatchedAction = mockStore.dispatch.args[0][0]
      const expectedDispatchedAction = loadFoods()
      expect(actualDispatchedAction).to.eql(expectedDispatchedAction)
    })

    it ('props.createCategory dispatches the saveFood action', () => {
      const wrapper = shallow(<ConnectedFoodCategories />, {context: {store: mockStore}})
      wrapper.props().createCategory('abc')
      const actualDispatchedAction = mockStore.dispatch.args[0][0]
      const expectedDispatchedAction = saveFood({category: 'abc'})
      expect(actualDispatchedAction).to.eql(expectedDispatchedAction)
    })

    it ('props.updateCategory dispatches the saveFood action', () => {
      const wrapper = shallow(<ConnectedFoodCategories />, {context: {store: mockStore}})
      wrapper.props().updateCategory({_id: 1, cateogry: 'xyz'})
      const actualDispatchedAction = mockStore.dispatch.args[0][0]
      let expectedDispatchedAction = saveFood({_id: 1, cateogry: 'xyz'})
      // props.updateCategory changes the [CALL_API] schema property to responseSchema
      expectedDispatchedAction[CALL_API].responseSchema = expectedDispatchedAction[CALL_API].schema
      delete expectedDispatchedAction[CALL_API].schema
      expect(actualDispatchedAction).to.eql(expectedDispatchedAction)
    })

    it ('props.deleteCategory dispatches the deleteFood action', () => {
      const wrapper = shallow(<ConnectedFoodCategories />, {context: {store: mockStore}})
      wrapper.props().deleteCategory('1234')
      const actualDispatchedAction = mockStore.dispatch.args[0][0]
      const expectedDispatchedAction = deleteFood('1234')
      expect(actualDispatchedAction).to.eql(expectedDispatchedAction)
    })

  })
})
