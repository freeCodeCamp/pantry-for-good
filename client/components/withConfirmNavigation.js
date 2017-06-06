import React, {Component} from 'react'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {withRouter} from 'react-router-dom'

import {showConfirmDialog, hideDialog} from '../modules/core/reducers/dialog'

const mapDispatchToProps = dispatch => ({
  showDialog: (cancel, confirm) => dispatch(showConfirmDialog(cancel, confirm)),
  hideDialog: () => dispatch(hideDialog())
})

const enhance = compose(
  connect(null, mapDispatchToProps),
  withRouter
)

const withConfirmNavigation = WrappedComponent => enhance(
  class ConfirmNavigation extends Component {
    componentDidMount() {
      this.unblock = this.props.history.block(nextLocation => {
        if (this.props.dirty) {
          this.props.showDialog(this.props.hideDialog, this.unblockAndGo(nextLocation))
        }
        return !this.props.dirty
      })
    }

    componentWillUnmount() {
      this.unblock()
    }

    unblockAndGo = location => () => {
      this.unblock()
      this.props.hideDialog()
      this.props.history.push(location)
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
)

export default withConfirmNavigation
