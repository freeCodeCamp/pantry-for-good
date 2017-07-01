import React from 'react'
import {Col, Row} from 'react-bootstrap'

import {Box, BoxBody, BoxHeader} from '../../../components/box'
import {RFFieldGroup} from '../../../components/form'

const Keys = () =>
  <Box>
    <BoxHeader heading="API Keys" />
    <BoxBody>
      <Row>
        <Col lg={6}>
          <RFFieldGroup
            name="gmapsApiKey"
            label="Google Maps API Key"
          />
        </Col>
        <Col lg={6}>
          <RFFieldGroup
            name="gmapsClientId"
            label="Google Maps Client ID"
          />
        </Col>
      </Row>
    </BoxBody>
  </Box>

export default Keys
