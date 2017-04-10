import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'store'
import { saveFoodItem, deleteFoodItem } from '../../food-item-reducer'

import NewFoodItem from './NewFoodItem'
import FoodItem from './FoodItem'

class FoodItems extends React.Component {

  getTableRows = () => {
    if (this.props.foodItems.length > 0) {
      return this.props.foodItems.map(foodItem => (
                <FoodItem key={foodItem._id} foodItem={foodItem}
                    foodCategories={this.props.foodCategories}
                    createSelectBox={this.createSelectBox}
                    deleteItem={this.props.deleteFoodItem}
                    saveItem={this.props.saveFoodItem} />
            ))
    } else {
      return (
                <tr>
                    <td className="text-center" colSpan="4">No food items yet.</td>
                </tr>)
    }
  }

    /**
     * Creates a select option box input for choosing a category
     * @param {Function} onChangeCallback callback function when the select option is changed
     * @param {String} selectedValue _id for the category to be selected by default
     */
  createSelectBox = (onChangeCallback, selectedValue) => {
    let options
    if (this.props.foodCategories.length > 0) {
      options = this.props.foodCategories.map(category =>
                <option key={category._id} value={category._id}>{category.category}</option>
            )
    }

    return (<select className="form-control"
                        onChange={e => onChangeCallback(e)}
                        defaultValue={selectedValue || ""} >
            <option value="">Select category</option>
            {options}
        </select>
    )
  }

  render = () => {
    let $ctrl = this.getCtrl()
    return (
            <div className="box" data-st-table="$ctrl.itemsCopy" data-st-safe-src="$ctrl.items">
                {/*<div className="box-header">
                    <h3 className="box-title">Items</h3>
                    <div className="box-tools">
                        <div className="form-group has-feedback">
                            <input className="form-control" type="search" data-st-search="name" placeholder="Search" />
                            <span className="glyphicon glyphicon-search form-control-feedback"></span>
                        </div>
                    </div>
                </div>*/}

                <div className="box-body table-responsive no-padding top-buffer">
                    {/*<form name="itemForm" data-ng-submit="$ctrl.createItem()">*/}
                        <table className="table table-bordered table-striped" data-datatable='ng' data-dt-options="$ctrl.dtOptions">
                            <thead>
                                <tr>
                                    <th data-st-sort="name">Food Item</th>
                                    <th data-st-sort="category">Food Category</th>
                                    <th data-st-sort="quantity">Quantity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <NewFoodItem
                                    saveFoodItem={this.props.saveFoodItem}
                                    createSelectBox={this.createSelectBox} />
                                {this.getTableRows()}
                            </tbody>
                        </table>
                    {/*</form>*/}
                </div>
                {this.props.error &&
                    <div className="alert alert-danger">{this.props.error}</div>
                }
                {this.props.isLoading &&
                    <div className="overlay" data-ng-show="$ctrl.isLoading">
                        <i className="fa fa-refresh fa-spin"></i>
                    </div>
                }
            </div>
    )
  }

  getCtrl = () => ({
    dtOptions: {
      dom: 'Tlrtip',
      tableTools: {
        sSwfPath: '/lib/datatables-tabletools/swf/copy_csv_xls.swf',
        aButtons: [
          "copy",
          {
            "sExtends":    "collection",
            "sButtonText": "Save",
            "aButtons":    [ {
              "sExtends": "csv",
              "sButtonText": "CSV",
              "mColumns": [ 0, 1, 2 ],
              "bSelectedOnly": true,
              "sFileName": 'report.csv'
            }, {
              "sExtends": "xls",
              "sButtonText": "Excel",
              "mColumns": [ 0, 1, 2 ],
              "bSelectedOnly": true,
              "sFileName": 'report.xls'
            }]
          }
        ]
      }
    },
    items: [
            //array of foods in all categories
      {
        hashkey: 0,
        _id: 0,
        categoryId: 0,
        categoryIdOld: 0,
        categoryName: 0,
        frequency: 0,
        name: 0,
        quantity: 0
      }
    ],
    itemsCopy: [], //'copy of items',
    foods: [  //array of categories
      {
        $$hashkey: 0,
        __v: 0,
        _id: 0,
        category: "r",
        items: []  //Array of items in that category
      }
    ],
    isLoading: false
  })
}

const mapStateToProps = state => {
  return {
    foodItems: selectors.getAllFoodItems(state),
    foodCategories: selectors.getAllFoods(state),
    isLoading: selectors.loadingFoods(state),
    error: state.foodItem.saveError
  }
}

const mapDispatchToProps = dispatch => ({
  saveFoodItem: (categoryId, foodItem) => {
    dispatch(saveFoodItem(categoryId, foodItem))
  },
  deleteFoodItem: (categoryId, _id) => {
    dispatch(deleteFoodItem(categoryId, _id))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(FoodItems)
