import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Table} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {loadVolunteers} from '../../volunteer/reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import {Box, BoxBody} from '../../../components/box'
import {Page, PageBody, PageHeader} from '../../../components/page'

const mapStateToProps = state => ({
  drivers: selectors.volunteer.getAllDrivers(state),
  loading: selectors.volunteer.loading(state) ||
    selectors.questionnaire.loading(state),
  loadError: selectors.volunteer.loadError(state) ||
    selectors.questionnaire.loadError(state)
})

const mapDispatchToProps = dispatch => ({
  loadVolunteers: () => dispatch(loadVolunteers()),
  loadQuestionnaires: () => dispatch(loadQuestionnaires())
})

class DriverAdmin extends Component {
  componentWillMount() {
    this.props.loadVolunteers()
    this.props.loadQuestionnaires()
  }

  render() {
    const {drivers, loading, loadError} = this.props

    return (
      <Page>
        <PageHeader heading="Drivers" />
        <PageBody>
          <Box>
            <BoxBody
              loading={loading}
              error={loadError}
            >
              <Table striped responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Delivery Status</th>
                    <th>General Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers && drivers.map((driver, i) =>
                    <tr key={i}>
                      <td><span>{driver.id}</span></td>
                      <td><span>{driver.fullName}</span></td>
                      <td>
                        <span className={labelClass(driver.deliveryStatus)}>{driver.deliveryStatus}
                        </span>
                      </td>
                      <td><span>{driver.generalNotes}</span></td>
                    </tr>
                  )}
                  {!drivers &&
                    <tr>
                      <td className="text-center" colSpan="4">No drivers yet.</td>
                    </tr>
                  }
                </tbody>
              </Table>
            </BoxBody>
          </Box>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DriverAdmin)

function labelClass(status) {
  if (status === 'Completed') return 'label label-success'
  return 'label label-warning'
}
