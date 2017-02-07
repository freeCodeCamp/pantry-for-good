import angular from 'angular';

export default angular.module('settings')
  .component('settings', {
    bindings: {
      tconfig: '='
    },
    controller: 'ChangeSettingsController',
    template: `
      <!-- Change Settings Page -->
      <section class="change-settings content">
        <!-- Box -->
        <div class="box box-solid box-primary">
          <!-- Box header -->
          <div class="box-header">
            <h3 class="box-title">CHANGE SETTINGS</h3>
          </div><!-- /.box-header-->
          <!-- Box body -->
          <div class="box-body">
            <!-- Basic Settings -->
            <basic-settings tconfig="$ctrl.tconfig"></basic-settings>
            <!-- Buttons -->
            <div class="row">
              <div class="col-sm-6 col-md-4 col-lg-2">
                <button class="btn btn-success btn-block top-buffer" ng-click="saveSettings()">Save Changes</button>
              </div>
              <div class="col-sm-6 col-md-4 col-lg-2">
                <a class="btn btn-primary btn-block top-buffer" data-ng-href="/#!/">Cancel</a>
              </div>
            </div><!-- /.buttons -->
          </div>
        </div>
      </section>
    `
  })
  .name;
