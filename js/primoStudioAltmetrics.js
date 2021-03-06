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

var altmetricsTemplate = '<div id="altmetric_badge"\n    ng-if="$ctrl.altmetric_id"\n    class="altmetric-embed"\n    data-hide-no-mentions="true"\n    data-link-target="new"\n    data-badge-type="{{$ctrl.altmetric_badge_type}}"\n    data-badge-details="right"\n    data-altmetric-id="{{$ctrl.altmetric_id}}">\n</div>\n';


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
            return this.studioConfig[0].badgetype || 'medium-donut';
        }
    }, {
        key: '$onInit',
        value: function $onInit() {

            var vm = this;

            vm.embed_js = '';
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
                        // Get the altmetrics widget
                        vm.embed_js = 'https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js?' + Date.now();
                        vm.angularLoad.loadScript(vm.embed_js).then(function () {
                            // Create our new Primo service
                            var altmetricsSection = {
                                scrollId: 'altmetrics',
                                serviceName: 'altmetrics',
                                title: 'brief.results.tabs.Altmetrics'
                            };
                            vm.parentCtrl.services.splice(vm.parentCtrl.services.length, 0, altmetricsSection);
                        }, function (res) {
                            console.log('altmetric loadScript failed: ' + res);
                        });
                    }, function (res) {
                        console.log('altmetric api failed: ' + res);
                    });
                }, 3000);
            }

            // move the altmetrics widget into the new Altmetrics service section
            var unbindWatcher = vm.$scope.$watch(function () {
                return vm.parentElement.querySelector('h4[translate="brief.results.tabs.Altmetrics"]');
            }, function (newVal, _oldVal) {
                if (newVal) {
                    // Get the section body associated with the value we're watching
                    var sectionBody = newVal.parentElement.parentElement.parentElement.parentElement.children[1];
                    if (sectionBody && sectionBody.appendChild) {
                        sectionBody.appendChild(vm.$element[0]);
                    }
                    unbindWatcher();
                }
            });
        }
    }, {
        key: '$onDestroy',
        value: function $onDestroy() {
            var vm = this;
            var el = null;

            if (vm.$window._altmetric) {
                delete vm.$window._altmetric;
            }

            // remove altmetric css/js
            if (vm.embed_js) {
                el = document.body.querySelector('[src="' + vm.embed_js + '"]');
                if (el) {
                    el.remove();
                }
                vm.embed_js = '';
            }
            document.body.querySelectorAll('script').forEach(function (script) {
                if (script.src.startsWith('https://api.altmetric.com/v1/id/')) {
                    script.parentNode.removeChild(script);
                }
            });

            el = document.head.querySelector('link[id="altmetric-embed-css"]');
            if (el) {
                el.remove();
            }
            el = document.head.querySelector('script[id="altmetric-embed-js"]');
            if (el) {
                el.remove();
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

app.requires.push(_altmetrics.PrimoStudioAltmetricsModule); /**
                                                             * main.js
                                                             */

},{"./js/altmetrics.module":3}]},{},[4]);
