import angular from 'angular';

const mapStateToThis = state => ({
  settings: state.settings.data
});

export default angular.module('donor')
  .component('donorCreateSuccess', {
    controller: function($ngRedux) {
      this.$onInit = () => this.unsubscribe = $ngRedux.connect(mapStateToThis)(this);

      this.$onDestroy = () => this.unsubscribe();
    },
    template: `
      <section class="row text-center">
        <foodbank-logo />
        <h3 class="col-md-12">Successfully submited. Thank you!</h3>
        <a href="/#!/" class="col-md-12">Go to {{$ctrl.settings.organization}}'s Homepage</a>
      </section>
    `
  })
  .name;
