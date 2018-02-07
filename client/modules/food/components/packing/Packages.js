/**
 * Component to display a table of all the packages
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn, SizePerPageDropDown} from 'react-bootstrap-table'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css'

import selectors from '../../../../store/selectors'
import {listPackages, unpackPackage, deliveredPackage} from '../../reducers/packing'

import {Box, BoxBody, BoxHeader} from '../../../../components/box'
import moment from 'moment'

const mapStateToProps = state => ({
  loading: selectors.food.packing.loading(state),
  error: selectors.food.packing.loadError(state),
  packages: selectors.food.packing.packages(state),
  packSaving: selectors.food.packing.saving(state),
})

const mapDispatchToProps = dispatch => ({
  load: () => dispatch(listPackages()),
  unpack: packageId => dispatch(unpackPackage(packageId)),
  delivered: singlePackage => dispatch(deliveredPackage(singlePackage)),
})

class Packages extends Component {

  componentWillMount() {
    this.props.load()
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.props.packSaving !== nextProps.packSaving) {
      this.props.load()
    }
  }

  /**
   * Convert an array of foodItems to a string listing the item names
   */
  formatContents = contentList => {
    return contentList.reduce((prev, curr) => {return `${prev} ${curr.name},`}, "")
  }

  renderSizePerPageDropDown = () => <SizePerPageDropDown variation='dropup'/>

  getActionButtons = (_, foodPackage) => {
    return (
      <div>
        <Button bsStyle="danger"
          onClick={() => this.props.unpack(foodPackage._id)}
          disabled={foodPackage.status === 'Received'}
        ><i className="fa fa-undo" /> Unpack</Button>
        <Button bsStyle="success"
          onClick={this.onReceivedClick}
          value={foodPackage._id}
          disabled={foodPackage.status === 'Received'}
        >Received</Button>
      </div>
    )
  }
  
  onReceivedClick = e => {
    this.props.delivered(e.target.value)
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
              sizePerPageDropDown: this.renderSizePerPageDropDown,
              noDataText: loading ? '' : 'No packages'
            }}
            hover
            striped
            pagination
          >
            <TableHeaderColumn dataField="_id" dataSort>_id</TableHeaderColumn>
            <TableHeaderColumn  dataField="customer" width="70px" dataFormat={customer => customer._id} >
              #
            </TableHeaderColumn>
            <TableHeaderColumn  dataField="customer" width="125px" dataFormat={customer => customer.fullName} >
              Customer Name
            </TableHeaderColumn>
            <TableHeaderColumn dataField="datePacked" dataFormat={datePacked => moment(datePacked).format("MM/DD/YYYY")} >
              Date Packed
            </TableHeaderColumn>
            <TableHeaderColumn dataField="contents" dataFormat={this.formatContents} >
              Contents
            </TableHeaderColumn>
            <TableHeaderColumn dataField="packedBy" >
              Packed By
            </TableHeaderColumn>
            <TableHeaderColumn dataField="status" >
              Status
            </TableHeaderColumn>
            <TableHeaderColumn dataFormat={this.getActionButtons} />
          </BootstrapTable>
        </BoxBody>
      </Box>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Packages)
