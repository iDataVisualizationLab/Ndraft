'use strict';

angular.module('pcagnosticsviz')
  .directive('vgSpecEditor', function(Spec) {
    return {
      templateUrl: 'components/vgSpecEditor/vgSpecEditor.html',
      restrict: 'E',
      scope: {},
      link: function postLink(scope /*, element, attrs*/) {
        scope.Spec = Spec;
      }
    };
  });
