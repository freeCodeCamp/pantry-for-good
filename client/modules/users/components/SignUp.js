import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {push} from 'react-router-redux'

import {ControlLabel, FormGroup} from 'react-bootstrap'

import {signUp, clearFlags} from '../auth-reducer'

import FieldGroup from '../../../components/form/FieldGroup'
import {LoginBox} from '../../../components/login'

import './signup.css'

class SignUp extends React.Component {
  constructor(props) {
    super(props)
    this.redirectIfAlreadySignedIn(this.props)
    this.state = {
      accountType: undefined,
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      passwordConfirm: ""
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
    this.props.signUp({
      "accountType": this.state.accountType,
      "firstName": this.state.firstName,
      "lastName": this.state.lastName,
      "email": this.state.email,
      "username": this.state.username,
      "password": this.state.password
    })
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
        loading={this.props.auth.fetching}
        error={this.props.auth.error}
      >
        <FormGroup controlId="accountType">
          <ControlLabel>Please select an account to create</ControlLabel>
          <div>
            <FieldGroup
              name="accountType"
              type="radio"
              label="Client"
              value="customer"
              checked={this.state.accountType === 'customer'}
              onChange={this.onFieldChange}
              required
              inline
            />
            <FieldGroup
              name="accountType"
              type="radio"
              label="Volunteer"
              value="volunteer"
              checked={this.state.accountType === 'volunteer'}
              onChange={this.onFieldChange}
              required
              inline
            />
            <FieldGroup
              name="accountType"
              type="radio"
              label="Donor"
              value="donor"
              checked={this.state.accountType === 'donor'}
              onChange={this.onFieldChange}
              required
              inline
            />
          </div>
        </FormGroup>
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
          name="username"
          onChange={this.onFieldChange}
          value={this.state.username}
          placeholder="Username"
          icon="user"
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
          <br/><br/>Already have an account?&nbsp;&nbsp;
          <Link to="/users/signin">Sign in</Link>
        </div>
      </LoginBox>
    </section>
}

const mapStateToProps = state => ({
  auth: state.auth
})

const mapDispatchToProps = dispatch => ({
  signUp: user => {
    dispatch(signUp(user))
  },
  clearFlags: () => dispatch(clearFlags()),
  push: location => dispatch(push(location))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
