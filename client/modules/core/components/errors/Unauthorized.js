import angular from 'angular'
import React from 'react'
import {react2angular} from 'react2angular'

import ErrorPage from './Error'

const UnauthorizedPage = () =>
  <ErrorPage
    color="yellow"
    status="403"
    msg="Oops! Access forbidden."
    description="This part of the website is for admins only."
  />

export default UnauthorizedPage

export const old = angular.module('core')
  .component('unauthorized', react2angular(UnauthorizedPage))
  .name
