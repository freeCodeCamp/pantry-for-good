import angular from 'angular';
import {stateGo} from 'redux-ui-router';

import {selectors} from '../../../store';
import {
  loadQuestionnaires,
  saveQuestionnaire,
  deleteQuestionnaire
} from '../../../store/questionnaire';
import {loadFields, saveField, deleteField} from '../../../store/field';
import {loadSections, saveSection, deleteSection} from '../../../store/section';

const mapStateToThis = state => ({
  user: state.auth.user,
  questionnaires: selectors.getAllQuestionnaires(state),
  loadingQuestionnaires: selectors.loadingQuestionnaires(state),
  loadQuestionnairesError: selectors.loadQuestionnairesError(state),
  savingQuestionnaires: selectors.savingQuestionnaires(state),
  saveQuestionnairesError: selectors.saveQuestionnairesError(state),
  formData: selectors.getFormData(state),
  loadingFormData: selectors.loadingFormData(state),
  loadFormDataError: selectors.loadFormDataError(state),
  savingField: selectors.savingField(state),
  saveFieldError: selectors.saveFieldError(state),
  savingSection: selectors.savingSection(state),
  saveSectionError: selectors.saveSectionError(state),
  settings: state.settings.data,
});

const mapDispatchToThis = dispatch => ({
  loadQuestionnaires: () => dispatch(loadQuestionnaires()),
  saveQuestionnaire: questionnaire => dispatch(saveQuestionnaire(questionnaire)),
  deleteQuestionnaire: questionnaire => dispatch(deleteQuestionnaire(questionnaire._id)),
  loadFormData: () => {
    dispatch(loadFields());
    dispatch(loadSections());
  },
  saveField: field => dispatch(saveField(field)),
  deleteField: field => dispatch(deleteField(field._id)),
  _saveSection: section => dispatch(saveSection(section)),
  deleteSection: section => dispatch(deleteSection(section._id)),
  push: (route, params, options) => dispatch(stateGo(route, params, options))
});

