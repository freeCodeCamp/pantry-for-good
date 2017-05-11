import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Col} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {loadCustomers} from '../../customer/reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'
import {loadSettings} from '../../settings/reducer'
import {loadVolunteers} from '../../volunteer/reducer'

import {Page, PageBody} from '../../../components/page'
import {Box, BoxBody, BoxHeader} from '../../../components/box'
import SelectCustomersTable from './driver-assignment/SelectCustomersTable'
import AssignDriverForm from './driver-assignment/AssignDriverForm'
import SelectCustomersMap from './driver-assignment/SelectCustomersMap'

const mapStateToProps = state => ({
  assigning: selectors.delivery.assignment.isFetching(state),
  assignError: selectors.delivery.assignment.hasError(state),
  directing: selectors.delivery.route.isFetching(state),
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
  componentWillMount() {
    this.props.load()
  }

  render() {
    const {loading, loadError, assigning, assignError, directing} = this.props

    return (
      <Page>
        <PageBody>
          <Col md={6} lg={5}>
            <Box>
              <BoxHeader heading="Driver Assignment" />
              <BoxBody
                loading={loading || assigning || directing}
                error={loadError || assignError}
              >
                {!loading && !loadError &&
                  <div className="overflow-scroll">
                    <AssignDriverForm />
                    <SelectCustomersTable />
                  </div>
                }
              </BoxBody>
            </Box>
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
