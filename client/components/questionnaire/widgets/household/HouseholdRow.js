import React from 'react'
import PropTypes from 'prop-types'
import {Button} from 'react-bootstrap'

import {RFFieldGroup} from '../../../form'

const inputStyle = {
  flexGrow: 1,
  margin: '10px 10px'
}

const buttonStyle = {
  margin: '10px 0',
  height: '34px'
}

const HouseholdRow = ({dependent, showDelete, handleDelete}) =>
  <li style={{display: 'flex', flexWrap: 'nowrap'}}>
    <div style={{display: 'flex', flexGrow: 1}}>
      <RFFieldGroup
        name={`${dependent}.name`}
        type="text"
        placeholder={'Name'}
        style={inputStyle}
      />
      <RFFieldGroup
        name={`${dependent}.relationship`}
        type="text"
        placeholder={'Relationship'}
        style={inputStyle}
      />
      <RFFieldGroup
        name={`${dependent}.dateOfBirth`}
        type="date"
        placeholder={'Date of Birth'}
        style={inputStyle}
      />
    </div>
    {showDelete &&
      <Button
        style={buttonStyle}
        onClick={handleDelete}
      >
        <i className="fa fa-trash" />
      </Button>
    }
  </li>

HouseholdRow.propTypes = {
  dependent: PropTypes.string,
  showDelete: PropTypes.bool,
  handleDelete: PropTypes.func.isRequired
}

export default HouseholdRow

