import React from 'react'

const Page = ({loading, children}) =>
  loading ?
    null :
    <div>
      {children}
    </div>

export default Page
