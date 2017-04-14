import React from 'react'
import {connect} from 'react-redux'
import {Col, Row} from 'react-bootstrap'

import {setPassword, clearFlags} from '../auth-reducer'

import FieldGroup from '../../../components/form/FieldGroup'
import LoadingWrapper from '../../../components/LoadingWrapper'

class ChangePassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPassword: "",
      newPassword: "",
      verifyPassword: ""
    }
  }

  componentWillMount() {
    this.props.clearFlags()
  }

  onFieldChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.changePassword(this.state.currentPassword, this.state.newPassword, this.state.verifyPassword)
  }

  render = () =>
    <section>
      <Row>
        <Col md={12}>
          <h3 className="col-md-12 text-center">Change your password</h3>
        </Col>
        <Col xs={8} xsOffset={2} md={2} mdOffset={5}>
          <LoadingWrapper loading={this.props.auth.fetching}>
            <form className="signin form-horizontal" autoComplete="off">
              <fieldset>
                <FieldGroup
                  name="currentPassword"
                  type="password"
                  label="Current Password"
                  onChange={this.onFieldChange}
                  value={this.state.currentPassword}
                  placeholder="Current Password"
                />
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
                  <button onClick={this.onSubmit} className="btn btn-large btn-primary">Save Password</button>
                </div>
                {this.props.auth.success &&
                  <div className="text-center text-success">
                    <strong>{this.props.auth.success.message}</strong>
                  </div>
                }
                {this.props.auth.error &&
                  <div className="text-center text-danger">
                    <strong>{this.props.auth.error}</strong>
                  </div>
                }
              </fieldset>
            </form>
          </LoadingWrapper>
        </Col>
      </Row>
    </section>
}

const mapStateToProps = state => ({
  auth: state.auth,
})

const mapDispatchToProps = dispatch => ({
  changePassword: (currentPassword, newPassword, verifyPassword) => {
    dispatch(setPassword({ currentPassword, newPassword, verifyPassword }))
  },
  clearFlags: () => dispatch(clearFlags())
})

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)
