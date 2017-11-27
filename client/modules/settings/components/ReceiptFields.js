import React from 'react'
import {Clearfix, Button} from 'react-bootstrap'

import {Box, BoxHeader} from '../../../components/box'
import {RFFieldGroup} from '../../../components/form'

import { FieldArray } from 'redux-form'

const renderRow = ({ fields, meta: { error, submitFailed } }) => (

  <div style={{padding: '10px'}}>
    <ul style={{paddingLeft: 0}}>
      <h4>Receipt Fields:</h4>
      {fields.map((receiptField, index) => (
        <li key={index} style={{display: 'flex', flexWrap: 'nowrap'}}>
          <div style={{display: 'flex', flexGrow: 1}}>
            <RFFieldGroup
              name={`${receiptField}.name`}
              type="text"
              placeholder="Name"
              style={{
                flexGrow: 1,
                margin: '10px 10px 0 0'
              }}
            />
            <RFFieldGroup
              name={`${receiptField}.value`}
              type="text"
              placeholder="Value"
              style={{
                flexGrow: 1,
                margin: '10px 0px 0 0'
              }}
            />
            <Button
              type="button"
              title="Remove ReceiptField"
              onClick={() => fields.remove(index)}
              className="btn"
              style={{
                margin: '10px 0 0px 18px',
                height: '34px'
              }}
            >
              <i className="fa fa-trash" />
            </Button>
            <Clearfix visibleSmBlock visibleMdBlock />
          </div>
        </li>
      ))}
      <Button
        type="button"
        onClick={() => fields.push({})}
        className="btn"
        style={{
          margin: '15px 0px 0px 15px',
          height: '34px'
        }}
      >
        Add Field
      </Button>
      {submitFailed && error && <span>{error}</span>}
    </ul>
  </div>
)

const ReceiptFields = props => {
  const { handleSubmit } = props
  return (
    <Box>
      <BoxHeader heading="General Receipt Fields" />
      <form onSubmit={handleSubmit} >
        <div className="form-group">
          <FieldArray name="receiptFields" component={renderRow} />
        </div>
      </form>
    </Box>
  )
}

export default ReceiptFields
