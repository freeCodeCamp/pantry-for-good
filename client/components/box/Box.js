import React from 'react'
import {Col, Row} from 'react-bootstrap'

const Box = ({children, type = 'primary', solid}) => {
  let boxClass = 'box'
  if (type) boxClass += ` box-${type}`
  if (solid) boxClass += ' box-solid'

  return (
    <Row>
      <Col xs={12}>
        <div className={boxClass}>
          {children}
        </div>
      </Col>
    </Row>
  )
}

export default Box
