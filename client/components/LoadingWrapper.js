import React from 'react'

const Loadable = ({loading, children, ...props}) =>
  loading ?
    <div className="overlay">
      <i className="fa fa-refresh fa-spin"></i>
    </div> :
    <div {...props}>{children}</div>

export default Loadable
