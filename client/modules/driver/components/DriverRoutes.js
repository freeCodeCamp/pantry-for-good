import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Table} from 'react-bootstrap'
import get from 'lodash/get'
import {Button, Checkbox, Col} from 'react-bootstrap'

import {selectors} from '../../../store'
import {loadCustomers, assignCustomers} from '../../customer/customer-reducer'
import {loadQuestionnaires, load} from '../../questionnaire/questionnaire-reducer'
import {loadSettings} from '../../settings/settings-reducer'
import {loadVolunteers} from '../../volunteer/volunteer-reducer'

import {Page, PageBody} from '../../../components/page'
import {Box, BoxBody, BoxHeader} from '../../../components/box'
import {FieldGroup} from '../../../components/form'
import SelectCustomersTable from './SelectCustomersTable'
import Map from './Map'

const mapStateToProps = state => ({
  settings: state.settings.data,
  customers: selectors.getAllCustomers(state),
  drivers: selectors.getAllDrivers(state),
  loading: selectors.loadingCustomers(state) || selectors.loadingQuestionnaires(state) ||
    state.settings.fetching || selectors.loadingVolunteers(state),
  saving: selectors.savingCustomers(state),
  error: selectors.loadCustomersError(state) || selectors.loadQuestionnairesError(state) || selectors.loadVolunteersError(state) || state.settings.error
})

const mapDispatchToProps = dispatch => ({
  loadCustomers: () => dispatch(loadCustomers()),
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  loadSettings: () => dispatch(loadSettings()),
  loadVolunteers: () => dispatch(loadVolunteers()),
  assignCustomers: (customerIds, driverId) => dispatch(assignCustomers(customerIds, driverId))
})

class DriverRoutes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedCustomers: [],
      selectedDriver: '',
      selectedFilter: 'unassigned'
    }
  }
  componentWillMount() {
    this.props.loadCustomers()
    this.props.loadQuestionnaires()
    this.props.loadSettings()
    this.props.loadVolunteers()
  }

  handleFieldChange = ev => {
    const {name, value} = ev.target
    this.setState({[name]: value})
  }

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

  assignCustomers = ev => {
    const customerIds = this.props.customers.filter(this.isSelected)
      .map(customer => customer.id)

    if (!customerIds.length) return
    this.props.assignCustomers(customerIds, this.state.selectedDriver)
  }

  render() {
    const {
      customers,
      drivers,
      settings,
      loading,
      saving,
      error
    } = this.props
    const {selectedCustomers, selectedDriver, selectedFilter} = this.state
    let markers = selectedCustomers.map(id => {
      const customer = customers && customers.find(c => c.id === id)
      if (!customer || !customer.location || !customer.location.length === 2) return
      return {
        position: {lat: customer.location[0], lng: customer.location[1]}
      }
    })
    if (!settings) return null
    const foodbankLocation = {
      lat: settings.location[0],
      lng: settings.location[1]
    }

    return (
      <Page>
        <PageBody>
          <Col md={6} lg={5}>
            <Box>
              <BoxHeader heading="Driver Assignment" />
              <BoxBody loading={loading} error={error}>
                {!loading && !error &&
                  <div>
                    <div style={{
                      display: 'flex',
                      alignContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <FieldGroup
                        name="selectedDriver"
                        type="select"
                        label="Assign Selected Customers"
                        value={selectedDriver}
                        onChange={this.handleFieldChange}
                        style={{flexGrow: 1, marginRight: '10px'}}
                      >
                        {drivers && drivers.map(driver =>
                          <option key={driver.id} value={driver.id}>
                            {driver.fullName}
                          </option>
                        )}
                      </FieldGroup>
                      <Button
                        bsStyle="success"
                        onClick={this.assignCustomers}
                        disabled={!selectedCustomers.length || !selectedDriver}
                        style={{marginTop: '10px'}}
                      >
                        Assign
                      </Button>
                    </div>
                    <FieldGroup
                      name="selectedFilter"
                      type="select"
                      label="Filter Customers"
                      value={selectedFilter}
                      onChange={this.handleFieldChange}
                    >
                      <option value="unassigned">Unassigned</option>
                      <option value="any">Any</option>
                      {drivers && drivers.map(driver =>
                        <option key={driver.id} value={driver.id}>
                          {driver.fullName}
                        </option>
                      )}
                    </FieldGroup>
                    <SelectCustomersTable
                      customers={customers}
                      isSelected={this.isSelected}
                      handleSelect={this.handleSelectCustomer}
                      filter={selectedFilter}
                    />
                  </div>
                }
              </BoxBody>
            </Box>
          </Col>
          <Col md={6} lg={7}>
            {location &&
              <Map
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyCASB95kRU_cIYk8LaG8tS-HY4pgV47hMU"
                loadingElement={<div className="overlay">
                    <i className="fa fa-refresh fa-spin"></i>
                  </div>}
                containerElement={<div className="googleMap" />}
                mapElement={<div style={{ height: `100%` }} />}
                onMapLoad={_.noop}
                onMapClick={_.noop}
                markers={markers}
                onMarkerRightClick={_.noop}
                defaultCenter={foodbankLocation}
              />
            }
          </Col>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DriverRoutes)
