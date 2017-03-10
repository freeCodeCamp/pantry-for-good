import angular from 'angular';
import {stateGo} from 'redux-ui-router';

import {selectors} from '../../../store';
import {loadFoods} from '../../../store/food-category';
import {saveFoodItem} from '../../../store/food-item';

const mapStateToThis = state => ({
	foodItems: selectors.getAllFoodItems(state),
  foodCategories: selectors.getAllFoods(state),
  loadingFoods: selectors.loadingFoods(state),
  loadFoodsError: selectors.loadFoodsError(state)
});

const mapDispatchToThis = dispatch => ({
  loadFoods: () => dispatch(loadFoods()),
  _saveFood: (categoryId, foodItem) => dispatch(saveFoodItem(categoryId, foodItem)),
	push: (route, params, options) => dispatch(stateGo(route, params, options))
});


export default angular.module('schedule')
  .component('schedules', {
    controller: function($ngRedux) {
      this.$onInit = () => {
        this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
        this.foodItemsModel = [];
        this.loadFoods();
      };

      this.$doCheck = () => {
        if (!this.loadingFoods)
          this.foodItemsModel = this.foodItems;
      };

      this.saveFood = food => {
        console.log('food', food);
        const categoryId = this.foodCategories.find(cat =>
          cat.items.find(item => item._id === food._id)
        )._id;
        console.log('categoryId', categoryId)

        this._saveFood(categoryId, food);
      };

      this.$onDestroy = () => this.unsubscribe();
    },
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header">
        <h1>Food Schedule</h1>
      </section>
      <!-- Main content -->
      <section class="content">
        <div class="row">
          <div class="col-xs-12">
            <div class="box" st-table="$ctrl.foodItemsModel" st-safe-src="$ctrl.foodItems">
              <!-- Box header -->
              <div class="box-header">
                <h3 class="box-title">Items</h3>
                <div class="box-tools">
                  <div class="form-group has-feedback">
                    <input class="form-control" type="search" st-search="name" placeholder="Search">
                    <span class="glyphicon glyphicon-search form-control-feedback"></span>
                  </div>
                </div>
              </div><!-- /.box-header -->
              <!-- Box body -->
              <div class="box-body table-responsive no-padding top-buffer">
                <!-- Table -->
                <table class="table table-striped table-bordered">
                  <!-- Table columns-->
                  <thead>
                    <tr>
                      <th st-sort="name">Name</th>
                      <th>Start date</th>
                      <th st-sort="frequency">Frequency (in weeks)</th>
                      <th>Actions</th>
                    </tr>
                  </thead><!-- /.table-columns -->
                  <!-- Table body -->
                  <tbody>
                    <tr data-ng-repeat="item in $ctrl.foodItemsModel">
                      <td><span data-ng-bind="item.name"></span></td>
                      <td data-ng-hide="item.showEdit"><span data-ng-bind="item.startDate | date : 'yyyy-Www'"></span></td>
                      <td data-ng-hide="item.showEdit"><span data-ng-bind="item.frequency"></span></td>
                      <td data-ng-show="item.showEdit">
                        <input class="form-control"
                              type="week" data-ng-model="item.startDate"
                              required>
                      </td>
                      <td data-ng-show="item.showEdit">
                        <input class="form-control"
                              type="number"
                              min="0"
                              max="52"
                              data-ng-model="item.frequency"
                              required>
                      </td>
                      <td>
                        <a data-ng-hide="item.showEdit" data-ng-click="item.showEdit = true" class="btn btn-primary btn-flat btn-xs">
                          <i class="fa fa-pencil"></i> Edit
                        </a>
                        <a data-ng-show="item.showEdit" data-ng-click="console.log(item); $ctrl.saveFood(item)" class="btn btn-success btn-flat btn-xs">
                          <i class="fa fa-download"></i> Save
                        </a>
                        <a data-ng-show="item.showEdit" data-ng-click="$ctrl.loadFoods(); item.showEdit=false" class="btn btn-primary btn-flat btn-xs">
                          <i class="fa fa-times"></i> Cancel
                        </a>
                      </td>
                    </tr>
                    <tr data-ng-if="!$ctrl.foodItems.length">
                      <td class="text-center" colspan="4">No food items yet.</td>
                    </tr>
                  </tbody><!-- /.table-body -->
                </table><!-- /.table -->
              </div><!-- /.box-body -->
              <div class="overlay" ng-show="$ctrl.loadingFoods">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
            </div><!-- /.box -->
          </div><!-- /.col -->
        </div><!-- /.row -->
        <div data-ng-show="$ctrl.loadFoodsError" class="text-danger">
          <strong data-ng-bind="$ctrl.loadFoodsError"></strong>
        </div>
      </section><!-- /.content -->
    `
  })
  .name;
