import {SET_USER, CLEAR_USER, SIGNIN_SUCCESS, SIGNUP_SUCCESS} from '../../users/reducer'

export default (state = {items: []}, action) => {
  switch (action.type) {
    case SET_USER:
      return getMenu(action.user)
    case CLEAR_USER:
    case SIGNIN_SUCCESS:
    case SIGNUP_SUCCESS:
      return getMenu(action.response)
    default: return state
  }
}

function getMenu(user) {
  if (!user) return {}
  const isAdmin = user.roles.find(role => role === 'admin')
  return {
    items: isAdmin ? getAdminMenuItems() : getUserMenuItems(user)
  }
}

function getUserMenuItems(user) {
  // The url paths are 'customers', 'donors' and 'volunteers' so need to add 's' at the end
  const userType = user.roles[0] + 's'
  if (!user.hasApplied)
    return [
      {
        title: 'Apply',
        link: `${userType}/create`,
      }
    ]
  return [
    {
      title: 'Edit Application',
      link: `${userType}/${user._id}/edit`,
    }
  ]
  // TODO: figure out if user is driver to add route assignment menu item
}

function getAdminMenuItems() {
  return [
    {
      title: 'Customers',
      link: 'customers/list',
    }, {
      title: 'Volunteers',
      link: 'volunteers/list',
    }, {
      title: 'Donors',
      link: 'donors/list',
    }, {
      title: 'Food Schedule',
      link: 'foods/schedule',
    }, {
      title: 'Packing List',
      link: 'foods/packing',
    }, {
      title: 'Inventory',
      link: 'foods/inventory',
    }, {
      title: 'Delivery',
      // link: 'drivers',
      menuItemType: 'treeview',
      items: [
        {
          title: 'Drivers',
          link: 'drivers',
        }, {
          title: 'Route Assignment',
          link: 'drivers/routes',
        }
      ]
    }, {
      title: 'App Settings',
      link: 'settings',
    }, {
      title: 'Page Editor',
      link: 'pages'
    }, {
      title: 'Application Forms',
      link: 'questionnaires',
    }
  ]
}
