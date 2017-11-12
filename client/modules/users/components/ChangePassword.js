import React from 'react'
import {connect} from 'react-redux'
import {Col, Row} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {setPassword, clearFlags} from '../authReducer'

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

  componentWillReceiveProps = nextProps => {
    if (nextProps.success) {
      this.setState({currentPassword: "", newPassword: "", verifyPassword: ""})
    }
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
        <Col xs={8} xsOffset={2} md={4} mdOffset={4}>
          <LoadingWrapper loading={this.props.fetching}>
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
                {this.state.newPassword !== this.state.verifyPassword &&
                  <div className="alert alert-danger">Passwords do not match</div>
                }
                <div className="text-center form-group">
                  <button
                    onClick={this.onSubmit}
                    className="btn btn-large btn-primary"
                    disabled={
                      !this.state.currentPassword ||
                      !this.state.newPassword ||
                      !this.state.verifyPassword ||
                      this.state.newPassword !== this.state.verifyPassword
                    }
                  >
                    Save Password
                  </button>
                </div>
                {this.props.success &&
                  <div className="text-center text-success">
                    <strong>{this.props.success.message}</strong>
                  </div>
                }
                {this.props.error &&
                  <div className="text-center text-danger">
                    <strong>{this.props.error}</strong>
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
  fetching: selectors.auth.fetching(state),
  error: selectors.auth.error(state),
  success: selectors.auth.success(state)
})

const mapDispatchToProps = dispatch => ({
  changePassword: (currentPassword, newPassword, verifyPassword) => {
    dispatch(setPassword({ currentPassword, newPassword, verifyPassword }))
  },
  clearFlags: () => dispatch(clearFlags())
})

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)
