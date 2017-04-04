import React from 'react'
import {connect} from 'react-redux'

const mapStateToProps = state => ({
  settings: state.settings.data,
  media: state.media.data
})

const FoodbankLogo = ({settings, media}) =>
  <img
    alt={settings && settings.organization}
    src={media && media.logoPath + media.logoFile}
  />

export default connect(mapStateToProps)(FoodbankLogo)
