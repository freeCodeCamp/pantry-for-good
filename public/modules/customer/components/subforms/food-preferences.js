import angular from 'angular';

export default angular.module('customer')
  .component('foodPreferences', {
    bindings: {
      customer: '=?',
      foodList: '=',
      foodIsChecked: '&',
      toggleSelection: '&',
      selectAll: '&'
    },
    template: `
      <!-- Box -->
      <div class="box box-solid box-primary">
        <!-- Box header -->
        <div class="box-header">
          <h3 class="box-title">SECTION C - FOOD PREFERENCES</h3>
        </div><!-- /.box-header-->
        <!-- Box body -->
        <div class="box-body">
          <div class="row">
            <div class="col-xs-12">
              <div class="form-group">
                <label>Food Preferences (check all that apply)</label>
                <label class="checkbox-inline">
                  <input type="checkbox"
                        data-ng-model="$ctrl.toggle"
                        data-ng-click="$ctrl.selectAll({toggle: !$ctrl.toggle})">Select All
                </label>
                <div>
                  <label class="checkbox-inline" ng-repeat="food in $ctrl.foodList">
                    <input type="checkbox"
                          name="selectedFood"
                          value="{{food.name}}"
                          data-ng-checked="$ctrl.foodIsChecked({food: food})"
                          data-ng-click="$ctrl.toggleSelection({food: food})">{{food.name}}
                  </label>
                </div>
              </div>
            </div>
            <div class="clearfix"></div>
            <div class="col-md-6 col-lg-4">
              <div class="form-group">
                <label>Please list other preferences, separated by a comma</label>
                <textarea class="form-control"
                          name="other-food-preferences"
                          id="other"
                          data-ng-minlength="1"
                          data-ng-maxlength="200"
                          data-ng-model="$ctrl.customer.foodPreferencesOther">
                </textarea>
              </div>
            </div>
          </div>
        </div><!-- /.box-body -->
      </div><!-- /.box -->
    `
  })
  .name;
