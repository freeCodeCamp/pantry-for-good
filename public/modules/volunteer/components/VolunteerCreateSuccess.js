import React from 'react'
import {connect} from 'react-redux'

import FoodbankLogo from '../../common/components/FoodbankLogo'

const mapStateToProps = state => ({
  settings: state.settings.data
})

const VolunteerCreateSuccess = ({settings}) =>
  <section className="row text-center">
    <FoodbankLogo />
    <h3 className="col-md-12">Successfully submited. Thank you!</h3>
    <a href="/#!/" className="col-md-12">Go to {settings && settings.organization}'s Homepage</a>
  </section>

export default connect(mapStateToProps)(VolunteerCreateSuccess)
