import React from 'react'
import { shallow } from 'enzyme'

import { Footer } from './Footer'

describe("Footer", function() {
  it("Should have a copyright year", function()
  {
    let f = shallow(<Footer />)
    expect(f).to.not.eql(null)
    expect(f.find("strong").text()).to.have.string("" + (new Date()).getFullYear())
  })

  it("Should have an organization", function()
  {
    let f = shallow(<Footer settings={{organization: "FakeOrg"}} />)
    expect(f).to.not.eql(null)
    expect(f.find("Link").children().text()).to.have.string("FakeOrg")
  })
})

