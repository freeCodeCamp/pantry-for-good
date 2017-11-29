import React from 'react'
import { connect } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import { includes } from 'lodash'

import { ADMIN_ROLE } from '../../../../common/constants'
import selectors from '../../../store/selectors'
import { editUser, getUserById } from '../userReducer'

import FieldGroup from '../../../components/form/FieldGroup'
import Box from '../../../components/box/Box'
import BoxHeader from '../../../components/box/BoxHeader'
import BoxBody from '../../../components/box/BoxBody'

const isAdmin = user => includes(user.roles, ADMIN_ROLE)

class EditUser extends React.Component {
  constructor(props) {
    super(props)
    const { user } = props
    this.state = {
      firstName: user ? props.user.firstName : "",
      lastName: user ? user.lastName : "",
      email: user ? user.email : "",
      isAdmin: user ? isAdmin(user) : false,
      showSaveSuccessMessage: false
    }
  }

  componentWillMount() {
    if (!this.props.user) {
      this.props.getUserById(this.props.match.params.userId)
    }
  }

  componentWillReceiveProps = nextProps => {
    if (!this.props.user && nextProps.user) {
      // The user info has just been received from the api call
      this.setState({
        firstName: nextProps.user.firstName,
        lastName: nextProps.user.lastName,
        email: nextProps.user.email,
        isAdmin: isAdmin(nextProps.user)
      })
    }

    if (this.props.saving && !nextProps.saving && !nextProps.saveError) {
      this.setState({ showSaveSuccessMessage: true })
    } else if (this.state.showSaveSuccessMessage) {
      this.setState({ showSaveSuccessMessage: false })
    }
  }

  onFieldChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value, showSaveSuccessMessage: false })
  }

  onCheckboxChange = e => {
    const { name, checked } = e.target
    this.setState({ [name]: checked, showSaveSuccessMessage: false })
  }

  onSubmit = e => {
    e.preventDefault()
    this.setState({ showSaveSuccessMessage: false })
    this.props.editUser({
      ...this.props.user,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      isAdmin: this.state.isAdmin
    })
  }

  createForm = () =>
    <form>
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
          disabled={this.props.user && (this.props.user.provider === "google")}
        />
        {(this.props.user && (this.props.user.provider === "google")) &&
          "Changing email addresses for users who signed up with google is not yet implemented"
        }
        <FieldGroup
          name="isAdmin"
          options="Admin"
          onChange={this.onCheckboxChange}
          checked={this.state.isAdmin}
          type="checkbox"
        />
        <div className="text-center form-group">
          <button
            onClick={this.onSubmit}
            type="submit"
            className="btn btn-large btn-primary"
            disabled={this.props.fetching || this.props.saving}
          >
            Update
          </button>
        </div>

        <div className="text-center text-success">
          {/* \u00a0 is a non-breaking space so the div still takes up space when empty */}
          <strong>{this.state.showSaveSuccessMessage ? "Profile Saved Successfully" : "\u00a0"}</strong>
        </div>

      </fieldset>
    </form>

  render = () =>
    <section className="content">
      <Row>
        <Col xs={8} xsOffset={2} md={4} mdOffset={4}>
          <Box>
            <BoxHeader>
              <h3 >Edit User Account</h3>
            </BoxHeader>
            <BoxBody
              loading={this.props.fetching || this.props.saving}
              error={this.props.fetchError || this.props.saveError}
              errorBottom
            >
              {!this.props.fetchError && this.props.user &&
                this.createForm()
              }
            </BoxBody>
          </Box>
        </Col>
      </Row>
    </section>

}

const mapStateToProps = (state, ownProps) => {
  let user = undefined
  if (ownProps.match.params.userId) {
    const _id = parseInt(ownProps.match.params.userId)
    user = selectors.user.users(state).find(user => user._id === _id)
  }
  return {
    user,
    fetching: selectors.user.fetching(state),
    saving: selectors.user.saving(state),
    fetchError: selectors.user.fetchError(state),
    saveError: selectors.user.saveError(state)
  }
}

const mapDispatchToProps = dispatch => ({
  editUser: user => dispatch(editUser(user)),
  getUserById: userId => dispatch(getUserById(userId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditUser)
