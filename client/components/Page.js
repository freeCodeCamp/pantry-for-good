import React from 'react'
import {Alert, Col, Row} from 'react-bootstrap'

import FoodbankLogo from './FoodbankLogo'

const Page = ({children, heading, showLogo, center, error}) => {
  return (
    <div>
      <section className={`content-header ${center ? 'text-center' : ''}`}>
        {showLogo && <FoodbankLogo />}
        <h1><span>{heading}</span></h1>
      </section>
      <section className="content">
        {children}
        {error &&
          <Row>
            <Col xs={12}>
              <span className="text-danger">
                <i className="icon fa fa-warning" />
                {error}
              </span>
            </Col>
          </Row>
        }
      </section>
    </div>
  )
}

export default Page
