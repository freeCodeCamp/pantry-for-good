import React from 'react'
import {connect} from 'react-redux'
import {Modal} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {saveDonation} from '../reducers/donation'

const mapStateToProps = state => ({
  savingDonations: selectors.donation.saving(state),
  saveDonationsError: selectors.donation.saveError(state)
})

const mapDispatchToProps = dispatch => ({
  saveDonation: (donation, donor) => () => dispatch(saveDonation(donation, donor)),
})

const DonationCreate = ({
  // savingDonations,
  // saveDonationsError,
  saveDonation,
  show,
  close,
  donation,
  handleFieldChange
}) => {
  if (!show) return null
  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>
          Create Donation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form name="donationForm">
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <div className="form-group">
                <label>Donation type</label>
                <select
                  className="form-control"
                  value={donation.type}
                  onChange={handleFieldChange('type')}
                  required
                >
                  <option value="Cash">Cash gift (no advantage)</option>
                  <option value="Cash with advantage">Cash gift with advantage</option>
                  <option value="Non-cash">Non-cash gift (no advantage)</option>
                  <option value="Non-cash with advantage">Non-cash gift with advantage</option>
                </select>
              </div>
            </div>
            <div className="col-xs-12 col-sm-6">
              <div className="form-group">
                <label>Date donation received</label>
                <input
                  type="date"
                  className="form-control"
                  value={donation.dateReceived}
                  onChange={handleFieldChange('dateReceived')}
                  required
                />
              </div>
            </div>
            <div className="clearfix"></div>
            <div className="col-xs-12 col-sm-6">
              <div className="form-group">
                <label>Donated by</label>
                <input
                  type="text"
                  className="form-control"
                  value={donation.donorName}
                  onChange={handleFieldChange('donorName')}
                  required
                />
              </div>
            </div>
            <div className="col-xs-12 col-sm-6">
              <div className="form-group">
                <label>Donor address</label>
                <input
                  type="text"
                  className="form-control"
                  value={donation.donorAddress}
                  onChange={handleFieldChange('donorAddress')}
                  required
                />
              </div>
            </div>
            <div className="clearfix"></div>
            <div className="col-xs-12 col-sm-6">
              <div className="form-group">
                <label>Total amount received by charity</label>
                <input
                  type="number"
                  className="form-control"
                  value={donation.total}
                  onChange={handleFieldChange('total')}
                  disabled={donation.type !== 'Cash with advantage' && donation.type !== 'Non-cash with advantage'}
                />
              </div>
            </div>
            <div className="col-xs-12 col-sm-6">
              <div className="form-group">
                <label>Value of advantage</label>
                <input
                  type="number"
                  className="form-control"
                  value={donation.advantageValue}
                  onChange={handleFieldChange('advantageValue')}
                  disabled={donation.type !== 'Cash with advantage' && donation.type !== 'Non-cash with advantage'}
                />
              </div>
            </div>
            <div className="clearfix"></div>
            <div className="col-xs-12 col-sm-6">
              <div className="form-group">
                <label>Description of advantage</label>
                <input
                  type="text"
                  className="form-control"
                  value={donation.advantageDescription}
                  onChange={handleFieldChange('advantageDescription')}
                  disabled={donation.type !== 'Cash with advantage' && donation.type !== 'Non-cash with advantage'}
                />
              </div>
            </div>
            <div className="col-xs-12 col-sm-6">
              <div className="form-group">
                <label>Eligible amount of gift for tax purposes</label>
                <input
                  type="number"
                  className="form-control"
                  value={donation.eligibleForTax}
                  onChange={handleFieldChange('eligibleForTax')}
                  required
                />
              </div>
            </div>
            <div className="clearfix"></div>
            <div className="col-xs-12 col-sm-6">
              <div className="form-group">
                <label>Description of property received by charity</label>
                <input
                  type="text"
                  className="form-control"
                  value={donation.description}
                  onChange={handleFieldChange('description')}
                  disabled={donation.type !== 'Non-cash' && donation.type !== 'Non-cash with advantage'}
                />
              </div>
            </div>
            <div className="col-xs-12 col-sm-6">
              <div className="form-group">
                <label>Appraised by</label>
                <input
                  type="text"
                  className="form-control"
                  value={donation.appraiserName}
                  onChange={handleFieldChange('appraiserName')}
                  disabled={donation.type !== 'Non-cash' && donation.type !== 'Non-cash with advantage'}
                />
              </div>
            </div>
            <div className="clearfix"></div>
            <div className="col-xs-12 col-sm-6">
              <div className="form-group">
                <label>Address of appraiser</label>
                <input
                  type="text"
                  className="form-control"
                  value={donation.appraiserAddress}
                  onChange={handleFieldChange('appraiserAddress')}
                  disabled={donation.type !== 'Non-cash' && donation.type !== 'Non-cash with advantage'}
                />
              </div>
            </div>
            <div className="col-xs-12 col-sm-6">
              <div className="form-group">
                <label>Date receipt issued</label>
                <input
                  type="date"
                  className="form-control"
                  value={donation.dateIssued}
                  onChange={handleFieldChange('dateIssued')}
                  required
                />
              </div>
            </div>
            <div className="clearfix"></div>
            <div className="col-xs-12 col-sm-6">
              <div className="form-group">
                <label>Location receipt issued</label>
                <input
                  type="text"
                  className="form-control"
                  value={donation.location}
                  onChange={handleFieldChange('location')}
                  required
                />
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-success pull-left" onClick={saveDonation(donation)}>Submit</button>
        <button className="btn btn-default" onClick={close}>Cancel</button>
      </Modal.Footer>
    </Modal>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DonationCreate)
