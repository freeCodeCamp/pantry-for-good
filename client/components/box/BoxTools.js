import React from 'react'
import {FormGroup, Glyphicon} from 'react-bootstrap'

const BoxTools = ({children, icon}) =>
  <FormGroup className="box-tools">
    {children}
    <Glyphicon glyph={icon} />
  </FormGroup>

export default BoxTools
