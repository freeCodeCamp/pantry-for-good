import React from 'react'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {DragSource, DropTarget} from 'react-dnd'
import {ListGroupItem} from 'react-bootstrap'

import selectors from '../../../../store/selectors'
import {requestMapquestRoute, moveWaypoint} from '../../reducers/route'

const mapStateToProps = state => ({
  settings: selectors.settings.getSettings(state),
  waypoints: selectors.delivery.route.getWaypoints(state),
  allWaypoints: selectors.delivery.route.getAllWaypoints(state)
})

const mapDispatchToProps = dispatch => ({
  moveWaypoint: (waypoint, idx) => dispatch(
    moveWaypoint(waypoint, idx, selectors.delivery.route.getAllWaypoints)),
  requestMapquestRoute: waypoints => dispatch(requestMapquestRoute(waypoints))
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  requestRoute: () => dispatchProps.requestMapquestRoute(stateProps.allWaypoints)
})

const waypointSource = {
  beginDrag(props) {
    return {
      waypoint: props.waypoint,
      idx: props.idx
    }
  }
}

const waypointTarget = {
  hover(props, monitor) {
    const {waypoint, idx} = monitor.getItem()
    const dropIndex = props.idx

    if (idx === dropIndex) return

    props.moveWaypoint(waypoint, dropIndex)
    monitor.getItem().idx = dropIndex
  },
  // drop(props) {
  //   props.requestRoute()
  // }
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

const RouteWaypoint = ({
  connectDragSource,
  connectDropTarget,
  // isDragging,
  isOver,
  idx,
  waypoint
}) => connectDragSource(
  connectDropTarget(
    <div>
      <ListGroupItem style={{
        border: 'none',
        opacity: isOver ? '0' : 1
      }}>
        {`${idx + 1}: ${waypoint.address}`}
      </ListGroupItem>
    </div>
  )
)

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  DragSource('waypoint', waypointSource, collectSource),
  DropTarget('waypoint', waypointTarget, collectTarget)
)(RouteWaypoint)
