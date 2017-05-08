import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Col} from 'react-bootstrap'

import {selectors, deliverySelectors} from '../../../store'
import {loadCustomers} from '../../customer/customer-reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/questionnaire-api'
import {loadSettings} from '../../settings/settings-reducer'
import {loadVolunteers} from '../../volunteer/volunteer-reducer'

import {Page, PageBody} from '../../../components/page'
import {Box, BoxBody, BoxHeader} from '../../../components/box'
import SelectCustomersTable from './driver-assignment/SelectCustomersTable'
import AssignDriverForm from './driver-assignment/AssignDriverForm'
import SelectCustomersMap from './driver-assignment/SelectCustomersMap'

const mapStateToProps = state => ({
  assigning: deliverySelectors.assignment.isFetching(state),
  assignError: deliverySelectors.assignment.hasError(state),
  directing: deliverySelectors.route.isFetching(state),
  loading: selectors.loadingCustomers(state) || selectors.loadingQuestionnaires(state) ||
    state.settings.fetching || selectors.loadingVolunteers(state),
  loadError: selectors.loadCustomersError(state) || selectors.loadQuestionnairesError(state) || selectors.loadVolunteersError(state) || state.settings.error
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
              <BoxBody loading={loading || assigning || directing} error={loadError || assignError}  >
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