export default angular.module('questionnaire')
  .component('questionnaires', {
    controller: function($ngRedux) {
       this.$onInit = () => {
        this.unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToThis)(this);
        this.questionnairesModel = [];
        this.questionnaireModel = {};
        this.sectionModel = {};
        this.fieldModel = {};
        this.formDataModel = {};
        this.prevState = {};
        this.loadFormData();
        this.loadQuestionnaires();
      };

      this.$doCheck = () => {
        if (!this.loadingFormData && this.prevState.loadingFormData) {
          if (this.loadFormDataError) this.error = this.loadFormDataError;
          else this.formDataModel = {...this.formData};
        }

        if (!this.loadingQuestionnaires && this.prevState.loadingQuestionnaires) {
          if (this.loadQuestionnairesError) this.error = this.loadQuestionnairesError;
          else this.questionnairesModel = [...this.questionnaires]
        }

        this.prevState = {...this};
      };

      this.saveSection = section => {
        console.log('section', section)
        this._saveSection(section)
      }

      this.$onDestroy = () => this.unsubscribe();
    },
    template: `
      <!-- Content header (Page header) -->
      <section class="content-header">
        <h1>Questionnaire Editor</h1>
      </section>
      <!-- Main content -->
      <section class="content">
        <!-- QUESTIONNAIRES TABLE -->
        <!-- Only shown for superadmin, to be implemented -->
        <div ng-if="true" class="row">
          <div class="col-xs-12">
            <div class="box" st-table="$ctrl.questionnaires">
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
                <div data-ng-show="$ctrl.error" class="text-danger">
                  <strong data-ng-bind="$ctrl.error"></strong>
                </div>
              </div><!-- /.box-header -->
              <!-- Box body -->
              <div class="box-body table-responsive no-padding top-buffer">
                <form name="questionnaireForm" data-ng-submit="$ctrl.saveQuestionnaire($ctrl.questionnaireModel)">
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
                                data-ng-model="$ctrl.questionnaireModel.name"
                                placeholder="Questionnaire Name">
                        </td>
                        <td>
                          <input class="form-control"
                                type="text"
                                data-ng-model="$ctrl.questionnaireModel.identifier"
                                placeholder="Short identifier">
                        </td>
                        <td>
                          <input class="form-control"
                                type="text"
                                data-ng-model="$ctrl.questionnaireModel.description"
                                placeholder="Description">
                        </td>
                        <td>
                          <button class="btn btn-success btn-flat" type="submit" data-ng-disabled="questionnaireForm.$invalid">
                            <i class="fa fa-plus"></i> Add Item
                          </button>
                        </td>
                      </tr>
                      <tr data-ng-repeat="questionnaire in $ctrl.questionnairesModel | orderBy: 'name' ">
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
                          <a data-ng-show="questionnaire.showEdit" data-ng-click="$ctrl.saveQuestionnaire(questionnaire)" class="btn btn-success btn-flat btn-xs"><i class="fa fa-download"></i> Save</a>
                          <a data-ng-show="questionnaire.showEdit && !questionnaire.logicReq" data-ng-click="$ctrl.deleteQuestionnaire(questionnaire)" class="btn btn-danger btn-flat btn-xs"><i class="fa fa-trash"></i> Delete</a>
                          <a data-ng-show="questionnaire.showEdit" data-ng-click="$ctrl.loadQuestionnaires(); questionnaire.showEdit = false" class="btn btn-primary btn-flat btn-xs"><i class="fa fa-times"></i> Cancel</a>
                        </td>
                      </tr>
                      <tr data-ng-if="!$ctrl.questionnairesModel.length">
                        <td class="text-center" colspan="4">No questionnaires yet.</td>
                      </tr>
                    </tbody><!-- /.table-body -->
                  </table><!-- /.table -->
                </form>
              </div><!-- /.box-body -->
              <div class="overlay" ng-show="$ctrl.initialized">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
            </div><!-- /.box -->
          </div><!-- /.col -->
        </div><!-- /.row -->

        <!-- SECTIONS TABLE -->
        <div class="row">
          <div class="col-xs-12">
            <div class="box" st-table="$ctrl.formDataModel.sections">
              <!-- Box header -->
              <div class="box-header">
                <h3 class="box-title">Sections</h3>
                <div class="box-tools">
                </div>
                <!-- Error display for sections -->
                <div data-ng-show="$ctrl.saveSectionError" class="text-danger">
                  <strong data-ng-bind="$ctrl.saveSectionError"></strong>
                </div>
              </div><!-- /.box-header -->
              <!-- Box body -->
              <div class="box-body table-responsive no-padding top-buffer">
                <form name="sectionForm" data-ng-submit="$ctrl.saveSection($ctrl.sectionModel)">
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
                                data-ng-model="$ctrl.sectionModel.name"
                                placeholder="Section Name">
                                <!-- required> -->
                        </td>
                        <td>
                          <select class="form-control"
                                  ng-options="questionnaire._id as questionnaire.name for questionnaire in $ctrl.questionnaires"
                                  data-ng-model="$ctrl.sectionModel.questionnaire"
                                  required>
                            <option value="">Select Questionnaire</option>
                          </select>
                        </td>
                        <td>
                          <input class="form-control"
                                type="text"
                                data-ng-model="$ctrl.sectionModel.position"
                                placeholder="Position">
                        </td>
                        <td>
                          <button class="btn btn-success btn-flat" type="submit" data-ng-disabled="sectionForm.$invalid">
                            <i class="fa fa-plus"></i> Add Item
                          </button>
                        </td>
                      </tr>

                      <!-- Rows displaying existing questionnaires, if not in edit mode  -->
                      <tr data-ng-repeat="section in $ctrl.formDataModel.sections | orderBy: ['questionnaire.name', 'position']">
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
                          <a data-ng-show="section.showEdit" data-ng-click="$ctrl.saveSection(section)" class="btn btn-success btn-flat btn-xs"><i class="fa fa-download"></i> Save</a>
                          <a data-ng-show="section.showEdit  && !section.logicReq" data-ng-click="$ctrl.deleteSection(section)" class="btn btn-danger btn-flat btn-xs"><i class="fa fa-trash"></i> Delete</a>
                          <a data-ng-show="section.showEdit" data-ng-click="$ctrl.loadFormData(); section.showEdit = false" class="btn btn-primary btn-flat btn-xs"><i class="fa fa-times"></i> Cancel</a>
                        </td>
                      </tr>
                      <tr data-ng-if="!$ctrl.formDataModel.sections.length">
                        <td class="text-center" colspan="4">No sections yet.</td>
                      </tr>
                    </tbody><!-- /.table-body -->
                  </table><!-- /.table -->
                </form>
              </div><!-- /.box-body -->
              <div class="overlay" ng-show="$ctrl.loadingFormData">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
            </div><!-- /.box -->
          </div><!-- /.col -->
        </div><!-- /.row -->

        <!-- FIELDS TABLE -->
        <div class="row" data-ng-init="$ctrl.findFields()">
          <div class="col-xs-12">
            <div class="box" st-table="$ctrl.formDataModel.fields">
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
                <div data-ng-show="$ctrl.saveFormDataError" class="text-danger">
                  <strong data-ng-bind="$ctrl.saveFormDateError"></strong>
                </div>
              </div><!-- /.box-header -->
              <!-- Box body -->
              <div class="box-body table-responsive no-padding top-buffer">
                <form name="fieldForm" data-ng-submit="$ctrl.saveField($ctrl.fieldModel)">
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
                                data-ng-model="$ctrl.fieldModel.label"
                                placeholder="Field Label">
                          </textarea>
                        </td>
                        <td>
                          <input class="form-control"
                                type="text"
                                data-ng-model="$ctrl.fieldModel.name"
                                placeholder="Field Name">
                        </td>
                        <td>
                          <select class="form-control"
                                  ng-options="section._id as section.name for section in $ctrl.formDataModel.sections"
                                  data-ng-model="$ctrl.fieldModel.section"
                              required>
                            <option value="">Select Section</option>
                          </select>
                        </td>
                        <td>
                          <select class="form-control"
                                  data-ng-model="$ctrl.fieldModel.type">
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
                                data-ng-model="$ctrl.fieldModel.choices"
                                placeholder="Choices">
                        </td>
                        <td>
                          <input class="form-control"
                                type="number" min="1" max="20"
                                data-ng-model="$ctrl.fieldModel.row"
                                placeholder="Row">
                        </td>
                        <td>
                          <input class="form-control"
                                type="number" min="1" max="4"
                                data-ng-model="$ctrl.fieldModel.column"
                                placeholder="Column">
                        </td>
                        <td>
                          <input class="form-control"
                                type="number" min="1" max="4" value="1"
                                data-ng-model="$ctrl.fieldModel.span"
                                placeholder="Span">
                        </td>
                        <td>
                          <button class="btn btn-success btn-flat" type="submit" data-ng-disabled="fieldForm.$invalid">
                            <i class="fa fa-plus"></i> Add Item
                          </button>
                        </td>
                      </tr>
                      <!-- Rows displaying existing sections, if not in edit mode  -->
                      <tr data-ng-repeat="field in $ctrl.formDataModel.fields | orderBy: ['section.name', 'row', 'column'] ">
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
                                  ng-options="section._id as section.name for section in $ctrl.formDataModel.sections"
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
                          <a data-ng-show="field.showEdit" data-ng-click="$ctrl.saveField(field)" class="btn btn-success btn-flat btn-xs"><i class="fa fa-download"></i> Save</a>
                          <a data-ng-show="field.showEdit && !field.logicReq" data-ng-click="$ctrl.deleteField(field)" class="btn btn-danger btn-flat btn-xs"><i class="fa fa-trash"></i> Delete</a>
                          <a data-ng-show="field.showEdit" data-ng-click="$ctrl.loadFormData(); field.showEdit = false" class="btn btn-primary btn-flat btn-xs"><i class="fa fa-times"></i> Cancel</a>
                        </td>
                      </tr>
                      <tr data-ng-if="!$ctrl.formDataModel.fields.length">
                        <td class="text-center" colspan="7">No fields yet.</td>
                      </tr>
                    </tbody><!-- /.table-body -->
                  </table><!-- /.table -->
                </form>
              </div><!-- /.box-body -->
              <div class="overlay" ng-show="$ctrl.loadingFormData">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
            </div><!-- /.box -->
          </div><!-- /.col -->
        </div><!-- /.row -->
      </section><!-- /.content -->
    `
  })
  .name;
