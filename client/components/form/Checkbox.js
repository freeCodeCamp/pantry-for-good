import React from 'react'
import P from 'prop-types'
import {compose, setPropTypes, withHandlers} from 'recompose'
import {Checkbox as RBCheckbox} from 'react-bootstrap'

const withPropTypes = setPropTypes({
  name: P.any,
  label: P.string,
  readOnly: P.bool,
  onClick: P.func,
  children: P.node
})

const withClickHandler = withHandlers({
  handleCheckboxClick: ({readOnly, onClick}) => ev =>
    readOnly ? ev.stopPropagation() : onClick && onClick(ev)
})

const Checkbox = ({handleCheckboxClick, children, ...rest}) =>
  <RBCheckbox
    onClick={handleCheckboxClick}
    {...rest}
  >
    <span></span>
    {children}
  </RBCheckbox>

export default compose(
  withPropTypes,
  withClickHandler
)(Checkbox)
