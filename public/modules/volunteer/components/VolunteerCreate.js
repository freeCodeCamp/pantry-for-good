import React, {Component} from 'react'
import {connect} from 'react-redux'
import {stateGo} from 'redux-ui-router'
import set from 'lodash/set'
import {utc} from 'moment'

import {Form} from '../../common/services/form'
import {selectors} from '../../../store';
import {saveVolunteer} from '../../../store/volunteer';
import {loadFields} from '../../../store/field';
import {loadFoods} from '../../../store/food-category';
import {loadSections} from '../../../store/section';

import Page from '../../common/components/Page'
import DynamicForm from '../../common/components/DynamicForm'
import FoodbankLogo from '../../common/components/FoodbankLogo'

const mapStateToProps = state => ({
  user: state.auth.user,
  savingVolunteers: selectors.savingVolunteers(state),
  saveVolunteersError: selectors.saveVolunteersError(state),
  formData: selectors.getFormData(state),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state),
  settings: state.settings.data,
});

const mapDispatchToProps = dispatch => ({
  saveVolunteer: volunteer => dispatch(saveVolunteer(volunteer)),
  loadFormData: () => {
    dispatch(loadFoods());
    dispatch(loadFields());
    dispatch(loadSections());
  },
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

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
    if (this.props.savingVolunteer && !savingVolunteer) {
      this.setState({error: savingVolunteerError})
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

  isMinor = (dateOfBirth) => utc().diff(dateOfBirth, 'years') < 18

  render() {
    const {volunteerForm, volunteerModel, error} = this.state
    const {settings} = this.props
    if (!settings || !volunteerForm) return null
    return (
      <div>
        <section className="content-header text-center">
          <FoodbankLogo />
          <h1>Volunteer Application</h1>
          <br />
          <div className="alert alert-info text-left">
            <i className="icon fa fa-warning"></i>For assistance with this application, please contact our support line at
            {settings.supportNumber}.
          </div>
        </section>
        <section className="content">
          <div className="row">
            <div className="col-xs-12">
              <form name="volunteerForm" onSubmit={this.saveVolunteer}>
                <DynamicForm
                  sectionNames={volunteerForm.sectionNames}
                  dynForm={volunteerForm.dynForm}
                  dynType={volunteerModel}
                  handleFieldChange={this.handleFieldChange}
                />
                <div className="box box-solid box-primary">
                  <div className="box-header">
                    <h3 className="box-title">
                      VOLUNTEER RELEASE AND WAIVER OF LIABILITY – READ BEFORE SIGNING<br />
                      (BY SIGNING THIS AGREEMENT YOU WILL WAIVER CERTAIN LEGAL RIGHTS, INCLUDING THE RIGHT TO SUE)
                    </h3>
                  </div>
                  <div className="box-body">
                    <span>{settings.mission}</span>
                    <ol>
                      <li>
                        {`Policies and Safety Rules. For my safety and that of others, I will comply with ${settings.organization}’s volunteer policies and safety rules and its other directors for all volunteer activities.`}
                      </li>
                      <li>
                        {`Awareness and Assumption of Risk. I understand that my volunteer activities may have inherit risks that may arise from the activities themselves, ${settings.organization}’s operations, my own actions or inactions, or the actions or inactions of ${settings.organization}, its trustees, directors, employees, and agents, other volunteers, and others present. These risks may include, but are not limited to, working around vehicles, lifting objects, and performing repetitive tasks. I assume full responsibility for any and all risks of bodily injury, death or property damage caused by or arising directly or indirectly from my presence or participation at ${settings.organization}’s activities, regardless of the cause.`}
                      </li>
                      <li>
                        {`Waiver and Release of Claims. I waive and release any and all claims against ${settings.organization}, its trustees, directors, officers, officials, employees, volunteers, donors, sponsors, beneficiaries, sponsoring agencies and affiliates (collectively, the “Released Parties”), for any liability, loss, damages, claims, expenses and legal fees resulting from death, or injury to my person or property, caused by or arising directly or indirectly from my presence at ${settings.organization}, or participation in activities on behalf of ${settings.organization}, regardless of the cause even if caused by negligence, whether passive or active. I agree not to sue any of the Released Parties on the basis of these waived and released claims. I understand that ${settings.organization} would not permit me to volunteer without my agreeing to these waivers and releases.`}
                      </li>
                      <li>
                        }`Medical Care Consent and Waiver. I authorize ${settings.organization} to provide to me first aid and, through medical personnel of its choice, medical assistance, transportation, and emergency medical services. This consent does not impose a duty upon ${settings.organization} to provide such assistance, transportation, or services. In addition, I waive and release any claims against the Released Parties arising out of any first aid, treatment, or medical service, including the lack or timing of such, made in connection with my volunteer activities with ${settings.organization}.`}
                      </li>
                      <li>
                        {`Indemnification. I will defend, indemnify, and hold the Released Parties harmless from and against any and all loss, damages, claims, expenses and legal fees that may be suffered by any Released Party resulting directly or indirectly from my volunteer activities for ${settings.organization}, except and only to extent the liability is caused by gross negligence or willful misconduct of the relevant Released Party.`}
                      </li>
                      <li>
                        {`Publicity. I consent to the unrestricted use of my image, voice, name and/or story in any format including video, print, or electronic (collectively the “Materials”) that the Released Parties or others may create in connection with my participation in activities at or for ${settings.organization}. ${settings.organization} may make Materials available at its discretion to third parties, including photos or streamed or other videos, on ${settings.organization}’s websites and internal displays, in publications, or through and other media, including social networking websites. I waive any right to inspect or approve the finished product and acknowledge that I am not entitled to any compensation for creation or use of the finished product.`}
                      </li>
                      <li>
                        {`Confidentiality. As a volunteer, I may have access to sensitive or confidential information. This information includes, but is not limited to, identity, address, contact information, and financial information. At all times during and after my participation, I agree to hold in confidence and not disclose or use any such confidential information except as required in my volunteer activities or as expressly authorized in writing by ${settings.organization}’s executives.`}
                      </li>
                      <li>
                        {`Volunteer Not an Employee. I understand that (i) I am not an employee of ${settings.organization}, (ii) that I will not be paid for my participation, and (iii) I am not covered by or eligible for any insurance, health care, worker’s compensation, or other benefits. I may choose at any time not to participate in an activity, or to stop my participation entirely, with ${settings.organization}.`}
                      </li>
                      <p>
                        <strong>I HAVE READ THIS WAIVER AND RELEASE OF LIABILITY, FULLY UNDERSTAND ITS TERMS, UNDERSTAND THAT I HAVE ASSUMED SIGNIFICANT RISKS AND GIVEN UP SUBSTANTIAL RIGHTS BY SIGNING IT, AND SIGN IT FREELY AND VOLUNTARILY WITHOUT ANY INDUCEMENT.</strong>
                      </p>
                      <div className="row">
                        <div className="col-xs-4 col-md-6 col-lg-4">
                          <div className="form-group">
                            <div>
                              <label className="checkbox-inline">
                                <input
                                  type="checkbox"
                                  value={volunteerModel.disclaimerAgree}
                                  onChange={this.handleFieldChange('disclaimerAgree')}
                                  required
                                />I agree
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-xs-8 col-md-6 col-lg-4">
                          <div className="form-group">
                            <input
                              disabled={!volunteerModel.disclaimerAgree}
                              className="form-control"
                              type="text"
                              value={volunteerModel.disclaimerSign}
                              onChange={this.handleFieldChange('disclaimerSign')}
                              placeholder="Sign here"
                              required
                            />
                          </div>
                        </div>
                        <div className="clearfix"></div>
                        {this.isMinor() &&
                          <div>
                            <div className="col-md-6 col-lg-4">
                              <div className="form-group">
                                <label>Parent/Guardian Signature</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={volunteerModel.disclaimerSignGuardian}
                                  onChange={this.handleFieldChange('disclaimerSignGuardian')}
                                />
                              </div>
                            </div>
                            <div className="col-md-6 col-lg-4">
                              <div className="form-group">
                                <label>Parent/Guardian Email</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  value={volunteerModel.disclaimerGuardianEmail}
                                  onChange={this.handleFieldChange('disclaimerGuardianEmail')}
                                />
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    </ol>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6 col-md-4 col-lg-2">
                    <button type="submit" className="btn btn-success btn-block top-buffer">Submit</button>
                  </div>
                  <div className="col-sm-6 col-md-4 col-lg-2">
                    <a className="btn btn-primary btn-block top-buffer" href="/#!/">Cancel</a>
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

export default connect(mapStateToProps, mapDispatchToProps)(VolunteerCreate)
