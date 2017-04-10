import angular from 'angular'
import React from 'react'
import {react2angular} from 'react2angular'

import ErrorPage from './Error'

const ServerErrorPage = () =>
  <ErrorPage
    color="red"
    status="500"
    msg="Oops! Something went wrong."
    description="We will work on fixing that right away."
  />

export default ServerErrorPage

export const old = angular.module('core')
  .component('serverError', react2angular(ServerErrorPage))
  .name
