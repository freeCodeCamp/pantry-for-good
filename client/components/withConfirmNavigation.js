import React, {Component} from 'react'
import P from 'prop-types'
import {connect} from 'react-redux'
import {compose, setPropTypes} from 'recompose'
import {withRouter} from 'react-router-dom'

import {showNavDialog, hideDialog} from '../modules/core/reducers/dialog'

const mapDispatchToProps = dispatch => ({
  showDialog: (cancel, confirm) => dispatch(showNavDialog(cancel, confirm)),
  hideDialog: () => dispatch(hideDialog())
})

const enhance = compose(
  setPropTypes({
    dirty: P.bool
  }),
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

    componentWillReceiveProps(nextProps) {
      if (nextProps.dirty) this.addUnloadListener()
      else this.removeUnloadListener()
    }

    componentWillUnmount() {
      this.unblock()
      this.removeUnloadListener()
    }

    addUnloadListener() {
      window.addEventListener('beforeunload', this.confirmUnload)
    }

    removeUnloadListener() {
      window.removeEventListener('beforeunload', this.confirmUnload)
    }

    confirmUnload(ev) {
      const message = 'Are you sure? Your changes will be lost.'
      ev.returnValue = message
      return message
    }

    unblockAndGo = location => () => {
      this.unblock()
      this.removeUnloadListener()
      this.props.hideDialog()
      this.props.history.push(location)
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
)

export default withConfirmNavigation
