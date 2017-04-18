import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table'

import { selectors } from 'store'
import { saveFoodItem, deleteFoodItem, clearFlags } from '../../food-item-reducer'

import NewFoodItem from './NewFoodItem'
import FoodItem from './FoodItem'

class FoodItems extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      editModalFood: undefined,
      modalInputFields: { name: "", categoryId: "", quantity: "" },
      validInput: false
    }
  }

  componentWillReceiveProps = nextProps => {
    // If the edit modal is open and a save is complete, close the modal
    if (this.state.showModal &&
      this.props.savingFoodItem &&
      !nextProps.savingFoodItem &&
      !nextProps.foodItemSaveError) {
      this.closeFoodAddEditModal()
    }
  }

  openFoodAddEditModal = _id => {
    if (typeof _id !== 'string') {
      // Open as an add modal
      this.setState({
        showModal: 'Add',
        editModalFood: undefined,
        modalInputFields: { name: "", categoryId: "", quantity: "" }
      })
    } else {
      // Open as an edit modal
      const food = this.props.foodItems.find(food => food._id === _id)
      this.setState({
        showModal: 'Edit',
        editModalFood: food,
        modalInputFields: {
          name: food.name,
          categoryId: food.categoryId,
          quantity: food.quantity
        }
      })
    }
  }

  closeFoodAddEditModal = () => {
    this.setState({
      showModal: false,
      editModalFood: undefined,
      modalInputFields: { name: "", categoryId: "", quantity: "" },
      validInput: false
    })
    this.props.clearFlags()
  }


  /**
   * Used by react-bootstrap-table to get the category name column values
   */
  categoryFormatter = cell => {
    const categoryObject = _.find(this.props.foodCategories, { _id: cell })
    return categoryObject.category
  }

  /**
   * Used by react-bootstrap-table to get the food item edit buttons
   */
  getEditButton = (cell, row, formatExtraData, rowIdx) => (
    <button onClick={() => { this.openFoodAddEditModal(row._id) }} className="btn btn-primary btn-flat btn-xs"><i className="fa fa-pencil"></i>Edit</button>
  )

  /**
   * Used by react-bootstrap-table to get the food item delete buttons
   */
  getDeleteButton = (cell, row, formatExtraData, rowIdx) => (
    <button
      onClick={() => { this.props.deleteFoodItem(row.categoryId, row._id) }}
      className="btn btn-danger btn-flat btn-xs">
      <i className="fa fa-trash"></i>Delete
    </button>
  )

  /**
   * Used by react-bootstrap-table to get the table header
   */
  createCustomToolBar = props => {
    return (
      <div style={{ margin: '3px 15px' }}>
        <div className='box-header' style={{ display: 'inline-block' }}>
          <h3 className='box-title'>Foods</h3>
        </div>
        <div style={{ display: 'inline-block', float: 'right', marginRight: '10px' }}>
          <Button onClick={this.openFoodAddEditModal} className='btn-success' style={{ color: 'white', width: '100px' }}>New</Button>
        </div>
        <div style={{ display: 'inline-block', float: 'right', marginRight: '10px' }}>
          {props.components.searchPanel}
        </div>
      </div>
    )
  }

  getValidationState = {
    // The following 3 functions validate the individual input fields and return the validation state used for react-bootstrap-table
    foodName: () =>
      this.state.modalInputFields.name.trim().length ? null : 'error',
    foodQuantity: () =>
      (this.state.modalInputFields.quantity !== "" && this.state.modalInputFields.quantity >= 0) ? null : 'error',
    foodCategory: () =>
      (this.state.modalInputFields.categoryId !== "") ? null : 'error',
    // This returns true or false if all fields are valid
    all: () =>
      this.getValidationState.foodName() === null &&
      this.getValidationState.foodQuantity() === null &&
      this.getValidationState.foodCategory() === null
  }

  /**
   * Re-computes the value for state.validInput
   */
  validate = () => {
    this.setState({ validInput: this.getValidationState.all() })
  }

  /**
   * functions to handle any changes of user input fields in the add/edit modal
   */
  handleChange = {
    foodName: e =>
      this.setState({ modalInputFields: { ...this.state.modalInputFields, name: e.target.value } }, this.validate),
    foodQuantity: e =>
      this.setState({ modalInputFields: { ...this.state.modalInputFields, quantity: e.target.value } }, this.validate),
    foodCategory: e =>
      this.setState({ modalInputFields: { ...this.state.modalInputFields, categoryId: e.target.value } }, this.validate)
  }

  saveFood = () => {
    if (this.state.showModal === 'Edit' && this.state.editModalFood) {
      this.props.saveFoodItem(
        this.state.editModalFood.categoryId,
        {
          ...this.state.editModalFood,
          name: this.state.modalInputFields.name,
          categoryId: this.state.modalInputFields.categoryId,
          quantity: this.state.modalInputFields.quantity
        }
      )
    } else if (this.state.showModal === 'Add') {
      this.props.saveFoodItem(
        this.state.modalInputFields.categoryId,
        {
          name: this.state.modalInputFields.name,
          categoryId: this.state.modalInputFields.categoryId,
          quantity: this.state.modalInputFields.quantity
        }
      )
    }
  }


  render = () => {
    const tableOptions = {
      toolBar: this.createCustomToolBar,
      defaultSortName: 'name',
      defaultSortOrder: 'asc'
    }
    return (
      <div className="box">

        <BootstrapTable data={this.props.foodItems} keyField='_id' options={tableOptions} striped search>
          <TableHeaderColumn dataField="name" width='33%' dataSort>Name</TableHeaderColumn>
          <TableHeaderColumn dataField="categoryId" width='33%' dataSort dataFormat={this.categoryFormatter}>Category</TableHeaderColumn>
          <TableHeaderColumn dataField="quantity" width='15%' dataSort>Qty</TableHeaderColumn>
          <TableHeaderColumn width='5%' dataAlign='center' dataFormat={this.getEditButton}></TableHeaderColumn>
          <TableHeaderColumn width='5%' dataAlign='center' dataFormat={this.getDeleteButton}></TableHeaderColumn>
        </BootstrapTable>

        <Modal show={!!this.state.showModal} onHide={this.closeFoodAddEditModal}>
          <div className="box">
            <Modal.Header closeButton>
              <Modal.Title>{this.state.showModal} Food</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <FormGroup controlId="foodName" validationState={this.getValidationState.foodName()} >
                  <ControlLabel>Food Name</ControlLabel>
                  <FormControl
                    type="text"
                    value={this.state.modalInputFields.name}
                    placeholder="Food Name"
                    onChange={this.handleChange.foodName}
                  />
                </FormGroup>

                <FormGroup controlId="foodCategory" validationState={this.getValidationState.foodCategory()}>
                  <ControlLabel>Category</ControlLabel>
                  <FormControl componentClass="select" placeholder="select category"
                    onChange={this.handleChange.foodCategory}
                    defaultValue={this.state.modalInputFields.categoryId} >
                    {(this.state.showModal === 'Add') &&
                      <option value="">Select Category</option>
                    }
                    {this.props.foodCategories.map(category =>
                      <option key={category._id} value={category._id}>{category.category}</option>
                    )}
                  </FormControl>
                </FormGroup>

                <FormGroup controlId="foodQuantity" validationState={this.getValidationState.foodQuantity()} >
                  <ControlLabel>Quantity</ControlLabel>
                  <FormControl
                    type="number"
                    min="0"
                    value={this.state.modalInputFields.quantity}
                    placeholder="Quantity"
                    onChange={this.handleChange.foodQuantity}
                  />
                </FormGroup>

              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeFoodAddEditModal}>Cancel</Button>
              <Button className={this.state.validInput && 'btn-success'} onClick={this.saveFood} disabled={!this.state.validInput || this.props.savingFoodItem}>Save</Button>
            </Modal.Footer>
            {this.props.foodItemSaveError &&
              <div className="alert alert-danger">{this.props.foodItemSaveError}</div>
            }
            {this.props.savingFoodItem &&
              <div className="overlay">
                <i className="fa fa-refresh fa-spin"></i>
              </div>
            }
          </div>
        </Modal>

        {(this.props.foodItemSaveError && !this.state.showModal) &&
          <div className="alert alert-danger">{this.props.foodItemSaveError}</div>
        }

        {(this.props.fetching || this.props.savingFoodItem) &&
          <div className="overlay">
            <i className="fa fa-refresh fa-spin"></i>
          </div>
        }
      </div>)
  }

}

const mapStateToProps = state => ({
  foodItems: selectors.getAllFoodItems(state),
  foodCategories: selectors.getAllFoods(state),
  fetching: state.foodCategory.fetching,
  savingFoodItem: state.foodItem.saving,
  foodItemSaveError: state.foodItem.saveError,
})

const mapDispatchToProps = dispatch => ({
  saveFoodItem: (categoryId, foodItem) => dispatch(saveFoodItem(categoryId, foodItem)),
  deleteFoodItem: (categoryId, _id) => dispatch(deleteFoodItem(categoryId, _id)),
  clearFlags: () => dispatch(clearFlags())
})

export default connect(mapStateToProps, mapDispatchToProps)(FoodItems)
