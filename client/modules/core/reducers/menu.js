import {intersection} from 'lodash'

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
  if (!user.hasApplied && !user.roles.find(r => r === 'admin')) {
    return [{
      title: 'Apply',
      link: `${user.accountType[0]}s/create`,
    }]
  }

  const items = [{
    title: 'Edit Application',
    link: `${user.accountType}s/${user._id}/edit`,
    roles: ['customer', 'donor', 'volunteer']
  }, {
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
  }, {
    title: 'Food Schedule',
    link: 'schedule',
    roles: ['admin', 'volunteer']
  }, {
    title: 'Packing List',
    link: 'packing',
    roles: ['admin', 'volunteer']
  }, {
    title: 'Inventory',
    link: 'inventory',
    roles: ['admin', 'volunteer']
  }, {
    title: 'Delivery',
    link: `drivers/${user._id}`,
    roles: ['driver']
  }, {
    title: 'Delivery',
    link: 'drivers',
    menuItemType: 'treeview',
    roles: ['admin'],
    items: [{
      title: 'Drivers',
      link: 'drivers/list',
    }, {
      title: 'Route Assignment',
      link: 'drivers/routes',
    }]
  }, {
    title: 'Settings',
    link: 'settings',
    menuItemType: 'treeview',
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

  return items.filter(item => intersection(item.roles, user.roles).length > 0)
}
