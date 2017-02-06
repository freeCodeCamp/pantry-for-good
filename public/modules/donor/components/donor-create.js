import angular from 'angular';

export default angular.module('donor')
  .component('donorCreate', {
    bindings: {
      tconfig: '=',
      media: '='
    },
    controller: 'DonorController',
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header text-center">
        <foodbank-logo tconfig="$ctrl.tconfig" media="$ctrl.media"></foodbank-logo>
        <h1>Donor Profile Creation</h1>
        <br>
        <div class="alert alert-info text-left">
          <i class="icon fa fa-warning"></i>For assistance with this application, please contact our support line at
          {{tconfig.supportNumber}}.
        </div>
      </section>
      <!-- Main content -->
      <section class="content">
        <div class="row">
          <div class="col-xs-12">
            <!-- Form -->
            <form name="donorForm" data-ng-submit="$ctrl.create()">

              <!-- Dynamic Form -->
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

              <!-- Buttons -->
              <div class="row">
                <div class="col-sm-6 col-md-4 col-lg-2">
                  <button type="submit" class="btn btn-success btn-block top-buffer">Submit</button>
                </div>
                <div class="col-sm-6 col-md-4 col-lg-2">
                  <a class="btn btn-primary btn-block top-buffer" data-ng-href="/#!/">Cancel</a>
                </div>
              </div><!-- /.buttons -->
              <!-- Error -->
              <div data-ng-show="$ctrl.error" class="text-danger">
                <strong data-ng-bind="$ctrl.error"></strong>
              </div><!-- /.error -->
            </form><!-- /.form -->
          </div><!-- /.col -->
        </div><!-- /.row -->
      </section><!-- /.main-content -->
    `
  })
  .name;
