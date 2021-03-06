'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'];

    var KelasService = function ($http, $q) {
        var serviceBase = BASEAPIURL,
            factory = {};

        factory.get = function (paramdata) {
            // return getResource('kelas', pageIndex, pageSize);
            return $http.get(serviceBase + 'kelas',{
                params : paramdata
            }).then(function (results) {
                return results.data;
            });
        };

        factory.getList = function(paramdata) {
            return $http.get(serviceBase + 'kelas/list',{
                params : paramdata
            }).then(function (results) {
                return results.data;
            });
        };

        factory.getGroupKelas = function() {
            return $http.get(serviceBase + 'kelas?scenario=1',{}).then(function (results) {
                return results.data;
            });
        };

        factory.insert = function (params) {
            return $http.post(serviceBase + 'kelas', params).then(function (results) {
                return results.data;
            });
        };

        factory.new = function () {
            return $q.when({ id: 0 });
        };

        factory.update = function (params) {
            return $http.put(serviceBase + 'kelas/' + params.id, params).then(function (status) {
                return status.data;
            });
        };

        factory.delete = function (id) {
            return $http.delete(serviceBase + 'kelas/' + id).then(function (status) {
                return status.data;
            });
        };

        factory.getById = function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'kelas/' + id).then(function (results) {
                // extendData([results.data]);
                return results.data;
            });
        };

        function getResource(baseResource, pageIndex, pageSize) {
            var resource = baseResource;
            resource += (arguments.length == 3) ? buildPagingUri(pageIndex, pageSize) : '';
            return $http.get(serviceBase + resource).then(function (response) {
                return (response.data) ? response.data : null;
            });
        }

        function buildPagingUri(pageIndex, pageSize) {
            var uri = '?page=' + pageIndex + '&per-page=' + pageSize;
            return uri;
        }

        return factory;
    };

    KelasService.$inject = injectParams;

    app.factory('KelasService', KelasService);

});