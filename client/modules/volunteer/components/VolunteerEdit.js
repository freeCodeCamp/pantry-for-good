import React, {Component} from 'react'
import {connect} from 'react-redux'
import set from 'lodash/set'
import {Link} from 'react-router-dom'
import {Row, Col} from 'react-bootstrap'

import {Form} from '../../../lib/form'
import {selectors} from '../../../store'
import {loadVolunteer, saveVolunteer} from '../volunteer-reducer'
import {loadFields} from '../../questionnaire/field-reducer'
import {loadFoods} from '../../food/food-category-reducer'
import {loadSections} from '../../questionnaire/section-reducer'

import {Page, PageBody, PageHeader} from '../../../components/page'
import DynamicForm from '../../../components/DynamicForm'

const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user,
  getVolunteer: selectors.getOneVolunteer(state),
  loadingVolunteer: selectors.loadingVolunteers(state),
  loadVolunteerError: selectors.loadVolunteersError(state),
  savingVolunteer: selectors.savingVolunteers(state),
  saveVolunteerError: selectors.saveVolunteersError(state),
  formData: selectors.getFormData(state),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state),
  volunteerId: ownProps.match.params.volunteerId,
  settings: state.settings.data
})

const mapDispatchToProps = dispatch => ({
  loadVolunteer: (id, admin) => dispatch(loadVolunteer(id, admin)),
  saveVolunteer: (volunteer, admin) => dispatch(saveVolunteer(volunteer, admin)),
  loadFormData: () => {
    dispatch(loadFoods())
    dispatch(loadFields())
    dispatch(loadSections())
  }
})

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
      <Page>
        <PageHeader
          heading={`${volunteerModel.firstName} ${volunteerModel.lastName}`}
        />
        <PageBody error={error}>
          <Row>
            <Col xs={12}>
              <form name="volunteerForm" onSubmit={this.saveVolunteer}>
                <DynamicForm
                  sectionNames={volunteerForm.sectionNames}
                  dynForm={volunteerForm.dynForm}
                  dynType={volunteerModel}
                  handleFieldChange={this.handleFieldChange}
                />
                <Row>
                  <Col sm={6} md={4} lg={2}>
                    <button type="submit" className="btn btn-success btn-block top-buffer">Update</button>
                  </Col>
                  <Col sm={6} md={4} lg={2}>
                    <Link
                      className="btn btn-primary btn-block top-buffer"
                      to={this.isAdmin ? "/volunteers" : "/"}
                    >Cancel</Link>
                  </Col>
                </Row>
              </form>
            </Col>
          </Row>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VolunteerEdit)
