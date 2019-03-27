'use strict';
angular.module('pcagnosticsviz')
    .factory("scagworker",['$q',function($q){

        var worker = new Worker('scagworker.js');
        var defer = $q.defer();
        worker.addEventListener('message', function(e) {
            console.log('Worker said: ', e.data);
            defer.resolve(e.data);
        }, false);
        var scagWork = {};
        scagWork.scag2D = function(myData){
            defer = $q.defer();
            worker.postMessage({action: '2D',data: myData}); // Send data to our worker.
            return defer.promise;
        };
        scagWork.scag3D = function(myData){
            defer = $q.defer();
            worker.postMessage({action: '3D',data: myData}); // Send data to our worker.
            return defer.promise;
        };
        scagWork.scagnD = function(myData){
            defer = $q.defer();
            worker.postMessage({action: 'nD',data: myData}); // Send data to our worker.
            return defer.promise;
        };
        return scagWork;

    }]);