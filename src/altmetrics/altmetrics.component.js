/*
 * altmetrics.component.js
 */

import controller from './altmetrics.controller';

const PrimoStudioAltmetricsComponent = {
    selector: 'primoStudioAltmetrics',
    controller,
    bindings: {parentCtrl: '<'},
    template: `<div id="altm1" ng-if="$ctrl.altmetric_id" class="altmetric-embed" data-hide-no-mentions="true"  data-link-target="new" data-badge-type="medium-donut" data-badge-details="right" data-altmetric-id="{{$ctrl.altmetric_id}}"></div>`
}

export default PrimoStudioAltmetricsComponent;

