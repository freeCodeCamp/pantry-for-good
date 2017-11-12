import React from 'react'
import PropTypes from 'prop-types'

import FoodbankLogo from '../FoodbankLogo'

const PageHeader = ({heading, showLogo, center, children}) =>
  <section className={`content-header ${center ? 'text-center' : ''}`}>
    {showLogo && <FoodbankLogo />}
    <h1><span>{heading}</span></h1>
    {children}
  </section>

PageHeader.propTypes = {
  heading: PropTypes.string,
  showLogo: PropTypes.bool,
  center: PropTypes.bool,
  children: PropTypes.node
}

export default PageHeader
