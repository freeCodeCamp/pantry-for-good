import React from 'react'
import { shallow } from 'enzyme'
import NewCategory from './NewCategory'

describe('NewCategory', () => {

  it('sets initial state ', () => {
    const wrapper = shallow(<NewCategory />)
    expect(wrapper.state()).to.deep.equal({ inputFieldValue: "", categoryExists: false, validInput: false })
  })

  it('onChange() sets state.inputFieldValue', () => {
    const instance = shallow(<NewCategory doesCategoryExist={() => { }} />).instance()
    const e = { target: { value: 'abc' } }
    instance.onChange(e)
    expect(instance.state.inputFieldValue).to.equal('abc')
  })

  it('onChange() calls validate', () => {
    const instance = shallow(<NewCategory doesCategoryExist={() => { }} />).instance()
    sinon.spy(instance, "validate")
    const e = { target: { value: 'abc' } }
    instance.onChange(e)
    expect(instance.validate.called).to.be.true
  })

  it('onClick() calls props.createCategory() with state.inputFieldValue', () => {
    const props = {
      doesCategoryExist: () => { },
      createCategory: sinon.spy()
    }
    const instance = shallow(<NewCategory {...props} />).instance()
    instance.setState({ inputFieldValue: 'abc' })
    instance.onClick()
    expect(props.createCategory.called).to.be.true
    expect(props.createCategory.args[0][0]).to.eql('abc')
  })

  it('onClick() sets state back to initial values', () => {
    const props = {
      doesCategoryExist: () => { },
      createCategory: sinon.spy()
    }
    const instance = shallow(<NewCategory {...props} />).instance()
    instance.setState({ inputFieldValue: "a", validInput: true, categoryExists: true })
    instance.onClick()
    expect(instance.state).to.deep.eql({ inputFieldValue: "", validInput: false, categoryExists: false })
  })

  it('validate() sets state.validInput true when valid input and new category', () => {
    const props = {
      doesCategoryExist: () => false,
    }
    const instance = shallow(<NewCategory {...props} />).instance()
    instance.setState({ inputFieldValue: 'abc' })
    instance.validate()
    expect(instance.state.validInput).to.be.true
  })

  it('validate() sets state.validInput false when empty string', () => {
    const props = {
      doesCategoryExist: () => false,
    }
    const instance = shallow(<NewCategory {...props} />).instance()
    instance.setState({ inputFieldValue: "   " })
    instance.validate()
    expect(instance.state.validInput).to.be.false
  })

  it('validate() sets state.validInput false when category exists', () => {
    const props = {
      doesCategoryExist: () => true,
    }
    const instance = shallow(<NewCategory {...props} />).instance()
    instance.setState({ inputFieldValue: 'abc' })
    instance.validate()
    expect(instance.state.validInput).to.be.false
  })

  it('validate() sets state.categoryExists true when props.doesCategoryExist true', () => {
    const props = {
      doesCategoryExist: () => true,
    }
    const instance = shallow(<NewCategory {...props} />).instance()
    instance.validate()
    expect(instance.state.categoryExists).to.be.true
  })

  it('validate() sets state.categoryExists false when props.doesCategoryExist false', () => {
    const props = {
      doesCategoryExist: () => false,
    }
    const instance = shallow(<NewCategory {...props} />).instance()
    instance.validate()
    expect(instance.state.categoryExists).to.be.false
  })

  describe('render()', () => {

    it('Displays an input', () => {
      const wrapper = shallow(<NewCategory />)
      const input = wrapper.find('input')
      expect(input).to.have.length(1)
      expect(input.props().type).to.eql('text')
    })

    it('Displays a button', () => {
      const wrapper = shallow(<NewCategory />)
      const button = wrapper.find('button')
      expect(button).to.have.length(1)
    })

    it('Disables and enables button using state.validInput', () => {
      const wrapper = shallow(<NewCategory />)
      let button = wrapper.find('button')
      wrapper.setState({ validInput: false })
      expect(button.props().disabled).to.be.true
      wrapper.setState({ validInput: true })
      button = wrapper.find('button')
      expect(button.props().disabled).to.be.false
    })

    it('Typing in input sets the state.inputFieldValue', () => {
      const wrapper = shallow(<NewCategory doesCategoryExist={() => false} />)
      const input = wrapper.find('input')
      input.simulate('change', { target: { value: 'abc' } })
      expect(wrapper.state().inputFieldValue).to.equal('abc')
    })

    it('Calls props.createCategory with user input when button is clicked', () => {
      const props = {
        doesCategoryExist: () => { },
        createCategory: sinon.spy()
      }
      const wrapper = shallow(<NewCategory {...props} />)
      const input = wrapper.find('input')
      input.simulate('change', { target: { value: 'abc' } })
      wrapper.find('button').simulate('click')
      expect(props.createCategory.called).to.be.true
      expect(props.createCategory.args[0][0]).to.equal('abc')
    })

    it('Displays a message when a category exists', () => {
      const wrapper = shallow(<NewCategory />)
      wrapper.setState({ categoryExists: false })
      expect(wrapper.text()).to.not.contain('That category already exists')
      wrapper.setState({ categoryExists: true })
      expect(wrapper.text()).to.contain('That category already exists')
    })
  })
})
