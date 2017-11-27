const placeholderTypes = {
  PAGE: 'page',
  EMAIL: 'email',
  ATTACHMENT: 'attachment'
}

const placeholders = [
  {id: 'organization', label: 'Foodbank Name'},
  {id: 'address', label: 'Foodbank Address'},
  {id: 'url', label: 'Foodbank Website'},
  {id: 'clientIntakeNumber', label: 'Client Intake Number'},
  {id: 'supportNumber', label: 'Support Number'},
  {id: 'receiptFields',
    label: 'Receipt Fields',
    format: value => `<p>${value.name}: ${value.value}</p>`
  },

  {id: 'firstName', label: 'User First Name', type: placeholderTypes.EMAIL},
  {id: 'lastName', label: 'User Last Name', type: placeholderTypes.EMAIL},
  {id: 'fullName', label: 'User Full Name', type: placeholderTypes.EMAIL},
  {
    id: 'passwordResetLink',
    label: 'Password Reset Link',
    type: placeholderTypes.EMAIL,
    required: true,
    format: value => `<a href="${value}">Reset Password</a>`
  },
  {
    id: 'logo',
    label: 'Logo',
    type: placeholderTypes.ATTACHMENT,
    format: () => '<img src="cid:logo" alt="Logo" />'
  },
  {
    id: 'signature',
    label: 'Signature',
    type: placeholderTypes.ATTACHMENT,
    format: () => '<img src="cid:signature" alt="Signature" />'
  },
  {
    id: 'receipt',
    label: 'Donation Receipt',
    type: placeholderTypes.EMAIL,
    required: true,
    format: value => renderReceipt(value)
  },
]

function getPagePlaceholders() {
  return placeholders.filter(pl => !pl.type || pl.type === placeholderTypes.PAGE)
}

function getEmailPlaceholders() {
  return placeholders.filter(pl => pl.type === placeholderTypes.EMAIL)
}

function getAttachmentPlaceholders() {
  return placeholders.filter(pl => pl.type === placeholderTypes.ATTACHMENT)
}

function getPlaceholders(types) {
  let placeholders = getPagePlaceholders()

  if (types.find(type => type === placeholderTypes.EMAIL))
    placeholders = placeholders.concat(getEmailPlaceholders())

  if (types.find(type => type === placeholderTypes.ATTACHMENT))
    placeholders = placeholders.concat(getAttachmentPlaceholders())

  return placeholders
}

function renderReceipt(values) {
  const ids = ['organization', 'address', 'url', 'supportNumber', 'receiptFields']
  let table = '<table>'

  for (let i = 0; i < ids.length; i++) {
    const placeholder = placeholders.find(p => p.id === ids[i])
    if (ids[i] === 'receiptFields')  table += `<tr><td>${values[ids[i]].name}:</td><td> ${values[ids[i]].value}</td></tr>`
    else table += `<tr><td>${placeholder.label}:</td><td> ${values[ids[i]]}</td></tr>`
  }

  table += `<tr><td><p>Here you have a list of the donations our organization recibed from you:</p></td></tr>`
  const items = values.items
  table += `<tr><td><p>Item</p></td><td><p>Value</p></td></tr>`
  let total = 0
  for (let i = 0; i < items.length; i++) {
    table += `<tr><td><p>${items[i].name}</p></td><td><p>${items[i].value}</p></td></tr>`
    total += items[i].value
  }

  return table + `<tr><td><p>Total:</p></td><td><p>${total}</p></td></tr></table>`
}

export {
  placeholders as default,
  placeholderTypes,
  getPlaceholders
}
