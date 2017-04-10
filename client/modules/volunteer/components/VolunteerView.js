import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Col, Row} from 'react-bootstrap'

import {Form} from '../../../lib/form'
import {selectors} from '../../../store'
import {loadVolunteer, saveVolunteer, deleteVolunteer} from '../volunteer-reducer'
import {loadFields} from '../../questionnaire/field-reducer'
import {loadFoods} from '../../food/food-category-reducer'
import {loadSections} from '../../questionnaire/section-reducer'

import DynamicView from '../../../components/DynamicView'
import Page from '../../../components/Page'

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user,
  savingVolunteer: state.volunteer.saving,
  saveVolunteerError: state.volunteer.saveError,
  loadingVolunteers: selectors.loadingVolunteers(state),
  loadVolunteersError: selectors.loadVolunteersError(state),
  getVolunteer: selectors.getOneVolunteer(state),
  volunteerId: ownProps.match.params.volunteerId,
  formData: selectors.getFormData(state),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state)
})

const mapDispatchToProps = dispatch => ({
  loadVolunteer: (id, admin) => dispatch(loadVolunteer(id, admin)),
  saveVolunteer: (volunteer, admin) => dispatch(saveVolunteer(volunteer, admin)),
  deleteVolunteer: volunteer => dispatch(deleteVolunteer(volunteer.id)),
  loadFormData: () => {
    dispatch(loadFoods())
    dispatch(loadFields())
    dispatch(loadSections())
  }
})

class VolunteerView extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = props.user.roles.find(role => role === 'admin')
    this.state = {
      volunteerModel: null,
      volunteerView: null,
      error: null
    }
  }

  componentWillMount() {
    this.props.loadVolunteer(this.props.volunteerId, this.isAdmin)
    this.props.loadFormData()
  }

  componentWillReceiveProps(nextProps) {
    const {
      savingVolunteer,
      saveVolunteerError,
      loadingVolunteers,
      loadVolunteersError,
      loadingFormData,
      loadFormDataError,
      getVolunteer
    } = nextProps

    // Tried to save volunteer
    if (this.props.savingVolunteer && !savingVolunteer) {
      this.setState({error: saveVolunteerError})
    }

    // Tried to load volunteer
    if (this.props.loadingVolunteers && !loadingVolunteers) {
      this.setState({error: loadVolunteersError})
    }

    // Tried to load form data
    if (this.props.loadingFormData && !loadingFormData) {
      if (loadFormDataError) this.setState({error: loadFormDataError})
      else this.formData = nextProps.formData
    }

    // generate volunteer view
    const volunteer = getVolunteer(nextProps.volunteerId)
    if (volunteer && this.formData && !this.state.volunteerView) {
      const volunteerModel = {...volunteer}

      this.setState({
        volunteerModel,
        volunteerView: Form.methods.generate(volunteerModel, this.formData, 'qVolunteers')
      })
    }
  }

  saveVolunteer = status => () => {
    if (!this.state.volunteerModel) return
    if (status === 'Driver') {
      return this.props.saveVolunteer({
        ...this.state.volunteerModel,
        status: 'Active',
        driver: true
      }, this.isAdmin)
    }
    this.props.saveVolunteer({
      ...this.state.volunteerModel,
      status,
      driver: false
    }, this.isAdmin)
  }

  deleteVolunteer = volunteer => () => this.props.deleteVolunteer(volunteer)

  render() {
    const {volunteerModel, volunteerView, error} = this.state
    if (!volunteerModel || !volunteerView) return null
    return (
      <Page
        heading={volunteerModel.fullName}
        error={error}
      >
        <Row>
          <Col xs={12}>
            <DynamicView
              model={volunteerModel}
              dynForm={volunteerView.dynForm}
              sectionNames={volunteerView.sectionNames}
            />
            {this.isAdmin ?
              <div className="form-group">
                <a
                  className="btn btn-info"
                  onClick={this.saveVolunteer('Driver')}
                >
                  Driver
                </a>
                <a
                  className="btn btn-success"
                  onClick={this.saveVolunteer('Active')}
                >
                  Active
                </a>
                <a
                  className="btn btn-warning"
                  onClick={this.saveVolunteer('Inactive')}
                >
                  Inactive
                </a>
                <a
                  className="btn btn-danger"
                  onClick={this.deleteVolunteer(volunteerModel)}
                >
                  Delete
                </a>
                <Link
                  className="btn btn-primary"
                  to={`/volunteers/${volunteerModel.id}/edit`}
                >
                  Edit
                </Link>
                <Link
                  className="btn btn-danger"
                  to="/volunteers"
                >
                  Cancel
                </Link>
              </div> :
              <div className="form-group">
                <Link
                  className="btn btn-primary"
                  to={`/volunteers/${volunteerModel.id}/edit`}
                >
                  Edit
                </Link>
                <Link
                  className="btn btn-danger"
                  to="/"
                >
                  Cancel
                </Link>
              </div>
            }
          </Col>
        </Row>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VolunteerView)
