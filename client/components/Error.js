import React from 'react'
import {Col, Row} from 'react-bootstrap'

const Error = ({error}) =>
  <div>
    {error ?
      <Row>
        <Col xs={12}>
          <span className="text-danger">
            <i className="icon fa fa-warning" />
            {error}
          </span>
        </Col>
      </Row> :
      null
    }
  </div>

export default Error
