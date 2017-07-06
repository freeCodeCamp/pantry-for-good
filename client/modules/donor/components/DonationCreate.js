import React from 'react'
import {connect} from 'react-redux'
import {compose, withHandlers} from 'recompose'
import {FieldArray, formValueSelector, reduxForm, submit} from 'redux-form'
import {Button, Col, Modal, Row} from 'react-bootstrap'

import selectors from '../../../store/selectors'
import {saveDonation} from '../reducers/donation'
import {RFFieldGroup} from '../../../components/form'
import DonationItemRow from './DonationItemRow'

const FORM_NAME = 'donationForm'

const mapStateToProps = state => ({
  items: formValueSelector(FORM_NAME)(state, 'items'),
  savingDonations: selectors.donation.saving(state),
  saveDonationsError: selectors.donation.saveError(state)
})

const mapDispatchToProps = dispatch => ({
  saveDonation: (donation, donor) => () => dispatch(saveDonation(donation, donor)),
  submit: () => dispatch(submit(FORM_NAME))
})

const renderItems = withHandlers({
  handleAdd: ({fields}) => () => fields.push(),
  handleDelete: ({fields}) => index => () => fields.remove(index)
})(({fields, handleAdd, handleDelete}) =>
  <div>
    <ul style={{padding: 0}}>
      {fields.map((item, i) =>
        <DonationItemRow
          key={i}
          item={item}
          showDelete={fields.length > 1}
          handleDelete={handleDelete(i)}
        />
      )}
    </ul>
    <div className="text-center">
      <Button onClick={handleAdd}>Add Item</Button>
    </div>
  </div>
)

const DonationCreate = ({
  items,
  show,
  close,
  handleSubmit,
  submit
}) => {
  if (!show) return null
  const total = items ? items.filter(x => x).reduce((acc, item) => acc + Number(item.value) || 0, 0) : 0
  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>
          Create Donation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <RFFieldGroup
            name="description"
            label="Description"
          />
          <label>Items:</label>
          <FieldArray
            name="items"
            component={renderItems}
          />
          <Row>
            <Col xs={4} xsOffset={8}>
              <label>Total:</label>
              <span className="pull-right">{total}</span>
            </Col>
          </Row>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="success" onClick={submit}>Add Donation</Button>
        <Button bsStyle="primary" onClick={close}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: FORM_NAME,
    validate
  })
)(DonationCreate)

function validate(values) {
  return {
    items: values.items.reduce((errors, row) => {
      let rowErrors = {}

      if (!row || !row.name || !row.name.trim())
        rowErrors.name = 'Name is required'
      if (!row || !row.value || row.value === '0')
        rowErrors.value = 'Value is required'

      return errors.concat(rowErrors)
    }, [])
  }
}
