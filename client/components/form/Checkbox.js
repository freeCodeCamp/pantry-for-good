import React from 'react'
import {withHandlers} from 'recompose'
import {Checkbox as RBCheckbox} from 'react-bootstrap'

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

export default withClickHandler(Checkbox)
