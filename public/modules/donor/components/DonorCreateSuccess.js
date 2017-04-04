import React from 'react'
import {connect} from 'react-redux'

import FoodbankLogo from '../../media/components/foodbank-logo'

const mapStateToProps = state => ({
  settings: state.settings.data
});

const DonorCreateSuccess = ({settings}) =>
  <section className="row text-center">
    <FoodbankLogo />
    <h3 className="col-md-12">Successfully submited. Thank you!</h3>
    <a href="/#!/" className="col-md-12">Go to {settings.organization}'s Homepage</a>
  </section>

export default connect(mapStateToProps)(DonorCreateSuccess)
