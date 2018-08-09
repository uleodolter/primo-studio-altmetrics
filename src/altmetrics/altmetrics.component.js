/*
 * altmetrics.component.js
 */

import controller from './altmetrics.controller';

const PrimoStudioAltmetricsComponent = {
    selector: 'primoStudioAltmetrics',
    controller,
    bindings: {parentCtrl: '<'},
    template: `<div id="altm1" ng-if="$ctrl.doi" class="altmetric-embed" data-hide-no-mentions="true"  data-link-target="new" data-badge-type="medium-donut" data-badge-details="right" data-doi="{{$ctrl.doi}}"></div>`
};

export default PrimoStudioAltmetricsComponent;

