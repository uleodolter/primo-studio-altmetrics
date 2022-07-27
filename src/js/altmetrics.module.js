/**
 * altmetrics.module.js
 */

import PrimoStudioAltmetricsComponent from './altmetrics.component.js';

export const PrimoStudioAltmetricsModule = angular
    .module('primoStudioAltmetrics', [])
    .component(PrimoStudioAltmetricsComponent.selector, PrimoStudioAltmetricsComponent)
    .name;
