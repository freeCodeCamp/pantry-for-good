import React from 'react'
import {connect} from 'react-redux'
import {Col, Row} from 'react-bootstrap'

import {setProfile, clearFlags} from '../auth-reducer'

import FieldGroup from '../../../components/form/FieldGroup'
import LoadingWrapper from '../../../components/LoadingWrapper'

class EditProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: this.props.auth.user.firstName,
      lastName: this.props.auth.user.lastName,
      email: this.props.auth.user.email,
      username: this.props.auth.user.username
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
    this.props.setProfile({...this.props.auth.user,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      username: this.state.username,
    })
  }

  render = () =>
    <section>
      <Row>
        <Col md={12}>
          <h3 className="col-md-12 text-center">Edit your profile</h3>
        </Col>
        <Col xs={8} xsOffset={2} md={2} mdOffset={5}>
          <LoadingWrapper loading={this.props.auth.fetching}>
            <form name="userForm" className="signin form-horizontal" autoComplete="off">
              <fieldset>
                <FieldGroup
                  name="firstName"
                  label="First Name"
                  onChange={this.onFieldChange}
                  value={this.state.firstName}
                  placeholder="First Name"
                />
                <FieldGroup
                  name="lastName"
                  label="Last Name"
                  onChange={this.onFieldChange}
                  value={this.state.lastName}
                  placeholder="Last Name"
                />
                <FieldGroup
                  name="email"
                  label="Email"
                  onChange={this.onFieldChange}
                  value={this.state.email}
                  placeholder="Email"
                />
                <FieldGroup
                  name="userName"
                  label="User Name"
                  onChange={this.onFieldChange}
                  value={this.state.userName}
                  placeholder="User Name"
                />

                <div className="text-center form-group">
                  <button onClick={this.onSubmit} type="submit" className="btn btn-large btn-primary">Save Profile</button>
                </div>
                {this.props.auth.success &&
                  <div className="text-center text-success">
                    <strong>Profile Saved Successfully</strong>
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
  setProfile: user => dispatch(setProfile(user)),
  clearFlags: () => dispatch(clearFlags())
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)
