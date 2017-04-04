import React, {Component} from 'react'
import {connect} from 'react-redux'
import {stateGo} from 'redux-ui-router'
import set from 'lodash/set'

import {Form} from '../../common/services/form'
import {selectors} from '../../../store'
import {loadDonor, saveDonor} from '../../../store/donor'
import {loadFields} from '../../../store/field'
import {loadFoods} from '../../../store/food-category'
import {loadSections} from '../../../store/section'

import Page from '../../common/components/Page'
import DynamicForm from '../../common/components/DynamicForm'

const mapStateToProps = state => ({
  user: state.auth.user,
  savingDonors: selectors.savingDonors(state),
  saveDonorsError: selectors.saveDonorsError(state),
  loadingDonors: selectors.loadingDonors(state),
  loadDonorsError: selectors.loadDonorsError(state),
  getDonor: selectors.getOneDonor(state),
  donorId: state.router.currentParams.donorId,
  formData: selectors.getFormData(state),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state)
});

const mapDispatchToProps = dispatch => ({
  loadDonor: (id, admin) => dispatch(loadDonor(id, admin)),
  saveDonor: (donor, admin) => dispatch(saveDonor(donor, admin)),
  loadFormData: () => {
    dispatch(loadFoods());
    dispatch(loadFields());
    dispatch(loadSections());
  },
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

class DonorEdit extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = props.user.roles.find(role => role === 'admin')
    this.formMethods = Form.methods
    this.state = {
      donorModel: null,
      donorForm: null,
      error: null,
    }
  }

  componentWillMount() {
    this.props.loadDonor(this.props.donorId, this.isAdmin);
    this.props.loadFormData();
  }

  componentWillReceiveProps(nextProps) {
    const {
      savingDonors,
      saveDonorsError,
      loadingDonors,
      loadDonorsError,
      loadingFormData,
      loadFormDataError,
      getDonor,
      formData
    } = nextProps

    // Tried to save donor
    if (!savingDonors && this.props.savingDonors) {
      if (saveDonorsError) this.setState({error: saveDonorsError})
      else this.props.push(this.isAdmin ? 'root.listDonors' : 'root')
    }

    // Tried to load donor
    if (!loadingDonors && this.props.loadingDonors) {
      this.setState({error: loadDonorsError})
    }

    // Tried to load form data
    if (!loadingFormData && this.props.loadingFormData) {
      if (loadFormDataError) this.setState({error: loadFormDataError})
      else this.formData = formData
    }

    // Set up form if data loaded and not already done
    const donor = getDonor(nextProps.donorId)
    if (donor && this.formData && !this.state.donorForm) {
      const donorModel = {...donor}
      const donorForm = this.formMethods.generate(donorModel,
                                  this.formData, 'qDonors')

      this.setState({donorModel, donorForm})
    }
  }

  saveDonor = ev => {
    ev.preventDefault()
    this.props.saveDonor(this.state.donorModel, this.isAdmin)
  }

  handleFieldChange = (field, value) => ev => {
    if (!value) value = ev.target.value
    let items

    if (ev.target.type === 'checkbox')
      items = this.formMethods.toggleCheckbox(this.state.donorModel, field, value)

    const donorModel = set({...this.state.donorModel}, field, items || value)
    this.setState({donorModel})
  }

  render() {
    const {donorModel, donorForm, error} = this.state
    if (!donorModel || !donorForm) return null
    return (
      <Page heading={`${donorModel.firstName} ${donorModel.lastName}`}>
        <div className="row">
          <div className="col-xs-12">
            <form name="donorForm" onSubmit={this.saveDonor}>
              <DynamicForm
                sectionNames={donorForm.sectionNames}
                dynForm={donorForm.dynForm}
                dynType={donorModel}
                foodList={donorForm.foodList}
                handleFieldChange={this.handleFieldChange}
              />
              <div className="row">
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <button type="submit" className="btn btn-success btn-block top-buffer">Update</button>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-2">
                  <a
                    className="btn btn-primary btn-block top-buffer"
                    href={this.isAdmin ? '/#!/admin/donors' : '/#!/'}>Cancel</a>
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

export default connect(mapStateToProps, mapDispatchToProps)(DonorEdit)
