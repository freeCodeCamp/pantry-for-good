import React from 'react'
import P from 'prop-types'
import {Col, Row} from 'react-bootstrap'

const Error = ({error}) => {
  if (!error) return null

  return (
    <Row>
      <Col xs={12}>
        <div className="text-danger" style={{ whiteSpace: "pre-wrap"}}>
          <i className="icon fa fa-warning" />
          {error.message || error}
        </div>
      </Col>
    </Row>
  )
}

Error.propTypes = {
  error: P.oneOfType([
    P.string,
    P.shape({message: P.string})
  ])
}

export default Error
