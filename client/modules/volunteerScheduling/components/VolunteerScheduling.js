import React from 'react'
import {connect} from 'react-redux'
import { Modal } from 'react-bootstrap'
import selectors from '../../../store/selectors'
import {Box, BoxBody} from '../../../components/box'

import { makeShift, updateShift, deleteShift, getAllVolunteers, emailShift } from '../../volunteer/reducer'

import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import interactionPlugin from '@fullcalendar/interaction'

import EditModal from './EditModal'
import AddShiftModal from './AddShiftModal'

import '@fullcalendar/core/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/bootstrap/main.css'

import {loadVolunteers} from '../../volunteer/reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import { clearFlags } from '../../food/reducers/item'


const mapStateToProps = state => ({
  volunteers: selectors.volunteer.getAll(state),
  getVolunteer: selectors.volunteer.getOne(state),
  loading: selectors.volunteer.loading(state),
  loadError: selectors.volunteer.loadError(state),
  saving: selectors.volunteer.saving(state),
  saveError: selectors.volunteer.saveError(state)
})

const mapDispatchToProps = dispatch => ({
  makeShift: volunteerId => dispatch(makeShift(volunteerId)),
  emailShift: credentials => dispatch(emailShift(credentials)),
  updateShift: shift => dispatch(updateShift(shift)),
  deleteShift: volunteer => dispatch(deleteShift(volunteer)),
  getAllVolunteers: () => dispatch(getAllVolunteers()),
  clearFlags: () => dispatch(clearFlags()),
  loadVolunteers: () => dispatch(loadVolunteers()),
  loadQuestionnaires: () => dispatch(loadQuestionnaires())
})

export class VolunteerScheduling extends React.Component {
  constructor(props) {
    super(props)
    this.props.loadVolunteers()
    this.state = {
      c: "",
      showAddModal: false,
      showEditModal: false,
      shiftToDelete: "",
      events: [],
      added: false,
      removed: false,
      moved: false,
      load: true
    }
  }

  componentDidMount() {
    // console.log("In componentDidMount")
    var calendarEl = document.getElementById('calendar')
    var calendar = new Calendar(calendarEl, {
      plugins: [ dayGridPlugin, bootstrapPlugin, interactionPlugin ],
      themeSystem: 'bootstrap',
      defaultView: 'dayGridMonth',
      editable: true,
      header: {
        center: 'addEventButton'
      },

      eventClick: info => {
        this.setState({showEditModal: true, shiftToDelete: info.event})
      },

      /* Triggered when dragging stops and the event has moved to a different day/time */
      eventDrop: info => {
        const volunteer = this.props.getVolunteer(info.event.extendedProps.volunteerId)
        this.setState({moved: true})
        this.props.updateShift({
          ...volunteer,
          times: {
            oldTime: new Date(info.oldEvent.start),
            newTime: new Date(info.event.start)
          }
        })
      },

      customButtons: {
        addEventButton: {
          text: 'Add Shift',
          click: () => {
            this.setState({showAddModal: true})
          }
        }
      }
    })
    calendar.render()
    this.setState({c: calendar})
  }  

  updateCalendar = (volunteer, event) => {
    const calendar = this.state.c

    var new_id = calendar.getEvents().length != 0 ? (calendar.getEvents()[calendar.getEvents().length-1].id + 1) : 0

    var temp = {
      id: new_id,
      title: volunteer.firstName + ' ' + volunteer.lastName,
      extendedProps: {volunteerId: volunteer._id, notes: event.notes},
      start: event.date      
    }
    var temp_events = this.state.events
    temp_events.push(temp)
    this.setState({events: temp_events, added: true})
  }

  deleteCalendarEvent = () => {
    var calendar = this.state.c

    /* Checking for case in which user adds an event and deletes it in same state */
    var sameState = false
    var events = this.state.events
    var delEvent = this.state.shiftToDelete

    for(var i = 0; i < events.length; i++) {
      if(events[i].id == delEvent.id) {
        var temp_event = calendar.getEventById(events[i].id)
        temp_event.remove()
        sameState = true
      }
    }

    if(sameState == false) {
      var event = calendar.getEventById(this.state.shiftToDelete.id)
      event.remove()
    }
    this.setState({showEditModal: false, removed: true})
  }

  /* If parameter "event" is provided, open the "Edit Modal", else open the "Add Modal" */
  openModal = event => () => {
    if(event) {
      this.setState({showEditModal: true, shiftToDelete: event})
    }
    else {
      this.setState({showAddModal: true})
    }
    this.props.clearFlags()
  }

  /* Closes the Add Modal */
  closeAddModal = () => {
    this.setState({showAddModal: false})
    this.props.clearFlags()
  }

  /* Closes the Edit Modal */
  closeEditModal = () => {
    this.setState({showEditModal: false})
    this.props.clearFlags()
  }

  // Returns true if all prev and new volunteers have sam eshift length
  countShifts = (v1, v2) => {
    for(var i = 0; i < v1.length; i++) {
      var shift1 = v1[i].shift
      var shift2 = v2[i].shift

      if(shift1.length != shift2.length) {
        return false
      }
    }
    return true
  }

