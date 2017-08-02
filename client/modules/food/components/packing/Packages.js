/**
 * Component to display a table of all the packages
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css'

import selectors from '../../../../store/selectors'
import {listPackages, unpackPackage} from '../../reducers/packing'

import {Box, BoxBody, BoxHeader} from '../../../../components/box'

const mapStateToProps = state => ({
  loading: selectors.food.packing.loading(state),
  error: selectors.food.packing.loadError(state),
  packages: selectors.food.packing.packages(state)
})

const mapDispatchToProps = dispatch => ({
  load: () => dispatch(listPackages()),
  unpack: packageId => dispatch(unpackPackage(packageId))
})

class Packages extends Component {

  componentWillMount() {
    this.props.load()
  }

  /**
   * Convert an array of foodItems to a string listing the item names
   */
  formatContents = contentList => {
    return contentList.reduce((prev, curr) => {return `${prev} ${curr.name},`}, "")
  }
  
  getActionButtons = (_, foodPackage) =>
    <div>
      <Button bsStyle="danger"
        onClick={() => this.props.unpack(foodPackage._id)}
      ><i className="fa fa-undo" /> Unpack</Button>
    </div>

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
            <TableHeaderColumn dataField="_id" dataSort>_id</TableHeaderColumn>
            <TableHeaderColumn  dataField="customer" dataFormat={customer => customer._id} >
              Customer
            </TableHeaderColumn>
            <TableHeaderColumn dataField="datePacked" >
              Date Packed
            </TableHeaderColumn>
            <TableHeaderColumn dataField="contents" dataFormat={this.formatContents} >
              Contents
            </TableHeaderColumn>
            <TableHeaderColumn dataField="packedBy" >
              Packed By
            </TableHeaderColumn>
            <TableHeaderColumn dataField="status" >
              status
            </TableHeaderColumn>
            <TableHeaderColumn
              dataFormat={this.getActionButtons}
            />
          </BootstrapTable>
        </BoxBody>
      </Box>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Packages)
