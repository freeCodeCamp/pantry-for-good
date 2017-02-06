import angular from 'angular';

export default angular.module('core')
  .component('dynamicForm', {
    bindings: {
      sectionNames: '=',
      dynForm: '=',
      dynType: '=',
      foodList: '=',
      isChecked: '&',
      handleCheckbox: '&',
      foodIsChecked: '&',
      toggleFoodSelection: '&'
    },
    template: `
      <!-- Sections -->
      <div ng-repeat="section in $ctrl.dynForm track by $index" class="clearfix">
        <!-- Box -->
        <div class="box box-solid box-primary">
          <!-- Box header -->
          <div class="box-header">
            <h3 class="box-title">SECTION {{$ctrl.sectionNames[$index] | uppercase}}</h3>
          </div> <!-- box-header-->
            <!-- Box body -->
            <div class="box-body">

              <!-- Rows -->
              <div ng-repeat="row in section track by $index">
                <!-- Table Row -->
                <div ng-if="row.tableHeaders">
                  <table class="table table-condensed table-hover">
                    <tr class="info">
                      <th ng-repeat="tableHeader in row.tableHeaders">{{tableHeader}}</th>
                    </tr>
                    <tr ng-repeat="tableRow in $ctrl.dynType[row.tableName]">
                      <td>{{tableRow.name}}</td>
                      <td ng-repeat="(tableCell, value) in tableRow" ng-if="tableCell !== 'name'">
                        <input type="number"
                                min="0"
                                data-ng-model="tableRow[tableCell]"
                                class="form-control">
                      </td>
                    </tr>
                  </table>
                </div> <!-- Table Row -->

                <!-- Standard Row -->
                <div ng-if="!row.tableHeaders" class="row">
                  <div ng-repeat="cell in row track by $index">
                    <!-- Make room for cell if empty or span ??? -->
                    <div ng-show="cell.status == 'invalid' || cell.span > 0" class="col-xs-{{3*cell.span || 3}}">
                      <div ng-hide="cell.status == 'invalid'">

                        <div class="form-group">
                          <label>{{cell.label}}</label>

                          <!-- Normal text input -->
                          <input ng-if="cell.type == 'Text'" class="form-control" type="text" ng-model="$ctrl.dynType[cell.name]" placeholder="{{cell.label}}">

                          <!-- Textarea input -->
                          <textarea ng-if="cell.type == 'Textarea'" class="form-control" ng-model="$ctrl.dynType[cell.name]" placeholder="{{cell.label}}"></textarea>

                          <!-- Date input -->
                          <input ng-if="cell.type == 'Date'" class="form-control" type="date" ng-model="$ctrl.dynType[cell.name]">

                          <!-- Radio buttons -->
                          <div ng-if="cell.type == 'Radio Buttons'">
                            <div ng-repeat="choice in cell.choices.split(',')" {{cell.choices}} <label class="radio-inline">
                              <input name="{{cell.name}}" type="radio" ng-model="$ctrl.dynType[cell.name]" value="{{choice.trim()}}"> {{choice.trim()}}
                              </label>
                            </div> <!-- Repeat choices -->
                          </div> <!-- Radio buttons -->

                          <!-- Checkboxes -->
                          <div ng-if="cell.type == 'Checkboxes'">
                            <span ng-repeat="choice in cell.choices.split(',')">
                              <label class="checkbox-inline">
                                <input name="{{cell.name}}" type="checkbox" value="{{choice.trim()}}"
                                  ng-checked="$ctrl.isChecked({dynType: $ctrl.dynType, cellName: cell.name, choice: choice.trim()})"
                                  ng-click="$ctrl.handleCheckbox({dynType: $ctrl.dynType, cellName: cell.name, choice: choice.trim()})">
                                  {{choice.trim()}}&nbsp;&nbsp;
                              </label>
                            </span> <!-- Repeat choices -->
                          </div> <!-- Checkboxes -->

                          <!-- Lookup -->
                          <div ng-if="cell.type == 'Lookup'">
                            <label class="checkbox-inline" ng-repeat="food in $ctrl.foodList">
                              <input type="checkbox" name="selectedFood" value="{{food.name}}"
                                      data-ng-checked="$ctrl.foodIsChecked({dynType: $ctrl.dynType, food: food})"
                                      data-ng-click="$ctrl.toggleFoodSelection({dynType: $ctrl.dynType, food: food})">{{food.name}}
                            </label> <!-- Lookup -->
                          </div> <!-- Lookup -->

                        </div> <!-- form group -->
                      </div>
                    </div>
                  </div> <!-- Cell -->
                </div> <!-- Standard Row -->

              </div>
            </div> <!-- box-body -->
        </div> <!-- box -->
      </div> <!-- section -->
    `
  })
  .name;
