import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-15'

import AddShiftModal from './AddShiftModal'

Enzyme.configure({adapter: new Adapter()})

describe('AddShiftModal', () => {
  let props

  beforeEach(() => {
    props = {
      AddShiftModal: [],
      loading: false,
      saving: false,
      volunteers: [],
      getVolunteer: sinon.spy(),
      emailShift: sinon.spy(),
      closeAddModal: sinon.spy(),
      makeShift: sinon.spy(),
      updateCalendar: sinon.spy()
    }
  })

  it('sets state when constructed', () => {
    const wrapper = shallow(<AddShiftModal {...props} />)
    expect(wrapper.state().formInputFields).to.deep.equal({volunteerName: "",
      id: "",
      dateTime: "",
      startTime: "",
      duration: "",
      notes: ""
    })  
    expect(wrapper.state().validInput).to.be.false
    expect(wrapper.state().touched).to.deep.equal({volunteerName: false, dateTime: false})
  })

  it('componentWillReceiveProps closes modal if a save is complete', () => {
    const wrapper = shallow(<AddShiftModal {...props} />)
    wrapper.setProps({ saving: true })
    const nextProps = {
      saving: false,
      saveError: undefined
    }
    expect(props.closeAddModal.called).to.be.false
    wrapper.setProps(nextProps)
    expect(props.closeAddModal.called).to.be.true
  })  

  it('componentWillReceiveProps will not close a modal if in process of saving', () => {
    const wrapper = shallow(<AddShiftModal {...props} />)
    wrapper.setProps({ saving: false })
    const nextProps = {
      saving: true
    }
    wrapper.setProps(nextProps)
    expect(props.closeAddModal.called).to.be.false
  })  

  it('componentWillReceiveProps will not close a modal if there is a save error', () => {
    const wrapper = shallow(<AddShiftModal {...props} />)
    wrapper.setProps({ saving: true })
    const nextProps = {
      saving: false,
      saveError: { message: 'error' }
    }
    wrapper.setProps(nextProps)
    expect(props.closeAddModal.called).to.be.false
  })  

  describe('getValidationState', () => {
    it('volunteerName() returns null for a valid name', () => {
      const wrapper = shallow(<AddShiftModal {...props} />)
      const instance = wrapper.instance()
      instance.setState({ formInputFields: { volunteerName: 'abc' } })
      expect(instance.getValidationState.volunteerName()).to.be.null
    })

    it('volunteerName() returns error for an empty string', () => {
      const wrapper = shallow(<AddShiftModal {...props} />)
      const instance = wrapper.instance()
      instance.setState({ formInputFields: { volunteerName: '' }, touched: { volunteerName: true } })
      expect(instance.getValidationState.volunteerName()).to.equal('error')
    })    

    it('volunteerName() returns error for a whitespace string', () => {
      const wrapper = shallow(<AddShiftModal {...props} />)
      const instance = wrapper.instance()
      instance.setState({ formInputFields: { volunteerName: ' ' }, touched: { volunteerName: true } })
      expect(instance.getValidationState.volunteerName()).to.equal('error')
    })

    it('getAll() returns true when VolunteerName and dateTime are all valid', () => {
      const wrapper = shallow(<AddShiftModal {...props} />)
      const instance = wrapper.instance()
      const state = {
        formInputFields: { volunteerName: 'abc', dateTime: "04/20/2019"  },
        touched: { volunteerName: true, dateTime: true }
      }
      instance.setState(state)
      expect(instance.getValidationState.all()).to.be.true
    })        

    it('getAll() returns false when VolunteerName or dateTime are not valid', () => {
      const wrapper = shallow(<AddShiftModal {...props} />)
      const instance = wrapper.instance()
      const state = {
        formInputFields: { volunteerName: '', dateTime: "04/20/2019"  },
        touched: { volunteerName: true, dateTime: true }
      }
      instance.setState(state)
      expect(instance.getValidationState.all()).to.be.false
    })    
  })

  describe('handleChange', () => {
    it('volunteerName() when called with a string sets state.formInputFields.volunteerName to blank', () => {
      const wrapper = shallow(<AddShiftModal {...props} />)
      const instance = wrapper.instance()
      instance.handleChange.volunteerName('abcde')
      expect(instance.state.formInputFields.volunteerName).to.equal('')
    })    

    it('volunteerName() when called with a string sets state.touched.volunteerName to true', () => {
      const wrapper = shallow(<AddShiftModal {...props} />)
      const instance = wrapper.instance()
      instance.handleChange.volunteerName('abcde')
      expect(instance.state.touched.volunteerName).to.equal(true)
    })  

    it('volunteerName() when called with an object sets state.formInputFields.volunteerName to name', () => {
      const wrapper = shallow(<AddShiftModal {...props} />)
      const instance = wrapper.instance()
      const vol = {
        fullName: "Samuel Freiberg",
        _id: 1
      }
      instance.handleChange.volunteerName(vol)
      expect(instance.state.formInputFields.volunteerName).to.equal("Samuel Freiberg")
    })     

    it('volunteerName() when called with an object sets state.touched.volunteerName to true', () => {
      const wrapper = shallow(<AddShiftModal {...props} />)
      const instance = wrapper.instance()
      const vol = {
        fullName: "Samuel Freiberg",
        _id: 1
      }
      instance.handleChange.volunteerName(vol)
      expect(instance.state.touched.volunteerName).to.equal(true)
    })     

    it('volunteerName() when called with a string calls validate()', () => {
      const wrapper = shallow(<AddShiftModal {...props} />)
      const instance = wrapper.instance()
      sinon.spy(instance, "validate")
      instance.handleChange.volunteerName("")
      expect(instance.validate.called).to.be.true
    })    

    it('dateTime() when called with a string sets state.formInputFields.dateTime to the string', () => {
      const wrapper = shallow(<AddShiftModal {...props} />)
      const instance = wrapper.instance()
      const date = {
        target: {
          value: "04/14/2019"
        }
      }
      instance.handleChange.dateTime(date)
      expect(instance.state.formInputFields.dateTime).to.equal('04/14/2019')
    })

    it('dateTime() when called sets state.touched.dateTime to true', () => {
      const wrapper = shallow(<AddShiftModal {...props} />)
      const instance = wrapper.instance()
      const date = {
        target: {
          value: "04/14/2019"
        }
      }
      instance.handleChange.dateTime(date)
      expect(instance.state.touched.dateTime).to.equal(true)
    }) 

    it('dateTime() when called calls validate()', () => {
      const wrapper = shallow(<AddShiftModal {...props} />)
      const instance = wrapper.instance()
      sinon.spy(instance, "validate")
      const date = {
        target: {
          value: "04/14/2019"
        }
      }      
      instance.handleChange.dateTime(date)
      expect(instance.validate.called).to.be.true
    })          

    it('notes() when called with a string sets state.formInputFields.notes to the string', () => {
      const wrapper = shallow(<AddShiftModal {...props} />)
      const instance = wrapper.instance()
      const note = {
        target: {
          value: "Hello"
        }
      }
      instance.handleChange.notes(note)
      expect(instance.state.formInputFields.notes).to.equal('Hello')
    })

    it('notes() when called calls validate()', () => {
      const wrapper = shallow(<AddShiftModal {...props} />)
      const instance = wrapper.instance()
      sinon.spy(instance, "validate")
      const note = {
        target: {
          value: "Hello"
        }
      }
      instance.handleChange.notes(note)
      expect(instance.validate.called).to.be.true
    })    
  })
})
