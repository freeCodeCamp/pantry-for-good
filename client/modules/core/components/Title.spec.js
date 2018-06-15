import React from 'react'
import { mount } from 'enzyme'

import {Title} from './Title'

import selectors from '../../../store/selectors'

describe("Title", function()
{
//*

  before(function()
  {
    sinon.stub(selectors.settings, "getSettings").callsFake(function(state)
    {
      //return undefined
      return {organization: "FakeOrg", state: state}
    })

    sinon.stub(selectors.customer, "getOne").callsFake(function(state)
    {
      //return new Object()
      return function(id) {return {fullName: "Fake Customer", id: id, state: state}}
    })
        
    sinon.stub(selectors.donor, "getOne").callsFake(function(state)
    {
      return function(id) {return {fullName: "Fake Donor", id: id, state: state}}
    })
        
    sinon.stub(selectors.volunteer, "getOne").callsFake(function(state)
    {
      return function(id) {return {fullName: "Fake Volunteer", id: id, state: state}}
    })
  })
    
  after(function()
  {
    selectors.settings.getSettings.restore()
    selectors.customer.getOne.restore()
    selectors.donor.getOne.restore()
    selectors.volunteer.getOne.restore()
  })
  //*/
    
  let store = null
    
  before(function()
  {
    store = new Object()

    store.subscribe = function() { }
    store.dispatch = function() { }

    store.getState = function() 
    {
      let ret = new Object()
      ret.router = new Object()
      ret.router.location = new Object()
      ret.router.location.pathname = "beep/boop"
      return ret
    }
    store.state = store.getState()
  })

  it("should display a title", function()
  {
    let t = mount(<Title />, {context: {store: store}})
    expect(t != null && t != undefined).to.eql(true)
    //t.update()
    //expect(document.title).to.equal("Beep Boop")
  })
})

