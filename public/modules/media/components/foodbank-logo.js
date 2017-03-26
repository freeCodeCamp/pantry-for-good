import React from 'react'
import {connect} from 'react-redux'
import {react2angular} from 'react2angular'
import angular from 'angular';

const mapStateToProps = state => ({
  settings: state.settings.data,
  media: state.media.data
})

const FoodbankLogoComponent = ({settings, media}) =>
  <img
    alt={settings && settings.organization}
    src={media && media.logoPath + media.logoFile}
  />

const FoodbankLogo = connect(mapStateToProps)(FoodbankLogoComponent)

export default FoodbankLogo

export const old = angular.module('media')
	.component('foodbankLogo', react2angular(FoodbankLogo))
	.name;
