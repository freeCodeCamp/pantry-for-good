import React from 'react'

const labelMap = {
  'Accepted': 'success',
  'Rejected': 'danger',
  'Pending': 'info',
  'Inactive': 'warning'
}

const CustomerStatusLabel = ({customer}) =>
  <span className={`label label-${labelMap[customer.status]}`}>
    {customer.status}
  </span>

export default CustomerStatusLabel
