import React, {Component} from 'react'
import {connect} from 'react-redux'
import {stateGo} from 'redux-ui-router';
import {Table} from 'react-bootstrap'

import {selectors} from '../../../store';
import {loadVolunteers} from '../../../store/volunteer';
import ClientStatusLabel from '../../common/components/ClientStatusLabel'
import Page from '../../common/components/Page'

const mapStateToProps = state => ({
  user: state.auth.user,
  volunteers: selectors.getAllVolunteers(state),
  loadingVolunteers: selectors.loadingVolunteers(state),
  loadVolunteersError: selectors.loadVolunteersError(state),
  settings: state.settings.data,
});

const mapDispatchToProps = dispatch => ({
  loadVolunteers: () => dispatch(loadVolunteers()),
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

class VolunteerList extends Component {
  componentWillMount() {
    if (!this.props.loadingVolunteers && !this.props.loadVolunteersError)
      this.props.loadVolunteers()
  }
  render() {
    const {volunteers, loadVolunteersError} = this.props
    return (
      <Page heading="Volunteer Database">
        <div className="row">
          <div className="col-xs-12">
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">Applications</h3>
              </div>
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
                    <tr key="volunteer.id">
                      <td><span>{volunteer.id}</span></td>
                      <td><span>{volunteer.fullName}</span></td>
                      <td><span>{volunteer.fullAddress}</span></td>
                      <td><span>{volunteer.telephoneNumber}</span></td>
                      <td><span>{volunteer.email}</span></td>
                      <td><ClientStatusLabel client={volunteer} /></td>
                      <td>
                        <a
                          href={`/#!/admin/volunteers/${volunteer.id}`}
                          className="btn btn-info btn-flat btn-xs"
                        ><i className="fa fa-eye"></i> View</a>
                        <a
                          href={`/#!/admin/volunteers/${volunteer.id}/edit`}
                          className="btn btn-primary btn-flat btn-xs"
                        ><i className="fa fa-pencil"></i> Edit</a>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        {loadVolunteersError &&
          <div className="text-danger">
            <strong>{loadVolunteersError}</strong>
          </div>
        }
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VolunteerList)
