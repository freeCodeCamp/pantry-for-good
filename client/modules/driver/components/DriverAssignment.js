import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Col} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {loadCustomers} from '../../customer/reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'
import {loadSettings} from '../../settings/reducers/settings'
import {loadVolunteers} from '../../volunteer/reducer'

import {Page, PageBody} from '../../../components/page'
import AssignmentForm from './driver-assignment/AssignmentForm'
import SelectCustomersMap from './driver-assignment/map/SelectCustomersMap'

const mapStateToProps = state => ({
  assigning: selectors.delivery.assignment.isFetching(state),
  assignError: selectors.delivery.assignment.hasError(state),
  directing: selectors.delivery.route.isFetching(state),
  directingError: selectors.delivery.route.hasError(state),
  loading: selectors.customer.loading(state) ||
    selectors.questionnaire.loading(state) ||
    selectors.settings.fetching(state) ||
    selectors.volunteer.loading(state) ||
    selectors.volunteer.saving(state),
  loadError: selectors.customer.loadError(state) ||
    selectors.questionnaire.loadError(state) ||
    selectors.volunteer.loadError(state) ||
    selectors.volunteer.saveError(state) ||
    selectors.settings.error(state),
  route: selectors.delivery.route.getRoute(state)
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
          <Col sm={7} md={6} lg={5}>
            <AssignmentForm
              loading={loading || assigning || directing}
              error={loadError || assignError || directingError}
            />
          </Col>
          <Col sm={5} md={6} lg={7}>
            <SelectCustomersMap />
          </Col>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DriverRoutes)
