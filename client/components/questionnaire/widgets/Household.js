import React from 'react'
import PropTypes from 'prop-types'
import {FieldArray} from 'redux-form'
import {withHandlers} from 'recompose'
import {Button} from 'react-bootstrap'

import HouseholdRow from './household/HouseholdRow'

const renderHousehold = withHandlers({
  handleDelete: ({fields}) => index => () => fields.remove(index),
  handleAdd: ({fields}) => () => fields.push()
})(({fields, handleDelete, handleAdd}) =>
  <div style={{padding: '10px'}}>
    <ul style={{paddingLeft: 0}}>
      {fields.map((dependent, i) =>
        <HouseholdRow
          key={i}
          dependent={dependent}
          showDelete={fields.length > 1}
          handleDelete={handleDelete(i)}
        />
      )}
    </ul>
    <div className="text-center">
      <Button onClick={handleAdd}>Add Dependant</Button>
    </div>
  </div>
)

const Household = ({className}) =>
  <div className={className}>
    <label style={{padding: '0 0 10px 10px'}}>
      Please list the members of your household
    </label>
    <FieldArray
      name="household"
      component={renderHousehold}
    />
  </div>

Household.propTypes = {
  className: PropTypes.string
}

export default Household
