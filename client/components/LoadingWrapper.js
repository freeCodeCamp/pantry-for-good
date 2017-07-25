import React from 'react'

const LoadingWrapper = ({loading, children, ...props}) =>
  <div {...props}>
    {children}
    {loading &&
      <div className="overlay">
        <i className="fa fa-2x fa-refresh fa-spin"></i>
      </div>
    }
  </div>

export default LoadingWrapper
