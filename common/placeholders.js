const placeholders = [
  {id: 'organization', label: 'Foodbank Name'},
  {id: 'address', label: 'Foodbank Address'},
  {id: 'url', label: 'Foodbank Website'},
  {id: 'clientIntakeNumber', label: 'Client Intake Number'},
  {id: 'supportNumber', label: 'Support Number'},

  {id: 'firstName', label: 'User First Name', type: 'email'},
  {id: 'lastName', label: 'User Last Name', type: 'email'},
  {id: 'fullName', label: 'User Full Name', type: 'email'},
  {
    id: 'passwordResetLink',
    label: 'Password Reset Link',
    type: 'email',
    required: true,
    format: value => `<a href="${value}">Reset Password</a>`
  }
]

function getPagePlaceholders() {
  return placeholders.filter(pl => !pl.type)
}

function getEmailPlaceholders() {
  return placeholders.filter(pl => pl.type === 'email')
}

function getPlaceholders(type) {
  let placeholders = getPagePlaceholders()

  if (type === 'email')
    placeholders = placeholders.concat(getEmailPlaceholders())

  return placeholders
}

export {
  placeholders as default,
  getPlaceholders
}
