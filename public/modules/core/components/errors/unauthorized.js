import angular from 'angular';

export default angular.module('core')
  .component('unauthorized', {
    template: `
      <error
        color="'yellow'"
        status="'403'"
        msg="'Oops! Access forbidden.'"
        desc="'This part of the website is for admins only.'"
      ></error>
    `
  })
  .name;
