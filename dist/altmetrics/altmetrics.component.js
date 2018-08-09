'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _altmetrics = require('./altmetrics.controller');

var _altmetrics2 = _interopRequireDefault(_altmetrics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PrimoStudioAltmetricsComponent = {
    selector: 'primoStudioAltmetrics',
    controller: _altmetrics2.default,
    bindings: { parentCtrl: '<' },
    template: '<div id="altm1" ng-if="$ctrl.doi" class="altmetric-embed" data-hide-no-mentions="true"  data-link-target="new" data-badge-type="medium-donut" data-badge-details="right" data-doi="{{$ctrl.doi}}"></div>'
}; /*
    * altmetrics.component.js
    */

exports.default = PrimoStudioAltmetricsComponent;