import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn, SizePerPageDropDown } from 'react-bootstrap-table'
import _ from 'lodash'

import selectors from '../../../../store/selectors'
import { saveFoodItem, deleteFoodItem, clearFlags } from '../../reducers/item'
import { Box, BoxBody } from '../../../../components/box'
import { showConfirmDialog, hideDialog } from '../../../core/reducers/dialog'
import FoodAddEditForm from './FoodAddEditForm'

export class FoodItems extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // When modalType is "Add" or "Edit" the addEdit modal is shown
      modalType: undefined,
      // editModalFood is the food being edited when the modalType is edit
      editModalFood: undefined,
      searchText: ""
    }
  }

  /**
   * Show the modal to add or edit a food.  If _id is provided the modal shows the form
   * to edit that food.  Otherwise it shows the form to add a new food.
   */
  openModal = _id => () => {
    if (_id) {
      // Open the modal in 'edit' mode
      const food = this.props.foodItems.find(food => food._id === _id)
      this.setState({
        modalType: 'Edit',
        editModalFood: food
      })
    } else {
      // Open the modal in 'add' mode
      this.setState({
        modalType: 'Add',
        editModalFood: undefined
      })
    }
    this.props.clearFlags()
  }

  closeModal = () => {
    this.setState({
      modalType: undefined,
      editModalFood: undefined,
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
   * Used by react-bootstrap-table to get the Edit and Delete buttons for a row
   */
  getActionButtons = (cell, row) =>
    <div>
      <Button onClick={this.openModal(row._id)} bsStyle="primary" bsSize="xs">
        <i className="fa fa-pencil" style={{ marginRight: '8px' }} />Edit
      </Button>
      {' '}
      <Button
        onClick={() => this.props.showConfirmDialog(
          this.props.hideDialog,
          () => {
            this.props.deleteFoodItem(row.categoryId, row._id)
            this.props.hideDialog()
          },
          'Any deleted fields will be permanently lost',
          'Delete Item'
        )}
        bsStyle="danger" bsSize="xs">
        <i className="fa fa-trash" style={{ marginRight: '8px' }} />Delete
      </Button>
    </div>

  /**
   * Used by react-bootstrap-table to get the table header
   */
  createCustomToolBar = props =>
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


  updateSearchText = searchText => {
    if (searchText && searchText !== this.state.searchText) {
      this.setState({ searchText })
    }
  }

  renderSizePerPageDropDown = () => <SizePerPageDropDown variation='dropup' />

  render = () => {
    // set options for react-bootstrap-table
    const tableOptions = {
      // toolBar specifies the function to create the table header
      toolBar: this.createCustomToolBar,
      defaultSortName: 'name',
      defaultSortOrder: 'asc',
      sizePerPageDropDown: this.renderSizePerPageDropDown,
      noDataText: (this.props.foodCategories.length === 0)
        ? 'No foods in inventory. Add a category prior to adding a food'
        : 'No foods in inventory matching ' + this.state.searchText,
      // afterSearch specifies a function to call when the user changes the search box text
      afterSearch: searchText => this.updateSearchText(searchText)
    }
    return (
      <Box>
        <BoxBody
          // Don't show loading spinner or error message on main page when modal is showing
          loading={this.state.modalType ? undefined : (this.props.loading || this.props.saving)}
          error={this.state.modalType ? undefined : (this.props.loadError || this.props.saveError)}
          errorBottom={true}>
          <BootstrapTable data={this.props.foodItems} pagination keyField='_id' options={tableOptions} striped search>
            <TableHeaderColumn dataField="name" dataSort>Name</TableHeaderColumn>
            <TableHeaderColumn dataField="categoryId" dataSort dataFormat={this.categoryFormatter}>Category</TableHeaderColumn>
            <TableHeaderColumn dataField="quantity" width='70px' dataAlign="right" dataSort>Qty</TableHeaderColumn>
            <TableHeaderColumn width="140px" dataAlign="center" dataFormat={this.getActionButtons}></TableHeaderColumn>
          </BootstrapTable>
        </BoxBody>
        <Modal show={!!this.state.modalType} onHide={this.closeModal}>
          <FoodAddEditForm
            foodItems={this.props.foodItems}
            foodCategories={this.props.foodCategories}
            loading={this.props.loading}
            saving={this.props.saving}
            saveError={this.props.saveError}
            saveFoodItem={this.props.saveFoodItem}
            formType={this.state.modalType}
            editFood={this.state.editModalFood}
            closeModal={this.closeModal}
          />
        </Modal>
      </Box>
    )
  }
}

const mapStateToProps = state => ({
  // Add a nameLowerCased property with the name in lower case to use for sorting in autosuggest
  foodItems: selectors.food.item.getAll(state).map(item =>
    ({ ...item, nameLowerCased: item.name.toLowerCase() })),
  foodCategories: selectors.food.category.getAll(state),
  loading: selectors.food.category.loading(state),
  loadError: selectors.food.category.loadError(state),
  saving: selectors.food.item.saving(state),
  saveError: selectors.food.item.saveError(state),
})

const mapDispatchToProps = dispatch => ({
  saveFoodItem: (categoryId, foodItem) => dispatch(saveFoodItem(categoryId, foodItem)),
  deleteFoodItem: (categoryId, _id) => dispatch(deleteFoodItem(categoryId, _id)),
  clearFlags: () => dispatch(clearFlags()),
  hideDialog: () => dispatch(hideDialog()),
  showConfirmDialog: (cancel, confirm, message, label) =>
    dispatch(showConfirmDialog(cancel, confirm, message, label)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FoodItems)
