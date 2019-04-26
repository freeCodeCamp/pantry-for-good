import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-15'

import MassImportsModal from './MassImportsModal'

Enzyme.configure({adapter: new Adapter()})

describe('MassImportsModal', () => {
  let props

  beforeEach(() => {
    props = {
      MassImportsModal: [],
      customers: [],
      closeModal: sinon.spy(),
      massUpload: sinon.spy()
    }
  })

  it('sets state when constructed', () => {
    const wrapper = shallow(<MassImportsModal {...props} />)
    expect(wrapper.state().validInput).to.be.false
    expect(wrapper.state().documents).to.be.empty  
  })

  it('isDuplicate returns true if a customer is a duplicate', () => {
    const wrapper = shallow(<MassImportsModal {...props} />)
    const instance = wrapper.instance()
    var customer = {
      firstName: 'Kobe',
      lastName: 'Bryant',
      email: "goat@gmail.com"
    }
    var customers = []
    customers.push(customer)

    expect(instance.isDuplicate("Kobe", "Bryant", "goat@gmail.com", customers)).to.be.true
  })

  it('isDuplicate returns false if a customer is not a duplicate', () => {
    const wrapper = shallow(<MassImportsModal {...props} />)
    const instance = wrapper.instance()
    var customer = {
      firstName: 'Kobe',
      lastName: 'Bryant',
      email: "goat@gmail.com"
    }
    var customers = []
    customers.push(customer)

    expect(instance.isDuplicate("Sammy", "Bryant", "goat@gmail.com", customers)).to.be.false
  })  

  describe("validateHeaders", () => {
    it('returns true if the headers are valid', () => {
      const wrapper = shallow(<MassImportsModal {...props} />)
      const instance = wrapper.instance()
      var headers = ["First Name", "Last Name", "Email", "Birthday", "Street", "City/Town", "State/Province", "ZIP"]

      expect(instance.validateHeaders(headers)).to.be.true
    })

    it('returns false if the length of headers is less than 8', () => {
      const wrapper = shallow(<MassImportsModal {...props} />)
      const instance = wrapper.instance()
      var headers = ["First Name", "Last Name", "Email", "Birthday", "Street", "City/Town", "State/Province"]

      expect(instance.validateHeaders(headers)).to.be.false
    })  

    it('returns false if the length of headers is greater than 8', () => {
      const wrapper = shallow(<MassImportsModal {...props} />)
      const instance = wrapper.instance()
      var headers = ["First Name", "Last Name", "Email", "Birthday", "Street", "City/Town", "State/Province", "ZIP", "Test"]

      expect(instance.validateHeaders(headers)).to.be.false
    })    

    it('returns false if the length of headers is 8, but wrong values in headrs', () => {
      const wrapper = shallow(<MassImportsModal {...props} />)
      const instance = wrapper.instance()
      var headers = ["First Name", "Wrong", "Email", "Birthday", "Street", "City/Town", "State/Province", "ZIP"]

      expect(instance.validateHeaders(headers)).to.be.false
    })     
  })

  it("validateRow returns true for valid row", () => {
    const wrapper = shallow(<MassImportsModal {...props} />)
    const instance = wrapper.instance()
    var row = ["1", "2", "3", "4", "5", "6", "7", "8"]

    expect(instance.validateRow(row)).to.be.true
  })

  it("validateRow returns false for row length less than 8", () => {
    const wrapper = shallow(<MassImportsModal {...props} />)
    const instance = wrapper.instance()
    var row = ["1", "2", "3", "4", "5", "6", "7"]

    expect(instance.validateRow(row)).to.be.false
  }) 

  it("validateRow returns false for row length greater than 8", () => {
    const wrapper = shallow(<MassImportsModal {...props} />)
    const instance = wrapper.instance()
    var row = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]

    expect(instance.validateRow(row)).to.be.false
  })  

  it("validateRow returns false for empty values", () => {
    const wrapper = shallow(<MassImportsModal {...props} />)
    const instance = wrapper.instance()
    var row = ["1", "2", "", "4", "5", "6", "7", "8"]

    expect(instance.validateRow(row)).to.be.false
  })

  it("importData calls props.massUpload", () => {
    const wrapper = shallow(<MassImportsModal {...props} />)
    const instance = wrapper.instance()
    instance.importData()
    expect(instance.props.massUpload.called).to.be.true       
  })

  it("importData calls props.closeModal", () => {
    const wrapper = shallow(<MassImportsModal {...props} />)
    const instance = wrapper.instance()
    instance.importData()
    expect(instance.props.closeModal.called).to.be.true       
  }) 
})
