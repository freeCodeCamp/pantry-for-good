import React, {Component} from 'react'
import {connect} from 'react-redux'
import {utc} from 'moment'
import set from 'lodash/set'
import {Button} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css'

import selectors from '../../../store/selectors'
import {loadDonor, deleteDonor} from '../reducers/donor'

import {Page, PageBody} from '../../../components/page'
import {Box, BoxBody, BoxHeader} from '../../../components/box'
import DonationView from './DonationView'
import DonationCreate from './DonationCreate'

const mapStateToProps = (state, ownProps) => ({
  user: selectors.user.getUser(state),
  savingDonors: selectors.donor.saving(state),
  saveDonorsError: selectors.donor.saveError(state),
  loadingDonors: selectors.donor.loading(state),
  loadDonorsError: selectors.donor.loadError(state),
  getDonor: selectors.donor.getOne(state),
  donorId: ownProps.match.params.donorId,
  settings: selectors.settings.getSettings(state)
})

const mapDispatchToProps = dispatch => ({
  loadDonor: (id, admin) => dispatch(loadDonor(id, admin)),
  deleteDonor: id => dispatch(deleteDonor(id))
})

class DonorView extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = props.user.roles.find(role => role === 'admin')
    this.state = {
      donorModel: null,
      donationModel: null,
      newDonationModal: false,
      viewDonationModal: false
    }
  }

  componentWillMount() {
    this.props.loadDonor(this.props.donorId, this.isAdmin)
  }

  componentWillReceiveProps(nextProps) {
    const {getDonor} = nextProps

    // generate donor view
    const donor = getDonor(nextProps.donorId)
    if (donor && !this.state.donorModel) {
      this.setState({
        donorModel: {...donor}
      })
    }
  }

  toggleNewDonationModal = () => this.setState({
    donationModel: {},
    newDonationModal: !this.state.newDonationModal
  })

  toggleViewDonationModal = donation => () => {
    this.setState({
      donationModel: {...donation},
      viewDonationModal: !this.state.viewDonationModal
    })
  }

  handleFieldChange = (field, value) => ev => {
    if (!value) value = ev.target.value

    const donationModel = set({...this.state.donationModel}, field, value)
    this.setState({donationModel})
  }

  getActionButtons = (_, donation) =>
    <Button
      bsStyle="info"
      bsSize="sm"
      onClick={this.toggleViewDonationModal(donation)}
    >
      <i className="fa fa-eye" />
    </Button>

  formatDate = date => utc(date).format('YYYY-MM-DD')

  render() {
    const {donorModel, donationModel} = this.state
    const {loadingDonors, savingDonors, loadDonorsError, saveDonorsError} = this.props

    return (
      <Page>
        <PageBody>
          <Box>
            <BoxHeader
              heading={donorModel ? `${donorModel.fullName}'s Donations` : 'Donations'}
            >
              <div className="box-tools">
                <Button
                  bsStyle="success"
                  bsSize="sm"
                  onClick={this.toggleNewDonationModal}
                >
                  <i className="fa fa-plus" /> Add Donation
                </Button>
              </div>
            </BoxHeader>
            <BoxBody
              loading={loadingDonors || savingDonors}
              error={loadDonorsError || saveDonorsError}
            >
              <BootstrapTable
                data={donorModel ? donorModel.donations : []}
                keyField="_id"
                options={{
                  defaultSortName: "_id",
                  defaultSortOrder: 'desc',
                  noDataText: loadingDonors ? '' : 'No donations found'
                }}
                hover
                striped
                pagination
                search
              >
                <TableHeaderColumn dataField="_id" width="70px" dataSort>#</TableHeaderColumn>
                <TableHeaderColumn dataField="type" dataSort>Type</TableHeaderColumn>
                <TableHeaderColumn dataField="eligibleForTax" dataSort>Amount</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="dateReceived"
                  dataFormat={this.formatDate}
                  dataSort
                >
                  Date
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataFormat={this.getActionButtons}
                  dataAlign="center"
                  width="45px"
                />
              </BootstrapTable>
            </BoxBody>
          </Box>
        </PageBody>
        {/*modals*/}
        {donorModel &&
          <DonationView
            show={this.state.viewDonationModal}
            close={this.toggleViewDonationModal()}
            donation={donationModel}
            donorId={donorModel.id}
          />
        }
        {donationModel &&
          <DonationCreate
            show={this.state.newDonationModal}
            close={this.toggleNewDonationModal}
            donation={donationModel}
            handleFieldChange={this.handleFieldChange}
          />
        }
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DonorView)
