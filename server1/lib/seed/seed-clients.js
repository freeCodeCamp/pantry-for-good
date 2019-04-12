import mongoose from 'mongoose'
import faker from 'faker'
import {
  extend,
  intersection,
  map,
  random,
  range
} from 'lodash'

import {
  clientRoles,
  volunteerRoles,
  fieldTypes,
  modelTypes,
  questionnaireIdentifiers
} from '../../../common/constants'

const User = mongoose.model(modelTypes.USER)
const Donation = mongoose.model(modelTypes.DONATION)
const Food = mongoose.model(modelTypes.FOOD)
const Questionnaire = mongoose.model(modelTypes.QUESTIONNAIRE)

export default async function seedClients(addressGenerator) {
  await Promise.all(map(clientRoles, async (role, key) => {
    const Model = mongoose.model(modelTypes[key])
    const count = await Model.count()
    if (count) return

    const users = await User.find({roles: role})
      .select('-__v')

    const clients = await Promise.all(users.map(user => {
      const client = new Model(user.toObject())
      return seedClientFields(client, user, addressGenerator)
    }))

    await Model.insertMany(clients)
  }))
}

/**
 * Seed client fields
 *
 * @param {mongoose.Document} client
 * @returns {Promise<mongoose.Document>}
 */
async function seedClientFields(client, user, addressGenerator) {
  const address = addressGenerator.getOne()
  const dynamicFields = await seedDynamicFields(client, user, address)
  const staticFields = await seedStaticFields(client, user, dynamicFields[0].value, address)

  return extend(client, staticFields, {fields: dynamicFields})
}

/**
 * Seed client dynamic fields
 *
 * @param {object} client
 * @returns {array}
 */
async function seedDynamicFields(client, user, address) {
  const roleKey = Object.keys(clientRoles).find(role =>
    intersection(user.roles, [clientRoles[role]]).length)

  const identifier = questionnaireIdentifiers[roleKey]
  const questionnaire = await Questionnaire
    .findOne({identifier})
    .lean()

  const generalInfoFields = questionnaire.sections[0].fields

  const addressFields = generalInfoFields.filter(field =>
    field.type === fieldTypes.ADDRESS)
  const dateOfBirthField = generalInfoFields.find(field =>
    field.label === 'Date of Birth')

  let fields = [{
    meta: addressFields[0],
    value: address.street
  }, {
    meta: addressFields[1],
    value: address.city
  }, {
    meta: addressFields[2],
    value: address.state
  }, {
    meta: addressFields[3],
    value: address.zip
  }]

  if (dateOfBirthField) {
    fields.unshift({
      meta: dateOfBirthField,
      value: faker.date.between('1950-01-01', '2000-12-31').toISOString()
    })
  }

  return fields
}

/**
 * Seed client static fields
 *
 * @param {object} client
 * @param {string} dateOfBirth
 * @returns {object}
 */
async function seedStaticFields(client, user, dateOfBirth, address) {
  const {lat, lng} = address
  let properties = {}

  if (user.roles.find(role => role === clientRoles.VOLUNTEER)) {
    properties.user = user._id

    properties.status = randomIn({
      'Active': 0.8,
      'Inactive': 0.2
    })

    if (user.roles.find(r => r === volunteerRoles.DRIVER)) {
      properties.status = 'Active'
      properties.location = {lat, lng}
    }
  }

  if (user.roles.find(role => role === clientRoles.DONOR)) {
    properties = {
      ...properties,
      ...await populateDonorFields(client)
    }
  }

  if (user.roles.find(role => role === clientRoles.CUSTOMER)) {
    properties = {
      ...properties,
      ...await populateCustomerFields(client, dateOfBirth, address)
    }
  }

  return properties
}

/**
 * return extra fields specific to donors
 *
 * @param {object} client
 * @returns {object}
 */
async function populateDonorFields(client) {
  const donations = range(random(3, 30)).map(() => {
    const items = range(random(1, 4)).map(() => ({
      name: randomIn({
        'Cash': 0.75,
        'Food': 0.25,
      }),
      value: random(1, 50)
    }))

    const total = items.reduce((acc, item) => acc + item.value, 0)
    const dateReceived = faker.date.past(3).toISOString()
    const approved = Boolean(Math.round(Math.random()))

    return {
      donor: client._id,
      dateReceived,
      items,
      total,
      approved,
      ...(approved ? {dateIssued: Date.now()} : {})
    }
  })

  return {donations: await Donation.create(donations)}
}

/**
 * return extra fields specific to customers
 *
 * @param {object} client
 * @param {string} dateOfBirth
 * @returns {object}
 */
async function populateCustomerFields(client, dateOfBirth, address) {
  // get a random sample of foods for foodPreferences
  const foodPreferences = (await Food.aggregate([
    {$unwind: '$items'},
    {$sample: {size: random(4, 10)}}
  ])).map(res => res.items._id)

  const household = [{
    name: `${client.firstName} ${client.lastName}`,
    relationship: 'Applicant',
    dateOfBirth
  }]

  const {lat, lng} = address
  const location = {lat, lng}

  const status = randomIn({
    'Accepted': 0.8,
    'Rejected': 0.1,
    'Pending': 0.05,
    'Inactive': 0.05
  })

  return {
    foodPreferences,
    household,
    location,
    status
  }
}

/**
 * return a random key with given probability
 *
 * @param {object} choices object of keys with probability of returning each key
 * @returns {string} the key
 */
function randomIn(choices) {
  const keys = Object.keys(choices)
  const rand = Math.random()

  return keys.reduce((a, key) => {
    // already have a key just return it
    if (a.key) return a
    // add probability for this key to accumulator
    a.acc += choices[key]

    if (rand < a.acc) return {key}
    else return a
  }, {acc: 0}).key
}
