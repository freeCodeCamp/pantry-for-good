import React from 'react'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {DragSource, DropTarget} from 'react-dnd'

import {selectors} from '../../../store'
import {moveSection} from '../reducers/questionnaire-editor'

const mapStateToProps = state => ({
  getSection: selectors.getSectionById(state)
})

const mapDispatchToProps = dispatch => ({
  moveSection: (section, idx) => dispatch(moveSection(section, idx))
})

const sectionSource = {
  beginDrag(props) {
    return {sectionId: props.section._id}
  }
}

const sectionTarget = {
  hover(props, monitor) {
    const draggedSectionId = monitor.getItem().sectionId
    const dropIndex = props.idx

    props.moveSection(draggedSectionId, dropIndex)
  }
}


function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}


const SectionView = ({
  connectDragSource,
  connectDropTarget,
  isDragging,
  isOver,
  idx,
  section,
  onEdit,
  onDelete
}) => connectDragSource(
  connectDropTarget(
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: isDragging || isOver ? '0.5' : 1
      }}
      onDoubleClick={onEdit}
    >
      {section.name}
      <span>
        <i
          className="fa fa-edit"
          onClick={onEdit}
        ></i>{' '}
        <i
          className="fa fa-trash-o"
          onClick={onDelete}
        ></i>
      </span>
    </div>
  )
)

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  DragSource('section', sectionSource, collectSource),
  DropTarget('section', sectionTarget, collectTarget)
)(SectionView)
