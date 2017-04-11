import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Col, Row, Table} from 'react-bootstrap'

import {selectors} from '../../../store'
import {loadVolunteers} from '../volunteer-reducer'

import {Box, BoxBody, BoxHeader} from '../../../components/box'
import ClientStatusLabel from '../../../components/ClientStatusLabel'
import {Page, PageBody, PageHeader} from '../../../components/page'

const mapStateToProps = state => ({
  user: state.auth.user,
  volunteers: selectors.getAllVolunteers(state),
  loadingVolunteers: selectors.loadingVolunteers(state),
  loadVolunteersError: selectors.loadVolunteersError(state),
  settings: state.settings.data
})

const mapDispatchToProps = dispatch => ({
  loadVolunteers: () => dispatch(loadVolunteers())
})

class VolunteerList extends Component {
  componentWillMount() {
    if (!this.props.loadingVolunteers && !this.props.loadVolunteersError)
      this.props.loadVolunteers()
  }
  render() {
    const {volunteers, loadVolunteersError} = this.props
    return (
      <Page>
        <PageHeader heading="Volunteer Database" />
        <PageBody error={loadVolunteersError}>
          <Box>
            <BoxHeader heading="Applications" />
            <BoxBody>
              <Table responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Full Address</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody role="alert" aria-live="polite" aria-relevant="all">
                  {volunteers && volunteers.map(volunteer =>
                    <tr key={volunteer.id}>
                      <td><span>{volunteer.id}</span></td>
                      <td><span>{volunteer.fullName}</span></td>
                      <td><span>{volunteer.fullAddress}</span></td>
                      <td><span>{volunteer.telephoneNumber}</span></td>
                      <td><span>{volunteer.email}</span></td>
                      <td><ClientStatusLabel client={volunteer} /></td>
                      <td>
                        <Link
                          to={`/volunteers/${volunteer.id}`}
                          className="btn btn-info btn-flat btn-xs"
                        ><i className="fa fa-eye"></i> View</Link>
                        <Link
                          to={`/volunteers/${volunteer.id}/edit`}
                          className="btn btn-primary btn-flat btn-xs"
                        ><i className="fa fa-pencil"></i> Edit</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(VolunteerList)
