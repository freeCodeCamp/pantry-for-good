import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Table} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {loadDonors, deleteDonor} from '../reducers/donor'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import {Box, BoxBody, BoxHeader} from '../../../components/box'
import {Page, PageBody, PageHeader} from '../../../components/page'

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

  totalDonations = donor => {
    if (!donor || !donor.donations) return 0
    return donor.donations.reduce((acc, x) => acc + x.eligibleForTax || 0, 0)
  }

  deleteDonor = donor => () => this.props.deleteDonor(donor)

  render() {
    const {donors, loading, loadError, savingDonors, saveDonorsError} = this.props
    return (
      <Page>
        <PageHeader heading="Donor Database" />
        <PageBody>
          <Box>
            <BoxHeader heading="Applications" />
            <BoxBody
              loading={loading || savingDonors}
              error={loadError || saveDonorsError}
            >
              <Table responsive>
                <thead>
                  <tr role="row">
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Total Donated</th>
                    <th>Full Address</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody role="alert" aria-live="polite" aria-relevant="all">
                  {donors && donors.map((donor, i) =>
                    <tr key={i}>
                      <td><span>{donor.id}</span></td>
                      <td><span>{donor.fullName}</span></td>
                      <td><span>{this.totalDonations(donor)}</span></td>
                      <td><span>{getAddress(donor)}</span></td>
                      <td><span>{donor.telephoneNumber}</span></td>
                      <td><span>{donor.email}</span></td>
                      <td>
                        <Link
                          to={`/donors/${donor.id}`}
                          className="btn btn-info btn-flat btn-xs"
                        ><i className="fa fa-eye"></i> View</Link>
                        <Link
                          to={`/donors/${donor.id}/edit`}
                          className="btn btn-primary btn-flat btn-xs"
                        ><i className="fa fa-pencil"></i> Edit</Link>
                        <button
                          className="btn btn-danger btn-flat btn-xs"
                          onClick={this.deleteDonor(donor)}
                        ><i className="fa fa-trash-o"></i> Delete</button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
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
