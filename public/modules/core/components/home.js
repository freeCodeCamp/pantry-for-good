import angular from 'angular';

export default angular.module('core')
  .component('home', {
    bindings: {
			tconfig: '=',
			media: '='
		},
    template: `
      <!-- Content Header (Page header) -->
      <section class="content-header">
        <div class="row text-center">
          <foodbank-logo tconfig="$ctrl.tconfig" media="$ctrl.media"></foodbank-logo>
        </div>
      </section>
    `
  })
  .name;
