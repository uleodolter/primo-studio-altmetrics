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
        this.$window      = $window;
    }

    getConfigApiKey() {
        return this.studioConfig[0].apikey || '';
    }

    getConfigISBN() {
        return this.studioConfig[0].isbn || '';
    }

    getConfigBadgeType() {
        return this.studioConfig[0].badge_type || 'medium-donut';
    }

    $onInit() {

        let vm = this;

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
            vm.$timeout(() => {
                vm.$http.get('https://api.altmetric.com/v1/' + vm.api + '/' + vm.doi).then((res) => {
                    vm.altmetric_id = res.data.altmetric_id;
                    // Get the altmetrics widget
                    vm.angularLoad.loadScript('https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js?' + Date.now()).then(() => {
                        // Create our new Primo service
                        let altmetricsSection = {
                            scrollId: "altmetrics",
                            serviceName: "altmetrics",
                            title: "brief.results.tabs.Altmetrics"
                        };
                        vm.parentCtrl.services.splice(vm.parentCtrl.services.length, 0, altmetricsSection);
                    }, (res) => {
                        console.log('altmetric loadScript failed: ' + res);
                    });
                }, (res) => {
                    console.log('altmetric api failed: ' + res);
                });
            }, 3000);
        }

        // move the altmetrics widget into the new Altmetrics service section
        let unbindWatcher = vm.$scope.$watch(() => {
            return vm.parentElement.querySelector('h4[translate="brief.results.tabs.Altmetrics"]');
        }, (newVal, oldVal) => {
            if (newVal) {
                // Get the section body associated with the value we're watching
                let sectionBody = newVal.parentElement.parentElement.parentElement.parentElement.children[1];
                if (sectionBody && sectionBody.appendChild) {
                    sectionBody.appendChild(vm.$element[0]);
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

        if (vm.$window._altmetric_embed_init) {
            delete vm.$window._altmetric_embed_init;
        }

        if (vm.$window.AltmetricTemplates) {
            delete vm.$window.AltmetricTemplates;
        }

        let embedCss = document.head.getElementById('altmetric-embed-css');
        if (embedCss) {
            embedCss.remove();
        }
        let embedJs  = document.head.getElementById('altmetric-embed-js');
        if (embedJs) {
            embedJs.remove();
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