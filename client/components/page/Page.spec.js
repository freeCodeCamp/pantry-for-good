import React from 'react'
import {shallow} from 'enzyme'

import {Page, PageHeader, PageBody} from './index'
import {ErrorWrapper} from '../error'
import LoadingWrapper from '../LoadingWrapper'

describe('Page', function() {
  it('Page renders', function() {
    const wrapper = shallow(<Page>foo</Page>)

    expect(wrapper.find(LoadingWrapper)).to.be.present()
    expect(wrapper.childAt(0)).to.have.text('foo')
  })

  it('PageHeader renders', function() {
    const wrapper = shallow(<PageHeader heading="foo">Bar</PageHeader>)

    expect(wrapper).to.have.className('content-header')
    expect(wrapper.childAt(0)).to.have.text('foo')
    expect(wrapper.childAt(1)).to.have.text('Bar')
  })

  it('PageBody renders', function() {
    const wrapper = shallow(<PageBody>foo</PageBody>)

    expect(wrapper).to.have.className('content')
    expect(wrapper.find(ErrorWrapper)).to.be.present()
  })
})
