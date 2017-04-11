import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Table} from 'react-bootstrap'

import {selectors} from 'store'
import {loadVolunteers} from '../../volunteer/volunteer-reducer'

import Page from '../../../components/page/PageBody'

const mapStateToProps = state => ({
  drivers: selectors.getAllVolunteers(state).filter(vol =>
    vol.driver && vol.status === 'Active'),
  loading: selectors.loadingVolunteers(state)
})

const mapDispatchToProps = dispatch => ({
  loadVolunteers: () => dispatch(loadVolunteers())
})

class DriverAdmin extends Component {
  componentWillMount() {
    this.props.loadVolunteers()
  }

  render() {
    const {drivers, loading} = this.props
    return (
      <Page heading="Drivers">
        <div className="row">
          <div className="col-xs-12">
            <div className="box">
              <div className="box-header">
                <h3 className="box-title"></h3>
                <div className="box-tools">
                  <div className="form-group has-feedback">
                    <input className="form-control" type="search" placeholder="Search" />
                    <span className="glyphicon glyphicon-search form-control-feedback"></span>
                  </div>
                </div>
              </div>
              <div className="box-body table-responsive no-padding top-buffer">
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Full Name</th>
                      <th>Delivery Status</th>
                      <th>General Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers && drivers.map((driver, i) =>
                      <tr key={i}>
                        <td><span>{driver.id}</span></td>
                        <td><span>{driver.fullName}</span></td>
                        <td>
                          <span className={labelClass(driver.deliveryStatus)}>{driver.deliveryStatus}
                          </span>
                        </td>
                        <td><span>{driver.generalNotes}</span></td>
                      </tr>
                    )}
                    {!drivers &&
                      <tr>
                        <td className="text-center" colSpan="4">No drivers yet.</td>
                      </tr>
                    }
                  </tbody>
                </Table>
              </div>
              {loading &&
                <div className="overlay">
                  <i className="fa fa-refresh fa-spin"></i>
                </div>
              }
            </div>
          </div>
        </div>
      </Page>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DriverAdmin)

function labelClass(status) {
  if (status === 'Completed') return 'label label-success'
  return 'label label-warning'
}
