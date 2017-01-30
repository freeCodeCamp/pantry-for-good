import angular from 'angular';

export default angular.module('core')
  .component('footer', {
    bindings: {
      tconfig: '='
    },
    template: `
      <strong>Copyright &copy; 2016 <a href="/#!/">{{$ctrl.tconfig.organization}}</a>.</strong>
      All rights reserved.
    `
  })
  .name;
