import angular from 'angular';

export default angular.module('users')
  .component('signInReact', {
    bindings: {
      media: '='
    },
    controller: 'SignInControllerReact',
    template: `
      <section class="content">
        <div id="singin-react"></div>
      </section>
    `
  })
  .name;
