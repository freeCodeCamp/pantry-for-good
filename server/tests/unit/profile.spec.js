import { includes } from 'lodash'

import { ADMIN_ROLE } from '../../../common/constants'
import * as controller from '../../controllers/users/profile'
import User from '../../models/user'

import { createTestUser } from '../helpers'

describe('Profile controller', function() {
  before(async function() {
    await initDb()
  })

  beforeEach(async function() {
    await User.find().remove()
  })

  after(async function() {
    await resetDb()
  })

  describe('update()', function() {
    it('toggles admin role', async function() {
      const req = {
        user: { _id: -1, roles: [ADMIN_ROLE] },
        body: {}
      }
      const res = { json: () => {} }
      let editedUser = await User.create(createTestUser('admin', ADMIN_ROLE))
      req.body._id = editedUser._id

      // toggle admin off
      req.body.isAdmin = false
      await controller.update(req, res)

      editedUser = await User.findById(editedUser._id)
      expect(includes(editedUser.roles, ADMIN_ROLE)).to.be.false

      // toggle admin on
      req.body.isAdmin = true
      await controller.update(req, res)
      
      editedUser = await User.findById(editedUser._id)
      expect(includes(editedUser.roles, ADMIN_ROLE)).to.be.true
    })
  })
})