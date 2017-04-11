import React from 'react'
import {Alert, Row, Col} from 'react-bootstrap'

const AssistanceInfo = ({supportNumber}) =>
  <Row>
    <Col xs={12}>
      <Alert bsStyle="info">
        <i className="icon fa fa-warning"></i>
        {`For assistance with this application, please contact our support line at ${supportNumber}.`}
      </Alert>
    </Col>
  </Row>

export default AssistanceInfo
