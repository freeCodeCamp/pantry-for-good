import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-15'

import { VolunteerScheduling } from './VolunteerScheduling'

Enzyme.configure({adapter: new Adapter()})

describe('VolunteerScheduling', () => {
  let props

  beforeEach(() => {
    props = {
      volunteers: [],
      clearFlags: sinon.spy(),
      loadVolunteers: sinon.spy()
    }
  })

  it('sets state when constructed', () => {
    const wrapper = shallow(<VolunteerScheduling {...props} />)
    expect(wrapper.state().showAddModal).to.be.false
    expect(wrapper.state().showEditModal).to.be.false
    expect(wrapper.state().shiftToDelete).to.equal("")
    expect(wrapper.state().added).to.be.false
    expect(wrapper.state().removed).to.be.false
    expect(wrapper.state().moved).to.be.false                     
  })

  it('should set calendar to the calendar object', () => {
    const wrapper = shallow(<VolunteerScheduling {...props} />)
    expect(wrapper.state().c).to.not.equal("")
  })

  it('updateCalendar add event to state and sets added to true', () => {
    const wrapper = shallow(<VolunteerScheduling {...props} />)
    const instance = wrapper.instance()
    instance.setState({events: [] })

    const volunteer = {firstName: "Samuel", lastName: "Freiberg", _id: 1}
    const event = {date: "04/12/2019T00:00:00", notes: "Test"}

    instance.updateCalendar(volunteer, event)
    expect(instance.state.events.length).to.equal(1)
  })

  it('openModal sets showAddModal to true', () => {
    const wrapper = shallow(<VolunteerScheduling {...props} />)
    const instance = wrapper.instance()
    instance.openModal()()
    expect(instance.state.showAddModal).to.be.true   
  })

  it('openModal sets showEditModal to true and shiftToDelete to event param', () => {
    const wrapper = shallow(<VolunteerScheduling {...props} />)
    const instance = wrapper.instance()

    var event = {
      date: "04/12/2019T00:00:00", 
      notes: "Test"
    }

    instance.openModal(event)()
    expect(instance.state.showEditModal).to.be.true   
    expect(instance.state.shiftToDelete).to.deep.equal({ date: "04/12/2019T00:00:00", notes: "Test" })
  }) 

  it('openModal calls props.clearFlags', () => {
    const wrapper = shallow(<VolunteerScheduling {...props} />)
    const instance = wrapper.instance()
    instance.openModal()()
    expect(instance.props.clearFlags.called).to.be.true    
  }) 

  it('closeAddModal sets showAddModal to false', () => {
    const wrapper = shallow(<VolunteerScheduling {...props} />)
    const instance = wrapper.instance()
    instance.closeAddModal()
    expect(instance.state.showAddModal).to.be.false
  })

  it('closeAddModal calls props.clearFlags', () => {
    const wrapper = shallow(<VolunteerScheduling {...props} />)
    const instance = wrapper.instance()
    instance.closeAddModal()
    expect(instance.props.clearFlags.called).to.be.true  
  })  

  it('closeEditModal sets showEditModal to false', () => {
    const wrapper = shallow(<VolunteerScheduling {...props} />)
    const instance = wrapper.instance()
    instance.closeEditModal()
    expect(instance.state.showEditModal).to.be.false
  })

  it('closeEditModal calls props.clearFlags', () => {
    const wrapper = shallow(<VolunteerScheduling {...props} />)
    const instance = wrapper.instance()
    instance.closeEditModal()
    expect(instance.props.clearFlags.called).to.be.true  
  })    

  it('countShifts returns true if params have same length', () => {
    const wrapper = shallow(<VolunteerScheduling {...props} />)
    const instance = wrapper.instance()

    var shift1 = ["1", "2"]
    var shift12 = ["1", "2", "3"]
    var shift2 = ["1", "2"]
    var shift22 = ["1", "2", "3"]   

    var shifts1 = []
    shifts1.push(shift1)
    shifts1.push(shift12)

    var shifts2 = []
    shifts2.push(shift2)
    shifts2.push(shift22)

    var volunteer1 = { shift: shifts1} 
    var volunteer2 = { shift: shifts2}

    var v1 = []
    v1.push(volunteer1)
    var v2 = []
    v2.push(volunteer2)

    expect(instance.countShifts(v1, v2)).to.equal(true)
  })

  it('countShifts returns false if params have diff length', () => {
    const wrapper = shallow(<VolunteerScheduling {...props} />)
    const instance = wrapper.instance()

    var shift1 = ["1", "2"]
    var shift12 = ["1", "2", "3", "4"]
    var shift13 = ["1", "2", "3", "4"]
    var shift2 = ["1", "2"]
    var shift22 = ["1", "2", "3"]   

    var shifts1 = []
    shifts1.push(shift1)
    shifts1.push(shift12)
    shifts1.push(shift13)

    var shifts2 = []
    shifts2.push(shift2)
    shifts2.push(shift22)

    var volunteer1 = { shift: shifts1} 
    var volunteer2 = { shift: shifts2}

    var v1 = []
    v1.push(volunteer1)
    var v2 = []
    v2.push(volunteer2)

    expect(instance.countShifts(v1, v2)).to.be.false
  })  
})
