import React from 'react'
import {connect} from 'react-redux'
import {Col, Row} from 'react-bootstrap'
import { replace } from 'react-router-redux'

import selectors from '../../../store/selectors'
import {resetPassword, clearFlags} from '../authReducer'

import FieldGroup from '../../../components/form/FieldGroup'
import LoadingWrapper from '../../../components/LoadingWrapper'

class ResetPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newPassword: "",
      verifyPassword: "",
      validationError: null
    }
  }

  componentWillMount() {
    this.props.clearFlags()
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.success) {
      this.setState({newPassword: "", verifyPassword: ""})
      setTimeout(() => this.props.redirect('/users/signin'), 3000)
    }
  }

  onFieldChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value, validationError: null }, this.props.clearFlags)
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.clearFlags()
    if (this.state.newPassword !== this.state.verifyPassword) {
      this.setState({ validationError: "Passwords do not match" })
    } else if (this.state.newPassword.length === 0) {
      this.setState({ validationError: "Password must not be blank" })
    } else {
      this.props.changePassword(this.props.match.params.token, this.state.newPassword)
    }
  }

  render = () => {
    return (
      <section>
        <Row>
          <Col md={12}>
            <h3 className="col-md-12 text-center">Reset your password</h3>
          </Col>
          <Col xs={8} xsOffset={2} md={4} mdOffset={4}>
            <LoadingWrapper loading={this.props.fetching}>
              <form className="signin form-horizontal" autoComplete="off">
                <fieldset>
                  <FieldGroup
                    name="newPassword"
                    type="password"
                    label="New Password"
                    onChange={this.onFieldChange}
                    value={this.state.newPassword}
                    placeholder="New Password"
                  />
                  <FieldGroup
                    name="verifyPassword"
                    type="password"
                    label="Verify Password"
                    onChange={this.onFieldChange}
                    value={this.state.verifyPassword}
                    placeholder="Verify Password"
                  />
                  <div className="text-center form-group">
                    <button
                      onClick={this.onSubmit}
                      className="btn btn-large btn-primary"
                      disabled={
                        this.props.fetching ||
                        !this.state.newPassword ||
                        !this.state.verifyPassword
                      }
                    >
                      Save Password
                    </button>
                  </div>
                  {this.state.validationError &&
                    <div className="text-center text-danger">
                      <strong>{this.state.validationError}</strong>
                    </div>
                  }
                  {this.props.success &&
                    <div className="text-center text-success">
                      <strong>{this.props.success.message}</strong>
                    </div>
                  }
                  {this.props.error &&
                    <div className="text-center text-danger">
                      <strong>{this.props.error.message}</strong>
                    </div>
                  }
                </fieldset>
              </form>
            </LoadingWrapper>
          </Col>
        </Row>
      </section>)
  }
}

const mapStateToProps = state => ({
  fetching: selectors.auth.fetching(state),
  error: selectors.auth.error(state),
  success: selectors.auth.success(state)

})

const mapDispatchToProps = dispatch => ({
  changePassword: (token, newPassword) => dispatch(resetPassword(token, newPassword)),
  redirect: url => dispatch(replace(url)),
  clearFlags: () => dispatch(clearFlags())
})

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
