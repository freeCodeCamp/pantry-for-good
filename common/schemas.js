import {schema} from 'normalizr'

export const customer = new schema.Entity('customers', {}, {idAttribute: '_id'})
export const donation = new schema.Entity('donations', {}, {idAttribute: '_id'})
export const donor = new schema.Entity('donors', {}, {idAttribute: '_id'})
export const field = new schema.Entity('fields', {}, {idAttribute: '_id'})
export const foodCategory = new schema.Entity('foodCategories', {}, {
  idAttribute: '_id',
  processStrategy: value => {
    //Add the category _id to each item in that category
    let category = Object.assign({}, value)
    if (category.items) {
      category.items.forEach(item => item.categoryId = category._id)
    }
    return category
  }
})
export const foodItem = new schema.Entity('foodItems', {}, {idAttribute: '_id'})
export const foodPackage = new schema.Entity('packages', {}, {idAttribute: '_id'})
export const page = new schema.Entity('pages', {}, {idAttribute: '_id'})
export const questionnaire = new schema.Entity('questionnaires', {}, {idAttribute: '_id'})
export const section = new schema.Entity('sections', {}, {idAttribute: '_id'})
export const user = new schema.Entity('users', {}, {idAttribute: '_id'})
export const volunteer = new schema.Entity('volunteers', {}, {idAttribute: '_id'})

export const notification = new schema.Entity('notification', {}, {idAttribute: '_id'})
export const arrayOfNotifications = new schema.Array(notification)

export const arrayOfDonations = new schema.Array(donation)
export const arrayOfDonors = new schema.Array(donor)
export const arrayOfCustomers = new schema.Array(customer)
export const arrayOfFields = new schema.Array(field)
export const arrayOfFoodCategories = new schema.Array(foodCategory)
export const arrayOfFoodItems = new schema.Array(foodItem)
export const arrayOfPackages = new schema.Array(foodPackage)
export const arrayOfPages = new schema.Array(page)
export const arrayOfQuestionnaires = new schema.Array(questionnaire)
export const arrayOfSections = new schema.Array(section)
export const arrayOfUsers = new schema.Array(user)
export const arrayOfVolunteers = new schema.Array(volunteer)

const shallowVolunteer = new schema.Entity('volunteers', {
  fields: [{meta: field}],
}, {idAttribute: '_id'})
customer.define({
  fields: [{meta: field}],
  foodPreferences: arrayOfFoodItems,
  packingList: arrayOfFoodItems,
  assignedTo: shallowVolunteer
})

donation.define({donor})

donor.define({
  fields: [{meta: field}],
  donations: arrayOfDonations
})

questionnaire.define({sections: arrayOfSections})

section.define({fields: arrayOfFields})

foodPackage.define({
  customer,
  contents: arrayOfFoodItems
})

foodCategory.define({
  items: arrayOfFoodItems
})

const shallowCustomer = new schema.Entity('customers', {
  fields: [{meta: field}],
  foodPreferences: arrayOfFoodItems,
  packingList: arrayOfFoodItems,
}, {idAttribute: '_id'})
volunteer.define({
  fields: [{meta: field}],
  customers: new schema.Array(shallowCustomer)
})
