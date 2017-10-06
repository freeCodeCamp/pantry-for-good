import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {BootstrapTable, TableHeaderColumn, SizePerPageDropDown} from 'react-bootstrap-table'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css'


import selectors from '../../../store/selectors'
import {loadVolunteers} from '../../volunteer/reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import {Box, BoxBody, BoxHeader} from '../../../components/box'
import {Page, PageBody} from '../../../components/page'

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

  getStatusLabel = (_, driver) =>
    <span className={labelClass(driver.deliveryStatus)}>
      {driver.deliveryStatus}
    </span>

  getActionButtons = (_, driver) =>
    <div>
      <Link to={`/drivers/${driver._id}`} className="btn btn-primary btn-sm">
        <i className="fa fa-road" style={{marginRight: '8px'}}/>{' '}
        Route
      </Link>
    </div>

  renderSizePerPageDropDown = () => <SizePerPageDropDown variation='dropup'/>

  render() {
    const {drivers, loading, loadError} = this.props

    return (
      <Page>
        <PageBody>
          <Box>
            <BoxHeader heading="Drivers" />
            <BoxBody
              loading={loading}
              error={loadError}
            >
              <BootstrapTable
                data={drivers || []}
                keyField="_id"
                options={{
                  defaultSortName: "_id",
                  defaultSortOrder: 'desc',
                  noDataText: loading ? '' : 'No drivers found',
                  sizePerPageDropDown: this.renderSizePerPageDropDown
                }}
                hover
                striped
                pagination
                search
              >
                <TableHeaderColumn dataField="_id" width="70px" dataSort>#</TableHeaderColumn>
                <TableHeaderColumn dataField="fullName" dataSort>Name</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="deliveryStatus"
                  dataFormat={this.getStatusLabel}
                  dataAlign="center"
                  width="90px"
                  dataSort
                >
                  Status
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataFormat={this.getActionButtons}
                  dataAlign="center"
                  width="100px"
                />
              </BootstrapTable>

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
