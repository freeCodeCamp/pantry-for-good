import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {ButtonToolbar, Button, Col} from 'react-bootstrap'

import {ADMIN_ROLE, questionnaireIdentifiers} from '../../../../common/constants'
import selectors from '../../../store/selectors'
import {loadVolunteer, saveVolunteer, deleteVolunteer} from '../reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'
import {showConfirmDialog, hideDialog} from '../../core/reducers/dialog'

import {Box, BoxHeader, BoxBody} from '../../../components/box'
import {Page, PageBody, PageHeader} from '../../../components/page'
import {QuestionnaireView} from '../../../components/questionnaire-view'
import RoleSelector from './RoleSelector'

const mapStateToProps = (state, ownProps) => {
  const {volunteerId} = ownProps.match.params
  return {
    user: selectors.auth.getUser(state),
    savingVolunteers: selectors.volunteer.saving(state),
    saveVolunteersError: selectors.volunteer.saveError(state),
    volunteer: selectors.volunteer.getOne(state)(volunteerId),
    volunteerId,
    questionnaire: selectors.questionnaire.getOne(state)(questionnaireIdentifiers.VOLUNTEER),
    loading: selectors.questionnaire.loading(state) ||
      selectors.volunteer.loading(state),
    loadError: selectors.questionnaire.loadError(state) ||
      selectors.volunteer.loadError(state)
  }
}

const mapDispatchToProps = dispatch => ({
  loadVolunteer: (id, admin) => dispatch(loadVolunteer(id, admin)),
  saveVolunteer: (volunteer, admin) => dispatch(saveVolunteer(volunteer, admin)),
  deleteVolunteer: volunteer => () => dispatch(deleteVolunteer(volunteer._id)),
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  showDialog: (cancel, confirm, message) =>
    dispatch(showConfirmDialog(cancel, confirm, message, 'Delete')),
  hideDialog: () => dispatch(hideDialog())
})

class VolunteerView extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = props.user.roles.find(role => role === ADMIN_ROLE)
  }

  componentWillMount() {
    this.props.loadVolunteer(this.props.volunteerId, this.isAdmin)
    this.props.loadQuestionnaires()
  }

  saveVolunteer = status => () => {
    const {volunteer} = this.props
    if (!volunteer) return

    if (status === 'Driver') {
      return this.props.saveVolunteer({
        ...volunteer,
        status: 'Active',
        driver: true
      }, this.isAdmin)
    }

    this.props.saveVolunteer({
      ...volunteer,
      status,
      driver: false
    }, this.isAdmin)
  }

  toggleRole = role => () => {
    const {volunteer} = this.props
    const roles = volunteer.roles.find(r => r === role) ?
      volunteer.roles.filter(r => r !== role) :
      volunteer.roles.concat(role)

    this.props.saveVolunteer({
      ...volunteer,
      roles
    })
  }

  deleteVolunteer = volunteer => () => this.props.showDialog(
    this.props.hideDialog,
    this.props.deleteVolunteer(volunteer),
    `Volunteer ${volunteer.fullName} will be permanently deleted`
  )

  render() {
    const {
      volunteer,
      questionnaire,
      loading,
      loadError,
      savingVolunteers,
      saveVolunteersError,
    } = this.props

    return (
      <Page>
        <PageHeader heading={volunteer && volunteer.fullName} />
        <PageBody error={loadError || saveVolunteersError}>
          {volunteer && questionnaire &&
            <QuestionnaireView
              model={volunteer}
              questionnaire={questionnaire}
              loading={loading || savingVolunteers}
            />
          }
          {volunteer && volunteer.roles && this.isAdmin &&
            <Box>
              <BoxHeader heading="Administration" />
              <BoxBody loading={loading || savingVolunteers}>
                <Col sm={6}>
                  <h4>Status: {volunteer.status}</h4>
                  <ButtonToolbar>
                    <Button
                      bsStyle="success"
                      disabled={loading || volunteer.status === 'Active'}
                      onClick={this.saveVolunteer('Active')}
                    >
                      Active
                    </Button>
                    <Button
                      bsStyle="warning"
                      disabled={loading || volunteer.status === 'Inactive'}
                      onClick={this.saveVolunteer('Inactive')}
                    >
                      Inactive
                    </Button>
                  </ButtonToolbar>
                </Col>
                <Col sm={6}>
                  <RoleSelector
                    toggleRole={this.toggleRole}
                    roles={volunteer.roles}
                  />
                </Col>
              </BoxBody>
            </Box>
          }
          {volunteer &&
            <div className="text-right">
              <Link
                className="btn btn-success"
                to={`/volunteers/${volunteer._id}/edit`}
              >
                Edit
              </Link>
              {this.isAdmin && ' '}
              {this.isAdmin &&
                <Button
                  bsStyle="danger"
                  disabled={loading}
                  onClick={this.deleteVolunteer(volunteer)}
                >
                  Delete
                </Button>
              }
              {' '}
              <Link
                className="btn btn-primary"
                to={this.isAdmin ? '/volunteers/list' : '/volunteers'}
              >
                Cancel
              </Link>
            </div>
          }
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VolunteerView)
