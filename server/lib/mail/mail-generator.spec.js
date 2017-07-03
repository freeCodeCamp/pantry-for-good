import generate from '../../lib/mail/mail-generator'

describe('Mail generator', function() {
  let pageMock = {
    findOne: sinon.stub().returnsThis()
  }

  before(function() {
    generate.__Rewire__('template', '{content}')
  })

  afterEach(function() {
    generate.__ResetDependency__('Page')
  })

  after(function() {
    generate.__ResetDependency__('template')
  })

  it('binds placeholders', async function() {
    const page = {
      body: 'From <span class="ql-placeholder-content" data-id="organization"></span>',
      subject: ''
    }

    pageMock.lean = sinon.stub().returns(page)
    generate.__Rewire__('Page', pageMock)

    const bindings = {organization: 'foodbank template'}
    const result = await generate('', bindings)

    expect(result.html).to.equal(`From ${bindings.organization}`)
  })

  it('binds html placeholders', async function() {
    const page = {
      body: '<span class="ql-placeholder-content" data-id="passwordResetLink"></span>',
      subject: ''
    }

    pageMock.lean = sinon.stub().returns(page)
    generate.__Rewire__('Page', pageMock)

    const bindings = {passwordResetLink: 'example.com/reset'}
    const result = await generate('', bindings)

    expect(result.html).to.equal(`<a href="${bindings.passwordResetLink}">Reset Password</a>`)
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

  it('replaces tags with email suitable tags', async function() {
    const page = {
      body: '<div><p class="ql-align-center">Centered</p></div>',
      subject: ''
    }

    pageMock.lean = sinon.stub().returns(page)
    generate.__Rewire__('Page', pageMock)

    const result = await generate('', {})
    expect(result.html).to.equal('<div><tr><td class="ql-align-center">Centered</td></tr></div>')
  })

  it('generates plain text version', async function() {
    const page = {
      body: `
  <table>
    <tr>
      <td>
        <p><span class="ql-placeholder-content" data-id="organization"></span></p>
        <p>Another paragraph</p>
        <p><a href="foo.com">Link</a><img src="logo.png" alt="logo" /></p>
      </td>
    </tr>
  </table>
      `,
      subject: ''
    }

    pageMock.lean = sinon.stub().returns(page)
    generate.__Rewire__('Page', pageMock)

    const bindings = {organization: 'foodbank template'}
    const result = await generate('', bindings)
    expect(result.text).to.equal(`${bindings.organization}\n\nAnother paragraph\n\nLink\n[foo.com]\n\n[logo]`)
  })
})
