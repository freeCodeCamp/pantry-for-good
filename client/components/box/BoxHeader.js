import React from 'react'

const BoxHeader = ({children, heading}) =>
  <div className="box-header">
    <h3 className="box-title">
      {heading}
    </h3>
    {children}
  </div>


export default BoxHeader
