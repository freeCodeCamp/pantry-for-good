import angular from 'angular';

import {selectors} from '../../../store';
import {sendReceipt} from '../../../store/donation';

const mapStateToThis = state => ({
  savingDonations: selectors.savingDonations(state),
  saveDonationsError: selectors.saveDonationsError(state)
});

const mapDispatchToThis = dispatch => ({
  _sendReceipt: (donation, donor) => dispatch(sendReceipt(donation, donor)),
});

export default angular.module('donor')
  .component('donationView', {
    bindings: {
      resolve: '=',
      modalInstance: '=',
      close: '&',
      dismiss: '&'
    },
    controller: function($ngRedux) {
      this.$onInit = () => {
        this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
        this.prevState = {};
        console.log('this.resolve.donation, this.resolve.donor', this.resolve.donation, this.resolve.donor)
      };

      this.$doCheck = () => {
        if (!this.savingDonations && this.prevState.savingDonations) {
          if (this.saveDonationsError) this.error = this.saveDonationsError;
          else this.close();
        }

        this.prevState = {...this};
      };

      this.$onDestroy = () => this.unsubscribe();

      this.sendReceipt = () => this._sendReceipt(this.resolve.donation, this.resolve.donor.id);
    },
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
              <strong><span data-ng-bind="$ctrl.resolve.donation.donorName"></span></strong><br>
              <span data-ng-bind="$ctrl.resolve.donation.donorAddress"></span>
            </address>
          </div>
          <div class="col-xs-4">
            <strong>Receipt #<span data-ng-bind="$ctrl.resolve.donation._id"></span></strong><br><br>
            <strong>Date Issued: </strong><span data-ng-bind="$ctrl.resolve.donation.dateIssued | date:'shortDate'"></span><br>
            <strong>Location: </strong><span data-ng-bind="$ctrl.resolve.donation.location"></span>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12" data-ng-if="$ctrl.resolve.donation.type === 'Non-cash' || $ctrl.resolve.donation.type === 'Non-cash with advantage'">
            <p class="lead">Non-cash payment details</p>
            <table class="table table-responsive">
              <tbody>
                <tr>
                  <td>Description of property received by charity:</td>
                  <td><span data-ng-bind="$ctrl.resolve.donation.description"></span></td>
                </tr>
                <tr>
                  <td>Appraised by:</td>
                  <td><span data-ng-bind="$ctrl.resolve.donation.appraiserName"></span></td>
                </tr>
                <tr>
                  <td>Address of appraiser:</td>
                  <td><span data-ng-bind="$ctrl.resolve.donation.appraiserAddress"></span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-xs-12" data-ng-if="$ctrl.resolve.donation.type === 'Cash with advantage' || $ctrl.resolve.donation.type === 'Non-cash with advantage'">
            <p class="lead">Advantage information</p>
            <table class="table table-responsive">
              <tbody>
                <tr>
                  <th>Total amount received by charity:</th>
                  <td><span data-ng-bind="$ctrl.resolve.donation.total | currency:'$':2"></span></td>
                </tr>
                <tr>
                  <th>Value of advantage:</th>
                  <td><span data-ng-bind="$ctrl.resolve.donation.advantageValue | currency:'$':2"></span></td>
                </tr>
                <tr>
                  <td>Description of advantage:</td>
                  <td><span data-ng-bind="$ctrl.resolve.donation.advantageDescription"></span></td>
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
                  <td><span data-ng-bind="$ctrl.resolve.donation.eligibleForTax | currency:'$':2"></span></td>
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
        <button class="btn btn-primary pull-left" data-ng-click="$ctrl.sendReceipt()">Send email</button>
        <button class="btn btn-default" data-ng-click="$ctrl.dismiss()">Cancel</button>
      </div><!-- /.modal-footer
    `
  })
  .name;
