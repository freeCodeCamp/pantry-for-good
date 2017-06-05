import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Autosuggest from 'react-bootstrap-autosuggest'

import selectors from '../../../../store/selectors'
import { saveFoodItem, deleteFoodItem, clearFlags } from '../../reducers/item'

class FoodItems extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // showModal can be false, "Add" or "Edit"
      showModal: false,
      // editModalFood is the food being edited in the edit modal
      editModalFood: undefined,
      modalInputFields: { name: "", categoryId: "", quantity: "" },
      validInput: false,
      searchText: ""
    }
  }

  componentWillReceiveProps = nextProps => {
    // If the modal is open and a save is complete, close the modal
    if (this.state.showModal &&
        this.props.savingFoodItem &&
        !nextProps.savingFoodItem &&
        !nextProps.foodItemSaveError) {
      this.closeModal()
    }
  }

  openModal = _id => () => {
    if (typeof _id !== 'string') {
      // Open the modal in 'add' mode
      this.setState({
        showModal: 'Add',
        editModalFood: undefined,
        modalInputFields: { name: "", categoryId: "", quantity: "" }
      })
    } else {
      // Open the modal in 'edit' mode
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

  closeModal = () => {
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
   * Used by react-bootstrap-table to get the action buttons
   */
  getActionButtons = (cell, row) =>
    <div>
      <Button onClick={this.openModal(row._id)} bsStyle="primary" bsSize="xs">
        <i className="fa fa-pencil" style={{marginRight: '8px'}} />Edit
      </Button>
      {' '}
      <Button
        onClick={this.props.deleteFoodItem(row.categoryId, row._id)}
        bsStyle="danger" bsSize="xs">
        <i className="fa fa-trash" style={{marginRight: '8px'}} />Delete
      </Button>
    </div>

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
          <Button onClick={this.openModal()} className='btn-success' disabled={this.props.foodCategories.length === 0} style={{ color: 'white', width: '200px' }}>Add to Inventory</Button>
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
    foodName: value => {
      if (typeof value === 'string') {
        // The user entered a food name that does not exist yet
        this.setState({ modalInputFields: { ...this.state.modalInputFields, name: value, categoryId:"" } }, this.validate)
      } else {
        // The user entered an existing food name and autosuggest provided the object for that food
        this.setState({ modalInputFields: { ...this.state.modalInputFields,
          name: value ? value.name : "",
          categoryId: value ? value.categoryId : ""
        } }, this.validate)
      }
    },
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

  updateSearchText = searchText => {
    if (searchText && searchText !== this.state.searchText) {
      this.setState({searchText})
    }
  }

  render = () => {
    // set options for react-bootstrap-table
    const tableOptions = {
      // toolBar specifies the function to create the table header
      toolBar: this.createCustomToolBar,
      defaultSortName: 'name',
      defaultSortOrder: 'asc',
      noDataText: (this.props.foodCategories.length === 0)
        ? 'No foods in inventory. Add a category prior to adding a food'
        : 'No foods in inventory matching ' + this.state.searchText,
      // afterSearch specifies a function to call when the user changes the search box text
      afterSearch: searchText => this.updateSearchText(searchText)
    }
    return (
      <div className="box">

        <BootstrapTable data={this.props.foodItems} pagination keyField='_id' options={tableOptions} striped search>
          <TableHeaderColumn dataField="name" dataSort>Name</TableHeaderColumn>
          <TableHeaderColumn dataField="categoryId" dataSort dataFormat={this.categoryFormatter}>Category</TableHeaderColumn>
          <TableHeaderColumn dataField="quantity" width='70px' dataAlign="right" dataSort>Qty</TableHeaderColumn>
          <TableHeaderColumn width="140px" dataAlign="center" dataFormat={this.getActionButtons}></TableHeaderColumn>
        </BootstrapTable>

        <Modal show={!!this.state.showModal} onHide={this.closeModal}>
          <div className="box">
            <Modal.Header closeButton>
              <Modal.Title>{this.state.showModal} Food</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <FormGroup controlId="foodName" validationState={this.getValidationState.foodName()} >
                  <ControlLabel>Food Name</ControlLabel>
                  <Autosuggest
                    value={this.state.modalInputFields.name}
                    datalist={this.props.foodItems}
                    placeholder="Food Name"
                    itemValuePropName='name'
                    itemReactKeyPropName='name'
                    itemSortKeyPropName='nameLowerCased'
                    onSelect={this.handleChange.foodName}
                  />
                </FormGroup>

                <FormGroup controlId="foodCategory" validationState={this.getValidationState.foodCategory()}>
                  <ControlLabel>Category</ControlLabel>
                  <FormControl componentClass="select" placeholder="select category"
                    onChange={this.handleChange.foodCategory}
                    value={this.state.modalInputFields.categoryId} >
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
              <Button onClick={this.closeModal}>Cancel</Button>
              <Button className={this.state.validInput && 'btn-success'}
                      onClick={this.saveFood}
                      disabled={!this.state.validInput || this.props.savingFoodItem}>
                        {this.state.showModal === 'Add' ? 'Add' : 'Update'}
              </Button>
            </Modal.Footer>
            {this.props.saveFoodItemError &&
              <div className="alert alert-danger">{this.props.saveFoodItemError}</div>
            }
            {this.props.savingFoodItem &&
              <div className="overlay">
                <i className="fa fa-refresh fa-spin"></i>
              </div>
            }
          </div>
        </Modal>

        {(this.props.saveFoodItemError && !this.state.showModal) &&
          <div className="alert alert-danger">{this.props.saveFoodItemError}</div>
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
  // Add a nameLowerCased property with the name in lower case to use for sorting in autosuggest
  foodItems: selectors.food.item.getAll(state).map(item =>
    ({...item, nameLowerCased: item.name.toLowerCase()})),
  foodCategories: selectors.food.category.getAll(state),
  loading: selectors.food.category.loading(state),
  savingFoodItem: selectors.food.item.saving(state),
  saveFoodItemError: selectors.food.item.saveError(state),
})

const mapDispatchToProps = dispatch => ({
  saveFoodItem: (categoryId, foodItem) => dispatch(saveFoodItem(categoryId, foodItem)),
  deleteFoodItem: (categoryId, _id) => () => dispatch(deleteFoodItem(categoryId, _id)),
  clearFlags: () => dispatch(clearFlags())
})

export default connect(mapStateToProps, mapDispatchToProps)(FoodItems)
