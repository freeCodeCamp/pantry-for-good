import React from 'react'
import {connect} from 'react-redux'
import {Modal, Table} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {sendReceipt} from '../reducers/donation'

const mapStateToProps = state => ({
  savingDonations: selectors.donation.saving(state),
  saveDonationsError: selectors.donation.saveError(state),
  settings: selectors.settings.getSettings(state)
})

const mapDispatchToProps = dispatch => ({
  sendReceipt: (donation, donorId) => () => dispatch(sendReceipt(donation, donorId)),
})

const DonationView = ({
  // savingDonations,
  // saveDonationsError,
  settings,
  sendReceipt,
  show,
  close,
  donation,
  donorId
}) => {
  if (!donation || !show) return null
  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>
          Official Donation Receipt for Income Tax Purposes
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-xs-4">
            <address>
              From
              <br />
              <strong>{settings.organization}</strong><br />
              Address
              <br />
              Number
            </address>
          </div>
          <div className="col-xs-4">
            <address>
              To
              <br />
              <strong><span>{donation.donorName}</span></strong>
              <br />
              <span>{donation.donorAddress}</span>
            </address>
          </div>
          <div className="col-xs-4">
            <strong>Receipt #<span>{donation._id}</span></strong>
            <br /><br />
            <strong>Date Issued: </strong><span>{donation.dateIssued}</span>
            <br />
            <strong>Location: </strong><span>{donation.location}</span>
          </div>
        </div>
        <div className="row">
          {donation.type === 'Non-cash' || donation.type === 'Non-cash with advantage' ?
            <div className="col-xs-12">
              <p className="lead">Non-cash payment details</p>
              <Table responsive>
                <tbody>
                  <tr>
                    <td>Description of property received by charity:</td>
                    <td><span>{donation.description}</span></td>
                  </tr>
                  <tr>
                    <td>Appraised by:</td>
                    <td><span>{donation.appraiserName}</span></td>
                  </tr>
                  <tr>
                    <td>Address of appraiser:</td>
                    <td><span>{donation.appraiserAddress}</span></td>
                  </tr>
                </tbody>
              </Table>
            </div> :
            <div className="col-xs-12">
              <p className="lead">Advantage information</p>
              <Table responsive>
                <tbody>
                  <tr>
                    <th>Total amount received by charity:</th>
                    <td><span>{donation.total}</span></td>
                  </tr>
                  <tr>
                    <th>Value of advantage:</th>
                    <td><span>{donation.advantageValue}</span></td>
                  </tr>
                  <tr>
                    <td>Description of advantage:</td>
                    <td><span>{donation.advantageDescription}</span></td>
                  </tr>
                </tbody>
              </Table>
            </div>
          }
          <div className="col-xs-12">
            <p className="lead">Summary</p>
            <Table responsive>
              <tbody>
                <tr>
                  <th>Eligible amount of gift for tax purposes:</th>
                  <td><span>{donation.eligibleForTax}</span></td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
        <p>
          Sincerely,<br /><br />
          <img src="/media/signature.png" alt="signature" />
        </p>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary pull-left" onClick={sendReceipt(donation, donorId)}>Send email</button>
        <button className="btn btn-default" onClick={close}>Cancel</button>
      </Modal.Footer>
    </Modal>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DonationView)
