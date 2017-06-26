import React, {Component} from 'react'
import {connect} from 'react-redux'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css'

import selectors from '../../../store/selectors'
import {listPackages } from '../reducers/packing'

import {Box, BoxBody, BoxHeader} from '../../../components/box'

const mapStateToProps = state => ({
  loading: selectors.food.packing.loading(state),
  error: selectors.food.packing.loadError(state),
  packages: selectors.food.packing.packages(state)
})

const mapDispatchToProps = dispatch => ({
  load: () => dispatch(listPackages())
})

class Packages extends Component {

  componentWillMount() {
    this.props.load()
  }

  formatContents = contentList => {
    return contentList.reduce((prev, curr) => {return `${prev} ${curr.name},`}, "")
  }
  
  render() {
    const {loading, error, packages} = this.props
    return (
      <Box>
        <BoxHeader heading="Packed Packages" />
        <BoxBody loading={loading} error={error}>
          <BootstrapTable
            data={packages || []}
            keyField="_id"
            options={{
              defaultSortName: "datePacked",
              defaultSortOrder: 'desc',
              noDataText: loading ? '' : 'No packages'
            }}
            hover
            striped
            pagination
          >
            <TableHeaderColumn dataField="_id" width="40px" dataSort>_id</TableHeaderColumn>
            <TableHeaderColumn  dataField="customer" dataFormat={customer => customer.id} width="20px">
              Customer
            </TableHeaderColumn>
            <TableHeaderColumn dataField="datePacked" width="40px">
              Date Packed
            </TableHeaderColumn>
            <TableHeaderColumn  dataField="contents" dataFormat={this.formatContents} width="80px">
              Contents
            </TableHeaderColumn>
          </BootstrapTable>
        </BoxBody>
      </Box>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Packages)
