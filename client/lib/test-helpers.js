import React from 'react'

class Fields extends Array {
  remove = index => super.splice(index, 1)
  push = item => super.push(item || {})
}

export function getMockField({meta, input} = {}) {
  return function MockField(props) {
    const {component: Component, ...rest} = props
    return <Component meta={meta || {}} input={input} {...rest} />
  }
}

export function getFieldArrayMock(fields = []) {
  return function MockFieldArray(props) {
    const {component: Component, ...rest} = props
    return (
      <Component
        fields={new Fields(...fields)}
        {...rest}
      />
    )
  }
}
