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
  isOver,
  section,
  onEdit,
  onDelete,
  onSelect,
  selected
}) => connectDragSource(
  connectDropTarget(
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: isOver ? '0.5' : 1
      }}
      className={selected === section._id ? 'list-group-item active' : 'list-group-item'}
      onDoubleClick={onEdit}
      onClick={onSelect}
    >
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
  DragSource('section', sectionSource, collectSource),
  DropTarget('section', sectionTarget, collectTarget)
)(SectionView)
