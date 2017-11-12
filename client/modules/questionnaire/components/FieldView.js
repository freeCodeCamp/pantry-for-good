import React from 'react'
import {connect} from 'react-redux'
import {capitalize} from 'lodash'
import {compose} from 'recompose'
import {DragSource, DropTarget} from 'react-dnd'

import {fieldTypes, widgetTypes} from '../../../../common/constants'
import selectors from '../../../store/selectors'
import {dragDropTypes} from '../types'
import {moveField} from '../reducers/editor/index'

const mapStateToProps = state => ({
  sectionId: selectors.qEditor.getSelectedSection(state)
})

const mapDispatchToProps = dispatch => ({
  moveField: (fieldId, sectionId, idx) => dispatch(moveField(fieldId, sectionId, idx))
})

const fieldSource = {
  beginDrag(props) {
    return {
      id: props.field._id,
      idx: props.idx,
      type: dragDropTypes.FIELD
    }
  }
}

const fieldTarget = {
  hover(props, monitor) {
    const {id, idx} = monitor.getItem()
    const dropIndex = props.idx

    if (idx === dropIndex) return

    props.moveField(id, props.sectionId, dropIndex)

    monitor.getItem().idx = dropIndex
  },
  canDrop(props, monitor) {
    const {id} = monitor.getItem()

    return id !== props.field._id
  }
}

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

const FieldView = ({
  connectDragSource,
  connectDragPreview,
  connectDropTarget,
  isOver,
  canDrop,
  field,
  onSelect
}) => connectDragPreview(
  connectDropTarget(
    <div
      onClick={onSelect}
      style={{
        display: 'flex',
        border: 'none',
        opacity: isOver && canDrop ? '0.5' : 1
      }}
      className="list-group-item"
    >
      {connectDragSource(
        <div
          style={{
            padding: '5px 10px',
            cursor: 'pointer'
          }}
        >
          <i className="fa fa-ellipsis-v" />
        </div>
      )}
      <div>
        <h4 className="list-group-item-heading">
          {field.label}
        </h4>
        <p className="list-group-item-text">
          {mapTypeToDescription(field.type)}
        </p>
      </div>
    </div>
  )
)

function mapTypeToDescription(type) {
  switch (type) {
    case fieldTypes.TEXTAREA: return 'Long Text'
    case fieldTypes.RADIO: return 'Radio Buttons'
    case fieldTypes.CHECKBOX: return 'Checkboxes'
    case widgetTypes.FOOD_PREFERENCES: return 'Food Preferences'
    default: return capitalize(type)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  DragSource(dragDropTypes.FIELD, fieldSource, collectSource),
  DropTarget(dragDropTypes.FIELD, fieldTarget, collectTarget)
)(FieldView)
