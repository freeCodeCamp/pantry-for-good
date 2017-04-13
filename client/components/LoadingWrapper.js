import React from 'react'

import './loading-wrapper.css'

const Loadable = ({loading, children, ...props}) =>
  <div>
    <div
      className={loading ? 'overlay' : ''}
      {...props}
    >
      {children}
    </div>
    {loading &&
      <div className="spinner">
        <i className="fa fa-2x fa-refresh fa-spin"></i>
      </div>
    }
  </div>

export default Loadable
