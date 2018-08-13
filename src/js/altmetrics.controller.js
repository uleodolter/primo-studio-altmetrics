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
        return this.studioConfig[0].badgetype || 'medium-donut';
    }

    $onInit() {

        let vm = this;

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
            vm.$timeout(() => {
                vm.$http.get('https://api.altmetric.com/v1/' + vm.api + '/' + vm.doi).then((res) => {
                    vm.altmetric_id = res.data.altmetric_id;
                    // Get the altmetrics widget
                    vm.embed_js = 'https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js?' + Date.now();
                    vm.angularLoad.loadScript(vm.embed_js).then(() => {
                        // Create our new Primo service
                        let altmetricsSection = {
                            scrollId: 'altmetrics',
                            serviceName: 'altmetrics',
                            title: 'brief.results.tabs.Altmetrics'
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
        }, (newVal, _oldVal) => {
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


    $onDestroy() {
        let vm = this;
        let el = null;

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

        el = document.head.querySelector('link[id="altmetric-embed-css"]');
        if (el) {
            el.remove();
        }
        el = document.head.querySelector('script[id="altmetric-embed-js"]');
        if (el) {
            el.remove();
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
