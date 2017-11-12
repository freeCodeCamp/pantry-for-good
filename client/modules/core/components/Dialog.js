import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {compose, withHandlers} from 'recompose'
import {ButtonToolbar, Button, Modal} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {hideDialog} from '../reducers/dialog'

const mapStateToProps = state => ({
  visible: selectors.app.dialog.isVisible(state),
  dialog: selectors.app.dialog.getDialog(state)
})

const withActionHandler = withHandlers({
  handleAction: ({dispatch}) => action => () => dispatch(action),
  hideModal: ({dispatch}) => () => dispatch(hideDialog())
})

const Dialog = ({visible, hideModal, dialog, handleAction}) => {
  if (!visible) return null

  return (
    <Modal show={visible} onHide={hideModal} className="smallModal">
      {dialog.header &&
        <Modal.Header className="text-center">{dialog.header}</Modal.Header>
      }
      <Modal.Body className="text-center">
        {dialog.message}
      </Modal.Body>
      <Modal.Footer >
        <ButtonToolbar className="pull-right">
          {dialog.actions && dialog.actions.map((action, i) =>
            <Button
              key={i}
              onClick={action.onClick || handleAction(action.action)}
              bsStyle={action.style}
              bsSize="sm"
            >
              {action.text}
            </Button>
          )}
        </ButtonToolbar>
      </Modal.Footer>
    </Modal>
  )
}

Dialog.propTypes = {
  visible: PropTypes.bool,
  hideModal: PropTypes.func.isRequired,
  dialog: PropTypes.object,
  handleAction: PropTypes.func.isRequired
}

export default compose(
  connect(mapStateToProps),
  withActionHandler,
)(Dialog)
