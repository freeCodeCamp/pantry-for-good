import angular from 'angular';

export default angular.module('settings')
  .component('basicSettings', {
    bindings: {
      tconfig: '='
    },
    template: `
      <div class="row">
        <div class="col-lg-3">
          <div class="form-group">
            <label>Organization</label>
            <input name="organization"
                  type="text"
                  id="organization"
                  class="form-control"
                  placeholder="Foodbank Template"
                  data-ng-model="$ctrl.tconfig.organization"
                  required>
          </div>
        </div>
        <div class="clearfix visible-sm-block visible-md-block"></div>
        <div class="col-lg-2">
          <div class="form-group">
            <label>URL</label>
            <input name="url"
                  type="text"
                  id="url"
                  class="form-control"
                  placeholder="www.example.com"
                  data-ng-model="$ctrl.tconfig.url"
                  required>
          </div>
        </div>
        <div class="clearfix visible-sm-block visible-md-block"></div>
        <div class="col-lg-2">
          <div class="form-group">
            <label>City</label>
            <input name="clientIntakeNumber"
                type="text"
                id="foodBankCity"
                class="form-control"
                placeholder="Toronto"
                data-ng-model="$ctrl.tconfig.foodBankCity"
                required>
          </div>
        </div>
        <div class="col-lg-2">
          <div class="form-group">
            <label>Client intake number</label>
            <input name="clientIntakeNumber"
                  type="text"
                  id="clientIntakeNumber"
                  class="form-control"
                  placeholder="+1 555 11 11 11 11"
                  data-ng-model="$ctrl.tconfig.clientIntakeNumber"
                  required>
          </div>
        </div>
        <div class="clearfix visible-sm-block visible-md-block"></div>
        <div class="col-lg-3">
          <div class="form-group">
            <label>Support number</label>
            <input name="supportNumber"
                  type="text"
                  id="supportNumber"
                  class="form-control"
                  placeholder="+1 555 22 11 11 11"
                  data-ng-model="$ctrl.tconfig.supportNumber"
                  required>
          </div>
        </div>
      </div>


      <div class="row">
        <div class="col-lg-6">
          <div class="form-group">
            <label>Mission</label>
            <textarea name="mission"
                      id="mission"
                      class="form-control"
                      rows="5"
                      data-ng-model="$ctrl.tconfig.mission"
                      placeholder="<p>Foodbank Template is a volunteer run organization based in (location) with the mission of helping families who are in need. We provide weekly non-perishable and freshly baked goods, to ensure that every family has delicious meals. The organization was founded in (year) in memory of (founder), who was very kind and sensitive to the needs of others.</p>"></textarea>
          </div>
        </div>
        <div class="clearfix visible-sm-block visible-md-block"></div>
        <div class="col-lg-6">
          <div class="form-group">
            <label>Instructions to clients</label>
            <textarea name="instructions"
                      id="instructions"
                      class="form-control"
                      rows="5"
                      data-ng-model="$ctrl.tconfig.instructions"
                      placeholder="<p><strong>Please carefully read the following information:</strong>Boxes will be delivered by our volunteers every <strong>Wednesday</strong> evening between <strong>8:00PM and 11:00PM</strong>. Boxes will be left at your doorstep. Volunteers may knock on your door and quickly leave to keep anonymity. During holidays, or other special times, including severe weather conditions, time and day of delivery may change without notice.</p><p>We ask that you <strong>leave the empty box outside your door</strong> the following week, so it can be picked up by the volunteers and reused.</p><p>Volunteers do their best to check food items for expiry dates, however mistakes do occur. <strong>Please use your own judgment and discretion before consuming any food or contact the manufacturer directly if you have any concerns</strong>. If you find an item that is expired, you may throw it away. <strong>If there are items that you don't use, please leave them in the box, and we will make a note so that you will not receive them again</strong>.</p><p>If there is a change in your financial situation and you no longer need our assistance, if you will be away  for a certain period, if you have a change in contact information, or any other change, please inform us promptly.</p>"></textarea>
          </div>
        </div>
        <div class="clearfix"></div>
        <div class="col-lg-6">
          <div class="form-group">
            <label>Thank you to donors</label>
            <textarea name="thanks"
                      id="thanks"
                      class="form-control"
                      rows="5"
                      data-ng-model="$ctrl.tconfig.thanks"
                      placeholder="<p>In the past year, over (amount) pounds of food was distributed on a weekly basis by our team of dedicated volunteers. Your assistance helps us respond to the ever-growing demand of our community. <strong>Thank you for taking the opportunity to help turn lives around.</strong></p><p>With your help, we are able to support the less fortunate families in our community, by providing them with nutritious food and energy to grow, learn, work, and give them hope for a better and brighter future.</p>"></textarea>
          </div>
        </div>
        <div class="clearfix visible-sm-block visible-md-block"></div>
        <div class="col-lg-6">
          <div class="form-group">
            <label>Other</label>
            <textarea name="other"
                      id="other"
                      class="form-control"
                      rows="5"
                      placeholder="For later use"></textarea>
          </div>
        </div>
      </div>
    `
  })
  .name;
