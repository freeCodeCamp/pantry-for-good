import React from 'react'
import {ListGroup} from 'react-bootstrap'

import DriverListItem from './DriverListItem'
import DriverListDetail from './DriverListDetail'

const DriverList = ({drivers, setDriver, selectedDriverId}) =>
  <ListGroup>
    {drivers && drivers.map(driver =>
      driver.id === selectedDriverId ?
        <DriverListDetail
          key={driver.id}
          driver={driver}
        /> :
        <DriverListItem
          key={driver.id}
          driver={driver}
          onClick={setDriver(driver.id)}
        />
    )}
  </ListGroup>

export default DriverList
