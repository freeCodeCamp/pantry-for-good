import React, { Component } from 'react'
import { connect } from 'react-redux'

import Category from './Category'
import NewCategory from './NewCategory'
import selectors from '../../../../store/selectors'
import { loadFoods, saveFood, deleteFood } from '../../reducers/category'
import { CALL_API } from '../../../../store/middleware/api'

class FoodCategories extends Component {
  componentWillMount = () => {
    this.props.loadFoods()
  }

  onItemEdit = (_id, value) => {
    let foodCategoryToUpdate = _.find(this.props.foods, {_id})

    //Don't do anything if it is the same value
    if (foodCategoryToUpdate.category === value.trim()) return

    foodCategoryToUpdate.category = value
    this.props.updateCategory(foodCategoryToUpdate)
  }

  onItemRemove = _id => {
    this.props.deleteCategory(_id)
  }

  getTableRows = () => {
    if (this.props.foods.length > 0) {
      return this.props.foods.map(category =>
        <Category key={category._id} id={category._id} category={category.category} onItemEdit={this.onItemEdit} onItemRemove={this.onItemRemove} />
      )
    } else {
      return (<tr><td className="text-center">No food categories yet.</td></tr>)
    }
  }

  createCategory = category => {
    this.props.createCategory(category.trim())
  }

  doesCategoryExist = name => {
    return this.props.foods.some(category => category.category.toLowerCase() === name.toLowerCase())
  }

  render() {
    return (
      <div className="box">
        <div className="box-header">
          <h3 className="box-title">Categories</h3>
        </div>

        <div className="box-body table-responsive no-padding">
          <table className="table table-striped table-bordered">
            <thead>
              <tr><th>Name</th></tr>
            </thead>
            <tbody>
              {this.getTableRows()}
            </tbody>
          </table>
        </div>

        <div className="box-footer">
          <NewCategory createCategory={this.createCategory} doesCategoryExist={this.doesCategoryExist}/>

          {this.props.saveFoodsError &&
            <div className="text-center text-danger">
                <strong>{this.props.saveFoodsError}</strong>
            </div>
          }
          {this.props.loadFoodsError &&
            <div className="text-center text-danger">
                <strong>{this.props.loadFoodsError}</strong>
            </div>
          }
        </div>

        {(this.props.loadingFoods || this.props.savingFoods) &&
          <div className="overlay">
            <i className="fa fa-refresh fa-spin"></i>
          </div>
        }
      </div>
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
