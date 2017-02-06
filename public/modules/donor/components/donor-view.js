import angular from 'angular';

export default angular.module('donor')
  .component('donorView', {
    controller: 'DonorController',
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header" data-ng-init="$ctrl.findOne()">
        <h1><span data-ng-bind="$ctrl.dynType.fullName"></span></h1>
      </section>
      <!-- Main content -->
      <section class="content">
        <div class="row">
          <div class="col-xs-12">
            <!-- Box -->
            <div class="box">
              <!-- Box header -->
              <div class="box-header">
                <h3 class="box-title">Donations</h3>
                <div class="box-tools">
                  <button class="btn btn-success btn-flat" data-ng-click="$ctrl.newDonation()">
                    <i class="fa fa-plus"></i> Add Donation
                  </button>
                </div>
              </div><!-- /.box-header-->
              <!-- Box body -->
              <div class="box-body table-responsive no-padding top-buffer">
                <!-- Table -->
                <table class="table table-bordered table-striped" st-table="$ctrl.donationsCopy" st-safe-src="$ctrl.donations" print-section>
                  <!-- Table columns -->
                  <thead>
                    <tr>
                      <th st-sort="dateReceived">Date</th>
                      <th st-sort="eligibleForTax">Amount</th>
                      <th st-sort="type">Type</th>
                      <th st-sort="_id">Tax receipt ID</th>
                      <th print-remove>Actions</th>
                    </tr>
                  </thead><!-- /.table-columns -->
                  <!-- Table body -->
                  <tbody>
                    <tr data-ng-repeat="donation in $ctrl.donationsCopy">
                      <td><span data-ng-bind="donation.dateReceived | date:'shortDate'"></span></td>
                      <td><span data-ng-bind="donation.eligibleForTax | currency:'$':2"></span></td>
                      <td><span data-ng-bind="donation.type"></span></td>
                      <td><span data-ng-bind="donation._id"></span></td>
                      <td print-remove>
                        <a class="btn btn-info btn-flat btn-xs" data-ng-click="$ctrl.viewDonation(donation)"><i class="fa fa-eye"></i> View</a>
                      </td>
                    </tr>
                    <tr data-ng-if="!$ctrl.donations.length">
                      <td class="text-center" colspan="5">This donor hasn't made any donations yet.</td>
                    </tr>
                  </tbody><!-- /.table-body -->
                </table><!-- /.table -->
              </div><!-- /.box-body -->
              <!-- Box footer -->
              <div class="box-footer">
                <div class="row">
                  <div class="col-sm-6 col-md-4 col-lg-2">
                    <button class="btn btn-default btn-flat btn-block" print-btn print-landscape>
                      <i class="fa fa-print"></i> Print
                    </button>
                  </div>
                </div>
              </div><!-- /.box-footer -->
            </div><!-- /.box -->
          </div><!-- /.col -->
        </div><!-- /.row -->
      </section><!-- /.content -->
    `
  })
  .name;
