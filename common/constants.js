export const ADMIN_ROLE = 'roles/admin'

export const clientRoles = {
  CUSTOMER: 'roles/customer',
  DONOR: 'roles/donor',
  VOLUNTEER: 'roles/volunteer'
}

export const volunteerRoles = {
  DRIVER: 'roles/driver',
  INVENTORY: 'roles/inventory',
  PACKING: 'roles/packing',
  SCHEDULE: 'roles/schedule'
}

export const fieldTypes = {
  ADDRESS: 'address',
  CHECKBOX: 'checkbox',
  DATE: 'date',
  RADIO: 'radio',
  TEXT: 'text',
  TEXTAREA: 'textarea'
}

export const widgetTypes = {
  FOOD_PREFERENCES: 'widgets/foodPreferences',
  HOUSEHOLD: 'widgets/household',
  TABLE: 'widgets/table'
}

export const modelTypes = {
  CUSTOMER: 'Customer',
  DONATION: 'Donation',
  DONOR: 'Donor',
  FOOD: 'Food',
  FOOD_ITEM: 'FoodItem',
  MEDIA: 'Media',
  PACKAGE: 'Package',
  PAGE: 'Page',
  QUESTIONNAIRE: 'Questionnaire',
  SETTINGS: 'Settings',
  USER: 'User',
  VOLUNTEER: 'Volunteer'
}

export const pageIdentifiers = {
  HOME: 'home',
  CUSTOMER: 'customers',
  DONOR: 'donors',
  VOLUNTEER: 'volunteers',
  CUSTOMER_ACCEPTED: 'accept-customer',
  CUSTOMER_REJECTED: 'reject-customer',
  CUSTOMER_APPLIED: 'customer-application',
  CUSTOMER_UPDATED: 'customer-update',
  DONATION_RECEIVED: 'donation-received',
  DONATION_RECEIPT: 'donation-receipt',
  PASSWORD_RESET: 'password-reset',
  PASSWORD_RESET_GOOGLE: 'password-reset-google'
}

export const pageTypes = {
  PAGE: 'page',
  EMAIL: 'email'
}

export const questionnaireIdentifiers = {
  CUSTOMER: 'questionnaire/customers',
  DONOR: 'questionnaire/donors',
  VOLUNTEER: 'questionnaire/volunteers'
}

export const customerStatus = {
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  PENDING: 'Pending',
  INACTIVE: 'Inactive'
}
