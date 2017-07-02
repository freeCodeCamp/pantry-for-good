import AddressGenerator from './address-generator'

describe('Address generator', function() {
  afterEach(function() {
    AddressGenerator.__ResetDependency__('readFileSync')
  })

  it('pulls addresses from a file', function() {
    const addresses = '1,1,street,city,state,zip\n'
    const readFileSync = sinon.stub().returns(addresses)
    AddressGenerator.__Rewire__('readFileSync', readFileSync)

    const generator = new AddressGenerator
    const address1 = generator.getOne()
    expect(address1).to.have.property('lat', '1')
    expect(address1).to.have.property('lng', '1')
    expect(address1).to.have.property('street', 'street')
    expect(address1).to.have.property('city', 'city')
    expect(address1).to.have.property('state', 'state')
    expect(address1).to.have.property('zip', 'zip')
  })

  it('gets unique addresses', function() {
    const addresses = '1,1,str,c,s,z\n2,2,str,c,s,z\n3,3,str,c,s,z\n'
    const readFileSync = sinon.stub().returns(addresses)
    AddressGenerator.__Rewire__('readFileSync', readFileSync)

    const generator = new AddressGenerator
    const address1 = generator.getOne()
    const address2 = generator.getOne()
    const address3 = generator.getOne()
    expect(address1.lat).to.not.equal(address2.lat)
    expect(address2.lat).to.not.equal(address3.lat)
    expect(address1.lat).to.not.equal(address3.lat)
  })

  it('throws if more addresses are requested', function() {
    const addresses = '1,1,street,city,state,zip'
    const readFileSync = sinon.stub().returns(addresses)
    AddressGenerator.__Rewire__('readFileSync', readFileSync)

    const generator = new AddressGenerator
    generator.getOne()
    expect(generator.getOne).to.throw()
  })
})
