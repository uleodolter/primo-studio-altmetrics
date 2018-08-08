/**
 * altmetrics.module.js
 */

import PrimoStudioAltmetricsComponent from './altmetrics.component';

export const PrimoStudioAltmetricsModule = angular
    .module('primoStudioAltmetrics', [])
        .component(PrimoStudioAltmetricsComponent.selector, PrimoStudioAltmetricsComponent)
        .name;