  /* Used to determine if there is a difference b/w the previous volunteer shifts and the volunteer shifts 
  ** True if theres a difference
  */
  difference = (v1, v2) => {
    if(this.countShifts(v1, v2) == false) {
      return true
    }

    for(var i = 0; i < v1.length; i++) {
      for(var j = 0; j < v1[i].shift.length; j++) {
        var date1 = new Date(v1[i].shift[j].date)
        var date2 = new Date(v2[i].shift[j].date)

        if(date1.getTime() !== date2.getTime()) {
          return true
        }
      }
    }
    return false
  }

  componentDidUpdate(prevProps) {
    // console.log("In componentDidUpdate")

    const calendar = this.state.c 

    if(prevProps.volunteers.length != this.props.volunteers.length) {
      //console.log("prevProps.volunteers.length != this.props.volunteers.length")
      /* Removes all events from calendar */
      const events = calendar.getEvents()
      for(var x = 0; x < events.length; x++) {
        calendar.getEventById(events[x].id).remove()
      }

      /* Re-renders all events on calendar */
      var volunteers = this.props.volunteers
      var id_num = 0
      for(var i = 0; i < volunteers.length; i++) {
        var shift = volunteers[i].shift

        for(var j = 0; j < shift.length; j++) {
          calendar.addEvent({
            id: id_num,
            title: volunteers[i].firstName + ' ' + volunteers[i].lastName,
            extendedProps: {volunteerId: volunteers[i]._id, notes: shift[j].notes},
            start: new Date(shift[j].date)
          })
          id_num++
        }
      } 
    }
    else if(this.state.added == true) {
      var num = this.state.events.length - 1
      calendar.addEvent({
        id: this.state.events[num].id,
        title: this.state.events[num].title,
        extendedProps: this.state.events[num].extendedProps,
        start: this.state.events[num].start
      })
      this.setState({added: false}) 
    }
    //else if(this.countShifts(this.props.volunteers) != this.countShifts(prevProps.volunteers) && this.state.removed == false) {
    else if(this.difference(this.props.volunteers, prevProps.volunteers) == true && this.state.removed == false && this.state.moved == false) {
      //console.log("this.countShifts(this.props.volunteers) != this.countShifts(prevProps.volunteers)")
      /* Removes all events from calendar */
      const events = calendar.getEvents()
      for(var q = 0; q < events.length; q++) {
        calendar.getEventById(events[q].id).remove()
      }

      var id_num1 = 0
      /* Re-renders all events on calendar */
      var volunteers1 = this.props.volunteers
      for(var z = 0; z < volunteers1.length; z++) {
        var shift1 = volunteers1[z].shift

        for(var w = 0; w < shift1.length; w++) {
          calendar.addEvent({
            id: id_num1,
            title: volunteers1[z].firstName + ' ' + volunteers1[z].lastName,
            extendedProps: {volunteerId: volunteers1[z]._id, notes: shift1[w].notes},
            start: new Date(shift1[w].date)
          })
          id_num1++
        }
      }
    }
    else if(this.state.load == true) {
      //console.log("this.state.load == true")
      var volunteers2 = this.props.volunteers
      var id_num2 = 0
      for(var i1 = 0; i1 < volunteers2.length; i1++) {
        var shift2 = volunteers2[i1].shift

        for(var j1 = 0; j1 < shift2.length; j1++) {
          calendar.addEvent({
            id: id_num2,
            title: volunteers2[i1].firstName + ' ' + volunteers2[i1].lastName,
            extendedProps: {volunteerId: volunteers2[i1]._id, notes: shift2[j1].notes},
            start: new Date(shift2[j1].date)
          })
          id_num2++
        }
      }   
      this.setState({load: false})  
    }
  }


  render = () => {
    const {loading, loadError} = this.props
    return (
      <Box>
        <BoxBody
          loading={loading}
          error={loadError}>
          <div id="calendar"></div>
        </BoxBody>
        <Modal show={this.state.showAddModal} onHide={this.closeAddModal}>
          <AddShiftModal
            loading={this.props.loading}
            saving={this.props.saving}
            saveError={this.props.saveError}
            emailShift={this.props.emailShift}
            closeAddModal={this.closeAddModal}
            volunteers={this.props.volunteers}
            makeShift={this.props.makeShift}
            getVolunteer={this.props.getVolunteer}
            updateCalendar={this.updateCalendar}
            getAllVolunteers={this.props.getAllVolunteers}
          />
        </Modal>   
        <Modal show={this.state.showEditModal} onHide={this.closeEditModal}>
          <EditModal
            loading={this.props.loading}
            saving={this.props.saving}
            saveError={this.props.saveError}
            closeEditModal={this.closeEditModal}
            shiftToDelete={this.state.shiftToDelete}
            deleteShift={this.props.deleteShift}
            getVolunteer={this.props.getVolunteer}
            deleteCalendarEvent={this.deleteCalendarEvent}
          />
        </Modal>               
      </Box>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VolunteerScheduling)