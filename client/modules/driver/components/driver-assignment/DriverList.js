import React from 'react'
import {ListGroup, ListGroupItem} from 'react-bootstrap'

import driverIcon from '../../images/car-green2.png'

const DriverList = ({drivers, setDriver, selectedDriverId}) =>
  <ListGroup style={{marginBottom: 0}}>
    {drivers && drivers.filter(driver => driver._id !== selectedDriverId)
      .map(driver =>
        <ListGroupItem
          key={driver._id}
          onClick={setDriver(driver._id)}
        >
          <div style={{display: 'flex'}}>
            <img
              src={driverIcon}
              style={{
                marginRight: '10px',
                width: '24px',
                height: '24px'
              }}
            />
            <div style={{flexGrow: 2}}>
              {driver.fullName}
            </div>
            <div>
              <span style={{padding: '0 8px'}}>
                {driver.customers.length}
              </span>
              <i className="fa fa-users" style={{color: '#777'}} />
            </div>
          </div>
        </ListGroupItem>
      )
    }
  </ListGroup>

export default DriverList
