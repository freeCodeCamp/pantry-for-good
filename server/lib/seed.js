import mongoose from 'mongoose'
import capitalize from 'lodash/capitalize'
import range from 'lodash/range'

import {foodFields, customerFields, donorFields, volunteerFields} from './seed-data'
import seedClients from './seed-clients'

const User = mongoose.model('User')
const Customer = mongoose.model('Customer')
const Donor = mongoose.model('Donor')
const Volunteer = mongoose.model('Volunteer')
const Questionnaire = mongoose.model('Questionnaire')
const Section = mongoose.model('Section')
const Field = mongoose.model('Field')
const Food = mongoose.model('Food')

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
    Questionnaire.find().remove(),
    Section.find().remove(),
    Field.find().remove()
  ])
}

async function seedDb(env) {
  await seedAdmin()
  await seedQuestionnaires()

  // for development also seed clients and foods
  if (env !== 'production') {
    await seedUsers()
    await seedFoods()
    await seedClients()
  }
}

async function seedAdmin() {
  const adminCount = await User.count({accountType: 'admin'})
  if (!adminCount) await User.create(createTestUser('Johnny Admin', 'admin'))
}

async function seedUsers() {
  const clientCount = await User.count({accountType: {$in: clientTypes}})
  if (clientCount) return

  const customers = range(25).map(i => createTestUser(`customer ${i + 1}`))
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

  // remove sections and fields before seeding questionnaires
  await Section.find().remove()
  await Field.find().remove()

  await Questionnaire.create(
    createTestQuestionnaire('client'),
    createTestQuestionnaire('donor'),
    createTestQuestionnaire('volunteer')
  )

  await seedSections()
  await Promise.all([
    seedCustomerFields(),
    seedVolunteerFields(),
    seedDonorFields()
  ])
}

async function seedSections() {
  const clientQuestionnaire = await Questionnaire.findOne({identifier: 'qClients'})
  const donorQuestionnaire = await Questionnaire.findOne({identifier: 'qDonors'})
  const volunteerQuestionnaire = await Questionnaire.findOne({identifier: 'qVolunteers'})
  await Promise.all([
    Section.create(
      createTestSection('A - General Information', clientQuestionnaire, 1, true),
      createTestSection('B - Employment', clientQuestionnaire, 2, true),
      createTestSection('C - Food Preferences', clientQuestionnaire, 3),
      createTestSection('D - Financial Assessment', clientQuestionnaire, 4)
    ),
    Section.create(
      createTestSection('A - Donor Information', donorQuestionnaire, 1, true)
    ),
    Section.create(
      createTestSection('A - Volunteer Information', volunteerQuestionnaire, 1, true)
    )
  ])
}

async function seedCustomerFields() {
  const sectionIds = await sectionIdsInQuestionnaire('qClients')

  customerFields.map(field =>
    Field.create({
      ...field,
      section: sectionIds[field.section]
    }))
}

async function seedVolunteerFields() {
  const sectionIds = await sectionIdsInQuestionnaire('qVolunteers')

  volunteerFields.map(field =>
    Field.create({
      ...field,
      section: sectionIds[field.section]
    }))
}

async function seedDonorFields() {
  const sectionIds = await sectionIdsInQuestionnaire('qDonors')

  donorFields.map(field =>
    Field.create({
      ...field,
      section: sectionIds[field.section]
    }))
}


// Helpers
function createTestUser(name, type = null) {
  const names = name.split(' ')
  if (names.length !== 2) throw new Error('name should be "firstname lastname"')
  type = type || names[0]
  return {
    username: type === 'admin' ? 'admin' : names.join(''),
    firstName: names[0],
    lastName: names[1],
    displayName: name,
    accountType: [type],
    roles: [type],
    email: `${names.join('')}@${type}.com`,
    password: 'password',
    provider: 'local'
  }
}

function createTestQuestionnaire(name) {
  return {
    name: `${capitalize(name)} Questionnaire`,
    description: `Information on ${name}s`,
    identifier: `q${capitalize(name)}s`
  }
}

function createTestSection(name, questionnaire, position, required) {
  return {
    name,
    questionnaire: questionnaire._id,
    position,
    logicReq: required
  }
}

/**
 * Get array of section ids for a questionnaire sorted by section position
 *
 * @param {string} identifier questionnaire identifier
 * @returns {array}
 */
async function sectionIdsInQuestionnaire(identifier) {
  const questionnaire = (await Questionnaire.findOne({identifier}))
  const sections = await Section.find({questionnaire: questionnaire._id})
    .sort('position')
    .select('_id')

  return sections.map(section => section._id)
}
