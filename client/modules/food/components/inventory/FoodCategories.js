import React, { Component } from 'react'
import { connect } from 'react-redux'
import NewCategory from './NewCategory'
import { selectors } from 'store'
import { loadFoods, saveFood, deleteFood } from '../../food-category-reducer'
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
      return this.props.foods.map(category => (
                <ListItem key={category._id} id={category._id} category={category.category} onItemEdit={this.onItemEdit} onItemRemove={this.onItemRemove} />
            ))
    } else {
      return (<tr><td className="text-center">No food categories yet.</td></tr>)
    }
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
                    <NewCategory createCategory={this.props.createCategory} />

                    {this.props.foodCategory.saveError &&
                        <div className="text-center text-danger">
                            <strong>{this.props.foodCategory.saveError}</strong>
                        </div>
                    }
                    {this.props.foodCategory.fetchError &&
                        <div className="text-center text-danger">
                            <strong>{this.props.foodCategory.fetchError}</strong>
                        </div>
                    }
                </div>

                {(this.props.foodCategory.fetching || this.props.foodCategory.saving) &&
                    <div className="overlay">
                        <i className="fa fa-refresh fa-spin"></i>
                    </div>
                }

            </div>

    )
  }
}

const mapStateToProps = state => ({
  foods: selectors.getAllFoods(state),
  foodCategory: state.foodCategory
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


class ListItem extends Component {
  constructor(props) {
    super(props)
    this.state = { showEdit: false, editedName: this.props.category }
  }

  render = () => {
    if (this.state.showEdit) {
      return (
                <tr>
                    <td>
                        <div className="input-group">
                            <input type="text" className="form-control" value={this.state.editedName} onChange={e => this.onChange(e)} required />
                            <span className="input-group-btn">
                                <button className="btn btn-success btn-flat" onClick={() => this.onClickSubmitEdit()} disabled={this.state.editedName.trim() === ""}>
                                    <i className="fa fa-check"></i>
                                </button>
                            </span>
                        </div>
                    </td>
                </tr>
      )
    } else {
      return (
                <tr>
                    <td>
                        <span>{this.props.category}</span>
                        <div className="tools">
                            <i className="fa fa-edit text-blue" onClick={() => this.onClickShowEdit()}></i>
                            <i className="fa fa-trash-o text-red" onClick={() => this.onClickRemove()}></i>
                        </div>
                    </td>
                </tr>
      )
    }
  }

  onChange = e => {
    this.setState({ editedName: e.target.value })
  }

  onClickShowEdit = () => {
    this.setState({ showEdit: true })
  }

  onClickSubmitEdit = e => {
    this.setState({ showEdit: false })
    this.props.onItemEdit(this.props.id, this.state.editedName)
  }

  onClickRemove = () => {
    this.props.onItemRemove(this.props.id)
  }
}
