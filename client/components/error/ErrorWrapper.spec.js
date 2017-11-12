import React from 'react'
import {shallow} from 'enzyme'

import ErrorWrapper from './ErrorWrapper'
import Error from './Error'

describe('ErrorWrapper', function() {
  it('wrapper', function() {
    const wrapper = shallow(
      <ErrorWrapper error="error">
        foo
      </ErrorWrapper>
    )
    expect(wrapper.childAt(0).find(Error)).to.be.present()
    expect(wrapper.childAt(1)).to.have.text('foo')
    expect(wrapper.childAt(2).find(Error)).to.be.present()
  })

  it('message', function() {
    const wrapper = shallow(<Error error="error" />)

    expect(wrapper.find('.text-danger').childAt(1)).to.have.text('error')

  })
})
