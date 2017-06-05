import mongoose from 'mongoose'
import range from 'lodash/range'

import {
  foodFields,
  getSettingsFields,
  pages,
  customerQuestionnaire,
  donorQuestionnaire,
  volunteerQuestionnaire
} from './seed-data'
import seedClients from './seed-clients'
import AddressGenerator from './address-generator'

const addressGenerator = new AddressGenerator

const User = mongoose.model('User')
const Customer = mongoose.model('Customer')
const Donor = mongoose.model('Donor')
const Volunteer = mongoose.model('Volunteer')
const Questionnaire = mongoose.model('Questionnaire')
const Food = mongoose.model('Food')
const Settings = mongoose.model('Settings')
const Page = mongoose.model('Page')

const clientTypes = ['customer', 'volunteer', 'donor']

/**
 * populate empty collections with seed data
 *
 * @param {string} env the environment
 * @param {boolean} replace replace all except admin user with fresh data
 * @param {boolean} replaceAdmin also replace admin user
 * @return {Promise<void>}
 */
export default async function seed(env, replace, replaceAdmin = false) {
  if (env === 'test') return
  if (replace) await clearDb(replaceAdmin)
  seedDb(env)
}

async function clearDb(replaceAdmin) {
  if (replaceAdmin) await User.find().remove()
  else await User.find({accountType: {$in: clientTypes}}).remove()

  await Promise.all([
    Customer.find().remove(),
    Donor.find().remove(),
    Volunteer.find().remove(),
    Food.find().remove(),
    Page.find().remove(),
    Questionnaire.find().remove(),
    Settings.find().remove()
  ])
}

async function seedDb(env) {
  await seedAdmin()
  await seedQuestionnaires()
  await seedSettings()
  await seedPages()

  // for development also seed clients and foods
  if (env !== 'production') {
    await seedUsers()
    await seedFoods()
    await seedClients(addressGenerator)
  }
}

async function seedAdmin() {
  const adminCount = await User.count({accountType: 'admin'})
  if (!adminCount) {
    const adminUser = {
      firstName: 'admin',
      lastName: 'user',
      displayName: 'admin',
      accountType: ['admin'],
      roles: ['admin'],
      email: `admin@example.com`,
      password: 'password',
      provider: 'local'
    }
    await User.create(adminUser)
  }
}

async function seedUsers() {
  const clientCount = await User.count({accountType: {$in: clientTypes}})
  if (clientCount) return

  const customers = range(40).map(i => createTestUser(`customer ${i + 1}`))
  const volunteers = range(15).map(i => createTestUser(`volunteer ${i + 1}`))
  const donors = range(15).map(i => createTestUser(`donor ${i + 1}`))
  const drivers = range(5).map(i => createTestUser(`driver ${i + 1}`, 'volunteer'))

  await User.create([
    ...customers,
    ...volunteers,
    ...donors,
    ...drivers
  ])
}

async function seedFoods() {
  const count = await Food.count()
  if (count) return

  await Food.create(foodFields)
}

async function seedQuestionnaires() {
  const count = await Questionnaire.count()
  if (count) return

  await Questionnaire.create(
    customerQuestionnaire,
    donorQuestionnaire,
    volunteerQuestionnaire
  )
}

async function seedSettings() {
  const count = await Settings.count()
  if (count) return

  await Settings.create(getSettingsFields(addressGenerator))
}

async function seedPages() {
  const count = await Page.count()
  if (count) return

  await Page.create(pages)
}

// Helpers
function createTestUser(name, type = null) {
  const names = name.split(' ')
  if (names.length !== 2) throw new Error('name should be "firstname lastname"')
  type = type || names[0]
  return {
    firstName: names[0],
    lastName: names[1],
    displayName: name,
    accountType: [type],
    roles: names[0] === 'driver' ? ['driver', 'volunteer'] : [type],
    email: `${names.join('')}@${type}.com`,
    password: 'password',
    provider: 'local'
  }
}
