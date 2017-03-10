import angular from 'angular';

import {selectors} from '../../../store';
import {saveDonation} from '../../../store/donation';

const mapStateToThis = state => ({
  savingDonations: selectors.savingDonations(state),
  saveDonationsError: selectors.saveDonationsError(state)
});

const mapDispatchToThis = dispatch => ({
  _saveDonation: (donation, donor) => dispatch(saveDonation(donation, donor)),
});

export default angular.module('donor')
  .component('donationCreate', {
    bindings: {
      resolve: '=',
      modalInstance: '=',
      close: '&',
      dismiss: '&'
    },
    controller: function($ngRedux) {
      this.$onInit = () => {
        this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
        this.donation = {};
        this.prevState = {};
      };

      this.$doCheck = () => {
        if (!this.savingDonations && this.prevState.savingDonations) {
          if (this.saveDonationsError) this.error = this.saveDonationsError;
          else this.close();
        }

        this.prevState = {...this};
      };

      this.$onDestroy = () => this.unsubscribe();

      this.saveDonation = donation => this._saveDonation(donation, this.resolve.donor);
    },
    template: `
      <!-- Modal header -->
      <div class="modal-header">
        <h4 class="modal-title">Create Donation</h4>
      </div><!-- /.modal-header -->
      <!-- Modal body -->
      <div class="modal-body">
        <form name="donationForm">
          <div class="row">
            <div class="col-xs-12 col-sm-6">
              <div class="form-group">
                <label>Donation type</label>
                <select class="form-control" data-ng-model="$ctrl.donation.type" required>
                  <option value="Cash">Cash gift (no advantage)</option>
                  <option value="Cash with advantage">Cash gift with advantage</option>
                  <option value="Non-cash">Non-cash gift (no advantage)</option>
                  <option value="Non-cash with advantage">Non-cash gift with advantage</option>
                </select>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6">
              <div class="form-group">
                <label>Date donation received</label>
                <input type="date"
                      class="form-control"
                      data-ng-model="$ctrl.donation.dateReceived"
                      required>
              </div>
            </div>
            <div class="clearfix"></div>
            <div class="col-xs-12 col-sm-6">
              <div class="form-group">
                <label>Donated by</label>
                <input type="text"
                      class="form-control"
                      data-ng-model="$ctrl.donation.donorName"
                      required>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6">
              <div class="form-group">
                <label>Donor address</label>
                <input type="text"
                      class="form-control"
                      data-ng-model="$ctrl.donation.donorAddress"
                      required>
              </div>
            </div>
            <div class="clearfix"></div>
            <div class="col-xs-12 col-sm-6">
              <div class="form-group">
                <label>Total amount received by charity</label>
                <input type="number"
                      class="form-control"
                      data-ng-model="$ctrl.donation.total"
                      data-ng-required="$ctrl.donation.type === 'Cash with advantage' || $ctrl.donation.type === 'Non-cash with advantage'"
                      data-ng-disabled="$ctrl.donation.type !== 'Cash with advantage' && $ctrl.donation.type !== 'Non-cash with advantage'">
              </div>
            </div>
            <div class="col-xs-12 col-sm-6">
              <div class="form-group">
                <label>Value of advantage</label>
                <input type="number"
                      class="form-control"
                      data-ng-model="$ctrl.donation.advantageValue"
                      data-ng-required="$ctrl.donation.type === 'Cash with advantage' || $ctrl.donation.type === 'Non-cash with advantage'"
                      data-ng-disabled="$ctrl.donation.type !== 'Cash with advantage' && $ctrl.donation.type !== 'Non-cash with advantage'">
              </div>
            </div>
            <div class="clearfix"></div>
            <div class="col-xs-12 col-sm-6">
              <div class="form-group">
                <label>Description of advantage</label>
                <input type="text"
                      class="form-control"
                      data-ng-model="$ctrl.donation.advantageDescription"
                      data-ng-required="$ctrl.donation.type === 'Cash with advantage' || $ctrl.donation.type === 'Non-cash with advantage'"
                      data-ng-disabled="$ctrl.donation.type !== 'Cash with advantage' && $ctrl.donation.type !== 'Non-cash with advantage'">
              </div>
            </div>
            <div class="col-xs-12 col-sm-6">
              <div class="form-group">
                <label>Eligible amount of gift for tax purposes</label>
                <input type="number"
                      class="form-control"
                      data-ng-model="$ctrl.donation.eligibleForTax"
                      required>
              </div>
            </div>
            <div class="clearfix"></div>
            <div class="col-xs-12 col-sm-6">
              <div class="form-group">
                <label>Description of property received by charity</label>
                <input type="text"
                      class="form-control"
                      data-ng-model="$ctrl.donation.description"
                      data-ng-required="$ctrl.donation.type === 'Non-cash' || $ctrl.donation.type === 'Non-cash with advantage'"
                      data-ng-disabled="$ctrl.donation.type !== 'Non-cash' && $ctrl.donation.type !== 'Non-cash with advantage'">
              </div>
            </div>
            <div class="col-xs-12 col-sm-6">
              <div class="form-group">
                <label>Appraised by</label>
                <input type="text"
                      class="form-control"
                      data-ng-model="$ctrl.donation.appraiserName"
                      data-ng-required="$ctrl.donation.type === 'Non-cash' || $ctrl.donation.type === 'Non-cash with advantage'"
                      data-ng-disabled="$ctrl.donation.type !== 'Non-cash' && $ctrl.donation.type !== 'Non-cash with advantage'">
              </div>
            </div>
            <div class="clearfix"></div>
            <div class="col-xs-12 col-sm-6">
              <div class="form-group">
                <label>Address of appraiser</label>
                <input type="text"
                      class="form-control"
                      data-ng-model="$ctrl.donation.appraiserAddress"
                      data-ng-required="$ctrl.donation.type === 'Non-cash' || $ctrl.donation.type === 'Non-cash with advantage'"
                      data-ng-disabled="$ctrl.donation.type !== 'Non-cash' && $ctrl.donation.type !== 'Non-cash with advantage'">
              </div>
            </div>
            <div class="col-xs-12 col-sm-6">
              <div class="form-group">
                <label>Date receipt issued</label>
                <input type="date"
                      class="form-control"
                      data-ng-model="$ctrl.donation.dateIssued"
                      required>
              </div>
            </div>
            <div class="clearfix"></div>
            <div class="col-xs-12 col-sm-6">
              <div class="form-group">
                <label>Location receipt issued</label>
                <input type="text"
                      class="form-control"
                      data-ng-model="$ctrl.donation.location"
                      required>
              </div>
            </div>
          </div>
        </form>
      </div><!-- /.modal-body -->
      <!-- Modal footer -->
      <div class="modal-footer">
        <button class="btn btn-success pull-left" data-ng-disabled="donationForm.$invalid" data-ng-click="$ctrl.saveDonation($ctrl.donation)">Submit</button>
        <button class="btn btn-default" data-ng-click="$ctrl.dismiss()">Cancel</button>
      </div><!-- /.modal-footer
    `
  })
  .name;
