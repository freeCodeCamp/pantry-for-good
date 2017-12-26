import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'
import {SizePerPageDropDown, BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css'

import selectors from '../../../store/selectors'
import {loadNotifications, deleteNotification, deleteAllNotifications} from '../authReducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'
import {showConfirmDialog, hideDialog} from '../../core/reducers/dialog'

import {Box, BoxBody, BoxHeader} from '../../../components/box'
import {Page, PageBody} from '../../../components/page'

const mapStateToProps = state => ({
  notifications: selectors.auth.getAllNotifications(state),
  user: selectors.auth.getUser(state),
  savingUser: selectors.auth.saving(state),
  saveUserError: selectors.auth.saveError(state),
  loading: selectors.auth.loading(state) ||
    selectors.questionnaire.loading(state),
  loadError: selectors.auth.loadError(state) ||
    selectors.questionnaire.loadError(state)
})

const mapDispatchToProps = dispatch => ({
  loadNotifications: () => dispatch(loadNotifications()),
  deleteNotification: id => dispatch(deleteNotification(id)),
  deleteNotificationState: id => dispatch({type: 'DEL_NOTIFICATION', index:id}),
  deleteAllNotifications: () => dispatch(deleteAllNotifications()),
  deleteAllNotificationState: () => dispatch({type: 'DEL_ALL_NOTIFICATIONS'}),
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  showDialog: (cancel, confirm, message) =>
    dispatch(showConfirmDialog(cancel, confirm, message, 'Delete')),
  hideDialog: () => dispatch(hideDialog())
})

class NotificationsList extends Component {
  componentWillMount() {
    this.props.loadNotifications()
    this.props.loadQuestionnaires()
  }

  deleteNotification = id => () => this.props.showDialog(
    this.props.hideDialog,
    () => {
      this.props.deleteNotification(id)
      this.props.deleteNotificationState(id)
      this.props.hideDialog()
    },
    `Notification ${id} will be permanently deleted`
  )

  getActionButtons2 = (_, notification) =>
    <div>
      <Link
        to={`${notification.url}`}
        className="btn btn-info btn-sm"
      ><i className="fa fa-eye" /></Link>
      {' '}
      <Button bsStyle="danger" bsSize="sm" onClick={this.deleteNotification(notification.index)}>
        <i className="fa fa-trash" />
      </Button>
    </div>

    formatData2 = () => this.props.notifications ?
      this.props.notifications.map((d, index) => ({
        ...d,
        index
      })) :
      []

      cleanAll = () => this.props.showDialog(
        this.props.hideDialog,
        () => {
          this.props.deleteAllNotifications()
          this.props.deleteAllNotificationState()
          this.props.hideDialog()
        },
        `All Notification will be permanently deleted`
      )

  renderSizePerPageDropDown = () => <SizePerPageDropDown variation='dropup'/>

  render() {
    const {loading, loadError, savingUser, saveUserError} = this.props
    return (
      <Page>
        <PageBody>
          <Box>
            <BoxHeader heading="Notifications" />
            <BoxBody
              loading={loading || savingUser}
              error={loadError || saveUserError}
            >
              <Button bsStyle="danger" bsSize="sm" onClick={this.cleanAll}>
                <i className="fa fa-trash" />
              </Button>
              <BootstrapTable
                data={this.formatData2()}
                keyField="index"
                options={{
                  defaultSortName: "index",
                  defaultSortOrder: 'desc',
                  noDataText: loading ? '' : 'No notifications found',
                  sizePerPageDropDown: this.renderSizePerPageDropDown
                }}
                hover
                striped
                pagination
                search
              >
                <TableHeaderColumn dataField="index" width="70px" dataSort>#</TableHeaderColumn>
                <TableHeaderColumn dataField="date" dataSort>Date</TableHeaderColumn>
                <TableHeaderColumn dataField="message" dataSort>Message</TableHeaderColumn>
                <TableHeaderColumn dataField="url" dataSort>Url</TableHeaderColumn>
                <TableHeaderColumn
                  dataFormat={this.getActionButtons2}
                  dataAlign="center"
                  width="135px"
                />
              </BootstrapTable>
            </BoxBody>
          </Box>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsList)
