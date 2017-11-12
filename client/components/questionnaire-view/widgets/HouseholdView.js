import React from 'react'
import PropTypes from 'prop-types'
import {Table} from 'react-bootstrap'
import {utc} from 'moment'

const HouseholdView = ({model, className}) =>
  <div className={className}>
    <Table striped bordered responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Relationship</th>
          <th>Date of Birth</th>
        </tr>
      </thead>
      <tbody>
        {model && model.household.map((dependant, i) =>
          <tr key={i}>
            <td>{dependant.name}</td>
            <td>{dependant.relationship}</td>
            <td>{utc(dependant.dateOfBirth).format('YYYY-MM-DD')}</td>
          </tr>
        )}
      </tbody>
    </Table>
  </div>

HouseholdView.propTypes = {
  model: PropTypes.shape({
    household: PropTypes.array.isRequired
  }),
  className: PropTypes.string
}

export default HouseholdView
