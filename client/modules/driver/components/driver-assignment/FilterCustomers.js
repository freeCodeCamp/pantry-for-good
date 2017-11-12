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
    <optgroup>
      <option value="">All Customers</option>
      <option value="unassigned">Unassigned Customers</option>
    </optgroup>
    <optgroup label="Assigned Driver:">
      {drivers && drivers.map(driver =>
        <option key={driver._id} value={driver._id}>
          {driver.fullName}
        </option>
      )}
    </optgroup>
  </FieldGroup>

export default FilterCustomers
