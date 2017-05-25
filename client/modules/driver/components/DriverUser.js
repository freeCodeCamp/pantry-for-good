import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Table} from 'react-bootstrap'
import 'moment-recur'

import {selectors} from '../../../store'
import {locateAddress, locateUser, stopLocateUser} from '../reducers/location'
import {deliver} from '../../food/packing-reducer'
import {loadVolunteer, saveVolunteer} from '../../volunteer/reducer'

import Page from '../../../components/page/PageBody'

const mapStateToProps = state => ({
  auth: state.auth,
  customers: selectors.getAssignedCustomers(state),
  driverLocation: selectors.getUserCoordinates(state),
  addressLocation: selectors.getAddressCoordinates(state),
  loadingAddressLocation: selectors.loadingAddressLocation(state),
  loadAddressLocationError: selectors.loadAddressLocationError(state),
  loadingUserLocation: selectors.loadingUserLocation(state),
  loadUserLocationError: selectors.loadUserLocationError(state),
  loading: selectors.loadingVolunteers(state) || selectors.loadingCustomers(state),
  loadError: selectors.loadVolunteersError(state) || selectors.loadCustomersError(state),
  driver: selectors.getOneVolunteer(state)(state.auth.user._id),
  settings: state.settings.data
})

const mapDispatchToProps = dispatch => ({
  loadDriver: id => dispatch(loadVolunteer(id)),
  saveDriver: driver => dispatch(saveVolunteer(driver)),
  locateAddress: address => dispatch(locateAddress(address)),
  locateUser: () => dispatch(locateUser()),
  stopLocateUser: () => dispatch(stopLocateUser()),
  deliver: customerIds => dispatch(deliver(customerIds))
})

class DriverUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedCustomers: [],
      generalNotes: ''
    }
  }

  componentWillMount() {
    this.props.loadDriver(this.props.auth.user._id)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading && this.props.loading && nextProps.driver) {
      this.setState({generalNotes: nextProps.driver.generalNotes || ''})
    }
  }

  // filter customers by assignedTo driver
  //     this.customers = this._customers.filter(customer =>
  //       this.driver.customers.find(c => c.id === customer.id));

  // this.deliver = () => {
  //   const customerIds = this.customers.filter(c => c.isChecked)
  //     .map(c => c.id);
  //   this._deliver(customerIds);
  // };

  // this.updateNotes = () => this.saveDriver(this.driver);

  handleSelectCustomer = customer => () => {
    if (this.isSelected(customer)) {
      this.setState({
        selectedCustomers: this.state.selectedCustomers.filter(id => id !== customer.id)
      })
    } else {
      this.setState({
        selectedCustomers: [...this.state.selectedCustomers, customer.id]
      })
    }
  }

  isSelected = customer =>
    !!this.state.selectedCustomers.find(id => id === customer.id)

  handleSelectAll = () => {
    if (this.allSelected()) this.setState({selectedCustomers: []})
    else this.setState({selectedCustomers: this.props.customers.map(c => c.id)})
  }

  allSelected = () => this.state.selectedCustomers.length &&
    this.state.selectedCustomers.length === this.props.customers.length

  handleNotesChange = ev =>
    this.setState({
      generalNotes: ev.target.value
    })

  handleNotesSave = () =>
    this.props.saveDriver({
      ...this.props.driver,
      generalNotes: this.state.generalNotes
    })

  render() {
    const {customers, driver, loading} = this.props
    // eslint-disable-next-line no-unused-vars
    const {selectedCustomers, generalNotes} = this.state
    return (
      <Page heading="Route Assignment">
        <div className="row">
          <div className="col-md-6">
            <div className="box box-success">
              <div className="box-header">
                <h3 className="box-title">Packages</h3>
              </div>
              <div className="box-body table-responsive no-padding">
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={this.allSelected()}
                          onChange={this.handleselectAll}
                        />
                        Delivered ?
                      </th>
                      <th>Client ID</th>
                      <th>Full Address</th>
                      <th>Delivery Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers && customers.map(customer =>
                      <tr>
                        <td className="text-center text-success">
                          <input
                            type="checkbox"
                            checked={this.isSelected(customer)}
                            onChange={this.handleSelectCustomer(customer)}
                          />
                        </td>
                        <td><span>{customer._id}</span></td>
                        <td><span>{customer.fullAddress}</span></td>
                        <td><span>{customer.deliveryInstructions}</span></td>
                      </tr>
                    )}
                    {!customers.length &&
                      <tr>
                        <td className="text-center" colSpan="4">All packages have been delivered!</td>
                      </tr>
                    }
                  </tbody>
                </Table>
              </div>
              <div className="box-footer">
                <div className="row">
                  <div className="col-sm-6 col-md-5 col-lg-4">
                    <button
                      className="btn btn-success btn-flat btn-block"
                      onClick={this.deliver}
                      disabled={true}
                    >
                      Mark delivered
                    </button>
                  </div>
                  <div className="col-sm-6 col-md-4 col-lg-3 col-md-offset-3 col-lg-offset-5">
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
          <div className="col-md-6">
            <div className="box box-primary">
              <div className="box-header">
                <h3 className="box-title">Google Maps</h3>
              </div>
              <div className="box-body no-padding">
                {/*<!-- Google map -->*/}
                <div className="googleMap"></div>
              </div>
              {loading &&
                <div className="overlay">
                  <i className="fa fa-refresh fa-spin"></i>
                </div>
              }
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">General notes</h3>
              </div>
              <div className="box-body">
                <span>{driver && driver.generalNotes}</span>
                <form name="deliveryForm">
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      value={generalNotes}
                      onChange={this.handleNotesChange}
                      placeholder="General remarks about this week's delivery..."
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="box-footer">
                <div className="row">
                  <div className="col-sm-6 col-md-4 col-lg-2">
                    <button
                      type="submit"
                      className="btn btn-success btn-flat btn-block"
                      onClick={this.handleNotesSave}
                    >
                      {/*data-ng-disabled="deliveryForm.$invalid"*/}
                      Submit
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
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DriverUser)
