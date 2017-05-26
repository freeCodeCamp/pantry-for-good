import React from 'react'
import {Col, Row} from 'react-bootstrap'

const Error = ({error}) => {
  if (!error) return null

  return (
    <Row>
      <Col xs={12}>
        <div className="text-danger" style={{ whiteSpace: "pre-wrap"}}>
          <i className="icon fa fa-warning" />
          {error}
        </div>
      </Col>
    </Row>
  )
}

export default Error
