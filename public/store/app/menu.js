import {capitalize} from 'lodash'
import {SET_USER, CLEAR_USER, SIGNIN_SUCCESS, SIGNUP_SUCCESS} from '../auth'

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
  const userType = user.roles[0]
  const userTypeCap = capitalize(user.roles[0])
  if (!user.hasApplied)
    return [
      {
        title: 'Apply',
        link: `${userType}/create`,
        uiRoute: `root.create${userTypeCap}User`
      }
    ]
  return [
    {
      title: 'Edit Application',
      link: `${userType}/${user._id}/edit`,
      uiRoute: `root.edit${userTypeCap}User({${userType}Id: ${user._id}})`
    }
  ]
  // need to figure out if user is driver to add route assignment menu item
}

function getAdminMenuItems() {
  return [
    {
      title: 'Client Database',
      link: 'admin/customers',
      uiRoute: 'root.listCustomers',
    }, {
      title: 'Food Schedule',
      link: 'admin/schedules',
      uiRoute: 'root.schedules',
    }, {
      title: 'Packing List',
      link: 'admin/packing',
      uiRoute: 'root.packing',
    }, {
      title: 'Inventory',
      link: 'admin/foods-react',
      uiRoute: 'root.foodsAdminReact',
    }, {
      title: 'Drivers and Route Assignment',
      link: 'admin/drivers',
      menuItemType: 'treeview',
      uiRoute: 'root.driver',
      items: [
        {
          title: 'Drivers',
          link: 'admin/drivers',
          uiRoute: 'root.driver.admin',
        }, {
          title: 'Route Assignment',
          link: 'admin/drivers/routes',
          uiRoute: 'root.driver.routes',
        }
      ]
    }, {
      title: 'Volunteer Database',
      link: 'admin/volunteers',
      uiRoute: 'root.listVolunteers',
    }, {
      title: 'Donor Database and Tax Receipts',
      link: 'admin/donors',
      uiRoute: 'root.listDonors',
    }, {
      title: 'App Settings',
      link: 'settings',
      uiRoute: 'root.changeSettings',
    }, {
      title: 'Media',
      link: 'media',
      uiRoute: 'root.changeMedia',
    }, {
      title: 'Questionnaire Editor',
      link: 'admin/questionnaires',
      uiRoute: 'root.questionnaires',
    }
  ]
}
