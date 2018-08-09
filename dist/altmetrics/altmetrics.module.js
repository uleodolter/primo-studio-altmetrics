'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrimoStudioAltmetricsModule = undefined;

var _altmetrics = require('./altmetrics.component');

var _altmetrics2 = _interopRequireDefault(_altmetrics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PrimoStudioAltmetricsModule = exports.PrimoStudioAltmetricsModule = angular.module('primoStudioAltmetrics', []).component(_altmetrics2.default.selector, _altmetrics2.default).name; /**
                                                                                                                                                                                          * altmetrics.module.js
                                                                                                                                                                                          */