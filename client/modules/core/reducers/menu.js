import {intersection, partition} from 'lodash'

import {LOAD_SUCCESS, CLEAR_USER, SIGNIN_SUCCESS, SIGNUP_SUCCESS} from '../../users/reducer'

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

function getMenuItems(user) {
  if (!user) return []

  const clientItems = [{
    title: 'Customers',
    type: 'treeview',
    link: 'customers',
    roles: ['!admin'],
    items: [{
      title: 'Information',
      link: 'customers',
      roles: ['customer']
    }, {
      title: 'Edit Details',
      link: `customers/${user._id}/edit`,
      roles: ['customer']
    }, {
      title: 'Apply',
      link: 'customers/create',
      roles: ['!customer']
    }]
  }, {
    title: 'Donors',
    type: 'treeview',
    link: 'donors',
    roles: ['!admin'],
    items: [{
      title: 'Information',
      link: 'donors',
      roles: ['donor']
    }, {
      title: 'Edit Details',
      link: `donors/${user._id}/edit`,
      roles: ['donor']
    }, {
      title: 'Apply',
      link: 'donors/create',
      roles: ['!donor']
    }]
  }, {
    title: 'Volunteers',
    type: 'treeview',
    link: 'volunteers',
    roles: ['!admin'],
    items: [{
      title: 'Information',
      link: 'volunteers',
      roles: ['volunteer']
    }, {
      title: 'Edit Details',
      link: `volunteers/${user._id}/edit`,
      roles: ['volunteer']
    }, {
      type: 'divider',
      roles: ['volunteer', 'driver']
    }, {
      title: 'Food Schedule',
      link: 'schedule',
      roles: ['volunteer', '!driver']
    }, {
      title: 'Packing List',
      link: 'packing',
      roles: ['volunteer', '!driver']
    }, {
      title: 'Inventory',
      link: 'inventory',
      roles: ['volunteer', '!driver']
    }, {
      title: 'Delivery',
      link: `drivers/${user._id}`,
      roles: ['driver']
    }, {
      title: 'Apply',
      link: 'volunteers/create',
      roles: ['!volunteer']
    }]
  }]

  const adminClientItems = [{
    title: 'Customers',
    link: 'customers/list',
    roles: ['admin']
  }, {
    title: 'Volunteers',
    link: 'volunteers/list',
    roles: ['admin']
  }, {
    title: 'Donors',
    link: 'donors/list',
    roles: ['admin']
  }]

  const foodItems = [{
    title: 'Food Schedule',
    link: 'schedule',
    roles: ['admin']
  }, {
    title: 'Packing List',
    link: 'packing',
    roles: ['admin']
  }, {
    title: 'Inventory',
    link: 'inventory',
    roles: ['admin']
  }]

  const deliveryItems = [{
    title: 'Delivery',
    link: 'drivers',
    type: 'treeview',
    roles: ['admin'],
    items: [{
      title: 'Drivers',
      link: 'drivers/list',
    }, {
      title: 'Route Assignment',
      link: 'drivers/routes',
    }]
  }]

  const settingsItems = [{
    title: 'Settings',
    link: 'settings',
    type: 'treeview',
    roles: ['admin'],
    items: [{
      title: 'General',
      link: 'settings'
    }, {
      title: 'Pages',
      link: 'settings/pages'
    }, {
      title: 'Emails',
      link: 'settings/emails'
    }, {
      title: 'Applications',
      link: 'settings/questionnaires'
    }]
  }]

  const items = [
    ...clientItems,
    ...adminClientItems,
    ...foodItems,
    ...deliveryItems,
    ...settingsItems
  ]


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
