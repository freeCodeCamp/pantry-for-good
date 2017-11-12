/**
 * Modal used to select items to pack for a single customer package.
 *
 * Checkboxes will be automatically generated for the items in props.customer.packingList
 * The user can add more items to the list by selecting items from props.scheduledFoods
 *
 */
import React, { Component } from 'react'
import { Modal, Button, FormGroup, FormControl, Well } from 'react-bootstrap'
import _ from 'lodash'
import PropTypes from 'prop-types'

import ErrorWrapper from '../../../../components/error/ErrorWrapper'

class PackModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedItems: new Set(), // The items the user has checked as being packed
      otherItems: new Set(), // A list of non-preferred items the user has added that can be checked off
      otherItemSelectBoxValue: undefined // the current value of the other item select box
    }
  }

  componentWillReceiveProps = nextProps => {
    // Close the modal after transitioning from saving when there is no error
    if (this.props.packSaving && !nextProps.packSaving && !nextProps.packSaveError) {
      this.setState({selectedItems: new Set()}, this.props.closeModal)
    }
  }

  generateCheckBoxes = itemList => {
    const sortedList = _.sortBy(itemList, 'name')
    return sortedList.map(foodItem => {
      // If the food is not in the scheduledFoods use a * to indicate that
      const notInScheduledFoods = this.props.scheduledFoods.find(x => x._id === foodItem._id) ? '' : '*'
      return (
        <div key={foodItem._id} className='checkbox' >
          <label>
            <input type='checkbox'
              name={foodItem._id}
              onChange={this.onCheckBoxChange}
              style={{opacity: 1, zIndex: 0}}
              checked={this.state.selectedItems.has(foodItem)}/>
            {notInScheduledFoods}{foodItem.name}
          </label>
        </div>
      )
    })
  }

  onCheckBoxChange = e => {
    const targetItem = _.find(this.props.allFoods, {_id: e.target.name})
    if (!targetItem) return

    const newSelectedItems = new Set(this.state.selectedItems)

    if (e.target.checked) {
      newSelectedItems.add(targetItem)
    } else {
      newSelectedItems.delete(targetItem)
    }

    this.setState({selectedItems: newSelectedItems})
  }

  generateOtherItemSelect = () => {
    const preferredItems = this.props.customer.packingList || []
    const itemsInCheckboxList = [...preferredItems, ...this.state.otherItems]
    const itemsNotInCheckBoxList = _.without(this.props.allFoods, ...itemsInCheckboxList)
    const selectBoxOptionList = _.sortBy(itemsNotInCheckBoxList, 'name').map(food => {
      // If the food is not in the scheduledFoods use a * to indicate that
      const notInScheduledFoods = this.props.scheduledFoods.find(x => x._id === food._id) ? '' : '*'
      return (<option key={food._id} value={food._id}>{notInScheduledFoods}{food.name}</option>)
    })
    return (
      <FormGroup controlId="formSelectOtherItem">
        <FormControl componentClass="select" onChange={this.onSelectedFoodChanged}>
          <option value='' selected='selected'>Select Other Food Item</option>
          {selectBoxOptionList}
        </FormControl>
        <Button onClick={this.onAddFoodClick} disabled={this.state.otherItemSelectBoxValue ? false : true}>Add Selected Food</Button>
      </FormGroup>
    )
  }

  onSelectedFoodChanged = e => {
    this.setState({otherItemSelectBoxValue: e.target.value})
  }

  /**
   * Handler for when uses clicks the button to add the selected food to the "other items" list
   */
  onAddFoodClick = () => {
    const item = _.find(this.props.allFoods, {_id: this.state.otherItemSelectBoxValue})
    if (!item) return

    const updatedOtherItems = new Set(this.state.otherItems)
    updatedOtherItems.add(item)

    this.setState({otherItems: updatedOtherItems, otherItemSelectBoxValue: undefined}, () => {
      // check the checkbox for the new item
      this.onCheckBoxChange({target: {checked: true, name: item._id}})
    })
  }

  onPackButtonClick = () => {
    // convert selectedItems set to an array of the item id's in the set
    const contents = [...this.state.selectedItems].map(item => item._id)
    const customer = this.props.customer._id
    this.props.packSelected([{customer, contents }])
  }

  render = () => {
    return (
      <Modal show={true} onHide={this.props.closeModal}>
        <div className="box">
          <Modal.Header closeButton>
            <Modal.Title>Packing List for {this.props.customer.fullName} {this.props.customer._id}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form>
              <ErrorWrapper error={this.props.packSaveError} errorBottom>
                <Well>
                  <h4>Preferred Items</h4>
                  {this.generateCheckBoxes(this.props.customer.packingList)}
                  <h4>Other Items</h4>
                  {this.generateCheckBoxes([...this.state.otherItems])}
                </Well>
                {this.generateOtherItemSelect()}
                * Indicates food items not scheduled for this week
              </ErrorWrapper>
            </form>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.props.closeModal}>Cancel</Button>
            <Button onClick={this.onPackButtonClick} disabled={this.state.selectedItems.size < 1}>
              Pack Selected
            </Button>
          </Modal.Footer>

          {this.props.saveFoodItemError &&
            <div className="alert alert-danger">{this.props.saveFoodItemError}</div>
          }
          {this.props.packSaving &&
            <div className="overlay">
              <i className="fa fa-refresh fa-spin"></i>
            </div>
          }
        </div>
      </Modal>
    )
  }

}

PackModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  customer: PropTypes.shape({
    _id: PropTypes.number.isRequired,
    fullName: PropTypes.string.isRequired,
    packingList: PropTypes.array
  }).isRequired,
  packSaveError: PropTypes.object,
  packSaving: PropTypes.bool.isRequired,
  packSelected: PropTypes.func.isRequired,
  scheduledFoods: PropTypes.array.isRequired,
  allFoods: PropTypes.array.isRequired
}

export default PackModal
