import React from 'react'
import {connect} from 'react-redux'
import {Button, Col, Modal, Row, Table} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {approveDonation, sendReceipt} from '../reducers/donation'

const mapStateToProps = (state, ownProps) => ({
  donor: selectors.donor.getOne(state)(ownProps.donorId),
  savingDonations: selectors.donation.saving(state),
  saveDonationsError: selectors.donation.saveError(state)
})

const mapDispatchToProps = dispatch => ({
  approveDonation: (donation, close) => () => {
    dispatch(approveDonation(donation._id))
    close()
  },
  sendReceipt: (donation, donorId, close) => () => {
    dispatch(sendReceipt(donation, donorId))
    close()
  }
})

const DonationView = ({
  approveDonation,
  sendReceipt,
  show,
  close,
  savingDonations,
  donation,
  donorId,
  donor
}) => {
  if (!donation || !show) return null
  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>
          Donation #{donation._id}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row style={{padding: '10px'}}>
          <Col xs={6}>
            <b>Donor:</b>
            <span className="pull-right">
              {donor.fullName}
            </span>
          </Col>
        </Row>
        <Row style={{padding: '10px'}}>
          <Col xs={6}>
            <strong>Description:</strong>
          </Col>
          <Col xs={6}>
            {donation.description}
          </Col>
        </Row>
        <Row style={{margin: '10px'}}>
          <Col xs={12}>
            <Table striped hover bordered style={{width: '85%', marginLeft: '7.5%'}}>
              <thead>
                <tr>
                  <td><b>Item</b></td>
                  <td
                    style={{width: '100px'}}
                    className="text-right"
                  >
                    <b>Value</b>
                  </td>
                </tr>
              </thead>
              <tbody>
                {donation.items && donation.items.map((item, i) =>
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td className="text-right">{item.value}</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row style={{padding: '10px'}}>
          <Col xs={4} xsOffset={8}>
            <b>Total:</b>
            <span className="pull-right">
              {donation.total}
            </span>
          </Col>
        </Row>
        {savingDonations &&
          <div className="overlay">
            <i className="fa fa-refresh" />
          </div>
        }
      </Modal.Body>
      <Modal.Footer>
        {donation.approved ?
          <Button
            bsStyle="success"
            onClick={sendReceipt(donation, donorId, close)}
          >
            Send Receipt
          </Button> :
          <Button
            bsStyle="primary"
            onClick={approveDonation(donation, close)}
          >
            Approve Donation
          </Button>
        }
        <Button onClick={close}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DonationView)
