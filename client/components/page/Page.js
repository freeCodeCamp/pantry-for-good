import React from 'react'

const Page = ({loading, children}) =>
  <div>
    {children}
    {loading &&
      <div className="overlay">
        <i className="fa fa-refresh fa-spin"></i>
      </div>
    }
  </div>

export default Page
