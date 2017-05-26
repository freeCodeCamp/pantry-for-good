import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import FoodbankLogo from '../../../components/FoodbankLogo'

const mapStateToProps = state => ({
  settings: state.settings.data
})

const DonorCreateSuccess = ({settings}) =>
  <section className="row text-center">
    <FoodbankLogo />
    <h3 className="col-md-12">Successfully submited. Thank you!</h3>
    <Link to="/" className="col-md-12">Go to {settings.organization}'s Homepage</Link>
  </section>

export default connect(mapStateToProps)(DonorCreateSuccess)
