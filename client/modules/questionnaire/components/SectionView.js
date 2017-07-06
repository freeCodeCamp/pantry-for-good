import React from 'react'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {DragSource, DropTarget} from 'react-dnd'

import selectors from '../../../store/selectors'
import {dragDropTypes} from '../types'
import {moveSection, moveFieldToSection} from '../reducers/editor'

const mapStateToProps = state => ({
  getSection: selectors.qEditor.getSectionById(state),
  getField: selectors.qEditor.getFieldById(state),
  selectedSection: selectors.qEditor.getSelectedSection(state)
})

const mapDispatchToProps = dispatch => ({
  moveSection: (section, idx) => dispatch(moveSection(section, idx)),
  moveFieldToSection: (field, fromSection, toSection) =>
    dispatch(moveFieldToSection(field, fromSection, toSection))
})

const sectionSource = {
  beginDrag(props) {
    return {
      id: props.section._id,
      idx: props.idx,
      type: dragDropTypes.SECTION
    }
  }
}

const sectionTarget = {
  hover(props, monitor) {
    const {id, idx, type} = monitor.getItem()
    const dropIndex = props.idx

    if (type !== dragDropTypes.SECTION || idx === dropIndex) return

    props.moveSection(id, dropIndex)

    monitor.getItem().idx = dropIndex
  },
  canDrop(props, monitor) {
    const {id, type} = monitor.getItem()

    if (type === dragDropTypes.FIELD)
      return props.selectedSection !== props.section._id

    return id !== props.section._id
  },
  drop(props, monitor) {
    const {id, type} = monitor.getItem()
    if (type !== dragDropTypes.FIELD) return

    const field = props.getField(id)

    props.moveFieldToSection(field, props.selectedSection, props.section._id)
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
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}

const SectionView = ({
  connectDragSource,
  connectDragPreview,
  connectDropTarget,
  isOver,
  canDrop,
  section,
  onEdit,
  onDelete,
  onSelect,
  selected
}) => connectDragPreview(
  connectDropTarget(
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: isOver && canDrop ? '0.5' : 1
      }}
      className={selected === section._id ? 'list-group-item active' : 'list-group-item'}
      onDoubleClick={onEdit}
      onClick={onSelect}
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
      {section.name}
      <span style={{marginLeft: '5px'}}>
        <i
          className="fa fa-edit"
          style={{marginRight: '5px'}}
          onClick={onEdit}
        />{' '}
        <i
          className="fa fa-trash-o"
          onClick={onDelete}
        />
      </span>
    </div>
  )
)

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  DragSource(dragDropTypes.SECTION, sectionSource, collectSource),
  DropTarget([dragDropTypes.SECTION, dragDropTypes.FIELD], sectionTarget, collectTarget)
)(SectionView)
