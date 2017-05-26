import React from 'react'

import FoodbankLogo from '../FoodbankLogo'

const PageHeader = ({heading, showLogo, center, children}) =>
  <section className={`content-header ${center ? 'text-center' : ''}`}>
    {showLogo && <FoodbankLogo />}
    <h1><span>{heading}</span></h1>
    {children}
  </section>

export default PageHeader
