import React from 'react'
import {connect} from 'react-redux'
import {Col, Row} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {forgotPassword, clearFlags} from '../authReducer'

import FieldGroup from '../../../components/form/FieldGroup'
import LoadingWrapper from '../../../components/LoadingWrapper'

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: ""
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
    this.props.resetPassword(this.state.email)
  }

  render = () => {
    if (this.props.success) {
      return (
        <Row>
          <Col xs={8} xsOffset={2} md={4} mdOffset={4}>
            <div className="text-center text-success">
              <br /><strong>{this.props.success.message}</strong>
            </div>
          </Col>
        </Row>
      )
    } else {
      return (
        <section>
          <Row>
            <Col md={12}>
              <h3 className="text-center">Reset your password</h3>
            </Col>
            <p className="text-center">Enter your email address.</p>
            <Col xs={8} xsOffset={2} md={4} mdOffset={4}>
              <LoadingWrapper loading={this.props.fetching}>
                <form className="signin form-horizontal" autoComplete="off">
                  <fieldset>
                    <FieldGroup
                      name="email"
                      value={this.state.email}
                      onChange={this.onFieldChange}
                    />
                    <div className="text-center form-group">
                      <button type="submit" onClick={this.onSubmit} disabled={this.state.email.trim() === "" || this.props.fetching} className="btn btn-primary">Submit</button>
                    </div>
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
        </section>
      )
    }
  }

}

const mapStateToProps = state => ({
  fetching: selectors.auth.fetching(state),
  error: selectors.auth.error(state),
  success: selectors.auth.success(state)
})

const mapDispatchToProps = dispatch => ({
  resetPassword: email => dispatch(forgotPassword({ email })),
  clearFlags: () => dispatch(clearFlags())
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
