import React, {Component} from 'react'
import {connect} from 'react-redux'
import {stateGo} from 'redux-ui-router'
import set from 'lodash/set'
import {utc} from 'moment'

import {Form} from '../../common/services/form'
import {selectors} from '../../../store';
import {loadVolunteer, saveVolunteer} from '../../../store/volunteer';
import {loadFields} from '../../../store/field';
import {loadFoods} from '../../../store/food-category';
import {loadSections} from '../../../store/section';

import Page from '../../common/components/Page'
import DynamicForm from '../../common/components/DynamicForm'

const mapStateToProps = state => ({
  user: state.auth.user,
  getVolunteer: selectors.getOneVolunteer(state),
  loadingVolunteer: selectors.loadingVolunteers(state),
  loadVolunteerError: selectors.loadVolunteersError(state),
  savingVolunteer: selectors.savingVolunteers(state),
  saveVolunteerError: selectors.saveVolunteersError(state),
  formData: selectors.getFormData(state),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state),
  volunteerId: state.router.currentParams.volunteerId,
  settings: state.settings.data,
});

const mapDispatchToProps = dispatch => ({
  loadVolunteer: (id, admin) => dispatch(loadVolunteer(id, admin)),
  saveVolunteer: (volunteer, admin) => dispatch(saveVolunteer(volunteer, admin)),
  loadFormData: () => {
    dispatch(loadFoods());
    dispatch(loadFields());
    dispatch(loadSections());
  },
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

class VolunteerEdit extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = props.user.roles.find(role => role === 'admin')
    this.formMethods = Form.methods
    this.state = {
      volunteerModel: null,
      volunteerForm: null,
      error: null,
    }
  }

  componentWillMount() {
    this.props.loadVolunteer(this.props.volunteerId, this.isAdmin)
    this.props.loadFormData()
  }

  componentWillReceiveProps(nextProps) {
    const {
      savingVolunteer,
      savingVolunteerError,
      loadingVolunteer,
      loadVolunteerError,
      loadingFormData,
      loadFormDataError,
      getVolunteer
    } = nextProps

    // Tried to save volunteer
    if (this.props.savingVolunteer && !savingVolunteer) {
      this.setState({error: savingVolunteerError})
    }

    // Tried to load volunteer
    if (this.props.loadingVolunteer && !loadingVolunteer) {
      this.setState({error: loadVolunteerError})
    }

    // Tried to load form data
    if (this.props.loadingFormData && !loadingFormData) {
      if (loadFormDataError) this.setState({error: loadFormDataError})
      else this.formData = nextProps.formData
    }

    const volunteer = getVolunteer(nextProps.volunteerId)
    if (volunteer && this.formData && !this.state.volunteerForm) {
      this.setState({
        volunteerModel: {...volunteer},
        volunteerForm: Form.methods.generate(volunteer, this.formData, 'qVolunteers')
      })
    }
  }

  saveVolunteer = ev => {
    ev.preventDefault()
    if (!this.state.volunteerModel) return
    this.props.saveVolunteer(this.state.volunteerModel, this.isAdmin)
  }

  handleFieldChange = (field, value) => ev => {
    if (!value) value = ev.target.value
    let items

    if (ev.target.type === 'checkbox')
      items = this.formMethods.toggleCheckbox(this.state.volunteerModel, field, value)

    const volunteerModel = set({...this.state.volunteerModel}, field, items || value)
    this.setState({volunteerModel})
  }

  render() {
    const {volunteerForm, volunteerModel, error} = this.state
    if (!volunteerModel || !volunteerForm) return null
    return (
      <Page heading={`${volunteerModel.firstName} ${volunteerModel.lastName}`}>
        <div className="row">
          <div className="col-xs-12">
            <form name="volunteerForm" onSubmit={this.saveVolunteer}>
              <DynamicForm
                sectionNames={volunteerForm.sectionNames}
                dynForm={volunteerForm.dynForm}
                dynType={volunteerModel}
                handleFieldChange={this.handleFieldChange}
              />
              <div className="row">
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <button type="submit" className="btn btn-success btn-block top-buffer">Update</button>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <a
                    className="btn btn-primary btn-block top-buffer"
                    href={this.isAdmin ? "/#!/admin/volunteers" : "/#!/"}
                  >Cancel</a>
                </div>
              </div>
              {error &&
                <div className="text-danger">
                  <strong>{error}</strong>
                </div>
              }
            </form>
          </div>
        </div>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VolunteerEdit)
