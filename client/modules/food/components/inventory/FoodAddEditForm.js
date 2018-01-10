import React from 'react'
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import Autosuggest from 'react-bootstrap-autosuggest'

import { Box, BoxHeader, BoxBody } from '../../../../components/box'

export default class FoodAddEditForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formInputFields: {
        name: this.props.editFood ? this.props.editFood.name : "",
        categoryId: this.props.editFood ? this.props.editFood.categoryId : "",
        quantity: this.props.editFood ? this.props.editFood.quantity : ""
      },
      validInput: false,
      //touched input fields
      touched: { foodName: false, foodCategory: false, foodQuantity: false },
    }
  }

  componentWillReceiveProps = nextProps => {
    // If the modal is open and a save is complete, close the modal
    if (this.props.saving && !nextProps.saving && !nextProps.saveError) {
      this.props.closeModal()
    }
  }

  getValidationState = {
    // The following 3 functions validate the individual input fields and return the validation state used for react-bootstrap-table
    foodName: () =>
      !this.state.touched.foodName || this.state.formInputFields.name.trim().length ? null : 'error',
    foodQuantity: () =>
      !this.state.touched.foodQuantity || (this.state.formInputFields.quantity !== "" && this.state.formInputFields.quantity >= 0) ? null : 'error',
    foodCategory: () =>
      !this.state.touched.foodCategory || (this.state.formInputFields.categoryId !== "") ? null : 'error',
    // This returns true or false if all fields are valid
    all: () =>
      this.state.formInputFields.name.trim().length > 0 &&
      this.state.formInputFields.quantity !== "" &&
      this.state.formInputFields.quantity >= 0 &&
      this.state.formInputFields.categoryId !== ""
  }

  /**
   * Re-computes the value for state.validInput
   */
  validate = () => {
    this.setState({ validInput: this.getValidationState.all() && this.checkChanged() })
  }

  /**
   *  check whether newly edited values are different from the inital values
   */
  checkChanged = () => {
    const initialformInputFields = {
      name: this.props.editFood ? this.props.editFood.name : "",
      categoryId: this.props.editFood ? this.props.editFood.categoryId : "",
      quantity: this.props.editFood ? this.props.editFood.quantity : ""
    }
    return Object.keys(this.state.formInputFields).map(key =>
      initialformInputFields[key] !== this.state.formInputFields[key]
    ).reduce((acc, x) => acc || x, false)
  }

  /**
   * functions to handle any changes of user input fields in the add/edit form
   */
  handleChange = {
    foodName: value => {
      if (typeof value === 'object' && value !== null) {
        // The user entered an existing food name and autosuggest provided the object for that food
        this.setState({
          formInputFields: {
            ...this.state.formInputFields,
            name: value.name,
            categoryId: value.categoryId
          },
          touched: { ...this.state.touched, foodName: true }
        })
      } else {
        // The user entered a food name that was not found by autosuggest
        this.setState({
          formInputFields: {
            ...this.state.formInputFields,
            name: value || ""
          },
          touched: { ...this.state.touched, foodName: true }
        }, this.validate)
      }
    },
    foodQuantity: e =>
      this.setState({
        formInputFields: { ...this.state.formInputFields, quantity: e.target.value },
        touched: { ...this.state.touched, foodQuantity: true }
      }, this.validate),
    foodCategory: e =>
      this.setState({
        formInputFields: { ...this.state.formInputFields, categoryId: e.target.value },
        touched: { ...this.state.touched, foodCategory: true }
      }, this.validate)
  }

  saveFood = () => {
    if (this.props.editFood) {
      this.props.saveFoodItem(
        this.props.editFood.categoryId,
        {
          ...this.props.editFood,
          name: this.state.formInputFields.name,
          categoryId: this.state.formInputFields.categoryId,
          quantity: this.state.formInputFields.quantity
        }
      )
    } else if (this.props.formType === 'Add') {
      this.props.saveFoodItem(
        this.state.formInputFields.categoryId,
        {
          name: this.state.formInputFields.name,
          categoryId: this.state.formInputFields.categoryId,
          quantity: this.state.formInputFields.quantity
        }
      )
    }
  }

  render = () => {
    return (
      <Box>
        <BoxHeader>
          {this.props.formType} Food
        </BoxHeader>
        <BoxBody
          loading={this.props.loading || this.props.saving}
          error={this.props.saveError}
          errorBottom={true}>
          <form>

            <FormGroup controlId="foodName" validationState={this.getValidationState.foodName()} >
              <ControlLabel>Food Name</ControlLabel>
              <Autosuggest
                value={this.state.formInputFields.name}
                datalist={this.props.foodItems}
                placeholder="Food Name"
                itemValuePropName='name'
                itemReactKeyPropName='name'
                itemSortKeyPropName='nameLowerCased'
                onSelect={this.handleChange.foodName}
                autoFocus={this.props.formType === 'Add'}
              />
            </FormGroup>

            <FormGroup controlId="foodCategory" validationState={this.getValidationState.foodCategory()}>
              <ControlLabel>Category</ControlLabel>
              <FormControl componentClass="select" placeholder="select category"
                onChange={this.handleChange.foodCategory}
                value={this.state.formInputFields.categoryId}
              >
                {(this.props.formType === 'Add') &&
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
                value={this.state.formInputFields.quantity}
                placeholder="Quantity"
                onChange={this.handleChange.foodQuantity}
                inputRef={ref => { this.quantityFormControl = ref }}
              />
            </FormGroup>
          </form>
          <div className="pull-right btn-toolbar">
            <Button onClick={this.props.closeModal}>Cancel</Button>
            <Button className={this.state.validInput && 'btn-success'}
              onClick={this.saveFood}
              disabled={!this.state.validInput || this.props.saving}>
              {this.props.formType === 'Add' ? 'Add' : 'Update'}
            </Button>
          </div>
        </BoxBody>
      </Box>
    )
  }
}
