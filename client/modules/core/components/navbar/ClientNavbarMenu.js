import React from 'react'
import PropTypes from 'prop-types'
import {intersection} from 'lodash'

import MenuGroup from './ClientNavbarMenuGroup'
import MenuItem from './ClientNavbarMenuItem'
import {clientRoles, volunteerRoles} from '../../../../../common/constants'

const {INVENTORY, PACKING, SCHEDULE} = volunteerRoles
const hasRoles = (user, roles) => user && intersection(user.roles, roles).length !== 0

const ClientNavbarMenu = ({user}) =>  
  <ul className="nav navbar-nav">
    {hasRoles(user, [clientRoles.CUSTOMER])
      ?
      <MenuGroup title="Customers">
        <MenuItem title="Information" path="/customers" />
        <MenuItem title="Edit Details" path={`/customers/${user._id}/edit`} />
      </MenuGroup> 
      :
      <MenuItem title="Apply as a Customer" path="/customers/create" />
    }
    
    {hasRoles(user, [clientRoles.DONOR])
      ?
      <MenuGroup title="Donors">
        <MenuItem title="Information" path="/donors" />
        <MenuItem title="Edit Details" path={`/donors/${user._id}/edit`} />
        <li className="divider"></li>
        <MenuItem title="My Donations" path={`/donations/${user._id}`} />
      </MenuGroup>
      :
      <MenuItem title="Apply as a Donor" path="/donors/create" />
    }

    {hasRoles(user, [clientRoles.VOLUNTEER])
      ?
      <MenuGroup title="Volunteers">
        <MenuItem title="Information" path="/volunteers" />
        <MenuItem title="Edit Details" path={`/volunteers/${user._id}/edit`} />
        {hasRoles(user, [SCHEDULE, PACKING, INVENTORY]) &&
          <li className="divider"></li>}
        {hasRoles(user, [SCHEDULE]) &&
          <MenuItem title="Food Schedule" path="/schedule" />}
        {hasRoles(user, [PACKING]) &&
          <MenuItem title="Packing List" path="/packing" />}
        {hasRoles(user, [INVENTORY]) &&
          <MenuItem title="Inventory" path="/inventory" />}
      </MenuGroup>
      :
      <MenuItem title="Apply as a Volunteer" path="/volunteers/create" />
    }
  </ul>

ClientNavbarMenu.propTypes = {
  user: PropTypes.object
}

export default ClientNavbarMenu