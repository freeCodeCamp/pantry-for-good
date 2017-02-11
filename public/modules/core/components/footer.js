import angular from 'angular';

const mapStateToThis = state => ({
  settings: state.settings.data,
});

export default angular.module('core')
  .component('footer', {
    controller: ['$ngRedux', function($ngRedux) {
      this.$onInit = () => this.unsubscribe = $ngRedux.connect(mapStateToThis)(this);
      this.$onDestroy = () => this.unsubscribe();
    }],
    template: `
      <strong>Copyright &copy; 2016 <a href="/#!/">{{$ctrl.settings.organization}}</a>.</strong>
      All rights reserved.
    `
  })
  .name;
