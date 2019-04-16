import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-15'

import EditModal from './EditModal'

Enzyme.configure({adapter: new Adapter()})

describe('EditModal', () => {
  let props

  beforeEach(() => {
    props = {
      EditModal: [],
      loading: false,
      saving: false,
      closeEditModal: sinon.spy(),
      getVolunteer: sinon.spy(),
      deleteShift: sinon.spy(),
      deleteCalendarEvent: sinon.spy()
    }
  })

  it('sets state when constructed', () => {
    const wrapper = shallow(<EditModal {...props} />)
    expect(wrapper.state().delete).to.be.false
  })

  it('deleteCalendarEvent should call props.getVolunteer()', () => {
    const wrapper = shallow(<EditModal {...props} />)
    wrapper.setProps({shiftToDelete: {extendedProps: {volunteerId: 1}}})
    const instance = wrapper.instance()
    instance.deleteEvent()
    expect(instance.props.getVolunteer.called).to.be.true
  })

  it('deleteCalendarEvent should call props.deleteShift()', () => {
    const wrapper = shallow(<EditModal {...props} />)
    wrapper.setProps({shiftToDelete: {extendedProps: {volunteerId: 1}}})
    const instance = wrapper.instance()
    instance.deleteEvent()
    expect(instance.props.deleteShift.called).to.be.true
  })  

  it('deleteCalendarEvent should call props.deleteCalendarEvent()', () => {
    const wrapper = shallow(<EditModal {...props} />)
    wrapper.setProps({shiftToDelete: {extendedProps: {volunteerId: 1}}})
    const instance = wrapper.instance()
    instance.deleteEvent()
    expect(instance.props.deleteCalendarEvent.called).to.be.true
  })    


})
