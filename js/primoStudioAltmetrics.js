!function o(a,l,c){function u(e,t){if(!l[e]){if(!a[e]){var r="function"==typeof require&&require;if(!t&&r)return r(e,!0);if(s)return s(e,!0);var i=new Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}var n=l[e]={exports:{}};a[e][0].call(n.exports,function(t){return u(a[e][1][t]||t)},n,n.exports,o,a,l,c)}return l[e].exports}for(var s="function"==typeof require&&require,t=0;t<c.length;t++)u(c[t]);return u}({1:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var i,n=t("./altmetrics.controller");var o={selector:"primoStudioAltmetrics",controller:((i=n)&&i.__esModule?i:{default:i}).default,bindings:{parentCtrl:"<"},template:'<div id="altm1" ng-if="$ctrl.doi" class="altmetric-embed" data-hide-no-mentions="true"  data-link-target="new" data-badge-type="medium-donut" data-badge-details="right" data-doi="{{$ctrl.doi}}"></div>'};r.default=o},{"./altmetrics.controller":2}],2:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var i=function(){function i(t,e){for(var r=0;r<e.length;r++){var i=e[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(t,e,r){return e&&i(t.prototype,e),r&&i(t,r),t}}();var n=function(){function l(t,e,r,i,n,o,a){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,l),this.angularLoad=t,this.studioConfig=e,this.$http=r,this.$scope=i,this.$element=n,this.$timeout=o,this.$windows=a}return i(l,[{key:"$onInit",value:function(){var i=this;i.parentElement=i.$element.parent()[0];try{i.doi=i.parentCtrl.item.pnx.addata.doi[0]||""}catch(t){return}i.doi&&i.$timeout(function(){i.$http.get("https://api.altmetric.com/v1/doi/"+i.doi).then(function(){try{angularLoad.loadScript("https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js?"+Date.now()).then(function(){});i.parentCtrl.services.splice(i.parentCtrl.services.length,0,{scrollId:"altmetrics",serviceName:"altmetrics",title:"brief.results.tabs.Altmetrics"})}catch(t){console.log(t)}}).catch(function(t){})},3e3);var n=i.$scope.$watch(function(){return i.parentElement.querySelector('h4[translate="brief.results.tabs.Altmetrics"]')},function(t,e){if(t){var r=t.parentElement.parentElement.parentElement.parentElement.children[1];i.parentElement.children[1].children[0];r&&r.appendChild&&altm1&&r.appendChild(altm1),n()}})}},{key:"$onDestroy",value:function(){this.$window._altmetric&&delete this.$window._altmetric,this.$window._altmetric_embed_init&&delete this.$window._altmetric_embed_init,this.$window.AltmetricTemplates&&delete this.$window.AltmetricTemplates}}]),l}();n.$inject=["angularLoad","primoStudioAltmetricsStudioConfig","$http","$scope","$element","$timeout","$window"],r.default=n},{}],3:[function(t,e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.PrimoStudioAltmetricsModule=void 0;var i,n=t("./altmetrics.component"),o=(i=n)&&i.__esModule?i:{default:i};r.PrimoStudioAltmetricsModule=angular.module("primoStudioAltmetricsModule",[]).component(o.default.selector,o.default).name},{"./altmetrics.component":1}],4:[function(t,e,r){"use strict";var i,n=t("./altmetrics/altmetrics.module");(i=n)&&i.__esModule;app.requires.push("primoStudioAltmetrics")},{"./altmetrics/altmetrics.module":3}]},{},[4]);
//# sourceMappingURL=custom.js.map
