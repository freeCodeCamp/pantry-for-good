import React from 'react'
import {Clearfix, Col, Row} from 'react-bootstrap'

import {Box, BoxBody, BoxHeader} from '../../../components/box'
import {RFFieldGroup} from '../../../components/form'

const General = () =>
  <Box>
    <BoxHeader heading="General" />
    <BoxBody>
      <Row>
        <Col lg={3}>
          <RFFieldGroup
            name="organization"
            label="Organization"
            type="text"
            required
          />
        </Col>
        <Clearfix visibleSmBlock visibleMdBlock />
        <Col lg={3}>
          <RFFieldGroup
            name="url"
            label="URL"
            type="text"
            required
          />
        </Col>
        <Clearfix visibleSmBlock visibleMdBlock />
        <Col lg={3}>
          <RFFieldGroup
            name="clientIntakeNumber"
            label="Client intake number"
            type="text"
            required
          />
        </Col>
        <Clearfix visibleSmBlock visibleMdBlock />
        <Col lg={3}>
          <RFFieldGroup
            name="supportNumber"
            label="Support number"
            type="text"
            required
          />
        </Col>
      </Row>

      <Row>
        <Clearfix visibleSmBlock visibleMdBlock />
        <Col lg={6}>
          <RFFieldGroup
            name="foodBankAddress"
            label="Address"
            type="textarea"
            rows="5"
          />
        </Col>
      </Row>
    </BoxBody>
  </Box>


export default General
