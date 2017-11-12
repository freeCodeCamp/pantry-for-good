import mongoose from 'mongoose'
import {range, values} from 'lodash'
import faker from 'faker'

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
import {
  ADMIN_ROLE,
  clientRoles,
  volunteerRoles,
  modelTypes
} from '../../../common/constants'

const addressGenerator = new AddressGenerator

const User = mongoose.model(modelTypes.USER)
const Customer = mongoose.model(modelTypes.CUSTOMER)
const Donor = mongoose.model(modelTypes.DONOR)
const Donation = mongoose.model(modelTypes.DONATION)
const Volunteer = mongoose.model(modelTypes.VOLUNTEER)
const Questionnaire = mongoose.model(modelTypes.QUESTIONNAIRE)
const Food = mongoose.model(modelTypes.FOOD)
const Settings = mongoose.model(modelTypes.SETTINGS)
const Page = mongoose.model(modelTypes.PAGE)
const Media = mongoose.model(modelTypes.MEDIA)

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
  else await User.find({roles: {$in: values(clientRoles)}}).remove()

  await Promise.all([
    Customer.find().remove(),
    Donation.find().remove(),
    Donor.find().remove(),
    Volunteer.find().remove(),
    Food.find().remove(),
    Page.find().remove(),
    Questionnaire.find().remove(),
    Settings.find().remove(),
    Media.find().remove()
  ])
}

async function seedDb(env) {
  await seedAdmin()
  await seedQuestionnaires()
  await seedSettings()
  await seedPages()
  await Media.create({})

  // for development also seed clients and foods
  if (env !== 'production') {
    await seedUsers()
    await seedFoods()
    await seedClients(addressGenerator)
  }
}

async function seedAdmin() {
  const adminCount = await User.count({roles: ADMIN_ROLE})
  if (!adminCount) {
    const adminUser = {
      firstName: 'admin',
      lastName: 'user',
      displayName: 'admin',
      roles: [ADMIN_ROLE],
      email: `admin@example.com`,
      password: 'password',
      provider: 'local'
    }
    await User.create(adminUser)
  }
}

async function seedUsers() {
  const clientCount = await User.count({roles: {$in: values(clientRoles)}})
  if (clientCount) return

  const customers = range(45).map(i =>
    createTestUser(`customer ${i + 1}`, clientRoles.CUSTOMER))
  const volunteers = range(8).map(i =>
    createTestUser(`volunteer ${i + 1}`, clientRoles.VOLUNTEER))
  const donors = range(5).map(i =>
    createTestUser(`donor ${i + 1}`, clientRoles.DONOR))
  const drivers = range(5).map(i =>
    createTestUser(`driver ${i + 1}`, clientRoles.VOLUNTEER))

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

  await Food.insertMany(foodFields)
}

async function seedQuestionnaires() {
  const count = await Questionnaire.count()
  if (count) return

  await Questionnaire.insertMany([
    customerQuestionnaire,
    donorQuestionnaire,
    volunteerQuestionnaire
  ])
}

async function seedSettings() {
  const count = await Settings.count()
  if (count) return

  await Settings.create(getSettingsFields(addressGenerator))
}

async function seedPages() {
  const count = await Page.count()
  if (count) return

  await Page.insertMany(pages)
}

// Helpers
function createTestUser(name, role) {
  const names = name.split(' ')
  if (names.length !== 2) throw new Error('name should be "firstname lastname"')
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    roles: names[0] === 'driver' ?
      [volunteerRoles.DRIVER, role] :
      [role],
    email: `${names.join('')}@example.com`,
    password: 'password',
    provider: 'local'
  }
}
