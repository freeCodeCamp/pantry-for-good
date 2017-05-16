import React from 'react'

import ErrorPage from './Error'

const NotFoundPage = () =>
  <ErrorPage
    color="yellow"
    status="404"
    msg="Oops! Page not found."
    description="We could not find the page you were looking for."
  />

export default NotFoundPage
