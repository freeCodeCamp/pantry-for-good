import React from 'react'
import {ButtonToolbar, Button, Glyphicon} from 'react-bootstrap'

const RowActions = ({actions, handlers}) => {
  if (!actions) return null
  return (
    <td>
      <ButtonToolbar>
        {actions.map((action, i) =>
          <Button
            key={i}
            bsStyle={action.style}
            bsSize="sm"
            onClick={handlers[action.onClick]}
            style={{width: '80px'}}
          >
            {/*{action.icon && <Glyphicon glyph={action.icon} />}*/}
            {action.icon &&
              <i
                className={`fa fa-${action.icon}`}
                style={{paddingRight: '7px'}}
              />
            }
            {action.label}
          </Button>
        )}
      </ButtonToolbar>
    </td>
  )
}

export default RowActions
