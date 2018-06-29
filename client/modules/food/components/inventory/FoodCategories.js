import React, { Component } from 'react'
import { connect } from 'react-redux'
import {find, sortBy} from 'lodash'

import Category from './Category'
import NewCategory from './NewCategory'
import selectors from '../../../../store/selectors'
import { loadFoods, saveFood, deleteFood } from '../../reducers/category'
import { CALL_API } from '../../../../store/middleware/api'
import { Box, BoxHeader, BoxBody } from '../../../../components/box'

export class FoodCategories extends Component {
  componentWillMount = () => {
    this.props.loadFoods()
  }

  onItemEdit = (_id, value) => {
    let foodCategoryToUpdate = find(this.props.foods, {_id})

    //Don't do anything if it is the same value
    if (foodCategoryToUpdate.category === value.trim()) return

    foodCategoryToUpdate.category = value
    this.props.updateCategory(foodCategoryToUpdate)
  }

  onItemRemove = _id => {
    this.props.deleteCategory(_id)
  }

  getTableRows = () => {
    var sorted = sortBy(this.props.foods, food => food.category.toLowerCase())

    if (!sorted.length) {
      return (<tr><td className="text-center">No food categories yet.</td></tr>)
    }

    return sorted.map(category =>
      <Category 
        key={category._id} 
        id={category._id} 
        category={category.category} 
        onItemEdit={this.onItemEdit} 
        onItemRemove={this.onItemRemove} 
      />
    )
  }

  createCategory = category => {
    this.props.createCategory(category.trim())
  }

  doesCategoryExist = name => {
    return this.props.foods.some(category => 
      category.category.toLowerCase() === name.toLowerCase())
  }

  render() {
    return (
      <Box>
        <BoxHeader heading="Categories" />
        <BoxBody
          loading={this.props.loadingFoods || this.props.savingFoods}
          error={this.props.loadFoodsError || this.props.saveFoodsError}
          errorBottom={true}>
          <table className="table table-striped table-bordered">
            <thead>
              <tr><th>Name</th></tr>
            </thead>
            <tbody>
              {this.getTableRows()}
            </tbody>
          </table>
          <div>
            <NewCategory 
              createCategory={this.createCategory} 
              doesCategoryExist={this.doesCategoryExist}
            />
          </div>
        </BoxBody>
      </Box>
    )
  }
}

const mapStateToProps = state => ({
  foods: selectors.food.category.getAll(state),
  loadingFoods: selectors.food.category.loading(state),
  loadFoodsError: selectors.food.category.loadError(state),
  savingFoods: selectors.food.category.saving(state),
  saveFoodsError: selectors.food.category.saveError(state)
})

const mapDispatchToProps = dispatch => ({
  loadFoods: () => dispatch(loadFoods()),
  createCategory: category => dispatch(saveFood({ category: category })),
  updateCategory: foodCategory => {
    let action = saveFood(foodCategory)
    //If the schema is present then callAPI will not include the complete
    //food objects in the request and it will fail. However the schema
    //is needed to process the response
    action[CALL_API].responseSchema = action[CALL_API].schema
    delete action[CALL_API].schema
    dispatch(action)
  },
  deleteCategory: id => dispatch(deleteFood(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(FoodCategories)
