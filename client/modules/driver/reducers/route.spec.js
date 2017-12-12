import * as reducer from './route'

describe('route reducer', function() {
  let foobarWaypoints, allWaypoints

  before(function() {
    foobarWaypoints = [
      {_id: 2, lat: 1, lng: 1, address: 'foo'},
      {_id: 3, lat: 1, lng: 1, address: 'bar'}
    ]

    allWaypoints = [
      {_id: 1, lat: 1, lng: 1, address: 'start'},
      ...foobarWaypoints,
      {_id: 4, lat: 1, lng: 1, address: 'end'}
    ]
  })

  describe('action creators', function() {
    it('setWaypoints', function() {
      const waypoints = [
        {_id: 2, location: {lat: 1, lng: 1}, address: 'foo'},
        {_id: 3, lat: 1, lng: 1, address: 'bar'}
      ]

      const action = reducer.setWaypoints(waypoints)
      expect(action.waypoints).to.eql(foobarWaypoints)
    })

    it('moveWaypoint', function() {
      const dispatchMock = sinon.spy()
      const noop = () => {}
      const waypoint = {_id: 1, lat: 1, lng: 1, address: 'foo'}

      reducer.moveWaypoint(waypoint, 1, noop)(dispatchMock, noop)
      expect(dispatchMock).to.have.been.calledWith({
        type: reducer.MOVE_WAYPOINT,
        waypoint,
        idx: 1
      })
    })

    it('requestGoogleRoute', function() {
      const routes = [{
        waypoint_order: [1, 0]
      }]

      const dispatchMock = sinon.spy()
      const getStateFake = () => ({delivery: {route: {fetching: false }}})
      const getGoogleRouteMock = sinon.stub().resolves({routes})

      reducer.default.__Rewire__('getGoogleRoute', getGoogleRouteMock)
      const result = reducer.requestGoogleRoute(allWaypoints, true)(dispatchMock, getStateFake)
      reducer.default.__ResetDependency__('getGoogleRoute')

      expect(dispatchMock.firstCall).to.have.been.calledWith({
        type: reducer.ROUTE_REQUEST
      })

      return result.then(() => {
        expect(dispatchMock.secondCall).to.have.been.calledWith({
          type: reducer.ROUTE_SUCCESS,
          result: {routes}
        })

        expect(dispatchMock.thirdCall).to.have.been.calledWithMatch({
          type: reducer.SET_WAYPOINTS,
          waypoints: [allWaypoints[2], allWaypoints[1]]
        })
      })
    })
  })

  describe('reducer', function() {
    it('sets all waypoints', function() {
      const state = reducer.default(null, {
        type: reducer.SET_ALL_WAYPOINTS,
        waypoints: allWaypoints
      })

      expect(state.origin).to.have.property('address', 'start')
      expect(state.destination).to.have.property('address', 'end')
      expect(state.waypoints.length).to.equal(2)
    })

    it('adds waypoints', function() {
      const initialState = {
        waypoints: foobarWaypoints
      }

      const state = reducer.default(initialState, {
        type: reducer.ADD_WAYPOINTS,
        waypoints: [{_id: 4, lat: 1, lng: 1, address: 'baz'}]
      })

      expect(state.waypoints.length).to.equal(3)
      expect(state.waypoints[2]).to.have.property('address', 'baz')
    })

    it('removes waypoints', function() {
      const initialState = {
        waypoints: foobarWaypoints
      }

      const state = reducer.default(initialState, {
        type: reducer.REMOVE_WAYPOINTS,
        waypoints: [{_id: 3}]
      })

      expect(state.waypoints.length).to.equal(1)
      expect(state.waypoints[0]).to.have.property('address', 'foo')
    })

    it('moves waypoints', function() {
      const initialState = {
        waypoints: foobarWaypoints
      }

      const state = reducer.default(initialState, {
        type: reducer.MOVE_WAYPOINT,
        waypoint: {_id: 3, lat: 1, lng: 1, address: 'bar'},
        idx: 0
      })

      expect(state.waypoints.length).to.equal(2)
      expect(state.waypoints[0]).to.have.property('address', 'bar')
      expect(state.waypoints[1]).to.have.property('address', 'foo')
    })
  })

  describe('selectors', function() {
    it('getAllWaypoints', function() {
      const state = {
        route: {
          origin: allWaypoints[0],
          destination: allWaypoints[3],
          waypoints: foobarWaypoints
        }
      }

      const selectors = reducer.createSelectors('route')
      const result = selectors.getAllWaypoints(state)

      expect(result).to.be.an('array')
      expect(result.length).to.equal(4)
    })
  })
})
