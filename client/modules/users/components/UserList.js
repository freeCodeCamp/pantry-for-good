import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {BootstrapTable, TableHeaderColumn, SizePerPageDropDown} from 'react-bootstrap-table'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css'

import selectors from '../../../store/selectors'
import {loadUsers} from '../userReducer'

import {Box, BoxBody, BoxHeader} from '../../../components/box'

const mapStateToProps = state => {
  return {
    users: selectors.user.users(state),
    loading: selectors.user.fetching(state),
    loadError: selectors.user.fetchError(state)
  }
}

const mapDispatchToProps = dispatch => ({
  loadUsers: () => {
    dispatch(loadUsers())
  }
})

class UserList extends Component {

  componentWillMount() {
    if (!this.props.loading) this.props.loadUsers()
  }

  getEditButton = (_, user) =>
    <div>
      <Link to={`/users/${user._id}/edit`} className="btn btn-primary btn-sm" >
        <i className="fa fa-pencil" /> Edit
      </Link>
    </div>

  renderSizePerPageDropDown = () => <SizePerPageDropDown variation='dropup'/>

  render = () =>
    <Box>
      <BoxHeader heading="User Accounts" />
      <BoxBody
        loading={this.props.loading}
        error={this.props.loadError}
      >
        <BootstrapTable
          data={this.props.users}
          keyField="_id"
          options={{
            defaultSortName: "_id",
            defaultSortOrder: 'asc',
            noDataText: this.props.loading ? '' : 'No Accounts Found',
            sizePerPageDropDown: this.renderSizePerPageDropDown
          }}
          hover
          striped
          pagination
          search
        >
          <TableHeaderColumn dataField="_id" width="25px" dataSort>User ID</TableHeaderColumn>
          <TableHeaderColumn dataField="firstName" width="60px" dataSort>First Name</TableHeaderColumn>
          <TableHeaderColumn dataField="lastName" width="60px" dataSort>Last Name</TableHeaderColumn>
          <TableHeaderColumn dataField="email" width="90px" dataSort>Email</TableHeaderColumn>
          <TableHeaderColumn dataFormat={this.getEditButton} dataAlign="center" width="40px" />
        </BootstrapTable>
      </BoxBody>
    </Box>
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList)
