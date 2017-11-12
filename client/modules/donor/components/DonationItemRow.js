import React from 'react'
import {Button} from 'react-bootstrap'

import {RFFieldGroup} from '../../../components/form'

const DonationItemRow = ({item, showDelete, handleDelete}) =>
  <li style={{display: 'flex'}}>
    <div style={{display: 'flex', flexGrow: 1}}>
      <RFFieldGroup
        name={`${item}.name`}
        type="text"
        placeholder="Name"
        style={{
          flexGrow: 1,
          margin: '10px 10px 0 0'
        }}
      />
      <RFFieldGroup
        name={`${item}.value`}
        type="number"
        step="any"
        min="0"
        placeholder="Value"
        style={{
          flexGrow: 1,
          margin: '10px 0 0 0'
        }}
      />
      {showDelete &&
        <Button
          style={{
            margin: '10px 0 0px 10px',
            height: '34px'
          }}
          onClick={handleDelete}
        >
          <i className="fa fa-trash" />
        </Button>
      }
    </div>
  </li>

export default DonationItemRow
