import React from 'react'
import { shallow } from 'enzyme'

import Category from './Category'

describe('Category Class', () => {
  let props

  beforeEach(() => {
    props = {
      key: '12345',
      id: '12345',
      category: 'Meat',
      onItemEdit: () => {},
      onItemRemove: () => {},
    }
  })

  it('sets state when constructed', () => {
    const category = shallow(<Category {...props} />)
    expect(category.state().showEdit).to.equal(false)
    expect(category.state().editedName).to.equal(props.category)
  })

  describe('When in View mode', () => {
    it('shows the category', () => {
      const category = shallow(<Category {...props} />)
      const categoryFields = category.find('span')
      expect(categoryFields.nodes[0].props.children).to.equal(props.category)
    })

    it('shows an Edit button', () => {
      const category = shallow(<Category {...props} />)
      const button = category.find('.fa-edit')
      expect(button).to.have.length(1)
    })

    it('changes to Edit mode when edit button clicked', () => {
      const category = shallow(<Category {...props} />)
      const button = category.find('.fa-edit')
      button.simulate('click')
      expect(category.state().showEdit).to.equal(true)
    })

    it('shows a Delete button', () => {
      const category = shallow(<Category {...props} />)
      const button = category.find('.fa-trash-o')
      expect(button).to.have.length(1)
    })

    it('calls props.onItemRemove when delete button clicked', () => {
      const category = shallow(<Category {...props} />)
      const onItemRemoveSpy = sinon.spy()
      category.setProps({ onItemRemove: onItemRemoveSpy })
      category.find('.fa-trash-o').simulate('click')
      expect(onItemRemoveSpy.called).to.equal(true)
    })

    it('calls props.onItemRemove with props.id', () => {
      const category = shallow(<Category {...props} />)
      const onItemRemoveSpy = sinon.spy()
      category.setProps({ onItemRemove: onItemRemoveSpy })
      category.find('.fa-trash-o').simulate('click')
      expect(onItemRemoveSpy.calledWith(props.id)).to.equal(true)
    })
  })

  describe('When in Edit mode', () => {
    let editCategory

    beforeEach(() => {
      editCategory = shallow(<Category {...props} />)
      editCategory.setState({ showEdit: true })
    })

    it('has an edit field that shows the category', () => {
      const editField = editCategory.find('input')
      expect(editField).to.have.length(1)
      expect(editField.props().value).to.equal(props.category)
    })

    it('has a save button', () => {
      const saveButton = editCategory.find('button')
      expect(saveButton).to.have.length(1)
    })

    it('calls props.onItemEdit when save button is clicked', () => {
      const onItemEditSpy = sinon.spy()
      editCategory.setProps({ onItemEdit: onItemEditSpy })
      editCategory.find('button').simulate('click')
      expect(onItemEditSpy.called).to.equal(true)
    })

    it('calls props.onItemEdit with the id and editedName', () => {
      const onItemEditSpy = sinon.spy()
      editCategory.setProps({ onItemEdit: onItemEditSpy })
      editCategory.setState({ editedName: 'New Value' })
      editCategory.find('button').simulate('click')
      expect(onItemEditSpy.calledWith(props.id, 'New Value')).to.equal(true)
    })

    it('turns off edit mode when "Enter" is pressed inside edit field', () => {
      editCategory.find('input').simulate('keyDown', { key: "Enter"})
      expect(editCategory.state().showEdit).to.equal(false)
    })

    it('calls props.onItemEdit when "Enter" is pressed inside edit field', () => {
      const onItemEditSpy = sinon.spy()
      editCategory.setProps({ onItemEdit: onItemEditSpy })
      editCategory.find('input').simulate('keyDown', { key: "Enter"})
      expect(onItemEditSpy.called).to.equal(true)
    })

    it('turns off edit mode when "Escape" is pressed inside edit field', () => {
      editCategory.find('input').simulate('keyDown', { key: "Escape" })
      expect(editCategory.state().showEdit).to.equal(false)
    })

    it('resets edited name when "Escape" is pressed inside edit field', () => {
      const input = editCategory.find('input')
      input.simulate('change', { target: { value: 'New Editeded Value'}})
      input.simulate('keyDown', { key: "Escape" })
      expect(editCategory.state().editedName).to.equal(props.category)
    })

    it('moveCurosr sets e.target.value back to the original value', () => {
      const instance = editCategory.instance()
      let e = { target: { value: 'abc' } }
      instance.moveCursor(e)
      expect(e).to.eql({ target: { value: 'abc' } })
    })

  })
})
