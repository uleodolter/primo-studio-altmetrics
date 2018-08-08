/*
 * altmetrics.controller.js
 *
 * https://github.com/Det-Kongelige-Bibliotek/primo-explore-rex
 * https://developers.exlibrisgroup.com/blog/Adding-Altmetrics-to-your-Primo-Full-Record-Display
 */

class PrimoStudioAltmetricsController {

    constructor(angularLoad, studioConfig, $http, $scope, $element, $timeout, $window) {
        this.angularLoad  = angularLoad;
        this.studioConfig = studioConfig;
        this.$http        = $http;
        this.$scope       = $scope;
        this.$element     = $element;
        this.$timeout     = $timeout;
        this.$windows     = $window;
    }

    $onInit() {

        let vm = this;

        // the prm-full-view container
        vm.parentElement = vm.$element.parent()[0];

        try {
            vm.doi = vm.parentCtrl.item.pnx.addata.doi[0] || '';
        } catch (e) {
            return;
        }

        if (vm.doi) {
            // If we've got a doi to work with check whether altmetrics has data for it.
            // If so, make our div visible and create a new Altmetrics service
            vm.$timeout(() => {
                vm.$http.get('https://api.altmetric.com/v1/doi/' + vm.doi).then(() => {
                    try {
                        // Get the altmetrics widget
                        angularLoad.loadScript('https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js?' + Date.now()).then(() => {});
                        // Create our new Primo service
                        let altmetricsSection = {
                            scrollId: "altmetrics",
                            serviceName: "altmetrics",
                            title: "brief.results.tabs.Altmetrics"
                        };
                        vm.parentCtrl.services.splice(vm.parentCtrl.services.length, 0, altmetricsSection);
                    } catch (e) {
                        console.log(e);
                    }
                }).catch((e) => {
                    return;
                });
            }, 3000);
        }

        // move the altmetrics widget into the new Altmetrics service section
        let unbindWatcher = vm.$scope.$watch(() => {
            return vm.parentElement.querySelector('h4[translate="brief.results.tabs.Altmetrics"]');
        }, (newVal, oldVal) => {
            if (newVal) {
                // Get the section body associated with the value we're watching
                let altContainer = newVal.parentElement.parentElement.parentElement.parentElement.children[1];
                let almt1 = vm.parentElement.children[1].children[0];
                if (altContainer && altContainer.appendChild && altm1) {
                    altContainer.appendChild(altm1);
                }
                unbindWatcher();
            }
        });
    }


    // You'd also need to look at removing the various css/js scripts loaded by this.
    // refer to: https://github.com/Det-Kongelige-Bibliotek/primo-explore-rex
    $onDestroy() {
        let vm = this;

        if (vm.$window._altmetric) {
            delete vm.$window._altmetric;
        }

        if (this.$window._altmetric_embed_init) {
            delete vm.$window._altmetric_embed_init;
        }

        if (this.$window.AltmetricTemplates) {
            delete vm.$window.AltmetricTemplates;
        }
    }
}

PrimoStudioAltmetricsController.$inject = [
    'angularLoad',
    'primoStudioAltmetricsStudioConfig',
    '$http',
    '$scope',
    '$element',
    '$timeout',
    '$window'
];

export default PrimoStudioAltmetricsController;
