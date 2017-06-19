import generate from '../../lib/mail-generator'

describe('Mail generator', function() {
  let pageMock = {
    findOne: sinon.stub().returnsThis()
  }

  before(function() {
    generate.__Rewire__('template', '<html>{content}</html>')
  })

  afterEach(function() {
    generate.__ResetDependency__('Page')
  })

  after(function() {
    generate.__ResetDependency__('template')
  })

  it('binds placeholders', async function() {
    const page = {
      body: '<p>some text</p><p>From <span class="ql-placeholder-content" data-id="organization"></span></p>',
      subject: ''
    }

    pageMock.lean = sinon.stub().returns(page)
    generate.__Rewire__('Page', pageMock)

    const bindings = {organization: 'foodbank template'}
    const result = await generate('', bindings)

    expect(result.body).to.equal(`<html><p>some text</p><p>From ${bindings.organization}</p></html>`)
  })

  it('binds html placeholders', async function() {
    const page = {
      body: '<p>reset password</p><p><span class="ql-placeholder-content" data-id="passwordResetLink"></span></p>',
      subject: ''
    }

    pageMock.lean = sinon.stub().returns(page)
    generate.__Rewire__('Page', pageMock)

    const bindings = {organization: 'foodbank template', passwordResetLink: 'reset'}
    const result = await generate('', bindings)

    expect(result.body).to.equal(`<html><p>reset password</p><p><a href="reset">Reset Password</a></p></html>`)
  })

  it('binds subject placeholders', async function() {
    const page = {
      body: '<p></p>',
      subject: '<p><span class="ql-placeholder-content" data-id="organization"></span> email</p>'
    }

    pageMock.lean = sinon.stub().returns(page)
    generate.__Rewire__('Page', pageMock)

    const bindings = {organization: 'foodbank template'}
    const result = await generate('', bindings)

    expect(result.subject).to.equal(`${bindings.organization} email`)
  })
})
