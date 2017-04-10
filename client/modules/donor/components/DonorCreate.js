import React, {Component} from 'react'
import {connect} from 'react-redux'
import set from 'lodash/set'
import {Link} from 'react-router-dom'

import {Form} from '../../../lib/form'
import {selectors} from '../../../store';
import {saveDonor} from '../donor-reducer';
import {loadFields} from '../../questionnaire/field-reducer';
import {loadFoods} from '../../food/food-category-reducer';
import {loadSections} from '../../questionnaire/section-reducer';

import Page from '../../../components/Page'
import DynamicForm from '../../../components/DynamicForm'
import FoodbankLogo from '../../../components/FoodbankLogo'

const mapStateToProps = state => ({
  user: state.auth.user,
  savingDonors: selectors.savingDonors(state),
  saveDonorsError: selectors.saveDonorsError(state),
  formData: selectors.getFormData(state),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state),
  settings: state.settings.data,
});

const mapDispatchToProps = dispatch => ({
  saveDonor: donor => dispatch(saveDonor(donor)),
  loadFormData: () => {
    dispatch(loadFoods());
    dispatch(loadFields());
    dispatch(loadSections());
  }
});

class DonorCreate extends Component {
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
    this.props.loadFormData();
  }

  componentWillReceiveProps(nextProps) {
    const {
      savingDonors,
      saveDonorsError,
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

    // Tried to load form data
    if (!loadingFormData && this.props.loadingFormData) {
      if (loadFormDataError) this.setState({error: loadFormDataError})
      else this.formData = formData
    }

    // Set up form if data loaded and not already done
    if (this.formData && !this.state.donorForm) {
      const donorModel = {...this.props.user}
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
    const {settings} = this.props
    if (!donorModel || !donorForm) return null
    return (
      <div>
        <section className="content-header text-center">
          <FoodbankLogo />
          <h1>Donor Profile Creation</h1>
          <br />
          <div className="alert alert-info text-left">
            <i className="icon fa fa-warning"></i>For assistance with this application, please contact our support line at
            {settings.supportNumber}.
          </div>
        </section>
        <section className="content">
          <div className="row">
            <div className="col-xs-12">
              <form name="donorForm" onSubmit={this.saveDonor}>
                <DynamicForm
                  sectionNames={donorForm.sectionNames}
                  dynForm={donorForm.dynForm}
                  dynType={donorModel}
                  handleFieldChange={this.handleFieldChange}
                />
                <div className="row">
                  <div className="col-sm-6 col-md-4 col-lg-2">
                    <button type="submit" className="btn btn-success btn-block top-buffer">Submit</button>
                  </div>
                  <div className="col-sm-6 col-md-4 col-lg-2">
                    <Link className="btn btn-primary btn-block top-buffer" to="/">Cancel</Link>
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
        </section>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DonorCreate)
