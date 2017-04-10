import React from 'react'
import {Label} from 'react-bootstrap'

const labelMap = {
  'Accepted': 'success',
  'Active': 'success',
  'Rejected': 'danger',
  'Pending': 'info',
  'Inactive': 'warning'
}

const ClientStatusLabel = ({client}) => {
  const labelClass = client.driver ? 'info' : labelMap[client.status]
  return (
    <Label bsStyle={labelClass}>
      {client.driver ? 'Driver' : client.status}
    </Label>
  )
}

export default ClientStatusLabel
