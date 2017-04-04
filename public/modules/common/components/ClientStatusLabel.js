import React from 'react'

const labelMap = {
  'Accepted': 'success',
  'Active': 'success',
  'Rejected': 'danger',
  'Pending': 'info',
  'Inactive': 'warning'
}

const ClientStatusLabel = ({client}) =>
  <span
    className={`label label-${client.driver ? 'info' : labelMap[client.status]}`}
  >
    {client.driver ? 'Driver' : client.status}
  </span>

export default ClientStatusLabel
