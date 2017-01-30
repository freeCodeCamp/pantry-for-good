import angular from 'angular';

export default angular.module('core')
  .component('serverError', {
    template: `
      <error
        color="'red'"
        status="'500'"
        msg="'Oops! Something went wrong.'"
        desc="'We will work on fixing that right away.'"
      ></error>
    `
  })
  .name;
