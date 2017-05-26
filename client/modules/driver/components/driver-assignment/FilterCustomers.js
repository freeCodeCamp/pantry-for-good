import React from 'react'

import {FieldGroup} from '../../../../components/form'

const FilterCustomers = ({
  filter,
  handleFilterChange,
  drivers
}) =>
  <FieldGroup
    type="select"
    value={filter}
    onChange={handleFilterChange}
  >
    <option value="">Filter Customers</option>
    <option value="unassigned">Unassigned</option>
    {drivers && drivers.map(driver =>
      <option key={driver.id} value={driver.id}>
        {driver.fullName}
      </option>
    )}
  </FieldGroup>

export default FilterCustomers
