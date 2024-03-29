'use strict';

/**
 * @ngdoc directive
 * @name pcagnosticsviz.directive:nullFilterDirective
 * @description
 * # nullFilterDirective
 */
angular.module('pcagnosticsviz')
  .directive('nullFilterDirective', function (Spec) {
    return {
      templateUrl: 'components/nullfilterdirective/nullfilterdirective.html',
      restrict: 'E',
      scope: {},
      link: function postLink(scope, element, attrs) {
        // jshint unused:false
        scope.Spec = Spec;

        scope.updateFilter = function() {
          Spec.update();
        };
      }
    };
  });