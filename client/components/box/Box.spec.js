import React from 'react'
import {shallow} from 'enzyme'
import {Row} from 'react-bootstrap'

import {Box, BoxHeader, BoxBody} from './index'
import {ErrorWrapper} from '../error'
import LoadingWrapper from '../LoadingWrapper'

describe('Box', function() {
  it('Box renders', function() {
    const wrapper = shallow(<Box />)
    const box = wrapper.find('div')

    expect(box).to.have.className('box')
    expect(box).to.have.className('box-primary')
  })

  it('Box renders solid', function() {
    const wrapper = shallow(<Box solid />)
    const box = wrapper.find('div')

    expect(box).to.have.className('box-solid')
  })

  it('Box applies style prop to row wrapper', function() {
    const wrapper = shallow(<Box style={{width: '100%'}} />)
    const row = wrapper.find(Row)

    expect(row).to.have.style('width', '100%')
  })

  it('BoxHeader renders', function() {
    const wrapper = shallow(<BoxHeader heading="foo">bar</BoxHeader>)
    const heading = wrapper.find('h3')
    const child = wrapper.childAt(1)

    expect(wrapper).to.have.className('box-header')
    expect(heading).to.have.className('box-title')
    expect(heading).to.have.text('foo')
    expect(child).to.have.text('bar')
  })

  it('BoxBody renders', function() {
    const wrapper = shallow(
      <BoxBody
        error="error"
        errorTop
        errorBottom
        loading
      >
        foo
      </BoxBody>
    )

    expect(wrapper).to.have.className('box-body')
    expect(wrapper.find(ErrorWrapper)).to.have.props({
      error: 'error',
      errorTop: true,
      errorBottom: true
    })
    expect(wrapper.find(LoadingWrapper)).to.have.props({loading: true})
    expect(wrapper.find(LoadingWrapper).childAt(0)).to.have.text('foo')
  })
})
