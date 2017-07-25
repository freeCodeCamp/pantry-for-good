import React from 'react'
import PropTypes from 'prop-types'

const BoxHeader = ({children, heading}) =>
  <div className="box-header">
    <h3 className="box-title">
      {heading}
    </h3>
    {children}
  </div>

BoxHeader.propTypes = {
  children: PropTypes.node,
  heading: PropTypes.string
}


export default BoxHeader
