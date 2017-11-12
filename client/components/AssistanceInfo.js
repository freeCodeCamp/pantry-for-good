import React from 'react'
import {Alert, Row, Col} from 'react-bootstrap'
import PropTypes from 'prop-types'

const AssistanceInfo = ({settings, heading, children}) =>
  <Row>
    <Col xs={12}>
      <Alert bsStyle="info">
        <h4>
          <i className="icon fa fa-warning">
            {heading}
          </i>
        </h4>
        <p>
          For assistance with this application, please contact our support line at {settings.supportNumber.replace(/ /g, "\u00a0")}.
        </p>
        {children}
      </Alert>
    </Col>
  </Row>

AssistanceInfo.propTypes = {
  settings: PropTypes.shape({
    supportNumber: PropTypes.string
  }).isRequired,
  heading: PropTypes.string,
  children: PropTypes.node
}

export default AssistanceInfo
