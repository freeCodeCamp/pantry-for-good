import React from 'react'
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import Autosuggest from 'react-bootstrap-autosuggest'

import { Box, BoxHeader, BoxBody } from '../../../components/box'

export default class AddShiftModal extends React.Component {

  constructor(props) {
    super(props)

    var now = new Date()
    now.setHours(0,0,0,0)

    this.state = {
      formInputFields: {
        volunteerName: "",
        id: "",
        dateTime: "",
        startTime: "",
        duration: "",
        notes: ""
      },
      validInput: false,
      nowDate: now,
      touched: { volunteerName: false, dateTime: false}
    }
  }

  componentWillReceiveProps = nextProps => {
    // If the modal is open and a save is complete, close the modal
    if (this.props.saving && !nextProps.saving && !nextProps.saveError) {
      this.props.closeAddModal()
    }
  }  

  validate = () => {
    this.setState({ validInput: this.getValidationState.all()})
  }

  formatData = () => {
    return this.props.volunteers.map(volunteer => ({ ...volunteer, fullName: (volunteer.firstName + " " + volunteer.lastName)}))
  }

  handleChange = {
    volunteerName: value => {
      if (typeof value === 'object' && value !== null) {
        this.setState({formInputFields: {volunteerName: value.fullName, id: value._id}, touched: {...this.state.touched, volunteerName: true}})
      } else {
        this.setState({
          formInputFields: {
            ...this.state.formInputFields,
            volunteerName: ""
          },
          touched: { ...this.state.touched, volunteerName: true}
        }, this.validate)
      }
    },
    dateTime: e => {
      this.setState({formInputFields: {...this.state.formInputFields, dateTime: e.target.value}, touched: {...this.state.touched, dateTime: true}}, this.validate)
    },
    notes: e => {
      this.setState({formInputFields: {...this.state.formInputFields, notes: e.target.value}}, this.validate)
    }
  }

  getValidationState = {
    // The following 3 functions validate the individual input fields and return the validation state used for react-bootstrap-table
    volunteerName: () =>
      !this.state.touched.volunteerName || this.state.formInputFields.volunteerName.trim().length ? null : 'error',
    dateTime: () =>
      // No dates in the past
      !this.state.touched.dateTime || this.state.nowDate.getTime() < new Date(this.state.formInputFields.dateTime).getTime() ? null : 'error',
    all: () =>
      this.state.formInputFields.volunteerName.trim().length > 0 &&
      this.state.formInputFields.dateTime !== "" &&
      this.state.nowDate.getTime() < new Date(this.state.formInputFields.dateTime).getTime()
  }

  saveShift = () => {
    const volunteer = this.props.getVolunteer(this.state.formInputFields.id)
    var dateStr = this.state.formInputFields.dateTime

    this.props.makeShift({
      ...volunteer,
      shift: {
        role: volunteer.firstName,
        date: new Date(dateStr),
        duration: 2,
        notes: this.state.formInputFields.notes
      }
    })

    var event = {
      role: volunteer.firstName,
      date: new Date(dateStr),
      duration: 2,
      notes: this.state.formInputFields.notes
    }

    var temp_date = new Date(dateStr)
    var email_date = temp_date.toLocaleString('en-US')

    var temp_event = {
      date: email_date
    }

    // Used to send email
    if(volunteer.email == "" || volunteer.email == null) {
      alert("Volunteer has no email in database. Shift has been saved, but no email reminders will be sent.")
      this.props.updateCalendar(volunteer, event)
      this.props.closeAddModal()
    }
    else {
      var credentials = {
        email: volunteer.email,
        shift: temp_event
      }
      this.props.emailShift(credentials)
      this.props.updateCalendar(volunteer, event)
    }
  }       

  render = () => {
    return (
      <Box>
        <BoxHeader>
          Volunteer Scheduling
        </BoxHeader>
        <div id="test">
        </div>
        <BoxBody
          loading = {this.props.loading || this.props.saving}
          error={this.props.saveError}
          errorBottom={true}>

          <form>
            <FormGroup controlId="volunteerInput" validationState={this.getValidationState.volunteerName()} >
              <ControlLabel>Volunteer Name</ControlLabel>
              <Autosuggest
                value={this.state.formInputFields.volunteerName}
                datalist={this.formatData()}
                placeholder="Volunteer Name"
                maxLength='45'
                itemValuePropName='fullName'
                itemReactKeyPropName='fullName'
                itemSortKeyPropName='fullName'
                onSelect={this.handleChange.volunteerName}            
              />    
            </FormGroup>
            <FormGroup controlId="dateTime" validationState={this.getValidationState.dateTime()}>
              <ControlLabel>Date & Time</ControlLabel>
              <FormControl
                type="datetime-local"
                value={this.state.formInputFields.dateTime}
                onChange={this.handleChange.dateTime}
              />
            </FormGroup>              
            <FormGroup controlId="notesInput">
              <ControlLabel>Notes (Optional)</ControlLabel>
              <FormControl
                type="text"
                maxLength='250'
                value={this.state.formInputFields.notes}
                onChange={this.handleChange.notes}
              />
            </FormGroup>                         
          </form>
          <div className="pull-right btn-toolbar">
            <Button onClick={this.props.closeAddModal}>Cancel</Button>
            <Button className={this.state.validInput && 'btn-success'}
              onClick={this.saveShift}
              disabled={!this.state.validInput || this.props.saving}>
              Add Event
            </Button>
          </div> 
        </BoxBody>
      </Box>
    )
  }
}
