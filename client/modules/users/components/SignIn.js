import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import selectors from '../../../store/selectors'
import {signIn, clearFlags} from '../authReducer'

import FieldGroup from '../../../components/form/FieldGroup'
import {LoginBox} from '../../../components/login'

export class SignIn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: ""
    }
  }

  componentWillMount() {
    this.props.clearFlags()
  }

  onFieldChange = e => {
    const {name, value} = e.target
    this.setState({ [name]: value })
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.signIn(this.state.email, this.state.password)
    this.setState({password: ""})
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
          name="email"
          placeholder="Email"
          value={this.state.email}
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
            disabled={!this.state.email || !this.state.password}>Sign in
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
  fetchingUser: selectors.auth.fetching(state),
  fetchUserError: selectors.auth.error(state),
  googleAuthentication: (state.settings && state.settings.data) ? state.settings.data.googleAuthentication : false
})

const mapDispatchToProps = dispatch => ({
  signIn: (email, password) => {
    dispatch(signIn({ email, password }))
  },
  clearFlags: () => dispatch(clearFlags())
})

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
