import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {push} from 'react-router-redux'

import {signIn, clearFlags} from '../auth-reducer'

import FieldGroup from '../../../components/FieldGroup'
import {LoginBox} from '../../../components/login'

class SignIn extends React.Component {
  constructor(props) {
    super(props)
    this.redirectIfAlreadySignedIn(this.props)
    this.state = {
      username: "",
      password: ""
    }
  }

  componentWillMount() {
    this.props.clearFlags()
  }

  redirectIfAlreadySignedIn(props) {
    if (props.auth && props.auth.user && props.auth.user._id) {
      props.push('root')
    }
  }

  onFieldChange = e => {
    const {name, value} = e.target
    this.setState({ [name]: value })
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.signIn(this.state.username, this.state.password)
    this.setState({password: ""})
  }

  componentWillReceiveProps = nextProps => {
    this.redirectIfAlreadySignedIn(nextProps)
  }

  render = () =>
    <section className="content">
      <LoginBox
        showLogo
        heading="Sign in to start your session"
        formName="loginForm"
        loading={this.props.auth.fetching}
        error={this.props.auth.signinError}
      >
        <FieldGroup
          name="username"
          placeholder="Username"
          value={this.state.username}
          onChange={this.onFieldChange}
          icon="user"
        />
        <FieldGroup
          name="password"
          type="password"
          placeholder="Password"
          value={this.state.password}
          onChange={this.onFieldChange}
          icon="lock"
        />
        <div className="pull-right form-group">
          <button className="btn btn-primary btn-flat" onClick={this.onSubmit}>Sign in</button>&nbsp; or&nbsp;
          <Link to="/users/signup">Sign up</Link>
        </div>
        <div className="form-group">
          <Link to="/users/forgot-password">Forgot your password?</Link>
        </div>
      </LoginBox>
    </section>
}

const mapStateToProps = state => ({
  auth: state.auth
})

const mapDispatchToProps = dispatch => ({
  signIn: (username, password) => {
    dispatch(signIn({ username, password }))
  },
  clearFlags: () => dispatch(clearFlags()),
  push: location => dispatch(push(location))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
