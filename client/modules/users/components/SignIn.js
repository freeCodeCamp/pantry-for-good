import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {push} from 'react-router-redux'

import selectors from '../../../store/selectors'
import {signIn, clearFlags} from '../reducer'

import FieldGroup from '../../../components/form/FieldGroup'
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
    if (props.user && props.user._id) {
      props.push('/')
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
        loading={this.props.fetchingUser}
        error={this.props.fetchUserError}
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
        <div className="text-center form-group">
          <button className="btn btn-primary btn-flat" onClick={this.onSubmit}
            disabled={!this.state.username || !this.state.password}>Sign in
          </button>&nbsp; or&nbsp;
          <Link to="/users/signup">Sign up</Link>
          <br />
          {this.props.googleAuthentication &&
            <div>
              or
              <br />
              <a href="/api/auth/google"  className="btn btn-default">
                <i className="fa fa-google" />{' '}
                Sign in with Google
              </a>
          </div>
          }
        </div>
        <div className="form-group">
          <Link to="/users/forgot-password">Forgot your password?</Link>
        </div>
      </LoginBox>
    </section>
}

const mapStateToProps = state => ({
  user: selectors.user.getUser(state),
  fetchingUser: selectors.user.fetching(state),
  fetchUserError: selectors.user.error(state),
  googleAuthentication: (state.settings && state.settings.data) ? state.settings.data.googleAuthentication : false
})

const mapDispatchToProps = dispatch => ({
  signIn: (username, password) => {
    dispatch(signIn({ username, password }))
  },
  clearFlags: () => dispatch(clearFlags()),
  push: location => dispatch(push(location))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
