import angular from 'angular';

export const users = angular.module('users', []).name;
export const core = angular.module('core', []).name;
export const customer = angular.module('customer', [users, core]).name;
export const donor = angular.module('donor', [users, core]).name;
export const driver = angular.module('driver', [users, core]).name;
export const food = angular.module('food', [users, core]).name;
export const media = angular.module('media', [users, core]).name;
export const packing = angular.module('packing', [users, core]).name;
export const questionnaire = angular.module('questionnaire', [users, core]).name;
export const schedule = angular.module('schedule', [users, core]).name;
export const settings = angular.module('settings', [users, core]).name;
export const volunteer = angular.module('volunteer', [users, core]).name;

require('./core');
require('./customer');
require('./donor');
require('./driver');
require('./food');
require('./media');
require('./packing');
require('./questionnaire');
require('./schedule');
require('./settings');
require('./users');
require('./volunteer');
