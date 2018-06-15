import React from 'react'
import { shallow, mount } from 'enzyme'

import {Footer} from './Footer'

describe("Footer", function() {
  let store = null

  beforeEach(function()
  {
    store = new Object()

    store.subscribe = function() { }
    store.dispatch = function() { }

    store.getState = function() 
    {
      return {
        settings: {
          data: {
            organization: "FakeOrg"
          }
        }
      }
    }
    store.state = store.getState()
  })
    
  it("Should have a copyright year", function()
  {
    let f = shallow(<Footer />, {context: {store: store}})
    expect(f).to.not.eql(null)
    expect(f.find("strong").text()).to.have.string("" + (new Date()).getFullYear())
  })

  it("Should have an organization", function()
  {
    let f = mount(<Footer />, {context: {store: store}})
    expect(f).to.not.eql(null)
    expect(f.find("Link").text()).to.have.string(store.getState().settings.data.organization)
  })
})

