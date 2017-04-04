import React, {Component} from 'react'
import {connect} from 'react-redux'
import {stateGo} from 'redux-ui-router'
import moment from 'moment'
import {Table} from 'react-bootstrap'

import {View} from '../../core/services/view.client.service'
import {selectors} from '../../../store';
import {loadVolunteer, saveVolunteer, deleteVolunteer} from '../../../store/volunteer';
import {loadFields} from '../../../store/field';
import {loadFoods} from '../../../store/food-category';
import {loadSections} from '../../../store/section';

import DynamicView from '../../common/components/DynamicView'
import Page from '../../common/components/Page'

const mapStateToProps = state => ({
  user: state.auth.user,
  savingVolunteer: state.volunteer.saving,
  saveVolunteerError: state.volunteer.saveError,
  loadingVolunteers: selectors.loadingVolunteers(state),
  loadVolunteersError: selectors.loadVolunteersError(state),
  getVolunteer: selectors.getOneVolunteer(state),
  volunteerId: state.router.currentParams.volunteerId,
  formData: selectors.getFormData(state),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state)
});

const mapDispatchToProps = dispatch => ({
  loadVolunteer: (id, admin) => dispatch(loadVolunteer(id, admin)),
  saveVolunteer: (volunteer, admin) => dispatch(saveVolunteer(volunteer, admin)),
  deleteVolunteer: volunteer => dispatch(deleteVolunteer(volunteer.id)),
  loadFormData: () => {
    dispatch(loadFoods());
    dispatch(loadFields());
    dispatch(loadSections());
  },
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

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
        volunteerView: View.methods.generate(volunteerModel, this.formData, 'qVolunteers')
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
      <Page heading={volunteerModel.fullName}>
        <div className="row">
          <div className="col-xs-12">
            <DynamicView
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
                <a
                  className="btn btn-primary"
                  href={`/#!/admin/volunteers/${volunteerModel.id}/edit`}
                >
                  Edit
                </a>
                <a
                  className="btn btn-danger"
                  href="/#!/admin/volunteers"
                >
                  Cancel
                </a>
              </div> :
              <div className="form-group">
                <a
                  className="btn btn-primary"
                  href={`/#!/volunteer/${volunteer.id}/edit`}
                >
                  Edit
                </a>
                <a
                  className="btn btn-danger"
                  href="/#!/"
                >
                  Cancel
                </a>
              </div>
            }
          </div>
        </div>
        {error &&
          <div className="text-danger">
            <strong>{error}</strong>
          </div>
        }
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VolunteerView)
