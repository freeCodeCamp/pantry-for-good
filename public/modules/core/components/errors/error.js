import angular from 'angular';

export default angular.module('core')
  .component('error', {
    bindings: {
      color: '=',
      status: '=',
      msg: '=',
      desc: '='
    },
    template: `
      <!-- Main Content -->
      <section class="content">
        <!-- Error Page -->
        <div class="error-page">
          <h2 class="headline text-{{$ctrl.color}}">{{$ctrl.status}}</h2>
          <!-- Error Content -->
          <div class="error-content">
            <h3>
              <i class="fa fa-warning text-{{$ctrl.color}}"></i>
              {{$ctrl.msg}}
            </h3>
            <p>
              {{$ctrl.description}} Meanwhile, you may
              <a href="/#!/">return to dashboard.</a>
            </p>
          </div><!-- /.error-content -->
        </div><!-- /.error-page -->
      </section>
    `
  })
  .name;
