import React from 'react'

import './loading-wrapper.css'

const LoadingWrapper = ({loading, children, ...props}) =>
  <div {...props}>
    {children}
    {loading &&
      <div className="spinner">
        <i className="fa fa-2x fa-refresh fa-spin"></i>
      </div>
    }
  </div>

export default LoadingWrapper
