import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {branch, compose, renderComponent, setPropTypes} from 'recompose'
import {Redirect} from 'react-router'

import selectors from '../../store/selectors'

const mapStateToProps = state => ({
  user: selectors.auth.getUser(state)
})

const noUser = ({user}) => !user || !user.roles

const RedirectToSignin = () => <Redirect to="/users/signin" />

export default compose(
  connect(mapStateToProps),
  branch(noUser, renderComponent(RedirectToSignin)),
  setPropTypes({user: PropTypes.object.isRequired}),
)
