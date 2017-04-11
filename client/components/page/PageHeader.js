import React from 'react'

import FoodbankLogo from '../FoodbankLogo'

const PageHeader = ({heading, showLogo, center}) =>
  <section className={`content-header ${center ? 'text-center' : ''}`}>
    {showLogo && <FoodbankLogo />}
    <h1><span>{heading}</span></h1>
  </section>

export default PageHeader
