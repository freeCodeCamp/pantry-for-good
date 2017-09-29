import React from 'react'
import { shallow } from 'enzyme'

import CategoryComponent from './Category'

describe('Category Class', () => {
  let props
  let shallowCategory
  const Category = () => {
    if (!shallowCategory) {
      shallowCategory = shallow(
        <CategoryComponent {...props} />
      )
    }
    return shallowCategory
  }

  beforeEach(() => {
    props = {
      key: '12345',
      id: '12345',
      category: 'Meat',
      onItemEdit: sinon.spy(),
      onItemRemove: sinon.spy(),
    }
  })

  it('sets state when constructed', () => {
    const category = Category()
    expect(category.state().showEdit).to.equal(false)
    expect(category.state().editedName).to.equal(props.category)
  })
  describe('When in View mode', () => {
    it('shows the category', () => {

    })
    it('shows an Edit button', () => {

    })
    it('changes to Edit mode when edit button clicked', () => {

    })
    it('shows a Delete button', () => {

    })
    it('calls props.onItemRemove when delete button clicked', () => {

    })
    it('calls props.onItemRemove with props.id', () => {

    })
  })
  describe('When in Edit mode', () => {
    let editCategory
    beforeEach(() => {
      editCategory = Category()
      editCategory.setState({ showEdit: true })
    })
    it('has an edit field that shows the category', () => {
      // const category = Category()
      // category.setState({ showEdit: true })
      const editField = editCategory.find('input')
      expect(editField).to.have.length(1)
      expect(editField.props().value).to.equal(props.category)
    })
    it('has a save button', () => {
      // const category = Category()
      // category.setState({ showEdit: true })
      const saveButton = editCategory.find('button')
      expect(saveButton).to.have.length(1)
    })
    it.skip('calls props.onItemEdit when save button is clicked', () => {
      editCategory.setProps({ onItemEdit: sinon.spy()})
      editCategory.find('button').simulate('click', { preventDefault() {} })
      // console.log(editCategory.props())
      // expect(props.onItemEdit.called).to.equal(true)
      expect(editCategory.props().onItemEdit.called).to.equal(true)
    })
    it('calls props.onItemEdit with the id and value in state', () => {

    })
  })
})

/**
* Need to test props:
*   key
*   id
*   category
*   onItemEdit
*   onItemRemove
*
*
**/
