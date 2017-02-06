import angular from 'angular';

export default angular.module('customer')
  .component('customerEdit', {
    controller: 'CustomerController',
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header" data-ng-init="$ctrl.findOne()">
        <h1><span data-ng-bind="$ctrl.dynType.fullName"></span></h1>
      </section>
      <!-- Main content -->
      <section class="content">
        <div class="row">
          <div class="col-xs-12">
            <!-- Form -->
            <form name="dynTypeForm" data-ng-submit="dynTypeForm.$valid && $ctrl.update()">
              <dynamic-form
                section-names="$ctrl.sectionNames"
                dyn-form="$ctrl.dynForm"
                dyn-type="$ctrl.dynType"
                food-list="$ctrl.foodList"
                is-checked="$ctrl.dynMethods.isChecked(dynType, cellName, choice)"
                handle-checkbox="$ctrl.dynMethods.handleCheckbox(dynType, cellName, choice)"
                food-is-checked="$ctrl.dynMethods.foodIsChecked(dynType, food)"
                toggle-food-selection="$ctrl.dynMethods.toggleFoodSelection(dynType, food)"
              />

              <!-- TO BE REPLACED ONCE THE NEEDED FIELD TYPE IS IMPLEMENTED -->
              <!-- Section E - Dependants and people in household -->
              <household
                number-of-dependants="$ctrl.numberOfDependants"
                dependants="$ctrl.dynType.household"
                set-dependant-list="$ctrl.setDependantList(num)"
              ></household>
              <!-- Buttons -->
              <div class="row">
                <div class="col-sm-6 col-md-4 col-lg-2">
                  <button type="submit" class="btn btn-success btn-block top-buffer">Update</button>
                </div>
                <div class="col-sm-6 col-md-4 col-lg-2">
                  <a class="btn btn-primary btn-block top-buffer" data-ng-if="$ctrl.isAdmin" data-ng-href="/#!/admin/customers">Cancel</a>
                  <a class="btn btn-primary btn-block top-buffer" data-ng-if="!$ctrl.isAdmin" data-ng-href="/#!/">Cancel</a>
                </div>
              </div><!-- /.buttons -->
              <!-- Error -->
              <div data-ng-show="$ctrl.error" class="text-danger">
                <strong data-ng-bind="$ctrl.error"></strong>
              </div>
            </form><!-- /.form -->
          </div><!-- /.col -->
        </div><!-- /.row -->
      </section><!-- /.content -->
    `
  })
  .name;
