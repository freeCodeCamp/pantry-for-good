import React from 'react'

import ErrorPage from './Error'

const UnauthorizedPage = () =>
  <ErrorPage
    color="yellow"
    status="403"
    msg="Oops! Access forbidden."
    description="You are not authorized to view this page."
  />

export default UnauthorizedPage

