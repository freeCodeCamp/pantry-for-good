import React from 'react'
import {values} from 'lodash'
import {ListGroup} from 'react-bootstrap'

import {volunteerRoles} from '../../../../common/constants'
import {Checkbox} from '../../../components/form'

const RoleSelector = ({toggleRole, roles}) =>
  <div>
    <h4>Roles:</h4>
    <ListGroup>
      {values(volunteerRoles).map((role, i) =>
        <div
          key={i}
          style={{
            display: 'flex',
            cursor: 'pointer',
            padding: 0
          }}
          className="list-group-item"
          onClick={toggleRole(role)}
        >
          <Checkbox
            checked={Boolean(roles.find(r => r === role))}
            readOnly
          />
          <div style={{
            marginTop: '7px'
          }}>
            {role}
          </div>
        </div>
      )}
    </ListGroup>
  </div>

export default RoleSelector
