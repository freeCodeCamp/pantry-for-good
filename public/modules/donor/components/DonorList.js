import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Table} from 'react-bootstrap'

import {selectors} from '../../../store'
import {loadDonors, deleteDonor} from '../donor-reducer'

import Page from '../../../components/Page'

const mapStateToProps = state => ({
  savingDonors: selectors.savingDonors(state),
  saveDonorsError: selectors.saveDonorsError(state),
  loadingDonors: selectors.loadingDonors(state),
  loadDonorsError: selectors.loadDonorsError(state),
  donors: selectors.getAllDonors(state),
});

const mapDispatchToProps = dispatch => ({
  loadDonors: () => dispatch(loadDonors()),
  deleteDonor: donor => dispatch(deleteDonor(donor.id))
});

class DonorList extends Component {
  componentWillMount() {
    this.props.loadDonors()
  }

  totalDonations = donor => {
    if (!donor || !donor.donations) return 0
    return donor.donations.reduce((acc, x) => acc + x.eligibleForTax || 0, 0)
  }

  deleteDonor = donor => () => this.props.deleteDonor(donor)

  render() {
    const {donors, loadingDonors, loadDonorsError} = this.props
    return (
      <Page heading="Donor Database">
        <div className="row">
          <div className="col-xs-12">
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">Applications</h3>
              </div>
              <div className="box-body table-responsive">
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
                        <td><span>{donor.fullAddress}</span></td>
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
              </div>
            </div>
          </div>
        </div>
        {loadDonorsError &&
          <div className="text-danger">
            <strong>{loadDonorsError}</strong>
          </div>
        }
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DonorList)
