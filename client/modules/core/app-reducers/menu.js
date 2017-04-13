import {SET_USER, CLEAR_USER, SIGNIN_SUCCESS, SIGNUP_SUCCESS} from '../../users/auth-reducer'

export default (state, action) => {
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
  // need to figure out if user is driver to add route assignment menu item
}

function getAdminMenuItems() {
  return [
    {
      title: 'Client Database',
      link: 'customers',
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
      title: 'Drivers and Route Assignment',
      link: 'drivers',
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
      title: 'Volunteer Database',
      link: 'volunteers',
    }, {
      title: 'Donor Database and Tax Receipts',
      link: 'donors',
    }, {
      title: 'App Settings',
      link: 'settings',
    }, {
      title: 'Media',
      link: 'media',
    }, {
      title: 'Questionnaire Editor',
      link: 'questionnaires',
    }
  ]
}
