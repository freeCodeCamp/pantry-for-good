import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-15'

import {Title} from './Title'

Enzyme.configure({adapter: new Adapter()})

describe("Title", function()
{
  const names = ["", "Fake Volunteer", "Fake Customer", "Fake Donor"]

  it("should display the org as the Title when there is one path element", function()
  {
    let t = mount(<Title settings={{organization: "Fake"}}
      route={{pathname: "fake"}} />)
    t.setProps({settings: {organization: "FakeOrg"}})
    expect(document.title).to.equal("FakeOrg")
  })
  
  it("should use path elements and org when there is more than one path element", function()
  {
    let t = mount(<Title settings={{organization: "Fake"}}
      route={{pathname: "two/fake/elements"}} />)
    t.setProps({settings: {organization: "FakeOrg"}})
    expect(document.title).to.equal("Elements - Fake - FakeOrg")
  })
  
  it("should use no more than two path elements", function()
  {
    let t = mount(<Title settings={{organization: "Fake"}}
      route={{pathname: "more/than/two/fake/elements"}} />)
    t.setProps({settings: {organization: "FakeOrg"}})
    expect(document.title).to.equal("Two - Than - FakeOrg")
  })
  
  it("should use volunteer and org when it is the volunteer list", function()
  {
    let t = mount(<Title settings={{organization: "Fake"}}
      route={{pathname: "fake/volunteers/list"}}
      getVolunteer={id => {return {fullName: names[id]}}} />)
    t.setProps({settings: {organization: "FakeOrg"}})
    expect(document.title).to.equal("Volunteers - FakeOrg")
  })
  
  it("should use volunteer name when it is a specific volunteer", function()
  {
    let t = mount(<Title settings={{organization: "Fake"}}
      route={{pathname: "fake/volunteers/1"}}
      getVolunteer={id => {return {fullName: names[id]}}} />)
    t.setProps({settings: {organization: "FakeOrg"}})
    expect(document.title).to.equal("Fake Volunteer - Volunteers - FakeOrg")
  })
  
  it("should use customer and org when it is the customer list", function()
  {
    let t = mount(<Title settings={{organization: "Fake"}}
      route={{pathname: "fake/customers/list"}}
      getCustomer={id => {return {fullName: names[id]}}} />)
    t.setProps({settings: {organization: "FakeOrg"}})
    expect(document.title).to.equal("Customers - FakeOrg")
  })
  
  it("should use customer name when it is a specific customer", function()
  {
    let t = mount(<Title settings={{organization: "Fake"}}
      route={{pathname: "fake/customers/2"}}
      getCustomer={id => {return {fullName: names[id]}}} />)
    t.setProps({settings: {organization: "FakeOrg"}})
    expect(document.title).to.equal("Fake Customer - Customers - FakeOrg")
  })
  
  it("should use donor and org when it is the donor list", function()
  {
    let t = mount(<Title settings={{organization: "Fake"}}
      route={{pathname: "fake/donors/list"}}
      getDonor={id => {return {fullName: names[id]}}} />)
    t.setProps({settings: {organization: "FakeOrg"}})
    expect(document.title).to.equal("Donors - FakeOrg")
  })
  
  it("should use donor name when it is a specific donor", function()
  {
    let t = mount(<Title settings={{organization: "Fake"}}
      route={{pathname: "fake/donors/3"}}
      getDonor={id => {return {fullName: names[id]}}} />)
    t.setProps({settings: {organization: "FakeOrg"}})
    expect(document.title).to.equal("Fake Donor - Donors - FakeOrg")
  })
})

