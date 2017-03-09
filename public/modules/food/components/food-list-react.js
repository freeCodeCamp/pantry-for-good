import angular from 'angular';

export default angular.module('food')
  .component('foodListReact', {
    controller: 'FoodControllerReact',
    template: '<div id="food-list-react"></div>'
  })
  .name;
