
import User from '../models/user'
import Volunteer from '../models/volunteer'

/**
 * Set Notification
 */
// let notification = {message:'', url: '', date: date}
async function setNotification(id, notification, model){
  await model.findOneAndUpdate(
    {_id: id},
    {$push: {notifications: notification}}
  )
}

/**
 * Search User and Set Notification to admin role
 */
export async function searchUserAndSetNotification(roleU, notification) {
  const users = await User.find({})

  users.forEach(function(user) {
    user.roles.map(role => {
      if (role === roleU){
        setNotification(user._id, notification, User)
      }
    })
  })
}

/**
 * Search volunteer and Set Notification to admin role
 */
export async function searchVolunteerAndSetNotification(notification, customerId) {
  const volunteers = await Volunteer.find({})

  volunteers.forEach(function(volunteer) {
    if(volunteer.customers.length > 0){
      volunteer.customers.map(customer => {    
        if (customer === customerId){
          setNotification(volunteer._id, notification, User)
        }
      })
    }
  })
}