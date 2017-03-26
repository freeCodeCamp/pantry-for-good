import angular from 'angular';

const mapStateToThis = state => ({
  settings: state.settings.data
});

export default angular.module('customer')
  .component('customerCreateSuccess', {
    controller: ['$ngRedux', function($ngRedux) {
      this.$onInit = () => this.unsubscribe = $ngRedux.connect(mapStateToThis)(this);
      this.store = $ngRedux
      this.$onDestroy = () => this.unsubscribe();
    }],
    template: `
      <section class="row text-center">
        <foodbank-logo store="$ctrl.store" />
        <h3 class="col-md-12">Successfully submited. Thank you!</h3>
        <a href="/#!/" class="col-md-12">Go to {{$ctrl.settings.organization}}'s Homepage</a>
      </section>
    `
  })
  .name;
