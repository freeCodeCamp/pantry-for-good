import mongoose from 'mongoose'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'
import supertest from 'supertest'

import config from './config'
global.expect = chai.expect
global.sinon = sinon
global.supertest = supertest

chai.use(sinonChai)
chai.use(chaiAsPromised)

mongoose.Promise = global.Promise

global.initDb = async function() {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(config.db)
  }
}

global.resetDb = async function() {
  mongoose.models = {}
  mongoose.modelSchemas = {}
  if (mongoose.connection.readyState) {
    await mongoose.disconnect()
  }
}
