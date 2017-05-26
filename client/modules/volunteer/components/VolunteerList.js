import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Table} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {loadVolunteers} from '../reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import {Box, BoxBody, BoxHeader} from '../../../components/box'
import ClientStatusLabel from '../../../components/ClientStatusLabel'
import {Page, PageBody, PageHeader} from '../../../components/page'

const mapStateToProps = state => ({
  volunteers: selectors.volunteer.getAll(state),
  loading: selectors.volunteer.loading(state) ||
    selectors.questionnaire.loading(state),
  loadError: selectors.volunteer.loadError(state) ||
    selectors.questionnaire.loadError(state)
})

const mapDispatchToProps = dispatch => ({
  loadVolunteers: () => dispatch(loadVolunteers()),
  loadQuestionnaires: () => dispatch(loadQuestionnaires())
})

class VolunteerList extends Component {
  componentWillMount() {
    this.props.loadVolunteers()
    this.props.loadQuestionnaires()
  }

  render() {
    const {volunteers, loading, loadError} = this.props

    return (
      <Page>
        <PageHeader heading="Volunteer Database" />
        <PageBody>
          <Box>
            <BoxHeader heading="Applications" />
            <BoxBody
              loading={loading}
              error={loadError}
            >
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
                      <td><span>{getAddress(volunteer)}</span></td>
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

function getAddress(client) {
  return client && client.fields.filter(f =>
      f.meta && f.meta.type === 'address')
    .map(f => f.value)
    .join(', ')
}
