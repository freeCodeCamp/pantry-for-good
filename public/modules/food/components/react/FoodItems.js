import React, { Component } from 'react'

class FoodItems extends Component {

    render() {
        return (
            <div className="box" data-st-table="$ctrl.itemsCopy" data-st-safe-src="$ctrl.items">
                <div className="box-header">
                    <h3 className="box-title">Items</h3>
                    <div className="box-tools">
                        <div className="form-group has-feedback">
                            <input className="form-control" type="search" data-st-search="name" placeholder="Search" />
                            <span className="glyphicon glyphicon-search form-control-feedback"></span>
                        </div>
                    </div>
                </div>
                <div className="box-body table-responsive no-padding top-buffer">
                    <form name="itemForm" data-ng-submit="$ctrl.createItem()">
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
                                <tr>
                                    <td>
                                        <input className="form-control"
                                            type="text"
                                            data-ng-model="$ctrl.item.name"
                                            placeholder="Food Item"
                                            required />
                                    </td>
                                    <td>
                                        <select className="form-control"
                                            data-ng-options="food._id as food.category for food in $ctrl.foods"
                                            data-ng-model="$ctrl.item.categoryId"
                                            required>
                                            <option value="">Select category</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input className="form-control"
                                            type="number" min="0"
                                            data-ng-model="$ctrl.item.quantity"
                                            placeholder="Quantity" />
                                    </td>
                                    <td>
                                        <button className="btn btn-success btn-flat" type="submit" data-ng-disabled="itemForm.$invalid">
                                            <i className="fa fa-plus"></i> Add Item
                          </button>
                                    </td>
                                </tr>
                                <tr data-ng-repeat="item in $ctrl.itemsCopy">
                                    <td data-ng-hide="item.showEdit"><span data-ng-bind="item.name"></span></td>
                                    <td data-ng-hide="item.showEdit"><span data-ng-bind="item.categoryName"></span></td>
                                    <td data-ng-hide="item.showEdit"><span data-ng-bind="item.quantity"></span></td>
                                    <td data-ng-show="item.showEdit">
                                        <input className="form-control"
                                            type="text"
                                            data-ng-model="item.name" />
                                    </td>
                                    <td data-ng-show="item.showEdit">
                                        <select className="form-control"
                                            data-ng-options="food._id as food.category for food in $ctrl.foods"
                                            data-ng-model="item.categoryId">
                                        </select>
                                    </td>
                                    <td data-ng-show="item.showEdit">
                                        <input className="form-control"
                                            type="number"
                                            min="0"
                                            data-ng-model="item.quantity" />
                                    </td>
                                    <td>
                                        <a data-ng-hide="item.showEdit" data-ng-click="item.showEdit = true" className="btn btn-primary btn-flat btn-xs"><i className="fa fa-pencil"></i> Edit</a>
                                        <a data-ng-show="item.showEdit" data-ng-click="$ctrl.updateItem(item)" className="btn btn-success btn-flat btn-xs"><i className="fa fa-download"></i> Save</a>
                                        <a data-ng-show="item.showEdit" data-ng-click="$ctrl.removeItem(item)" className="btn btn-danger btn-flat btn-xs"><i className="fa fa-trash"></i> Delete</a>
                                        <a data-ng-show="item.showEdit" data-ng-click="$ctrl.find(); item.showEdit = false" className="btn btn-primary btn-flat btn-xs"><i className="fa fa-times"></i> Cancel</a>
                                    </td>
                                </tr>
                                <tr data-ng-if="!$ctrl.items.length">
                                    <td className="text-center" colSpan="4">No food items yet.</td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                <div className="overlay" data-ng-show="$ctrl.isLoading">
                    <i className="fa fa-refresh fa-spin"></i>
                </div>
            </div>
        )
    }
}

export default FoodItems
