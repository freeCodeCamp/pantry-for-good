import React from 'react'
import {get, has} from 'lodash'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import selectors from '../../../store/selectors'
import {signUp, clearFlags} from '../authReducer'
import {showDialog, hideDialog} from '../../core/reducers/dialog'

import FieldGroup from '../../../components/form/FieldGroup'
import {LoginBox} from '../../../components/login'

import './signup.css'

class SignUp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: {value: '', touched: false},
      lastName: {value: '', touched: false},
      email: {value: '', touched: false},
      password: {value: '', touched: false},
      passwordConfirm: {value: '', touched: false}
    }
  }

  componentWillMount() {
    this.props.clearFlags()
  }

  onFieldBlur = e => {
    const {name, value} = e.target
    this.setState({[name]: {value, touched: true}})
  }

  onFieldChange = e => {
    const {name, value} = e.target
    this.setState({[name]: {value, touched: this.state[name].touched ? true : false}})
  }

  onSubmit = e => {
    e.preventDefault()
    this.setState({
      firstName: {value: this.state.firstName.value, touched: true},
      lastName: {value: this.state.lastName.value, touched: true},
      email: {value: this.state.email.value, touched: true},
      password: {value: this.state.password.value, touched: true},
    })
    this.props.signUp({
      firstName: this.state.firstName.value,
      lastName: this.state.lastName.value,
      email: this.state.email.value,
      password: this.state.password.value
    })
  }

  googleSignup = () => {
    window.location = `/api/auth/google?action=signup`
  }

  isValid = field => has(
    get(this.props, 'fetchUserError.paths', {}),
    field
  ) ? 'error' : null

  getError = field => get(this.props, `fetchUserError.paths.${field}`)

  matchPasswords = () => this.state.password.value === this.state.passwordConfirm.value

  passwordLength = () => this.state.password.value.length > 6

  showPasswordErrors = () => {
    let error
    if (this.state.password.touched && !this.passwordLength())
      error = 'Password must be at least 7 characters long'
    else if (this.state.passwordConfirm.touched && !this.matchPasswords())
      error = 'Passwords do not match'
    return error ? <div className="alert alert-danger">{error}</div> : null
  }

  render() {
    const {fetchingUser, fetchUserError} = this.props
    const {
      firstName,
      lastName,
      email,
      password,
      passwordConfirm
    } = this.state

    return(
      <section className="content">
        <LoginBox
          showLogo
          heading="Register a new membership"
          formName="registerForm"
          loading={fetchingUser}
          error={fetchUserError}
        >
          <FieldGroup
            name="firstName"
            onChange={this.onFieldChange}
            value={firstName.value}
            touched={firstName.touched}
            className="signup-firstname"
            valid={this.isValid('firstName')}
            errorMessage={this.getError('firstName')}
            placeholder="First Name"
            required
          />
          <FieldGroup
            name="lastName"
            onChange={this.onFieldChange}
            value={lastName.value}
            touched={lastName.touched}
            valid={this.isValid('lastName')}
            errorMessage={this.getError('lastName')}
            placeholder="Last Name"
            required
          />
          <FieldGroup
            name="email"
            type="email"
            onChange={this.onFieldChange}
            value={email.value}
            touched={email.touched}
            valid={this.isValid('email')}
            errorMessage={this.getError('email')}
            placeholder="Email"
            required
          />
          <FieldGroup
            name="password"
            type="password"
            onChange={this.onFieldChange}
            onBlur={this.onFieldBlur}
            value={password.value}
            touched={password.touched}
            valid={this.isValid('password')}
            errorMessage={this.getError('password')}
            placeholder="Password"
            icon="lock"
            required
          />
          <FieldGroup
            name="passwordConfirm"
            type="password"
            onChange={this.onFieldChange}
            onBlur={this.onFieldBlur}
            value={passwordConfirm.value}
            touched={passwordConfirm.touched}
            valid={this.isValid('passwordConfirm')}
            errorMessage={this.getError('passwordConfirm')}
            placeholder="Confirm Password"
            icon="lock"
            required
          />
          {this.showPasswordErrors()}
          <div className="text-center form-group">
            <button type="submit" className="btn btn-flat btn-primary"
              onClick={this.onSubmit}
              disabled={!this.matchPasswords() || !this.passwordLength()}>
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
    )
  }
}

const mapStateToProps = state => ({
  fetchingUser: selectors.auth.fetching(state),
  fetchUserError: selectors.auth.error(state),
  googleAuthentication: get(selectors.settings.getSettings(state), 'googleAuthentication')
})

const mapDispatchToProps = dispatch => ({
  signUp: user => dispatch(signUp(user)),
  clearFlags: () => dispatch(clearFlags()),
  showDialog: dialogOptions => dispatch(showDialog(dialogOptions)),
  hideDialog: () => dispatch(hideDialog())
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
