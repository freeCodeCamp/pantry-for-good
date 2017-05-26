import React from 'react'
import {ListGroupItem} from 'react-bootstrap'

const DriverListItem = ({driver, onClick}) =>
  <ListGroupItem
    style={{display: 'flex'}}
    onClick={onClick}
  >
    <div style={{flexGrow: 2}}>
      {driver.fullName}
    </div>
    <div>
      <span style={{padding: '0 8px'}}>
        {driver.customers.length}
      </span>
      <i className="fa fa-users" style={{color: '#777'}} />
    </div>
  </ListGroupItem>

export default DriverListItem
