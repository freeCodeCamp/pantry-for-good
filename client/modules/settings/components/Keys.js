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
      <Row>
        <Col lg={4}>
          <RFFieldGroup
            name="keys.mailService"
            label="Mail Service"
            type="select"
          >
            <option label="Select an email service" value="" />
            <option label="SendPulse" value="SendPulse" />
            <option label="SES-US-EAST-1" value="SES-US-EAST-1" />
            <option label="SES-US-WEST-2" value="SES-US-WEST-2" />
            <option label="SES-EU-WEST-1" value="SES-EU-WEST-1" />
            <option label="Zoho" value="Zoho" />
          </RFFieldGroup>
        </Col>
        <Col lg={4}>
          <RFFieldGroup
            name="keys.mailUsername"
            label="Username/Email"
            type="email"
          />
        </Col>
        <Col lg={4}>
          <RFFieldGroup
            name="keys.mailPassword"
            label="Password"
            type="password"
          />
        </Col>
      </Row>
    </BoxBody>
  </Box>

export default Keys
