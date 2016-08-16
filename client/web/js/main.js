﻿

require.config({
    baseUrl: BASEURL + 'js/app',
    // urlArgs: false, //'v=0.0.0.0.1'
    urlArgs: "bust=" + (new Date()).getTime()
});

require(
    [
        'app',
        // 'services/routeResolver',
        // 'directives/comboKelas',
        'services/authService',
        'services/httpInterceptors',
        'services/kwitansiPemabayaranService',
        'services/SiswaRombelService',
        'services/TagihanInfoService',
        'controllers/NavbarController'
    ],
    function () {
        angular.bootstrap(document, ['alHaraki']);
    });
