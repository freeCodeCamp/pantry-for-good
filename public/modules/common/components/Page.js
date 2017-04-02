import React from 'react'

const Page = ({children, heading}) =>
  <div>
    <section className="content-header">
      <h1><span>{heading}</span></h1>
    </section>
    <section className="content">
      {children}
    </section>
  </div>

export default Page
