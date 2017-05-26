import React from 'react'
import {connect} from 'react-redux'

import selectors from '../../../../store/selectors'
import {setFilter, setDriver} from '../../reducers/assignment'
import {Box, BoxBody, BoxHeader} from '../../../../components/box'
import FilterCustomers from './FilterCustomers'
import DriverList from './DriverList'

const mapStateToProps = state => ({
  selectedDriverId: selectors.delivery.assignment.getDriverId(state),
  drivers: selectors.volunteer.getAllDrivers(state),
  filter: selectors.delivery.assignment.getFilter(state)
})

const mapDispatchToProps = dispatch => ({
  setDriver: id => () => dispatch(setDriver(id)),
  handleFilterChange: ev => dispatch(setFilter(ev.target.value))
})

const AssignDriverForm = ({
  selectedDriverId,
  drivers,
  filter,
  handleFilterChange,
  setDriver,
  loading,
  error
}) =>
  !loading && !error ?
    <Box className="assignmentBox">
      <BoxHeader heading="Drivers">
        <div className="box-tools">
          <FilterCustomers
            filter={filter}
            handleFilterChange={handleFilterChange}
            drivers={drivers}
          />
        </div>
      </BoxHeader>
      <BoxBody
        loading={loading}
        error={error}
      >
        <DriverList
          drivers={drivers}
          selectedDriverId={selectedDriverId}
          setDriver={setDriver}
        />
      </BoxBody>
    </Box> :
    null

export default connect(mapStateToProps, mapDispatchToProps)(AssignDriverForm)
