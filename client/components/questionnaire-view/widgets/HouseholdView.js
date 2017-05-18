import React from 'react'
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

export default HouseholdView
