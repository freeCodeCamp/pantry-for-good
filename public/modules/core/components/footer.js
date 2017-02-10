import angular from 'angular';

import {loadSettings} from '../../../store/settings';

const mapStateToThis = state => ({
  settings: state.settings.data,
  fetching: state.settings.fetching
});

const mapDispatchToThis = dispatch => ({
  loadSettings: () => dispatch(loadSettings())
});

export default angular.module('core')
  .component('footer', {
    controller: ['$ngRedux', function($ngRedux) {
      this.$onInit = () => {
        this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
        if (!this.settings && !this.fetching) this.loadSettings();
      };
      this.$onDestroy = () => this.unsubscribe();
    }],
    template: `
      <strong>Copyright &copy; 2016 <a href="/#!/">{{$ctrl.settings.organization}}</a>.</strong>
      All rights reserved.
    `
  })
  .name;
