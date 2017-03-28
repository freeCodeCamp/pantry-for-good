import angular from 'angular';

export default angular.module('users')
  .component('signUpReact', {
    bindings: {
      media: '='
    },
    controller: 'SignUpControllerReact',
    template: `
      <section class="content">
        <div id="singup-react"></div>
      </section>
    `
  })
  .name;
