import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import {push} from 'react-router-redux'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import {fromForm, toForm} from '../../../lib/fields-adapter'
import selectors from '../../../store/selectors'
import {saveDonor} from '../reducers/donor'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import {Page, PageHeader, PageBody} from '../../../components/page'
import {Questionnaire} from '../../../components/questionnaire'
import AssistanceInfo from '../../../components/AssistanceInfo'

const FORM_NAME = 'donorForm'

const mapStateToProps = state => ({
  user: selectors.user.getUser(state),
  savingDonors: selectors.donor.saving(state),
  saveDonorsError: selectors.donor.saveError(state),
  questionnaire: selectors.questionnaire.getOne(state)('qDonors'),
  loading: selectors.questionnaire.loading(state) ||
    selectors.settings.fetching(state),
  loadError: selectors.questionnaire.loadError(state) ||
    selectors.settings.error(state),
  settings: selectors.settings.getSettings(state),
})

const mapDispatchToProps = dispatch => ({
  saveDonor: donor => dispatch(saveDonor(donor)),
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  push: route => dispatch(push(route)),
  submit: form => dispatch(submit(form))
})

class DonorCreate extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = props.user.roles.find(role => role === 'admin')
    this.donor = {
      ...this.props.user,
      fields: []
    }
  }

  componentWillMount() {
    this.props.loadQuestionnaires()
  }

  componentWillReceiveProps(nextProps) {
    const {savingDonors, saveDonorsError} = nextProps

    if (!savingDonors && this.props.savingDonors && !saveDonorsError) {
      this.props.push(this.isAdmin ? '/donors' : '/')
    }
  }

  saveDonor = form =>
    this.props.saveDonor(fromForm(form), this.isAdmin)

  submit = () => this.props.submit(FORM_NAME)

  render() {
    const {settings, questionnaire, loading, loadError, savingDonors} = this.props
    const error = loadError || this.props.saveDonorsError

    return (
      <Page>
        <PageHeader
          heading="Donor Profile Creation"
          showLogo
          center
        >
          {settings &&
            <AssistanceInfo settings={settings} />
          }
        </PageHeader>
        <PageBody error={error}>
          <form onSubmit={this.saveDonor}>
            {questionnaire &&
              <Questionnaire
                form={FORM_NAME}
                questionnaire={questionnaire}
                loading={loading || savingDonors}
                onSubmit={this.saveDonor}
                initialValues={toForm(this.donor, questionnaire)}
              />
            }
            <div className="text-right">
              <Button
                type="button"
                bsStyle="success"
                onClick={this.submit}
              >Submit</Button>
              {' '}
              <Link className="btn btn-primary" to="/">Cancel</Link>
            </div>
          </form>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DonorCreate)
