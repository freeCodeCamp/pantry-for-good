import React from 'react'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {DragSource, DropTarget} from 'react-dnd'

import selectors from '../../../store/selectors'
import {moveSection} from '../reducers/editor/index'

const mapStateToProps = state => ({
  getSection: selectors.qEditor.getSectionById(state)
})

const mapDispatchToProps = dispatch => ({
  moveSection: (section, idx) => dispatch(moveSection(section, idx))
})

const sectionSource = {
  beginDrag(props) {
    return {
      id: props.section._id,
      idx: props.idx
    }
  }
}

const sectionTarget = {
  hover(props, monitor) {
    const {id, idx} = monitor.getItem()
    const dropIndex = props.idx

    if (idx === dropIndex) return

    props.moveSection(id, dropIndex)

    monitor.getItem().idx = dropIndex
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
