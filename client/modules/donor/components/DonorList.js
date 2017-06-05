import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css'

import selectors from '../../../store/selectors'
import {loadDonors, deleteDonor} from '../reducers/donor'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import {Box, BoxBody, BoxHeader} from '../../../components/box'
import {Page, PageBody} from '../../../components/page'

const mapStateToProps = state => ({
  donors: selectors.donor.getAll(state),
  savingDonors: selectors.donor.saving(state),
  saveDonorsError: selectors.donor.saveError(state),
  loading: selectors.donor.loading(state) ||
    selectors.questionnaire.loading(state),
  loadError: selectors.donor.loadError(state) ||
    selectors.questionnaire.loadError(state)
})

const mapDispatchToProps = dispatch => ({
  loadDonors: () => dispatch(loadDonors()),
  deleteDonor: donor => dispatch(deleteDonor(donor.id)),
  loadQuestionnaires: () => dispatch(loadQuestionnaires())
})

class DonorList extends Component {
  componentWillMount() {
    this.props.loadDonors()
    this.props.loadQuestionnaires()
  }

  totalDonations = (_, donor) => {
    if (!donor || !donor.donations) return 0
    return donor.donations.reduce((acc, x) => acc + x.eligibleForTax || 0, 0)
  }

  deleteDonor = donor => () => this.props.deleteDonor(donor)

  formatData = () => this.props.donors ?
    this.props.donors.map(d => ({
      ...d,
      address: getAddress(d)
    })) :
    []

  getActionButtons = (_, donor) =>
    <div>
      <Link
        to={`/donors/${donor.id}`}
        className="btn btn-info btn-sm"
      ><i className="fa fa-eye" /></Link>
      {' '}
      <Link
        to={`/donors/${donor.id}/edit`}
        className="btn btn-primary btn-sm"
      ><i className="fa fa-pencil" /></Link>
      {' '}
      <Button bsStyle="danger" bsSize="sm" onClick={this.deleteDonor(donor)}>
        <i className="fa fa-trash" />
      </Button>
    </div>

  render() {
    const {loading, loadError, savingDonors, saveDonorsError} = this.props
    return (
      <Page>
        <PageBody>
          <Box>
            <BoxHeader heading="Donors" />
            <BoxBody
              loading={loading || savingDonors}
              error={loadError || saveDonorsError}
            >
              <BootstrapTable
                data={this.formatData()}
                keyField="id"
                options={{
                  defaultSortName: "id",
                  defaultSortOrder: 'desc',
                  noDataText: loading ? '' : 'No donors found'
                }}
                hover
                striped
                pagination
                search
              >
                <TableHeaderColumn dataField="id" width="70px" dataSort>#</TableHeaderColumn>
                <TableHeaderColumn dataField="fullName" dataSort>Name</TableHeaderColumn>
                <TableHeaderColumn
                  dataFormat={this.totalDonations}
                  dataAlign="right"
                  width="150px"
                >
                  Amount Donated
                </TableHeaderColumn>
                <TableHeaderColumn dataField="address">Address</TableHeaderColumn>
                <TableHeaderColumn dataField="email" dataSort>Email</TableHeaderColumn>
                <TableHeaderColumn
                  dataFormat={this.getActionButtons}
                  dataAlign="center"
                  width="135px"
                />
              </BootstrapTable>
            </BoxBody>
          </Box>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DonorList)

function getAddress(client) {
  return client && client.fields.filter(f =>
      f.meta && f.meta.type === 'address')
    .map(f => f.value)
    .join(', ')
}
