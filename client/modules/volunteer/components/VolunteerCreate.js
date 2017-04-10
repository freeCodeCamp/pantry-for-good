import React, {Component} from 'react'
import {connect} from 'react-redux'
import set from 'lodash/set'
import {utc} from 'moment'
import {Link} from 'react-router-dom'
import {Row, Col} from 'react-bootstrap'

import {Form} from '../../../lib/form'
import {selectors} from '../../../store'
import {saveVolunteer} from '../volunteer-reducer'
import {loadFields} from '../../questionnaire/field-reducer'
import {loadFoods} from '../../food/food-category-reducer'
import {loadSections} from '../../questionnaire/section-reducer'

import AssistanceInfo from '../../../components/AssistanceInfo'
import DynamicForm from '../../../components/DynamicForm'
import Page from '../../../components/Page'
import VolunteerWaiver from './VolunteerWaiver'

const mapStateToProps = state => ({
  user: state.auth.user,
  savingVolunteers: selectors.savingVolunteers(state),
  saveVolunteersError: selectors.saveVolunteersError(state),
  formData: selectors.getFormData(state),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state),
  settings: state.settings.data,
})

const mapDispatchToProps = dispatch => ({
  saveVolunteer: volunteer => dispatch(saveVolunteer(volunteer)),
  loadFormData: () => {
    dispatch(loadFoods())
    dispatch(loadFields())
    dispatch(loadSections())
  }
})

class VolunteerCreate extends Component {
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
    this.props.loadFormData()
  }

  componentWillReceiveProps(nextProps) {
    const {
      savingVolunteers,
      saveVolunteersError,
      loadingFormData,
      loadFormDataError
    } = nextProps

    // Tried to save volunteer
    if (this.props.savingVolunteers && !savingVolunteers) {
      this.setState({error: saveVolunteersError})
    }

    // Tried to load form data
    if (this.props.loadingFormData && !loadingFormData) {
      if (loadFormDataError) this.setState({error: loadFormDataError})
      else this.formData = nextProps.formData
    }

    if (this.formData && !this.state.volunteerForm) {
      const volunteerModel = {...this.props.user}
      this.setState({
        volunteerModel,
        volunteerForm: Form.methods.generate(volunteerModel, this.formData, 'qVolunteers')
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

  isMinor = () => {
    const dateOfBirth = this.state.volunteerModel.dateOfBirth
    return dateOfBirth && utc().diff(dateOfBirth, 'years') < 18
  }

  render() {
    const {volunteerForm, volunteerModel, error} = this.state
    const {settings} = this.props
    if (!settings || !volunteerForm) return null
    return (
      <Page
        showLogo
        center
        heading="Volunteer Application"
        error={error}
      >
        <AssistanceInfo supportNumber={settings.supportNumber} />
        <Row>
          <Col xs={12}>
            <form name="volunteerForm" onSubmit={this.saveVolunteer}>
              <DynamicForm
                sectionNames={volunteerForm.sectionNames}
                dynForm={volunteerForm.dynForm}
                dynType={volunteerModel}
                handleFieldChange={this.handleFieldChange}
              />
              <VolunteerWaiver
                settings={settings}
                model={volunteerModel}
                onFieldChange={this.handleFieldChange}
                isMinor={this.isMinor()}
              />
              <Row>
                <Col sm={6} md={4} lg={2}>
                  <button type="submit" className="btn btn-success btn-block top-buffer">Submit</button>
                </Col>
                <Col sm={6} md={4} lg={2}>
                  <Link className="btn btn-primary btn-block top-buffer" to="/">Cancel</Link>
                </Col>
              </Row>
            </form>
          </Col>
        </Row>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VolunteerCreate)
