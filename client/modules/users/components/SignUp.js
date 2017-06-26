import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {push} from 'react-router-redux'

import selectors from '../../../store/selectors'
import {signUp, clearFlags} from '../reducer'
import userClientRole from '../../../lib/user-client-role'
import {showDialog, hideDialog} from '../../core/reducers/dialog'

import FieldGroup from '../../../components/form/FieldGroup'
import {LoginBox} from '../../../components/login'

import './signup.css'

class SignUp extends React.Component {
  constructor(props) {
    super(props)
    this.redirectIfAlreadySignedIn(this.props)
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: ""
    }
  }

  componentWillMount() {
    this.props.clearFlags()
  }

  redirectIfAlreadySignedIn(props) {
    if (props.user && props.user._id) {
      const role = userClientRole(props.user)
      props.push(role ? `/${role}s` : '/')
    }
  }

  onFieldChange = e => {
    const {name, value} = e.target
    this.setState({ [name]: value })
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.signUp({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password
    })
  }

  googleSignup = () => {
    window.location = `/api/auth/google?action=signup`
  }

  componentWillReceiveProps = nextProps => {
    this.redirectIfAlreadySignedIn(nextProps)
  }

  render = () =>
    <section className="content">
      <LoginBox
        showLogo
        heading="Register a new membership"
        formName="registerForm"
        loading={this.props.fetchingUser}
        error={this.props.fetchUserError}
      >
        <FieldGroup
          name="firstName"
          onChange={this.onFieldChange}
          value={this.state.firstName}
          className="signup-firstname"
          placeholder="First Name"
        />
        <FieldGroup
          name="lastName"
          onChange={this.onFieldChange}
          value={this.state.LastName}
          placeholder="Last Name"
          required
        />
        <FieldGroup
          name="email"
          type="email"
          onChange={this.onFieldChange}
          value={this.state.email}
          placeholder="Email"
          required
        />
        <FieldGroup
          name="password"
          type="password"
          onChange={this.onFieldChange}
          value={this.state.password}
          placeholder="Password"
          icon="lock"
          required
        />
        <FieldGroup
          name="passwordConfirm"
          type="password"
          onChange={this.onFieldChange}
          value={this.state.passwordConfirm}
          placeholder="Confirm Password"
          icon="lock"
          required
        />
        {this.state.password !== this.state.passwordConfirm &&
          <div className="alert alert-danger">Passwords do not match</div>
        }
        <div className="text-center form-group">
          <button type="submit" className="btn btn-flat btn-primary"
            onClick={this.onSubmit}
            disabled={this.state.password !== this.state.passwordConfirm}>
            Sign up
          </button>
          <br />
          {this.props.googleAuthentication &&
            <div>
              or
              <br />
              <button type="button" onClick={this.googleSignup} className="btn btn-default">
                <i className="fa fa-google" />{' '}
                Sign up with Google
              </button>
            </div>
          }
          <br/><br/>Already have an account?&nbsp;&nbsp;
          <Link to="/users/signin">Sign in</Link>
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
  signUp: user => dispatch(signUp(user)),
  clearFlags: () => dispatch(clearFlags()),
  push: location => dispatch(push(location)),
  showDialog: dialogOptions => dispatch(showDialog(dialogOptions)),
  hideDialog: () => dispatch(hideDialog())
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
