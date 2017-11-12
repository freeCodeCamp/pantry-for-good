import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn, SizePerPageDropDown} from 'react-bootstrap-table'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css'

import {fieldTypes} from '../../../../common/constants'
import {fieldsByType} from '../../../lib/questionnaire-helpers'
import selectors from '../../../store/selectors'
import {loadDonors, deleteDonor} from '../reducers/donor'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'
import {showConfirmDialog, hideDialog} from '../../core/reducers/dialog'

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
  deleteDonor: donor => dispatch(deleteDonor(donor._id)),
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  showDialog: (cancel, confirm, message) =>
    dispatch(showConfirmDialog(cancel, confirm, message, 'Delete')),
  hideDialog: () => dispatch(hideDialog())
})

class DonorList extends Component {
  componentWillMount() {
    this.props.loadDonors()
    this.props.loadQuestionnaires()
  }

  totalDonations = (_, donor) => {
    if (!donor || !donor.donations.length) return 0
    return donor.donations.reduce((acc, x) => acc + x.total || 0, 0)
  }

  deleteDonor = donor => () => this.props.showDialog(
    this.props.hideDialog,
    () => {
      this.props.deleteDonor(donor)
      this.props.hideDialog()
    },
    `Donor ${donor.fullName} will be permanently deleted`
  )

  formatData = () => this.props.donors ?
    this.props.donors.map(d => ({
      ...d,
      address: fieldsByType(d, fieldTypes.ADDRESS).map(f => f.value).join(', ')
    })) :
    []

  getActionButtons = (_, donor) =>
    <div>
      <Link
        to={`/donors/${donor._id}`}
        className="btn btn-info btn-sm"
      ><i className="fa fa-eye" /></Link>
      {' '}
      <Link
        to={`/donors/${donor._id}/edit`}
        className="btn btn-primary btn-sm"
      ><i className="fa fa-pencil" /></Link>
      {' '}
      <Button bsStyle="danger" bsSize="sm" onClick={this.deleteDonor(donor)}>
        <i className="fa fa-trash" />
      </Button>
    </div>

  renderSizePerPageDropDown = () => <SizePerPageDropDown variation='dropup'/>

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
                keyField="_id"
                options={{
                  defaultSortName: "_id",
                  defaultSortOrder: 'desc',
                  noDataText: loading ? '' : 'No donors found',
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
