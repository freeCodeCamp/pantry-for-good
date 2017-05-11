import React, {Component} from 'react'
import {connect} from 'react-redux'
import {utc} from 'moment'
import 'moment-recur'
import {Table} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {loadCustomers} from '../../customer/reducer'
import {loadFoods} from '../reducers/category'
import {pack} from '../reducers/packing'

import Page from '../../../components/page/PageBody'

const mapStateToProps = state => ({
  customers: selectors.customer.getAll(state),
  items: selectors.food.item.getAll(state),
  loading: selectors.customer.loading(state) ||
    selectors.food.category.loading(state),
  loadError: selectors.customer.loadError(state) ||
    selectors.food.category.loadError(state)
})

const mapDispatchToProps = dispatch => ({
  loadCustomers: () => dispatch(loadCustomers()),
  loadFoods: () => dispatch(loadFoods()),
  pack: (customers, items) => dispatch(pack(customers, items))
})

class PackingList extends Component {
  constructor(props) {
    super(props)
    this.beginWeek = utc().startOf('isoWeek')
    this.state = {
      error: null,
      customers: null,
      items: null,
      allSelected: false
    }
  }

  componentWillMount() {
    this.props.loadCustomers()
    this.props.loadFoods()
  }

  componentWillReceiveProps(nextProps) {
    const allCustomers = nextProps.customers
    const allItems = nextProps.items
    const {
      loading,
      loadCustomersError,
      loadFoodsError
    } = nextProps

    if (!loading && this.props.loading) {
      if (loadFoodsError) this.setState({error: loadFoodsError})
      else if (loadCustomersError) this.setState({error: loadCustomersError})
      else {
        const scheduledCustomers = getScheduledCustomers(allCustomers, this.beginWeek)
        const scheduledItems = getScheduledItems(allItems, this.beginWeek)

        // generate packing lists for the customers
        const {customers} = getPackedCustomersAndItems(
          scheduledCustomers,
          scheduledItems
        )

        this.setState({customers, items: scheduledItems})
      }
    }
  }

  pack = () => {
    // generate packing lists for selected customers and updated item counts
    const {customers, items} = getPackedCustomersAndItems(
      this.state.customers.filter(customer => customer.isChecked),
      this.state.items
    )

    this.props.pack(customers, items)
  }

  // Determine column span of empty cells
  getColSpan = customer => {
    if (this.state.items && customer.packingList) {
      return this.state.items.length - customer.packingList.length
    }
    return 1
  };

  // Select all checkboxes
  selectAll = () => {
    this.setState({
      customers: this.state.customers.map(customer => ({
        ...customer,
        isChecked: !this.state.allSelected
      })),
      allSelected: !this.state.allSelected
    })
  }

  // toggle selected for customer with id
  handleSelect = id => () =>
    this.setState({
      customers: selectCustomer(this.state.customers, id)
    })

  // Enable submit button if any of the checkboxes are checked
  isDisabled = () =>
    !this.state.customers || !this.state.customers.find(customer => customer.isChecked)

  render() {
    const {customers, items, error, allSelected} = this.state
    const {loading} = this.props
    if (!customers || !items) return null
    return (
      <Page heading="Packing List">
        <div className="row">
          <div className="col-xs-12">
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">Current week</h3>
                <div className="box-tools">
                  <div className="form-group has-feedback">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search"
                    />
                    <span className="glyphicon glyphicon-search form-control-feedback"></span>
                  </div>
                </div>
              </div>
              <div className="box-body table-responsive no-padding top-buffer">
                <Table responsive>
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={this.selectAll}
                        />
                        Packed ?
                      </th>
                      <th>Client ID</th>
                      <th>Household</th>
                      {items.map((item, i) =>
                        <th key={i}>Item {i + 1}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer, i) =>
                      <tr key={i}>
                        <td>
                          <input
                            type="checkbox"
                            checked={customer.isChecked || false}
                            onChange={this.handleSelect(customer.id)}
                          />
                        </td>
                        <td><span>{customer.id}</span></td>
                        <td><span>{customer.householdSummary}</span></td>
                        {customer.packingList && customer.packingList.map((item, i) =>
                          <td key={i}><span>{item.name}</span></td>
                        )}
                        {items.length !== customer.packingList.length &&
                          <td colSpan={this.getColSpan(customer)}>
                            N/A
                          </td>
                        }
                      </tr>
                    )}
                    {!customers.length &&
                      <tr>
                        <td className="text-center" colSpan={items.length + 3}>
                          All food packages have been packed!
                        </td>
                      </tr>
                    }
                  </tbody>
                </Table>
              </div>
              <div className="box-footer">
                <div className="row">
                  <div className="col-sm-6 col-md-4 col-lg-2">
                    <button
                      className="btn btn-primary btn-flat btn-block"
                      onClick={this.pack}
                      disabled={this.isDisabled()}
                    >
                      Send packages
                    </button>
                  </div>
                  <div className="col-sm-6 col-md-4 col-lg-2 col-md-offset-4 col-lg-offset-8">
                    <button className="btn btn-default btn-flat btn-block">
                      <i className="fa fa-print"></i> Print
                    </button>
                  </div>
                </div>
              </div>
              {loading &&
                <div className="overlay">
                  <i className="fa fa-refresh fa-spin"></i>
                </div>
              }
            </div>
          </div>
        </div>
        {error &&
          <div className="text-danger">
            <strong>{error}</strong>
          </div>
        }
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PackingList)


// 2. Select all items that are scheduled for distribution this week
function getScheduledItems(items, beginWeek) {
  return items.filter(item => {
    // Check if the item has a schedule planned
    if (item.frequency) {
      // Construct a moment recurring object based on the starting date and frequency from schedule
      const interval = utc(item.startDate).recur()
        .every(item.frequency).days()
      // Return true only if the current week matches one of the recurring dates
      return interval.matches(beginWeek)
    }
  })
}

// 3. Find a list of customers and filter based on status and last packed date
function getScheduledCustomers(customers, beginWeek) {
  // If the packed date equals this week's date then the customer package
  // has already been packed for this week
  return customers.filter(customer =>
    !utc(customer.lastPacked).isSame(beginWeek) &&
      (customer.status === 'Accepted')
  )
}

// 4. Figure out which food items should be in the packing list
function getPackedCustomersAndItems(scheduledCustomers, scheduledItems) {
  let itemCounts = scheduledItems.map(item => item.quantity)

  // generate a packing list for each customer
  const customers = scheduledCustomers.map(customer => ({
    ...customer,
    packingList: scheduledItems.map((item, i) => {
      // If the item is in the customer's food preferences and in stock
      // add it to customers packing list and decrement its count
      if (customer.foodPreferences.find(equalIds(item)) && itemCounts[i] > 0) {
        itemCounts[i]--
        return item
      }
    }).filter(exists)
  }))

  // generate a list of updated items after packing
  const items = scheduledItems.map((item, i) => ({
    ...item,
    quantity: itemCounts[i]
  }))

  return {customers, items}
}

// get a list of ids of checked customers
function getCustomerIds(customers) {
  return customers.filter(customer => customer.isChecked)
    .map(customer => customer.id)
}

// get customers list after toggling selected on matching id
function selectCustomer(customers, id) {
  return customers.map(customer => {
    if (customer.id === id)
      return {
        ...customer,
        isChecked: !customer.isChecked
      }

    return {...customer}
  })
}

function equalIds(thing) {
  return other => thing && other && thing._id === other._id
}

function exists(thing) {
  return thing
}
