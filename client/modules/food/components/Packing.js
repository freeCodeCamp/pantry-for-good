import React, {Component} from 'react'
import {connect} from 'react-redux'
import {compose, withProps} from 'recompose'
import {Button} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css'

import selectors from '../../../store/selectors'
import {loadCustomers} from '../../customer/reducer'
import {loadFoods} from '../reducers/category'
import {pack} from '../reducers/packing'

import {Box, BoxBody, BoxHeader} from '../../../components/box'
import {Page, PageBody} from '../../../components/page'
import {Checkbox} from '../../../components/form'

const mapStateToProps = state => ({
  customers: selectors.customer.getScheduled(state),
  items: selectors.food.item.getScheduled(state),
  loading: selectors.customer.loading(state) ||
    selectors.food.category.loading(state),
  error: selectors.customer.loadError(state) ||
    selectors.food.category.loadError(state),
  packing: selectors.food.packing.saving(state),
  packError: selectors.food.packing.saveError(state)
})

const mapDispatchToProps = dispatch => ({
  load: () => {
    dispatch(loadCustomers())
    dispatch(loadFoods())
  },
  pack: (customers, items) => dispatch(pack(customers, items))
})

const withPackedCustomers = withProps(({customers, items}) =>
  getPackedCustomersAndItems(customers, items))

class PackingList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: []
    }
  }

  componentWillMount() {
    this.props.load()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.packing && !nextProps.packing && !nextProps.packError)
      this.setState({selected: []})
  }

  pack = () => {
    // generate packing lists for selected customers and updated item counts
    const {packedCustomers, updatedItems} = getPackedCustomersAndItems(
      this.state.selected.map(id => this.props.customers.find(c => c.id === id)),
      this.props.items
    )

    this.props.pack(packedCustomers, updatedItems)
  }

  getItemList = items => items.map(i => i.name).join(', ')

  select(props) {
    const {type, checked, disabled, onChange, rowIndex} = props

    return rowIndex === 'Header' ?
      <Checkbox
        type={type}
        name="checkboxAll"
        checked={checked}
        disabled={disabled}
        className={props.indeterminate ? 'partial' : ''}
        onChange={onChange}
        style={{margin: '0 0 0 -8px'}}
      /> :
      <Checkbox
        type={type}
        name={'checkbox' + rowIndex}
        checked={checked}
        disabled={disabled}
        onChange={e => onChange(e, rowIndex)}
        style={{margin: '0 0 0 -8px'}}
      />
  }

  handleSelect = (customer, isSelected) => this.setState({
    selected: isSelected ?
      [...this.state.selected, customer.id] :
      this.state.selected.filter(id => id !== customer.id)
  })

  handleSelectAll = isSelected => {
    const {selected} = this.state
    const {customers} = this.props
    this.setState({
      selected: isSelected || selected.length < customers.length ?
        customers.map(c => c.id) : []
    })
  }

  render() {
    const {loading, packing, error, packError, packedCustomers} = this.props
    const {selected} = this.state
    const itemsToPack = packedCustomers.reduce((acc, c) =>
      acc + c.packingList.length, 0)
    return (
      <Page>
        <PageBody>
          <Box>
            <BoxHeader heading="Packing List" />
            <BoxBody loading={loading || packing} error={error || packError}>
              {packedCustomers &&
                <div style={{color: '#aaa'}}>
                  {itemsToPack} items for {packedCustomers.length} customers
                </div>
              }
              <BootstrapTable
                data={packedCustomers || []}
                keyField="id"
                options={{
                  defaultSortName: "id",
                  defaultSortOrder: 'desc',
                  noDataText: loading ? '' : 'Nothing to pack'
                }}
                selectRow={{
                  mode: 'checkbox',
                  customComponent: this.select,
                  onSelect: this.handleSelect,
                  onSelectAll: this.handleSelectAll,
                  selected,
                  clickToSelect: true,
                  columnWidth: '55px'
                }}
                hover
                striped
                pagination
                search
              >
                <TableHeaderColumn dataField="id" width="70px" dataSort>#</TableHeaderColumn>
                <TableHeaderColumn dataField="householdSummary" width="90px">
                  Household
                </TableHeaderColumn>
                <TableHeaderColumn dataField="packingList" dataFormat={this.getItemList}>
                  Items
                </TableHeaderColumn>
              </BootstrapTable>
              <div className="box-footer text-right">
                <Button
                  bsStyle="success"
                  onClick={this.pack}
                  disabled={!packedCustomers.length}
                >
                  Mark Packed
                </Button>
              </div>
            </BoxBody>
          </Box>
        </PageBody>
      </Page>
    )
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPackedCustomers
)(PackingList)

function getPackedCustomersAndItems(customers, items) {
  let itemCounts = items.map(item => item.quantity)

  // generate a packing list for each customer
  const packedCustomers = customers.map(customer => ({
    ...customer,
    packingList: items.map((item, i) => {
      // If the item is in the customer's food preferences and in stock
      // add it to customers packing list and decrement its count
      if (customer.foodPreferences.find(equalIds(item)) && itemCounts[i] > 0) {
        itemCounts[i]--
        return item
      }
    }).filter(exists)
  }))

  // generate a list of updated items after packing
  const updatedItems = items.map((item, i) => ({
    ...item,
    quantity: itemCounts[i]
  }))

  return {packedCustomers, updatedItems}
}

function equalIds(thing) {
  return other => thing && other && thing._id === other._id
}

function exists(thing) {
  return thing
}
