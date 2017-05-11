import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {ButtonToolbar, Button} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {loadVolunteer, saveVolunteer, deleteVolunteer} from '../reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import {Box, BoxHeader, BoxBody} from '../../../components/box'
import {Page, PageBody, PageHeader} from '../../../components/page'
import {QuestionnaireView} from '../../../components/questionnaire-view'

const mapStateToProps = (state, ownProps) => {
  const {volunteerId} = ownProps.match.params
  return {
    user: selectors.user.getUser(state),
    savingVolunteers: selectors.volunteer.saving(state),
    saveVolunteersError: selectors.volunteer.saveError(state),
    volunteer: selectors.volunteer.getOne(state)(volunteerId),
    volunteerId,
    questionnaire: selectors.questionnaire.getOne(state)('qVolunteers'),
    loading: selectors.questionnaire.loading(state) ||
      selectors.volunteer.loading(state),
    loadError: selectors.questionnaire.loadError(state) ||
      selectors.volunteer.loadError(state)
  }
}

const mapDispatchToProps = dispatch => ({
  loadVolunteer: (id, admin) => dispatch(loadVolunteer(id, admin)),
  saveVolunteer: (volunteer, admin) => dispatch(saveVolunteer(volunteer, admin)),
  deleteVolunteer: volunteer => dispatch(deleteVolunteer(volunteer.id)),
  loadQuestionnaires: () => dispatch(loadQuestionnaires())
})

class VolunteerView extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = props.user.roles.find(role => role === 'admin')
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

  deleteVolunteer = volunteer => () => this.props.deleteVolunteer(volunteer)

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
          {volunteer && this.isAdmin &&
            <Box>
              <BoxHeader heading={`Status: ${volunteer.driver ? 'Driver' : volunteer.status}`} />
              <BoxBody loading={loading}>
                <ButtonToolbar>
                  <Button
                    bsStyle="info"
                    disabled={loading || volunteer.driver}
                    onClick={this.saveVolunteer('Driver')}
                  >
                    Driver
                  </Button>
                  <Button
                    bsStyle="success"
                    disabled={loading || volunteer.status === 'Active' && !volunteer.driver}
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
              </BoxBody>
            </Box>
          }
          {volunteer &&
            <div className="text-right">
              <Link
                className="btn btn-success"
                to={`/volunteers/${volunteer.id}/edit`}
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
                to={this.isAdmin ? '/volunteers' : '/'}
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
