import mongoose from 'mongoose'
import capitalize from 'lodash/capitalize'
import extend from 'lodash/extend'
import random from 'lodash/random'
import range from 'lodash/range'
import faker from 'faker'

const User = mongoose.model('User')
const Customer = mongoose.model('Customer')
const Donor = mongoose.model('Donor')
const Donation = mongoose.model('Donation')
const Volunteer = mongoose.model('Volunteer')
const Food = mongoose.model('Food')

const clientTypes = ['customer', 'volunteer', 'donor']

export default async function seedClients() {
  clientTypes.map(async type => {
    const Model = mongoose.model(capitalize(type))
    const count = await Model.count()
    if (count) return

    const users = await User.find({accountType: [type]})
      .select('-salt -password -__v')

    await Promise.all(
      users.map(async user => {
        const client = new Model(user.toObject())
        const populatedClient = await populateClientFields(client)

        await populatedClient.save()
        await User.findOneAndUpdate({_id: client._id}, {$set: {hasApplied: true }})
      })
    )
  })
}

/**
 * Populate client fields
 *
 * @param {mongoose.Document} client
 * @returns {Promise<mongoose.Document>}
 */
async function populateClientFields(client) {
  let fields = {}

  // General fields
  fields.dateOfBirth = new Date(
    random(1950, 2000),
    random(1, 13),
    random(1, 28)
  )

  fields.apartmentNumber = random(1, 350)
  fields.buzzNumber = random(1,8)
  fields.address = faker.address.streetName()
  fields.city = faker.address.city()
  fields.province = faker.address.state()
  fields.postalCode = faker.address.zipCode()
  fields.telephoneNumber = faker.phone.phoneNumber()
  fields.gender = randomIn({'Male': 0.5, 'Female': 0.5})

  // Driver fields
  if (client.firstName === 'driver') {
    fields.driver = true
  }

  if (client.accountType.find(type => type === 'volunteer')) {
    fields.status = randomIn({
      'Active': 0.8,
      'Inactive': 0.2
    })
  }

  if (client.accountType.find(type => type === 'donor')) {
    fields = {
      ...fields,
      ...await populateDonorFields(client)
    }
  }

  // Customer fields
  if (client.accountType.find(type => type === 'customer')) {
    fields = {
      ...fields,
      ...await populateCustomerFields(client, fields)
    }
  }

  return extend(client, fields)
}

/**
 * return extra fields specific to donors
 *
 * @param {object} client
 * @param {object} fields
 * @returns
 */
async function populateDonorFields(client) {
  const donations = range(10).map(() => {
    const type = randomIn({
      'Cash': 0.25,
      'Cash with advantage': 0.25,
      'Non-cash': 0.25,
      'Non-cash with advantage': 0.25
    })

    const dateReceived = new Date(
      random(2006, 2016),
      random(1, 13),
      random(1, 28)
    )

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
 * @param {object} fields
 * @returns
 */
async function populateCustomerFields(client, fields) {
  // get a random sample of foods for foodPreferences
  const foods = (await Food.aggregate(
      {$unwind: '$items'},
      {$sample: {size: random(4, 10)}}))
    .map(res => res.items._id)

  const household = [{
    name: `${client.firstName} ${client.lastName}`,
    relationship: 'Applicant',
    dateOfBirth: fields.dateOfBirth
  }]

  const financialAssessment = {
    income: [],
    expenses: []
  }

  const status = randomIn({
    'Accepted': 0.8,
    'Rejected': 0.1,
    'Pending': 0.05,
    'Inactive': 0.05
  })

  return {
    foodPreferences: foods,
    household,
    financialAssessment,
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
