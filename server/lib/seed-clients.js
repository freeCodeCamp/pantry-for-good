import mongoose from 'mongoose'
import capitalize from 'lodash/capitalize'
import extend from 'lodash/extend'
import random from 'lodash/random'
import range from 'lodash/range'
import faker from 'faker'
import {utc} from 'moment'

const User = mongoose.model('User')
const Donation = mongoose.model('Donation')
const Food = mongoose.model('Food')
const Questionnaire = mongoose.model('Questionnaire')

const clientTypes = ['customer', 'volunteer', 'donor']

export default async function seedClients() {
  await clientTypes.map(async type => {
    const Model = mongoose.model(capitalize(type))
    const count = await Model.count()
    if (count) return

    const users = await User.find({accountType: [type]})
      .select('-salt -password -__v')

    await Promise.all(
      users.map(async user => {
        const client = new Model(user.toObject())
        const seededClient = await seedClientFields(client)

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
async function seedClientFields(client) {
  const dynamicFields = await seedDynamicFields(client)
  const staticFields = await seedStaticFields(client, dynamicFields[0].value)

  return extend(client, staticFields, {fields: dynamicFields})
}

/**
 * Seed client dynamic fields
 *
 * @param {object} client
 * @returns {array}
 */
async function seedDynamicFields(client) {
  const identifier = `q${capitalize(client.accountType)}s`
  const questionnaire = await Questionnaire
    .findOne({identifier})
    .lean()

  const generalInfoFields = questionnaire.sections[0].fields

  const addressFields = generalInfoFields.filter(field => field.type === 'address')
  const dateOfBirthField = generalInfoFields.find(field => field.label === 'Date of Birth')
// console.log('client', client)

  if (dateOfBirthField)
    return [{
      meta: dateOfBirthField,
      value: randomDate('1950-01-01', '2000-12-31')
    }, {
      meta: addressFields[0],
      value: `${random(1,350)} ${faker.address.streetName()}`
    }, {
      meta: addressFields[1],
      value: faker.address.city()
    }, {
      meta: addressFields[2],
      value: faker.address.state()
    }, {
      meta: addressFields[3],
      value: faker.address.zipCode()
    }]

  return [{
    meta: addressFields[0],
    value: `${random(1,350)} ${faker.address.streetName()}`
  }, {
    meta: addressFields[1],
    value: faker.address.city()
  }, {
    meta: addressFields[2],
    value: faker.address.state()
  }, {
    meta: addressFields[3],
    value: faker.address.zipCode()
  }]

}

/**
 * Seed client static fields
 *
 * @param {object} client
 * @param {string} dateOfBirth
 * @returns {object}
 */
async function seedStaticFields(client, dateOfBirth) {
  let properties = {}

  if (client.accountType.find(type => type === 'volunteer')) {
    properties.status = randomIn({
      'Active': 0.8,
      'Inactive': 0.2
    })

    if (client.firstName === 'driver') {
      properties.driver = true
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
      ...await populateCustomerFields(client, dateOfBirth)
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

    const dateReceived = randomDate('2015-01-01')

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
async function populateCustomerFields(client, dateOfBirth) {
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

  const status = randomIn({
    'Accepted': 0.8,
    'Rejected': 0.1,
    'Pending': 0.05,
    'Inactive': 0.05
  })

  return {
    foodPreferences,
    household,
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

/**
 * Generate a random date
 *
 * @param {string} fromDate
 * @param {string} [toDate=null]
 * @returns {string}
 */
function randomDate(fromDate, toDate = null) {
  const fromTime = new Date(fromDate).getTime()
  const toTime = new Date(toDate || Date.now()).getTime()
  return new Date(random(fromTime, toTime)).toISOString()
}
