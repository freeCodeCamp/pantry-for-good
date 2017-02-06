import angular from 'angular';

export default angular.module('customer')
  .component('customerCreate', {
    controller: 'CustomerUserController',
    bindings: {
      tconfig: '='
    },
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header text-center">
        <foodbank-logo />
        <h1>Client Request for Assistance Application</h1>
        <div class="alert alert-info text-left top-buffer">
          <h4><i class="icon fa fa-warning"></i>Please fill out the following form</h4>
          Once submitted, your application will be reviewed and you will be contacted directly.
          To check on your application status, you may call our client intake line at {{$ctrl.tconfig.clientIntakeNumber}}.
          For assistance with this application, please contact our support line at {{$ctrl.tconfig.supportNumber}}.
        </div>
      </section><!-- /.content-header -->
      <!-- Main content -->
      <section class="content" data-ng-init="$ctrl.findFood()">
        <div class="row">
          <div class="col-xs-12">
            <!-- Form -->
            <form name="customerForm" data-ng-submit="$ctrl.create()" novalidate>
              <!-- Dynamic Form -->
              <dynamic-form
                sectionNames="$ctrl.sectionNames"
                dynType="$ctrl.dynType"
                foodList="$ctrl.foodList"
                isChecked="$ctrl.isChecked(dynType, cellName, choice)"
                handleCheckbox="$ctrl.handleCheckbox(dynType, cellName, choice)"
                foodIsChecked="$ctrl.foodIsChecked(dynType, food)"
                toggleFoodSelection="$ctrl.toggleFoodSelection(dynType, food)"
              />

              <!-- TO BE REPLACED ONCE THE NEEDED FIELD TYPE IS IMPLEMENTED -->
              <!-- Section E - Dependants and People in Household -->
              <household
                number-of-dependants="$ctrl.numberOfDependants"
                dependants="$ctrl.customer.household"
                set-dependant-list="$ctrl.setDependantList(num)"
              ></household>

              <!-- Section F - Client Release and Waiver of Liability -->
              <waiver
                customer="$ctrl.customer"
                organization="$ctrl.tconfig.organization"
              ></waiver>
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
              </div>
            </form><!-- form -->
          </div><!-- /.col -->
        </div><!-- /.row -->
      </section><!-- /.main-content -->
    `
  })
  .name;
