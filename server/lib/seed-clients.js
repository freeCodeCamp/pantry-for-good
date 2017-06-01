import mongoose from 'mongoose'
import capitalize from 'lodash/capitalize'
import extend from 'lodash/extend'
import random from 'lodash/random'
import range from 'lodash/range'
import faker from 'faker'

const User = mongoose.model('User')
const Donation = mongoose.model('Donation')
const Food = mongoose.model('Food')
const Questionnaire = mongoose.model('Questionnaire')

const clientTypes = ['customer', 'volunteer', 'donor']

export default async function seedClients(addressGenerator) {
  await clientTypes.map(async type => {
    const Model = mongoose.model(capitalize(type))
    const count = await Model.count()
    if (count) return

    const users = await User.find({accountType: [type]})
      .select('-salt -password -__v')

    await Promise.all(
      users.map(async user => {
        const client = new Model(user.toObject())
        const seededClient = await seedClientFields(client, addressGenerator)

        await seededClient.save()
        await User.findOneAndUpdate({_id: client._id}, {$set: {hasApplied: true }})
      })
    )
  })
}

/**
 * Seed client fields
 *
 * @param {mongoose.Document} client
 * @returns {Promise<mongoose.Document>}
 */
async function seedClientFields(client, addressGenerator) {
  const address = addressGenerator.getOne()
  const dynamicFields = await seedDynamicFields(client, address)
  const staticFields = await seedStaticFields(client, dynamicFields[0].value, address)

  return extend(client, staticFields, {fields: dynamicFields})
}

/**
 * Seed client dynamic fields
 *
 * @param {object} client
 * @returns {array}
 */
async function seedDynamicFields(client, address) {
  const identifier = `q${capitalize(client.accountType)}s`
  const questionnaire = await Questionnaire
    .findOne({identifier})
    .lean()

  const generalInfoFields = questionnaire.sections[0].fields

  const addressFields = generalInfoFields.filter(field => field.type === 'address')
  const dateOfBirthField = generalInfoFields.find(field => field.label === 'Date of Birth')

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

  if (dateOfBirthField)
    fields.unshift({
      meta: dateOfBirthField,
      value: faker.date.between('1950-01-01', '2000-12-31').toISOString()
    })

  return fields
}

/**
 * Seed client static fields
 *
 * @param {object} client
 * @param {string} dateOfBirth
 * @returns {object}
 */
async function seedStaticFields(client, dateOfBirth, address) {
  const {lat, lng} = address
  let properties = {}

  if (client.accountType.find(type => type === 'volunteer')) {
    properties.status = randomIn({
      'Active': 0.8,
      'Inactive': 0.2
    })

    if (client.firstName === 'driver') {
      properties.driver = true
      properties.location = {lat, lng}
    }
  }

  if (client.accountType.find(type => type === 'donor')) {
    properties = {
      ...properties,
      ...await populateDonorFields(client)
    }
  }

  if (client.accountType.find(type => type === 'customer')) {
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
  const donations = range(10).map(() => {
    const type = randomIn({
      'Cash': 0.25,
      'Cash with advantage': 0.25,
      'Non-cash': 0.25,
      'Non-cash with advantage': 0.25
    })

    const dateReceived = faker.date.past(3).toISOString()

    return {
      type,
      dateReceived,
      eligibleForTax: random(10, 1000),
      donorName: client.displayName
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
  const foodPreferences = (await Food.aggregate(
      {$unwind: '$items'},
      {$sample: {size: random(4, 10)}}))
    .map(res => res.items._id)

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
