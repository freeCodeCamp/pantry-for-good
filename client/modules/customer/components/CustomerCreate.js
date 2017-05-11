import React, {Component} from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

import {fromForm, toForm} from '../../../lib/fields-adapter'
import selectors from '../../../store/selectors'
import {saveCustomer} from '../reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import {Page, PageHeader, PageBody} from '../../../components/page'
import AssistanceInfo from '../../../components/AssistanceInfo'
import {Questionnaire} from '../../../components/questionnaire'

const FORM_NAME = 'questionnaireForm'

const mapStateToProps = state => ({
  user: selectors.user.getUser(state),
  savingCustomers: selectors.customer.saving(state),
  saveCustomersError: selectors.customer.saveError(state),
  questionnaire: selectors.questionnaire.getOne(state)('qCustomers'),
  loading: selectors.questionnaire.loading(state) ||
    selectors.settings.fetching(state),
  loadError: selectors.questionnaire.loadError(state) ||
    selectors.settings.error(state),
  settings: selectors.settings.getSettings(state),
})

const mapDispatchToProps = dispatch => ({
  saveCustomer: customer => dispatch(saveCustomer(customer)),
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  submit: form => dispatch(submit(form))
})

class CustomerCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      customerModel: {
        ...props.user,
        household: [],
        foodPreferences: [],
        fields: []
      }
    }
  }

  isAdmin = this.props.user.roles.find(r => r === 'admin')

  componentWillMount() {
    this.props.loadQuestionnaires()
  }

  saveCustomer = fields => {
    this.props.saveCustomer({
      ...this.state.customerModel,
      fields: fromForm(fields)
    }, this.isAdmin)
  }

  submit = () => this.props.submit(FORM_NAME)

  render() {
    const {settings, questionnaire, loading, loadError} = this.props
    const {customerModel} = this.state

    return (
      <Page>
        <PageHeader
          heading="Client Request for Assistance Application"
          showLogo
          center
        >
          {settings &&
            <AssistanceInfo
              settings={settings}
              heading="Please fill out the following form"
            >
              <p>To check on your application status, you may call our client intake line at {settings.clientIntakeNumber.replace(/ /g, "\u00a0")}.
              </p>
              <p>Once submitted, your application will be reviewed and you will be contacted directly.
              </p>
            </AssistanceInfo>
          }
        </PageHeader>
        <PageBody>
          <form onSubmit={this.saveCustomer}>
            {questionnaire &&
              <Questionnaire
                form={FORM_NAME}
                model={customerModel}
                questionnaire={questionnaire}
                loading={loading}
                onSubmit={this.saveCustomer}
                initialValues={toForm(customerModel, questionnaire)}
              />
            }
            <div className="text-right">
              <Button
                type="button"
                onClick={this.submit}
                bsStyle="success"
              >
                Submit
              </Button>
              {' '}
              <Link
                to="/"
                className="btn btn-primary"
              >
                Cancel
              </Link>
            </div>
          </form>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerCreate)
