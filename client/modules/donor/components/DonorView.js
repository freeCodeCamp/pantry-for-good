import React, {Component} from 'react'
import {connect} from 'react-redux'
import {utc} from 'moment'
import {uniq} from 'lodash'
import {Button, Label} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css'

import {ADMIN_ROLE} from '../../../../common/constants'
import selectors from '../../../store/selectors'
import {loadDonor, deleteDonor} from '../reducers/donor'
import {approveDonation, saveDonation} from '../reducers/donation'

import {Page, PageBody} from '../../../components/page'
import {Box, BoxBody, BoxHeader} from '../../../components/box'
import DonationView from './DonationView'
import DonationCreate from './DonationCreate'

const mapStateToProps = (state, ownProps) => ({
  user: selectors.auth.getUser(state),
  savingDonors: selectors.donor.saving(state),
  saveDonorsError: selectors.donor.saveError(state),
  savingDonations: selectors.donation.saving(state),
  saveDonationsError: selectors.donation.saveError(state),
  loadingDonors: selectors.donor.loading(state),
  loadDonorsError: selectors.donor.loadError(state),
  donor: selectors.donor.getOne(state)(ownProps.match.params.donorId),
  donorId: ownProps.match.params.donorId,
  settings: selectors.settings.getSettings(state)
})

const mapDispatchToProps = dispatch => ({
  loadDonor: (id, admin) => dispatch(loadDonor(id, admin)),
  deleteDonor: id => dispatch(deleteDonor(id)),
  approveDonation: donation => () => dispatch(approveDonation(donation._id)),
  saveDonation: donor => donation => dispatch(saveDonation(donation, donor))
})

class DonorView extends Component {
  constructor(props) {
    super(props)
    this.isAdmin = props.user.roles.find(role => role === ADMIN_ROLE)
    this.state = {
      newDonationModal: false,
      viewDonationModal: null
    }
  }

  componentWillMount() {
    this.props.loadDonor(this.props.donorId, this.isAdmin)
  }

  componentWillReceiveProps(nextProps) {
    const {savingDonations, saveDonationsError} = nextProps
    if (this.props.savingDonations && !savingDonations && !saveDonationsError) {
      this.setState({
        newDonationModal: false,
        newDonationModel: {items: [{name: '', value: ''}]},
        viewDonationModal: null
      })
    }
  }

  toggleNewDonationModal = () => this.setState({
    newDonationModal: !this.state.newDonationModal,
    newDonationModel: {items: [{name: '', value: ''}]}
  })

  toggleViewDonationModal = donation => () =>  this.setState({
    viewDonationModal: donation ? donation._id : null
  })

  getActionButtons = (_, donation) =>
    <Button
      bsStyle="info"
      bsSize="sm"
      onClick={this.toggleViewDonationModal(donation)}
    >
      <i className="fa fa-eye" />
    </Button>

  getItems = (_, donation) => uniq(donation.items.map(item => item.name)).join(', ')

  formatDate = date => utc(date).format('YYYY-MM-DD')

  getDonationApprovedButton = (_, donation) => {
    if (donation.approved)
      return <Label bsStyle="success">Approved</Label>

    if (!this.isAdmin)
      return <Label bsStyle="primary">Pending</Label>

    return (
      <Button
        bsStyle="primary"
        bsSize="xs"
        onClick={this.props.approveDonation(donation)}
      >
        Approve
      </Button>
    )
  }

  render() {
    const {
      donor,
      loadingDonors,
      loadDonorsError,
      savingDonors,
      saveDonorsError,
      savingDonations,
      saveDonationsError
    } = this.props

    return (
      <Page>
        <PageBody>
          <Box>
            <BoxHeader
              heading={donor ? `${donor.fullName}'s Donations` : 'Donations'}
            >
              <div className="box-tools">
                <Button
                  bsStyle="success"
                  bsSize="sm"
                  onClick={this.toggleNewDonationModal}
                >
                  <i className="fa fa-plus" style={{marginRight: '5px'}} />
                  Add Donation
                </Button>
              </div>
            </BoxHeader>
            <BoxBody
              loading={loadingDonors || savingDonors || savingDonations}
              error={loadDonorsError || saveDonorsError || saveDonationsError}
            >
              <BootstrapTable
                data={donor ? donor.donations : []}
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
                <TableHeaderColumn
                  dataField="_id"
                  dataAlign="right"
                  width="70px"
                  dataSort
                >#</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="total"
                  dataAlign="right"
                  width="100px"
                  dataSort
                >Value</TableHeaderColumn>
                <TableHeaderColumn
                  dataFormat={this.getItems}
                  dataSort
                >Items</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="dateReceived"
                  dataFormat={this.formatDate}
                  width="100px"
                  dataSort
                >
                  Date
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataFormat={this.getDonationApprovedButton}
                  dataAlign="center"
                  width="100px"
                >Approved</TableHeaderColumn>
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
        {donor &&
          <DonationView
            donationId={this.state.viewDonationModal}
            close={this.toggleViewDonationModal()}
            donorId={donor._id}
            showAdminButtons={this.isAdmin}
          />
        }
        <DonationCreate
          show={this.state.newDonationModal}
          close={this.toggleNewDonationModal}
          onSubmit={this.props.saveDonation(donor)}
          initialValues={this.state.newDonationModel}
        />
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DonorView)
