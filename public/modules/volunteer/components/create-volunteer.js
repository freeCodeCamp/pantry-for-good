import angular from 'angular';

export default angular.module('volunteer')
  .component('createVolunteer', {
    bindings: {
      tconfig: '=',
      media: '='
    },
    controller: 'VolunteerController',
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header text-center">
        <foodbank-logo tconfig="$ctrl.settings" media="$ctrl.media"></foodbank-logo>
        <h1>Volunteer Application</h1>
        <br>
        <div class="alert alert-info text-left">
          <i class="icon fa fa-warning"></i>For assistance with this application, please contact our support line at
          {{$ctrl.settings.supportNumber}}.
        </div>
      </section>
      <!-- Main content -->
      <section class="content">
        <div class="row">
          <div class="col-xs-12">
            <!-- Form -->
            <form name="volunteerForm" data-ng-submit="volunteerForm.$valid && $ctrl.create()">
              <!-- Identification and General Information -->
              <dynamic-form
                section-names="$ctrl.sectionNames"
                dyn-form="$ctrl.dynForm"
                dyn-type="$ctrl.dynType"
                food-list="$ctrl.foodList"
                is-checked="$ctrl.dynMethods.isChecked(dynType, cellName, choice)"
                handle-checkbox="$ctrl.dynMethods.handleCheckbox(dynType, cellName, choice)"
                food-is-checked="$ctrl.dynMethods.foodIsChecked(dynType, food)"
                toggle-food-selection="$ctrl.dynMethods.toggleFoodSelection(dynType, food)"
              />

              <!-- Box -->
              <div class="box box-solid box-primary">
                <!-- Box header -->
                <div class="box-header">
                  <h3 class="box-title">
                    VOLUNTEER RELEASE AND WAIVER OF LIABILITY – READ BEFORE SIGNING<br>
                    (BY SIGNING THIS AGREEMENT YOU WILL WAIVER CERTAIN LEGAL RIGHTS, INCLUDING THE RIGHT TO SUE)
                  </h3>
                </div><!-- /.box-header-->
                <!-- Box body -->
                <div class="box-body">
                  <span ng-bind-html="$ctrl.settings.mission"></span>
                  <ol>
                    <li>
                      Policies and Safety Rules. For my safety and that of others, I will comply with {{$ctrl.settings.organization}}’s volunteer policies and safety rules and its other directors for all volunteer activities.
                    </li>
                    <li>
                      Awareness and Assumption of Risk. I understand that my volunteer activities may have inherit risks that may arise from the activities themselves, {{$ctrl.settings.organization}}’s operations, my own actions or inactions, or the actions or inactions of {{$ctrl.settings.organization}}, its trustees, directors, employees, and agents, other volunteers, and others present. These risks may include, but are not limited to, working around vehicles, lifting objects, and performing repetitive tasks. I assume full responsibility for any and all risks of bodily injury, death or property damage caused by or arising directly or indirectly from my presence or participation at {{$ctrl.settings.organization}}’s activities, regardless of the cause.
                    </li>
                    <li>
                      Waiver and Release of Claims. I waive and release any and all claims against {{$ctrl.settings.organization}}, its trustees, directors, officers, officials, employees, volunteers, donors, sponsors, beneficiaries, sponsoring agencies and affiliates (collectively, the “Released Parties”), for any liability, loss, damages, claims, expenses and legal fees resulting from death, or injury to my person or property, caused by or arising directly or indirectly from my presence at {{$ctrl.settings.organization}}, or participation in activities on behalf of {{$ctrl.settings.organization}}, regardless of the cause even if caused by negligence, whether passive or active. I agree not to sue any of the Released Parties on the basis of these waived and released claims. I understand that {{$ctrl.settings.organization}} would not permit me to volunteer without my agreeing to these waivers and releases.
                    </li>
                    <li>
                      Medical Care Consent and Waiver. I authorize {{$ctrl.settings.organization}} to provide to me first aid and, through medical personnel of its choice, medical assistance, transportation, and emergency medical services. This consent does not impose a duty upon {{$ctrl.settings.organization}} to provide such assistance, transportation, or services. In addition, I waive and release any claims against the Released Parties arising out of any first aid, treatment, or medical service, including the lack or timing of such, made in connection with my volunteer activities with {{$ctrl.settings.organization}}.
                    </li>
                    <li>
                      Indemnification. I will defend, indemnify, and hold the Released Parties harmless from and against any and all loss, damages, claims, expenses and legal fees that may be suffered by any Released Party resulting directly or indirectly from my volunteer activities for {{$ctrl.settings.organization}}, except and only to extent the liability is caused by gross negligence or willful misconduct of the relevant Released Party.
                    </li>
                    <li>
                      Publicity. I consent to the unrestricted use of my image, voice, name and/or story in any format including video, print, or electronic (collectively the “Materials”) that the Released Parties or others may create in connection with my participation in activities at or for {{$ctrl.settings.organization}}. {{$ctrl.settings.organization}} may make Materials available at its discretion to third parties, including photos or streamed or other videos, on {{$ctrl.settings.organization}}’s websites and internal displays, in publications, or through and other media, including social networking websites. I waive any right to inspect or approve the finished product and acknowledge that I am not entitled to any compensation for creation or use of the finished product.
                    </li>
                    <li>
                      Confidentiality. As a volunteer, I may have access to sensitive or confidential information. This information includes, but is not limited to, identity, address, contact information, and financial information. At all times during and after my participation, I agree to hold in confidence and not disclose or use any such confidential information except as required in my volunteer activities or as expressly authorized in writing by {{$ctrl.settings.organization}}’s executives.
                    </li>
                    <li>
                      Volunteer Not an Employee. I understand that (i) I am not an employee of {{$ctrl.settings.organization}}, (ii) that I will not be paid for my participation, and (iii) I am not covered by or eligible for any insurance, health care, worker’s compensation, or other benefits. I may choose at any time not to participate in an activity, or to stop my participation entirely, with {{$ctrl.settings.organization}}.
                    </li>
                    <p>
                      <strong>I HAVE READ THIS WAIVER AND RELEASE OF LIABILITY, FULLY UNDERSTAND ITS TERMS, UNDERSTAND THAT I HAVE ASSUMED SIGNIFICANT RISKS AND GIVEN UP SUBSTANTIAL RIGHTS BY SIGNING IT, AND SIGN IT FREELY AND VOLUNTARILY WITHOUT ANY INDUCEMENT.</strong>
                    </p>
                    <div class="row">
                      <div class="col-xs-4 col-md-6 col-lg-4">
                        <div class="form-group">
                          <div>
                            <label class="checkbox-inline">
                              <input type="checkbox"
                                    data-ng-model="$ctrl.volunteer.disclaimerAgree"
                                    value="true"
                                    required>I agree
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="col-xs-8 col-md-6 col-lg-4">
                        <div class="form-group">
                          <input data-ng-disabled="!$ctrl.volunteer.disclaimerAgree"
                                class="form-control"
                                type="text"
                                data-ng-model="$ctrl.volunteer.disclaimerSign"
                                placeholder="Sign here"
                                required>
                        </div>
                      </div>
                      <div class="clearfix"></div>
                      <div class="col-md-6 col-lg-4" data-ng-show="$ctrl.isMinor($ctrl.volunteer.dateOfBirth)">
                        <div class="form-group">
                          <label>Parent/Guardian Signature</label>
                          <input type="text"
                                class="form-control"
                                data-ng-model="$ctrl.volunteer.disclaimerSignGuardian"
                                data-ng-required="$ctrl.isMinor($ctrl.volunteer.dateOfBirth)"
                                required>
                        </div>
                      </div>
                      <div class="col-md-6 col-lg-4" data-ng-show="$ctrl.isMinor($ctrl.volunteer.dateOfBirth)">
                        <div class="form-group">
                          <label>Parent/Guardian Email</label>
                          <input type="email"
                                class="form-control"
                                data-ng-model="$ctrl.volunteer.disclaimerGuardianEmail"
                                data-ng-required="$ctrl.volunteer.isMinor(volunteer.dateOfBirth)"
                                required>
                        </div>
                      </div>
                    </div>
                  </ol>
                </div><!-- /.box-body -->
              </div><!-- /.box -->
              <!-- Buttons -->
              <div class="row">
                <div class="col-sm-6 col-md-4 col-lg-2">
                  <button type="submit" class="btn btn-success btn-block top-buffer">Submit</button>
                </div>
                <div class="col-sm-6 col-md-4 col-lg-2">
                  <a class="btn btn-primary btn-block top-buffer" data-ng-href="/#!/">Cancel</a>
                </div>
              </div><!-- /.buttons -->
              <!-- Error -->
              <div data-ng-show="$ctrl.error" class="text-danger">
                <strong data-ng-bind="$ctrl.error"></strong>
              </div>
            </form><!-- /.form -->
          </div><!-- /.col -->
        </div><!-- /.row -->
      </section><!-- /.main-content -->
    `
  })
  .name;
