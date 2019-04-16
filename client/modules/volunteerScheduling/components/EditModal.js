import React from 'react'
import { Button } from 'react-bootstrap'

import { Box, BoxHeader, BoxBody } from '../../../components/box'

export default class EditModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      delete: false
    }
  }

  deleteEvent = () => {
    const id = this.props.shiftToDelete.extendedProps.volunteerId
    const volunteer = this.props.getVolunteer(id)
    this.props.deleteShift({
      ...volunteer,
      del_shift: {
        start: this.props.shiftToDelete.start
      }
    })
    this.props.deleteCalendarEvent()
  }

  render = () => {
    return (
      <Box>
        <BoxHeader>
          <p><strong>Volunteer Name: </strong><span id="vName">{this.props.shiftToDelete.title}</span></p>
          <p><strong>Start Time: </strong><span id="vName">{this.props.shiftToDelete.start.toLocaleString('en-US')}</span></p>
          <p><strong>Notes: </strong><span id="vName">{this.props.shiftToDelete.extendedProps.notes}</span></p>
        </BoxHeader>
        <BoxBody
          loading={this.props.loading || this.props.saving}
          error={this.props.saveError}
          errorBottom={true}>

          <div className="pull-right btn-toolbar">
            <Button onClick={this.props.closeEditModal}>Cancel</Button>
            <Button className='btn-success'
              onClick={this.deleteEvent}>Delete
            </Button>
          </div> 
        </BoxBody>
      </Box>
    )
  }
}