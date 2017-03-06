import angular from 'angular';

export default angular.module('questionnaire')
  .component('questionnaires', {
    controller: 'QuestionnaireController',
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header">
        <h1>Questionnaire Editor</h1>
      </section>
      <!-- Main content -->
      <section class="content" data-ng-init="$ctrl.findQuestionnaires()">
        <!-- QUESTIONNAIRES TABLE -->
        <!-- Only shown for superadmin, to be implemented -->
        <div ng-if="false" class="row">
          <div class="col-xs-12">
            <div class="box" st-table="$ctrl.questionnairesCopy" st-safe-src="$ctrl.questionnaires">
              <!-- Box header -->
              <div class="box-header">
                <h3 class="box-title">Questionnaires</h3>
                <div class="box-tools">
                  <div class="form-group has-feedback">
                    <input class="form-control" type="search" st-search="name" placeholder="Search">
                    <span class="glyphicon glyphicon-search form-control-feedback"></span>
                  </div>
                </div>
                <!-- Error display for questionnaires -->
                <div data-ng-show="$ctrl.questionnaireError" class="text-danger">
                  <strong data-ng-bind="$ctrl.questionnaireError"></strong>
                </div>
              </div><!-- /.box-header -->
              <!-- Box body -->
              <div class="box-body table-responsive no-padding top-buffer">
                <form name="questionnaireForm" data-ng-submit="$ctrl.createQuestionnaire()">
                  <!-- Table -->
                  <table class="table table-bordered table-striped">
                    <!-- Table columns -->
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Identifier</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead><!-- /.table-columns -->
                    <!-- Table body -->
                    <tbody>
                      <tr>
                        <td>
                          <input class="form-control"
                                type="text"
                                data-ng-model="$ctrl.questionnaire.name"
                                placeholder="Questionnaire Name">
                        </td>
                        <td>
                          <input class="form-control"
                                type="text"
                                data-ng-model="$ctrl.questionnaire.identifier"
                                placeholder="Short identifier">
                        </td>
                        <td>
                          <input class="form-control"
                                type="text"
                                data-ng-model="$ctrl.questionnaire.description"
                                placeholder="Description">
                        </td>
                        <td>
                          <button class="btn btn-success btn-flat" type="submit" data-ng-disabled="questionnaireForm.$invalid">
                            <i class="fa fa-plus"></i> Add Item
                          </button>
                        </td>
                      </tr>
                      <tr data-ng-repeat="questionnaire in $ctrl.questionnairesCopy | orderBy: 'name' ">
                        <td data-ng-hide="questionnaire.showEdit"><span data-ng-bind="questionnaire.name"></span></td>
                        <td data-ng-hide="questionnaire.showEdit"><span data-ng-bind="questionnaire.identifier"></span></td>
                        <td data-ng-hide="questionnaire.showEdit"><span data-ng-bind="questionnaire.description"></span></td>
                        <td data-ng-show="questionnaire.showEdit">
                          <input class="form-control"
                                type="text"
                                data-ng-model="questionnaire.name">
                        </td>
                        <td data-ng-show="questionnaire.showEdit">
                          <input class="form-control"
                                type="text"
                                data-ng-model="questionnaire.identifier">
                        </td>
                        <td data-ng-show="questionnaire.showEdit">
                          <input class="form-control"
                                type="text"
                                data-ng-model="questionnaire.description">
                        </td>
                        <td>
                          <a data-ng-hide="questionnaire.showEdit" data-ng-click="questionnaire.showEdit = true" class="btn btn-primary btn-flat btn-xs"><i class="fa fa-pencil"></i> Edit</a>
                          <a data-ng-show="questionnaire.showEdit" data-ng-click="$ctrl.updateQuestionnaire(questionnaire)" class="btn btn-success btn-flat btn-xs"><i class="fa fa-download"></i> Save</a>
                          <a data-ng-show="questionnaire.showEdit && !questionnaire.logicReq" data-ng-click="$ctrl.removeQuestionnaire(questionnaire)" class="btn btn-danger btn-flat btn-xs"><i class="fa fa-trash"></i> Delete</a>
                          <a data-ng-show="questionnaire.showEdit" data-ng-click="$ctrl.findQuestionnaires(); questionnaire.showEdit = false" class="btn btn-primary btn-flat btn-xs"><i class="fa fa-times"></i> Cancel</a>
                        </td>
                      </tr>
                      <tr data-ng-if="!$ctrl.questionnaires.length">
                        <td class="text-center" colspan="4">No questionnaires yet.</td>
                      </tr>
                    </tbody><!-- /.table-body -->
                  </table><!-- /.table -->
                </form>
              </div><!-- /.box-body -->
              <div class="overlay" ng-show="$ctrl.isLoading">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
            </div><!-- /.box -->
          </div><!-- /.col -->
        </div><!-- /.row -->

        <!-- SECTIONS TABLE -->
        <div class="row" data-ng-init="$ctrl.findSections()">
          <div class="col-xs-12">
            <div class="box" st-table="$ctrl.sectionsCopy" st-safe-src="$ctrl.sections">
              <!-- Box header -->
              <div class="box-header">
                <h3 class="box-title">Sections</h3>
                <div class="box-tools">
                </div>
                <!-- Error display for sections -->
                <div data-ng-show="$ctrl.sectionError" class="text-danger">
                  <strong data-ng-bind="$ctrl.sectionError"></strong>
                </div>
              </div><!-- /.box-header -->
              <!-- Box body -->
              <div class="box-body table-responsive no-padding top-buffer">
                <form name="sectionForm" data-ng-submit="$ctrl.createSection()">
                  <!-- Table -->
                  <table class="table table-bordered table-striped">

                    <!-- Table columns -->
                    <thead>
                      <tr>
                        <th>Section Name</th>
                        <th>Questionnaire</th>
                        <th>Position</th>
                        <th>Actions</th>
                      </tr>
                    </thead><!-- /.table-columns -->

                    <!-- Table body -->
                    <tbody>
                      <!-- First row for adding sections -->
                      <tr>
                        <td>
                          <input class="form-control"
                                type="text"
                                data-ng-model="$ctrl.section.name"
                                placeholder="Section Name">
                                <!-- required> -->
                        </td>
                        <td>
                          <select class="form-control"
                                  ng-options="questionnaire._id as questionnaire.name for questionnaire in $ctrl.questionnaires"
                                  data-ng-model="$ctrl.section.questionnaire"
                                  required>
                            <option value="">Select Questionnaire</option>
                          </select>
                        </td>
                        <td>
                          <input class="form-control"
                                type="text"
                                data-ng-model="$ctrl.section.position"
                                placeholder="Position">
                        </td>
                        <td>
                          <button class="btn btn-success btn-flat" type="submit" data-ng-disabled="sectionForm.$invalid">
                            <i class="fa fa-plus"></i> Add Item
                          </button>
                        </td>
                      </tr>

                      <!-- Rows displaying existing questionnaires, if not in edit mode  -->
                      <tr data-ng-repeat="section in $ctrl.sectionsCopy | orderBy: ['questionnaire.name', 'position']">
                        <td data-ng-hide="section.showEdit"><span data-ng-bind="section.name"></span></td>
                        <td data-ng-hide="section.showEdit"><span data-ng-bind="section.questionnaire.name"></span></td>
                        <td data-ng-hide="section.showEdit"><span data-ng-bind="section.position"></span></td>

                        <!-- Inputs for editing existing data, if in edit mode -->
                        <td data-ng-show="section.showEdit">
                          <input class="form-control"
                                type="text"
                                data-ng-model="section.name">
                        </td>
                        <td data-ng-show="section.showEdit">
                          <!-- Questionnaire data is populated by now, add ._id -->
                          <select class="form-control"
                                  ng-options="questionnaire._id as questionnaire.name for questionnaire in $ctrl.questionnaires"
                                  data-ng-model="section.questionnaire._id">
                          </select>
                        </td>
                        <td data-ng-show="section.showEdit">
                          <input class="form-control"
                                type="text"
                                data-ng-model="section.position">
                        </td>
                        <td>
                          <a data-ng-hide="section.showEdit" data-ng-click="section.showEdit = true" class="btn btn-primary btn-flat btn-xs"><i class="fa fa-pencil"></i> Edit</a>
                          <a data-ng-show="section.showEdit" data-ng-click="$ctrl.updateSection(section)" class="btn btn-success btn-flat btn-xs"><i class="fa fa-download"></i> Save</a>
                          <a data-ng-show="section.showEdit  && !section.logicReq" data-ng-click="$ctrl.removeSection(section)" class="btn btn-danger btn-flat btn-xs"><i class="fa fa-trash"></i> Delete</a>
                          <a data-ng-show="section.showEdit" data-ng-click="$ctrl.findSections(); section.showEdit = false" class="btn btn-primary btn-flat btn-xs"><i class="fa fa-times"></i> Cancel</a>
                        </td>
                      </tr>
                      <tr data-ng-if="!$ctrl.sections.length">
                        <td class="text-center" colspan="4">No sections yet.</td>
                      </tr>
                    </tbody><!-- /.table-body -->
                  </table><!-- /.table -->
                </form>
              </div><!-- /.box-body -->
              <div class="overlay" ng-show="$ctrl.isLoading">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
            </div><!-- /.box -->
          </div><!-- /.col -->
        </div><!-- /.row -->

        <!-- FIELDS TABLE -->
        <div class="row" data-ng-init="$ctrl.findFields()">
          <div class="col-xs-12">
            <div class="box" st-table="$ctrl.fieldsCopy" st-safe-src="$ctrl.fields">
              <!-- Box header -->
              <div class="box-header">
                <h3 class="box-title">Fields</h3>
                <div class="box-tools">
                  <div class="form-group has-feedback">
                    <input class="form-control" type="search" st-search="name" placeholder="Search">
                    <span class="glyphicon glyphicon-search form-control-feedback"></span>
                  </div>
                </div>
                <!-- Error display for fields -->
                <div data-ng-show="$ctrl.fieldError" class="text-danger">
                  <strong data-ng-bind="$ctrl.fieldError"></strong>
                </div>
              </div><!-- /.box-header -->
              <!-- Box body -->
              <div class="box-body table-responsive no-padding top-buffer">
                <form name="fieldForm" data-ng-submit="$ctrl.createField()">
                  <!-- Table -->
                  <table class="table table-bordered table-striped">
                    <!-- Table columns -->
                    <thead>
                      <tr>
                        <th>Label</th>
                        <th>Name</th>
                        <th>Section</th>
                        <th>Type</th>
                        <th>Choices</th>
                        <th>Row</th>
                        <th>Column</th>
                        <th>Span</th>
                        <th>Actions</th>
                      </tr>
                    </thead><!-- /.table-columns -->
                    <!-- Table body -->
                    <tbody>
                      <tr>
                        <td>
                          <textarea class="form-control"
                                data-ng-model="$ctrl.field.label"
                                placeholder="Field Label">
                          </textarea>
                        </td>
                        <td>
                          <input class="form-control"
                                type="text"
                                data-ng-model="$ctrl.field.name"
                                placeholder="Field Name">
                        </td>
                        <td>
                          <select class="form-control"
                                  ng-options="section._id as section.name for section in $ctrl.sections"
                                  data-ng-model="$ctrl.field.section"
                              required>
                            <option value="">Select Section</option>
                          </select>
                        </td>
                        <td>
                          <select class="form-control"
                                  data-ng-model="$ctrl.field.type">
                                  <option value="Text">Text</option>
                                  <option value="Textarea">Textarea</option>
                                  <option value="Date">Date</option>
                                  <option value="Radio Buttons">Radio Buttons</option>
                                  <option value="Checkboxes">Checkboxes</option>
                                  <option value="Lookup">Lookup</option>
                                  <option value="Table">Table</option>
                                  <option value="">Select Type</option>
                          </select>
                        </td>
                        <td>
                          <input class="form-control"
                                type="text"
                                data-ng-model="$ctrl.field.choices"
                                placeholder="Choices">
                        </td>
                        <td>
                          <input class="form-control"
                                type="number" min="1" max="20"
                                data-ng-model="$ctrl.field.row"
                                placeholder="Row">
                        </td>
                        <td>
                          <input class="form-control"
                                type="number" min="1" max="4"
                                data-ng-model="$ctrl.field.column"
                                placeholder="Column">
                        </td>
                        <td>
                          <input class="form-control"
                                type="number" min="1" max="4" value="1"
                                data-ng-model="$ctrl.field.span"
                                placeholder="Span">
                        </td>
                        <td>
                          <button class="btn btn-success btn-flat" type="submit" data-ng-disabled="fieldForm.$invalid">
                            <i class="fa fa-plus"></i> Add Item
                          </button>
                        </td>
                      </tr>
                      <!-- Rows displaying existing sections, if not in edit mode  -->
                      <tr data-ng-repeat="field in $ctrl.fieldsCopy | orderBy: ['section.name', 'row', 'column'] ">
                        <td data-ng-hide="field.showEdit"><span data-ng-bind="field.label"></span></td>
                        <td data-ng-hide="field.showEdit"><span data-ng-bind="field.name"></span></td>
                        <td data-ng-hide="field.showEdit"><span data-ng-bind="field.section.name"></span></td>
                        <td data-ng-hide="field.showEdit"><span data-ng-bind="field.type"></span></td>
                        <td data-ng-hide="field.showEdit"><span data-ng-bind="field.choices"></span></td>
                        <td data-ng-hide="field.showEdit"><span data-ng-bind="field.row"></span></td>
                        <td data-ng-hide="field.showEdit"><span data-ng-bind="field.column"></span></td>
                        <td data-ng-hide="field.showEdit"><span data-ng-bind="field.span"></span></td>

                        <td data-ng-show="field.showEdit">
                          <textarea class="form-control"
                                type="text"
                                rows=3
                                data-ng-model="field.label"></textarea>
                        </td>
                        <td data-ng-show="field.showEdit">
                          <input class="form-control"
                                type="text"
                                data-ng-model="field.name"
                                data-ng-disabled="field.logicReq">
                        </td>
                        <!-- Section data is populated by now, add ._id -->
                        <td data-ng-show="field.showEdit">
                          <select class="form-control"
                                  ng-options="section._id as section.name for section in $ctrl.sections"
                                  data-ng-model="field.section._id">
                          </select>
                        </td>
                        <td data-ng-show="field.showEdit">
                          <select class="form-control"
                                data-ng-model="field.type"
                                data-ng-disabled="field.logicReq">
                                <option value="Text">Text</option>
                                <option value="Textarea">Textarea</option>
                                <option value="Date">Date</option>
                                <option value="Radio Buttons">Radio Buttons</option>
                                <option value="Checkboxes">Checkboxes</option>
                                <option value="Table">Table</option>
                          </select>
                        </td>
                        <td data-ng-show="field.showEdit">
                          <input class="form-control"
                                type="text"
                                data-ng-model="field.choices">
                        </td>
                        <td data-ng-show="field.showEdit">
                          <input class="form-control"
                                type="number" min="1" max="20"
                                data-ng-model="field.row">
                        </td>
                        <td data-ng-show="field.showEdit">
                          <input class="form-control"
                                type="number" min="1" max="4"
                                data-ng-model="field.column">
                        </td>
                        <td data-ng-show="field.showEdit">
                          <input class="form-control"
                                type="number" min="1" max="4" value="1"
                                data-ng-model="field.span">
                        </td>
                        <td>
                          <a data-ng-hide="field.showEdit" data-ng-click="field.showEdit = true" class="btn btn-primary btn-flat btn-xs"><i class="fa fa-pencil"></i> Edit</a>
                          <a data-ng-show="field.showEdit" data-ng-click="$ctrl.updateField(field)" class="btn btn-success btn-flat btn-xs"><i class="fa fa-download"></i> Save</a>
                          <a data-ng-show="field.showEdit && !field.logicReq" data-ng-click="$ctrl.removeField(field)" class="btn btn-danger btn-flat btn-xs"><i class="fa fa-trash"></i> Delete</a>
                          <a data-ng-show="field.showEdit" data-ng-click="$ctrl.findFields(); field.showEdit = false" class="btn btn-primary btn-flat btn-xs"><i class="fa fa-times"></i> Cancel</a>
                        </td>
                      </tr>
                      <tr data-ng-if="!$ctrl.fields.length">
                        <td class="text-center" colspan="7">No fields yet.</td>
                      </tr>
                    </tbody><!-- /.table-body -->
                  </table><!-- /.table -->
                </form>
              </div><!-- /.box-body -->
              <div class="overlay" ng-show="$ctrl.isLoading">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
            </div><!-- /.box -->
          </div><!-- /.col -->
        </div><!-- /.row -->
      </section><!-- /.content -->
    `
  })
  .name;
