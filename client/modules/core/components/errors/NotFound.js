import angular from 'angular'
import React from 'react'
import {react2angular} from 'react2angular'

import ErrorPage from './Error'

const NotFoundPage = () =>
  <ErrorPage
    color="yellow"
    status="404"
    msg="Oops! Page not found."
    description="We could not find the page you were looking for."
  />

export default NotFoundPage

export const old = angular.module('core')
  .component('notFound', react2angular(NotFoundPage))
  .name
