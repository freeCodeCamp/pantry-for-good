import React from 'react'
import {connect} from 'react-redux'
import {Col, Row} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {setProfile, clearFlags} from '../authReducer'

import FieldGroup from '../../../components/form/FieldGroup'
import LoadingWrapper from '../../../components/LoadingWrapper'

class EditProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: this.props.user.firstName,
      lastName: this.props.user.lastName,
      email: this.props.user.email,
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
    this.props.setProfile({...this.props.user,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
    })
  }

  render = () =>
    <section>
      <Row>
        <Col md={12}>
          <h3 className="col-md-12 text-center">Edit your profile</h3>
        </Col>
        <Col xs={8} xsOffset={2} md={2} mdOffset={5}>
          <LoadingWrapper loading={this.props.fetchingUser}>
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

                <div className="text-center form-group">
                  <button onClick={this.onSubmit} type="submit" className="btn btn-large btn-primary">Save Profile</button>
                </div>
                {this.props.fetchUserSuccess &&
                  <div className="text-center text-success">
                    <strong>Profile Saved Successfully</strong>
                  </div>
                }
                {this.props.fetchUserError &&
                  <div className="text-center text-danger">
                    <strong>{this.props.fetchUserError}</strong>
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
  user: selectors.auth.getUser(state),
  fetchingUser: selectors.auth.fetching(state),
  fetchUserError: selectors.auth.error(state),
  fetchUserSuccess: selectors.auth.success(state)
})

const mapDispatchToProps = dispatch => ({
  setProfile: user => dispatch(setProfile(user)),
  clearFlags: () => dispatch(clearFlags())
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)
