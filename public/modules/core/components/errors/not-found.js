import angular from 'angular';

export default angular.module('core')
  .component('notFound', {
    template: `
      <error
        color="'yellow'"
        status="'404'"
        msg="'Oops! Page not found.'"
        desc="'We could not find the page you were looking for.'"
      ></error>
    `
  })
  .name;
