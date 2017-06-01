import React from 'react'

import {FieldGroup} from '../../../../components/form'

const FilterCustomers = ({
  drivers,
  filter,
  handleFilterChange
}) =>
  <FieldGroup
    type="select"
    value={filter}
    onChange={handleFilterChange}
    style={{flexGrow: 1}}
  >
    <option value="">All Customers</option>
    <option value="unassigned">Unassigned Customers</option>
    <option disabled style={{fontSize: '1px'}}>{' '}</option>
    <option disabled style={{fontSize: '12px', color: '#aaa'}}>Assigned Driver:</option>
    {drivers && drivers.map(driver =>
      <option key={driver.id} value={driver.id}>
        {driver.fullName}
      </option>
    )}
  </FieldGroup>

export default FilterCustomers
