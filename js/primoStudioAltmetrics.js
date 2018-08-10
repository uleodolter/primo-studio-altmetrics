(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _altmetrics = require('./altmetrics.controller');

var _altmetrics2 = _interopRequireDefault(_altmetrics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * altmetrics.component.js
 */

var altmetricsTemplate = '<div id="altmetric"\n    ng-if="$ctrl.altmetric_id"\n    class="altmetric-embed"\n    data-hide-no-mentions="true"\n    data-link-target="new"\n    data-badge-type="{{$ctrl.altmetric_badge_type}}"\n    data-badge-details="right"\n    data-altmetric-id="{{$ctrl.altmetric_id}}">\n</div>\n';


var PrimoStudioAltmetricsComponent = {
    selector: 'primoStudioAltmetrics',
    controller: _altmetrics2.default,
    bindings: { parentCtrl: '<' },
    template: altmetricsTemplate
};

exports.default = PrimoStudioAltmetricsComponent;

},{"./altmetrics.controller":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * altmetrics.controller.js
 *
 * https://github.com/Det-Kongelige-Bibliotek/primo-explore-rex
 * https://developers.exlibrisgroup.com/blog/Adding-Altmetrics-to-your-Primo-Full-Record-Display
 */

var PrimoStudioAltmetricsController = function () {
    function PrimoStudioAltmetricsController(angularLoad, studioConfig, $http, $scope, $element, $timeout, $window) {
        _classCallCheck(this, PrimoStudioAltmetricsController);

        this.angularLoad = angularLoad;
        this.studioConfig = studioConfig;
        this.$http = $http;
        this.$scope = $scope;
        this.$element = $element;
        this.$timeout = $timeout;
        this.$window = $window;
    }

    _createClass(PrimoStudioAltmetricsController, [{
        key: 'getConfigApiKey',
        value: function getConfigApiKey() {
            return this.studioConfig[0].apikey || '';
        }
    }, {
        key: 'getConfigISBN',
        value: function getConfigISBN() {
            return this.studioConfig[0].isbn || '';
        }
    }, {
        key: 'getConfigBadgeType',
        value: function getConfigBadgeType() {
            return this.studioConfig[0].badge_type || 'medium-donut';
        }
    }, {
        key: '$onInit',
        value: function $onInit() {

            var vm = this;

            vm.altmetric_id = '';
            vm.altmetric_badge_type = vm.getConfigBadgeType();
            vm.altmetric_key = vm.getConfigApiKey();

            // the prm-full-view container, our parent is prm-full-view-after
            vm.parentElement = vm.$element.parent().parent()[0];

            vm.api = 'doi';
            try {
                vm.doi = vm.parentCtrl.item.pnx.addata.doi[0] || '';
            } catch (e) {
                try {
                    if (vm.getConfigISBN()) {
                        vm.doi = vm.parentCtrl.item.pnx.addata.isbn[0] || '';
                        vm.api = 'isbn';
                    }
                } catch (e) {
                    return;
                }
            }

            if (vm.doi) {
                // If we've got a doi to work with check whether altmetrics has data for it.
                // If so, make our div visible and create a new Altmetrics service
                vm.$timeout(function () {
                    vm.$http.get('https://api.altmetric.com/v1/' + vm.api + '/' + vm.doi).then(function (res) {
                        vm.altmetric_id = res.data.altmetric_id;
                        try {
                            // Get the altmetrics widget
                            vm.angularLoad.loadScript('https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js?' + Date.now()).then(function () {});
                            // Create our new Primo service
                            var altmetricsSection = {
                                scrollId: "altmetrics",
                                serviceName: "altmetrics",
                                title: "brief.results.tabs.Altmetrics"
                            };
                            vm.parentCtrl.services.splice(vm.parentCtrl.services.length, 0, altmetricsSection);
                        } catch (e) {
                            console.log(e);
                        }
                    }).catch(function (e) {
                        return;
                    });
                }, 3000);
            }

            // move the altmetrics widget into the new Altmetrics service section
            var unbindWatcher = vm.$scope.$watch(function () {
                return vm.parentElement.querySelector('h4[translate="brief.results.tabs.Altmetrics"]');
            }, function (newVal, oldVal) {
                if (newVal) {
                    // Get the section body associated with the value we're watching
                    var altContainer = newVal.parentElement.parentElement.parentElement.parentElement.children[1];
                    var almt1 = vm.parentElement.children[1].children[0];
                    if (altContainer && altContainer.appendChild && altm1) {
                        altContainer.appendChild(altm1);
                    }
                    unbindWatcher();
                }
            });
        }

        // You'd also need to look at removing the various css/js scripts loaded by this.
        // refer to: https://github.com/Det-Kongelige-Bibliotek/primo-explore-rex

    }, {
        key: '$onDestroy',
        value: function $onDestroy() {
            var vm = this;

            if (vm.$window._altmetric) {
                delete vm.$window._altmetric;
            }

            if (vm.$window._altmetric_embed_init) {
                delete vm.$window._altmetric_embed_init;
            }

            if (vm.$window.AltmetricTemplates) {
                delete vm.$window.AltmetricTemplates;
            }

            var embedCss = document.head.getElementById('altmetric-embed-css');
            if (embedCss) {
                embedCss.remove();
            }
            var embedJs = document.head.getElementById('altmetric-embed-js');
            if (embedJs) {
                embedJs.remove();
            }
        }
    }]);

    return PrimoStudioAltmetricsController;
}();

PrimoStudioAltmetricsController.$inject = ['angularLoad', 'primoStudioAltmetricsStudioConfig', '$http', '$scope', '$element', '$timeout', '$window'];

exports.default = PrimoStudioAltmetricsController;

},{}],3:[function(require,module,exports){
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

},{"./altmetrics.component":1}],4:[function(require,module,exports){
'use strict';

var _altmetrics = require('./js/altmetrics.module');

var _altmetrics2 = _interopRequireDefault(_altmetrics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

app.requires.push('primoStudioAltmetrics');

},{"./js/altmetrics.module":3}]},{},[4]);
