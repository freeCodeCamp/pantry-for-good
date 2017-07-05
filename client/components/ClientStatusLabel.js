import React from 'react'
import {Label} from 'react-bootstrap'
import {get} from 'lodash'

import {volunteerRoles} from '../../common/constants'

const labelMap = {
  'Accepted': 'success',
  'Active': 'success',
  'Rejected': 'danger',
  'Pending': 'info',
  'Inactive': 'warning'
}

const ClientStatusLabel = ({client}) => {
  const driver = get(client, 'user.roles', []).find(r => r === volunteerRoles.DRIVER)
  const labelClass = driver ? 'info' : labelMap[client.status]
  return (
    <Label bsStyle={labelClass}>
      {driver ? 'Driver' : client.status}
    </Label>
  )
}

export default ClientStatusLabel
