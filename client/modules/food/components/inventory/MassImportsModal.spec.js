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
      closeMassImportModal: sinon.spy(),
      massUpload: sinon.spy()
    }
  })

  it('sets state when constructed', () => {
    const wrapper = shallow(<MassImportsModal {...props} />)
    expect(wrapper.state().validInput).to.be.false
    expect(wrapper.state().documents).to.be.empty  
  }) 

  describe("validateHeaders", () => {
    it('returns true if the headers are valid', () => {
      const wrapper = shallow(<MassImportsModal {...props} />)
      const instance = wrapper.instance()
      var headers = ["Category", "Product", "Item Number", "Location", "Current Quantity", "Weight", "Desired Quantity", "Desired Weight"]

      expect(instance.validateHeaders(headers)).to.be.true
    })

    it('returns false if the length of headers is less than 8', () => {
      const wrapper = shallow(<MassImportsModal {...props} />)
      const instance = wrapper.instance()
      var headers = ["Category", "Product", "Item Number", "Location", "Current Quantity", "Weight", "Desired Quantity"]

      expect(instance.validateHeaders(headers)).to.be.false
    })  

    it('returns false if the length of headers is greater than 8', () => {
      const wrapper = shallow(<MassImportsModal {...props} />)
      const instance = wrapper.instance()
      var headers = ["Category", "Product", "Item Number", "Location", "Current Quantity", "Weight", "Desired Quantity", "Desired Weight", "Test"]

      expect(instance.validateHeaders(headers)).to.be.false
    })    

    it('returns false if the length of headers is 8, but wrong values in headers', () => {
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
    var row = ["", "2", "3", "4", "5", "6", "7", "8"]

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
    expect(instance.props.closeMassImportModal.called).to.be.true       
  }) 
})
