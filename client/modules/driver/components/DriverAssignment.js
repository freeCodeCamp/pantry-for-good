import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Col} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {loadCustomers} from '../../customer/reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'
import {loadSettings} from '../../settings/reducer'
import {loadVolunteers} from '../../volunteer/reducer'

import {Page, PageBody} from '../../../components/page'
import SelectCustomersTable from './driver-assignment/SelectCustomersTable'
import AssignDriverForm from './driver-assignment/AssignDriverForm'
import SelectCustomersMap from './driver-assignment/SelectCustomersMap'

const mapStateToProps = state => ({
  assigning: selectors.delivery.assignment.isFetching(state),
  assignError: selectors.delivery.assignment.hasError(state),
  directing: selectors.delivery.route.isFetching(state),
  directingError: selectors.delivery.route.hasError(state),
  loading: selectors.customer.loading(state) ||
    selectors.questionnaire.loading(state) ||
    selectors.settings.fetching(state) ||
    selectors.volunteer.loading(state),
  loadError: selectors.customer.loadError(state) ||
    selectors.questionnaire.loadError(state) ||
    selectors.volunteer.loadError(state) ||
    selectors.settings.error(state)
})

const mapDispatchToProps = dispatch => ({
  load: () => {
    dispatch(loadCustomers())
    dispatch(loadQuestionnaires())
    dispatch(loadSettings())
    dispatch(loadVolunteers())
  }
})

class DriverRoutes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showDrivers: true,
      showCustomers: false
    }
  }
  componentWillMount() {
    this.props.load()
  }

  render() {
    const {
      loading,
      loadError,
      assigning,
      assignError,
      directing,
      directingError
    } = this.props

    return (
      <Page>
        <PageBody>
          <Col md={6} lg={5}
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: 'calc(100vh - 130px)',
            }}
          >
            <AssignDriverForm
              loading={loading || assigning || directing}
              error={loadError || assignError || directingError}
              style={{flexShrink: 1}}
            />
            <SelectCustomersTable
              loading={loading || assigning || directing}
              error={loadError || assignError || directingError}
            />
          </Col>
          <Col md={6} lg={7}>
            <SelectCustomersMap />
          </Col>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DriverRoutes)
