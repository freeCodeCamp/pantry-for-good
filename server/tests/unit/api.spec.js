import apiRouterFactory from '../../routes/api'

import {ADMIN_ROLE} from '../../../common/constants'

describe('Api router', function() {
  let userControllerMock
  let apiRouterMock

  before(async function() {
    await initDb()
  })

  beforeEach(function() {
    userControllerMock = {
      hasAuthorization: sinon.spy()
    }

    apiRouterMock = {
      use: sinon.stub().returnsThis(),
      all: sinon.stub().returnsThis()
    }

    apiRouterFactory.__Rewire__('users', userControllerMock)
    apiRouterFactory.__Rewire__('apiRouter', apiRouterMock)
    apiRouterFactory.__Rewire__('customerRoutes', () => sinon.spy())

    apiRouterFactory()
  })

  afterEach(function() {
    apiRouterFactory.__ResetDependency__('users')
    apiRouterFactory.__ResetDependency__('apiRouter')
    apiRouterFactory.__ResetDependency__('customerRoutes')
  })

  after(async function() {
    await resetDb()
  })

  it('uses subrouters', function() {
    expect(apiRouterMock.use).to.have.been.called
  })

  it('checks admin/ routes for admin role', function () {
    expect(userControllerMock.hasAuthorization)
      .to.have.been.calledWith([ADMIN_ROLE])
    expect(apiRouterMock.all).to.have.been
      .calledWith('/admin/*')
  })
})
