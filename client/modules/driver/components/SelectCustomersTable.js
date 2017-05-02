import React from 'react'
import {Checkbox, Table} from 'react-bootstrap'

const SelectCustomersTable = ({customers, isSelected, handleSelect, filter}) => {
  const filteredCustomers = customers && customers.filter(customer => {
    if (filter === 'any') return true
    if (filter === 'unassigned') return !customer.assignedTo
    return customer.assignedTo && customer.assignedTo.id === filter
  })
  return (
    <Table responsive striped>
      <thead>
        <tr>
          <th></th>
          <th>Customer ID</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        {filteredCustomers.map((customer, i) =>
          <tr
            key={i}
            className={isSelected(customer) ? 'active' : ''}
            onClick={handleSelect(customer)}
          >
            <td>
              <Checkbox
                checked={isSelected(customer)}
              />
            </td>
            <td><span>{customer.id}</span></td>
            <td><span>
              {getAddress(customer)}
            </span></td>
          </tr>
        )}
        {!filteredCustomers.length &&
          <tr>
            <td className="text-center" colSpan="4">No matching customers.</td>
          </tr>
        }
      </tbody>
    </Table>
  )
}

export default SelectCustomersTable

function getAddress(customer) {
  return customer.fields.filter(field =>
      field.meta && field.meta.type === 'address')
    .map(field => field.value)
    .join(', ')
}
