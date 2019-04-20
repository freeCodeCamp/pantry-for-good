import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import { Button, Modal } from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn, SizePerPageDropDown} from 'react-bootstrap-table'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css'

import {fieldTypes} from '../../../../common/constants'
import {fieldsByType} from '../../../lib/questionnaire-helpers'
import selectors from '../../../store/selectors'
import {loadVolunteers, massUpload} from '../reducer'
import {loadQuestionnaires} from '../../questionnaire/reducers/api'

import {Box, BoxBody, BoxHeader} from '../../../components/box'
import ClientStatusLabel from '../../../components/ClientStatusLabel'
import {Page, PageBody} from '../../../components/page'

import MassImportsModal from './MassImportsModal'

const mapStateToProps = state => ({
  volunteers: selectors.volunteer.getAll(state),
  loading: selectors.volunteer.loading(state) ||
    selectors.questionnaire.loading(state),
  loadError: selectors.volunteer.loadError(state) ||
    selectors.questionnaire.loadError(state)
})

const mapDispatchToProps = dispatch => ({
  loadVolunteers: () => dispatch(loadVolunteers()),
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  massUpload: docs => dispatch(massUpload(docs))
})

class VolunteerList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showImportsModal: false
    }
  }  

  openModal = () => {
    this.setState({showImportsModal: true})
  }

  closeModal = () => {
    location.reload()
    this.setState({showImportsModal: false})
  }  


  componentWillMount() {
    this.props.loadVolunteers()
    this.props.loadQuestionnaires()
  }

  getStatusLabel = (_, volunteer) => <ClientStatusLabel client={volunteer} />

  getActionButtons = (_, volunteer) =>
    <div>
      <Link
        to={`/volunteers/${volunteer._id}`}
        className="btn btn-info btn-sm"
      ><i className="fa fa-eye" /></Link>
      {' '}
      <Link
        to={`/volunteers/${volunteer._id}/edit`}
        className="btn btn-primary btn-sm"
      ><i className="fa fa-pencil" /></Link>
    </div>

  formatData = () => this.props.volunteers ?
    this.props.volunteers.map(v => ({...v, address: fieldsByType(v, fieldTypes.ADDRESS).map(f => f.value).join(', ')
    })) :
    []

  renderSizePerPageDropDown = () => <SizePerPageDropDown variation='dropup'/>

  render() {
    const {loading, loadError} = this.props

    return (
      <Page>
        <PageBody>
          <Box>
            <BoxHeader heading="Volunteers" />
            <BoxBody
              loading={loading}
              error={loadError}
            >
              <Button onClick={this.openModal}>Mass Imports</Button>

              <Modal show={this.state.showImportsModal} onHide={this.closeModal}>
                <MassImportsModal
                  volunteers={this.props.volunteers}
                  closeModal={this.closeModal}
                  massUpload={this.props.massUpload}
                />
              </Modal>            

              <BootstrapTable
                data={this.formatData()}
                keyField="_id"
                options={{
                  defaultSortName: "_id",
                  defaultSortOrder: 'desc',
                  noDataText: loading ? '' : 'No volunteers found',
                  sizePerPageDropDown: this.renderSizePerPageDropDown
                }}
                hover
                striped
                pagination
                search
              >
                <TableHeaderColumn dataField="_id" width="70px" dataSort>#</TableHeaderColumn>
                <TableHeaderColumn dataField="fullName" dataSort>Name</TableHeaderColumn>
                <TableHeaderColumn dataField="address">Address</TableHeaderColumn>
                <TableHeaderColumn dataField="email" dataSort>Email</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="status"
                  dataFormat={this.getStatusLabel}
                  dataAlign="center"
                  width="90px"
                  dataSort
                >
                  Status
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataFormat={this.getActionButtons}
                  dataAlign="center"
                  width="100px"
                />
              </BootstrapTable>
            </BoxBody>
          </Box>
        </PageBody>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VolunteerList)
