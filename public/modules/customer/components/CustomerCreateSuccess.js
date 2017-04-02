import React from 'react'
import {connect} from 'react-redux'

import FoodbankLogo from '../../media/components/foodbank-logo'

const mapStateToProps = state => ({
  settings: state.settings.data
});

const CustomerCreateSuccess = ({settings}) =>
  <section class="row text-center">
    <FoodbankLogo />
    <h3 class="col-md-12">Successfully submited. Thank you!</h3>
    <a href="/#!/" class="col-md-12">Go to {settings.organization}'s Homepage</a>
  </section>

export default connect(mapStateToProps)(CustomerCreateSuccess)
