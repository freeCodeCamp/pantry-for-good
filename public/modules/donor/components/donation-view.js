import angular from 'angular';

export default angular.module('donor')
  .component('donationView', {
    bindings: {
      resolve: '=',
      modalInstance: '=',
      close: '&',
      dismiss: '&'
    },
    controller: 'DonationController',
    template: `
      <!-- Modal header -->
      <div class="modal-header invoice-header">
        <h2 class="page-header">Official Donation Receipt for Income Tax Purposes</h2>
      </div><!-- /.modal-header -->
      <!-- Modal body -->
      <div class="modal-body">
        <div class="row">
          <div class="col-xs-4">
            <address>
              From<br>
              <strong>{{$ctrl.resolve.settings.organization}}</strong><br>
              Address<br>
              Number
            </address>
          </div>
          <div class="col-xs-4">
            <address>
              To<br>
              <strong><span data-ng-bind="$ctrl.donation.donorName"></span></strong><br>
              <span data-ng-bind="$ctrl.donation.donorAddress"></span>
            </address>
          </div>
          <div class="col-xs-4">
            <strong>Receipt #<span data-ng-bind="$ctrl.donation._id"></span></strong><br><br>
            <strong>Date Issued: </strong><span data-ng-bind="$ctrl.donation.dateIssued | date:'shortDate'"></span><br>
            <strong>Location: </strong><span data-ng-bind="$ctrl.donation.location"></span>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12" data-ng-if="$ctrl.donation.type === 'Non-cash' || $ctrl.donation.type === 'Non-cash with advantage'">
            <p class="lead">Non-cash payment details</p>
            <table class="table table-responsive">
              <tbody>
                <tr>
                  <td>Description of property received by charity:</td>
                  <td><span data-ng-bind="$ctrl.donation.description"></span></td>
                </tr>
                <tr>
                  <td>Appraised by:</td>
                  <td><span data-ng-bind="$ctrl.donation.appraiserName"></span></td>
                </tr>
                <tr>
                  <td>Address of appraiser:</td>
                  <td><span data-ng-bind="$ctrl.donation.appraiserAddress"></span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-xs-12" data-ng-if="$ctrl.donation.type === 'Cash with advantage' || $ctrl.donation.type === 'Non-cash with advantage'">
            <p class="lead">Advantage information</p>
            <table class="table table-responsive">
              <tbody>
                <tr>
                  <th>Total amount received by charity:</th>
                  <td><span data-ng-bind="$ctrl.donation.total | currency:'$':2"></span></td>
                </tr>
                <tr>
                  <th>Value of advantage:</th>
                  <td><span data-ng-bind="$ctrl.donation.advantageValue | currency:'$':2"></span></td>
                </tr>
                <tr>
                  <td>Description of advantage:</td>
                  <td><span data-ng-bind="$ctrl.donation.advantageDescription"></span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-xs-12">
            <p class="lead">Summary</p>
            <table class="table table-responsive">
              <tbody>
                <tr>
                  <th>Eligible amount of gift for tax purposes:</th>
                  <td><span data-ng-bind="$ctrl.donation.eligibleForTax | currency:'$':2"></span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p>
          Sincerely,<br><br>
          <img src="/media/brand/signature.png" alt="signature">
        </p>
      </div><!-- /.modal-body -->
      <!-- Modal footer -->
      <div class="modal-footer">
        <button class="btn btn-primary pull-left" data-ng-click="$ctrl.sendEmail()">Send email</button>
        <button class="btn btn-default" data-ng-click="$ctrl.dismiss()">Cancel</button>
      </div><!-- /.modal-footer
    `
  })
  .name;
