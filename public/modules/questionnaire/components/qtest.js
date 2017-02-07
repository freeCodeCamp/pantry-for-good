import angular from 'angular';

export default angular.module('questionnaire')
  .component('qTest', {
    controller: 'qTestController',
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header">
        <h1>QTEST</h1>
      </section>

      <section class="content">
        <!-- Box -->
        <div class="box box-solid box-primary">
          <!-- Box header -->
          <div class="box-header">
            <h3 class="box-title">Financial Assessment</h3>
          </div> <!-- box-header-->
          <!-- Box body -->
          <div class="box-body">
            <!-- Rows -->
            <table class="table table-condensed table-hover">
              <tr class="info">
                <th ng-repeat="header in $ctrl.mockCols">{{header}}</th>
              </tr>
              <tr ng-repeat="row in $ctrl.income">
                <td>{{row.name}}</td>
                <td ng-repeat="(cell, value) in row" ng-if="cell !== 'name'">
                  <input type="number"
                        min="0"
                        data-ng-model="row[cell]"
                        class="form-control">

                </td>
              </tr>
            </table>
          </div> <!-- box-body -->
        </div> <!-- box -->

        <!-- DEBUG: Live view of form data to be saved -->
        <p style="margin-top: 15px;">Form Data:</p>
        <pre>{{$ctrl.income | json}}</pre>

      </section>
    `
  })
  .name;
