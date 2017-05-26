import React from 'react'
import {Col, Row} from 'react-bootstrap'

const Box = ({children, type = 'primary', style, solid, ...props}) => {
  let boxClass = 'box'
  if (type) boxClass += ` box-${type}`
  if (solid) boxClass += ' box-solid'

  return (
    <Row style={style}>
      <Col xs={12} {...props}>
        <div className={boxClass}>
          {children}
        </div>
      </Col>
    </Row>
  )
}

export default Box
