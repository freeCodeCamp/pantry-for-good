import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import selectors from '../store/selectors'
import FoodbankLogo from './FoodbankLogo'

const mapStateToProps = state => ({
  settings: selectors.settings.getSettings(state)
})

const CustomerCreateSuccess = ({settings}) =>
  <section className="row text-center">
    <FoodbankLogo />
    <h3 className="col-md-12">Successfully submited. Thank you!</h3>
    <Link to="/" className="col-md-12">Go to {settings && settings.organization}&apos;s Homepage</Link>
  </section>

CustomerCreateSuccess.propTypes = {
  settings: PropTypes.shape({
    organization: PropTypes.string
  }).isRequired,
}

export default connect(mapStateToProps)(CustomerCreateSuccess)
