import React from 'react'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import {ListGroup} from 'react-bootstrap'

import {setWaypoints} from '../../reducers/route'
import RouteWaypoint from './RouteWaypoint'

const mapDispatchToProps = (dispatch, ownProps) => ({
  setWaypoints: () => dispatch(setWaypoints(ownProps.customers))
})

const RouteOrder = ({driver, waypoints}) =>
  <ListGroup>
    {waypoints && driver && waypoints.map((waypoint, i) =>
      <RouteWaypoint
        key={i}
        idx={i}
        waypoint={waypoint}
        driver={driver}
      />
    )}
  </ListGroup>

export default compose(
  connect(null, mapDispatchToProps),
  DragDropContext(HTML5Backend)
)(RouteOrder)
