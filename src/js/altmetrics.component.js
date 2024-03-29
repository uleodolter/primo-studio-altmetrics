/*
 * altmetrics.component.js
 */

import altmetricsTemplate from '../html/altmetrics.template.html';
import controller from './altmetrics.controller.js';

const PrimoStudioAltmetricsComponent = {
    selector: 'primoStudioAltmetrics',
    controller,
    bindings: {parentCtrl: '<'},
    template: altmetricsTemplate
};

export default PrimoStudioAltmetricsComponent;
