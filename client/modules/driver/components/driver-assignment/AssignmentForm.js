import React from 'react'

import {Box, BoxBody, BoxHeader} from '../../../../components/box'
import DriverSelector from './DriverSelector'
import CustomerSelector from './CustomerSelector'

const AssignmentForm = ({loading, error}) =>
  <Box className="assignForm">
    <BoxHeader heading="Assign Customers" />
    <BoxBody
      loading={loading}
      error={error}
    >
      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <DriverSelector />
        <CustomerSelector />
      </div>
    </BoxBody>
  </Box>

export default AssignmentForm
