/**
 * altmetrics.module.js
 */

import PrimoStudioAltmetricsComponent from './altmetrics.component';

export const PrimoStudioAltmetricsModule = angular
    .module('primoStudioAltmetricsModule', [])
        .component(PrimoStudioAltmetricsComponent.selector, PrimoStudioAltmetricsComponent)
        .name;

