import {intersection, partition} from 'lodash'

import {ADMIN_ROLE, clientRoles, volunteerRoles} from '../../../../common/constants'
import {LOAD_SUCCESS, CLEAR_USER, SIGNIN_SUCCESS, SIGNUP_SUCCESS} from '../../users/authReducer'

export default (state = {items: []}, action) => {
  switch (action.type) {
    case CLEAR_USER:
    case SIGNIN_SUCCESS:
    case SIGNUP_SUCCESS:
    case LOAD_SUCCESS:
      return {
        items: getMenuItems(action.response)
      }
    default: return state
  }
}

const notAdmin = `!${ADMIN_ROLE}`
const notCustomer = `!${clientRoles.CUSTOMER}`
const notDonor = `!${clientRoles.DONOR}`
const notVolunteer = `!${clientRoles.VOLUNTEER}`

function getMenuItems(user) {
  if (!user) return []

  const items = [{
    title: 'Customers',
    type: 'treeview',
    link: 'customers',
    roles: [notAdmin],
    items: [{
      title: 'Information',
      link: 'customers',
      roles: [clientRoles.CUSTOMER]
    }, {
      title: 'Edit Details',
      link: `customers/${user._id}/edit`,
      roles: [clientRoles.CUSTOMER]
    }, {
      title: 'Apply',
      link: 'customers/create',
      roles: [notCustomer]
    }]
  }, {
    title: 'Donors',
    type: 'treeview',
    link: 'donors',
    roles: [notAdmin],
    items: [{
      title: 'Information',
      link: 'donors',
      roles: [clientRoles.DONOR]
    }, {
      title: 'Edit Details',
      link: `donors/${user._id}/edit`,
      roles: [clientRoles.DONOR]
    }, {
      title: 'Apply',
      link: 'donors/create',
      roles: [notDonor]
    }, {
      type: 'divider',
      roles: [clientRoles.DONOR]
    }, {
      title: 'My Donations',
      link: `donors/${user._id}`,
      roles: [clientRoles.DONOR]
    }]
  }, {
    title: 'Volunteers',
    type: 'treeview',
    link: 'volunteers',
    roles: [notAdmin],
    items: [{
      title: 'Information',
      link: 'volunteers',
      roles: [clientRoles.VOLUNTEER]
    }, {
      title: 'Edit Details',
      link: `volunteers/${user._id}/edit`,
      roles: [clientRoles.VOLUNTEER]
    }, {
      type: 'divider',
      roles: [
        volunteerRoles.INVENTORY,
        volunteerRoles.PACKING,
        volunteerRoles.SCHEDULE,
        volunteerRoles.DRIVER
      ]
    }, {
      title: 'Food Schedule',
      link: 'schedule',
      roles: [volunteerRoles.SCHEDULE]
    }, {
      title: 'Packing List',
      link: 'packing',
      roles: [volunteerRoles.PACKING]
    }, {
      title: 'Inventory',
      link: 'inventory',
      roles: [volunteerRoles.INVENTORY]
    }, {
      title: 'Delivery',
      link: `drivers/${user._id}`,
      roles: [volunteerRoles.DRIVER]
    }, {
      title: 'Apply',
      link: 'volunteers/create',
      roles: [notVolunteer]
    }]
  }]

  return items.map(item => {
    if (item.type === 'treeview') return {
      ...item,
      items: item.items.filter(fulfillsRole(user))
    }
    return item
  }).filter(fulfillsRole(user))
}

function fulfillsRole(user) {
  return item => {
    if (!item.roles) return true

    const [forbiddenRoles, requiredRoles] = partition(item.roles, role =>
      role.startsWith('!'))

    const hasNoForbiddenRoles = intersection(
      forbiddenRoles.map(r => r.slice(1)),
      user.roles
    ).length === 0

    if (forbiddenRoles.length && !requiredRoles.length)
      return hasNoForbiddenRoles

    const hasRequiredRole = intersection(requiredRoles, user.roles).length > 0
    return hasRequiredRole && hasNoForbiddenRoles
  }
}
