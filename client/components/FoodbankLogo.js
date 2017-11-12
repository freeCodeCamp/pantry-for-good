import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import selectors from '../store/selectors'

const mapStateToProps = state => ({
  settings: selectors.settings.getSettings(state),
  media: selectors.media.getMedia(state)
})

const FoodbankLogo = ({settings, media}) =>
  <img
    alt={settings && settings.organization}
    src={`/${media && media.path + media.logo}`}
  />

FoodbankLogo.propTypes = {
  media: PropTypes.shape({
    path: PropTypes.string,
    logo: PropTypes.string
  }),
  settings: PropTypes.shape({
    organization: PropTypes.string
  })
}

export default connect(mapStateToProps)(FoodbankLogo)
