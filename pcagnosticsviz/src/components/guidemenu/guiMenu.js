'use strict';
angular.module('pcagnosticsviz')
    .directive('guideMenu', function(){
        //template: "<svg id =\'bi-plot\' width=\'100%\' class=\"\"></svg>",
        return {
            templateUrl: 'components/guidemenu/guideMenu.html',
            restrict: 'E',
            scope: {
                prop: '=',
                initialLimit: '<',
                priority:'<',
                marks: '<',
                props: '<',
                limit:'=',
                limitup: '<',
            },
            replace: true,
            controller: function($scope, PCAplot) {
                var first = true;
                $scope.limit = $scope.initialLimit || (($scope.prop.dim<1)?10:5);
                console.log("dim: " + $scope.prop.dim + "limit: " + $scope.limit);
                $scope.limitup =  ($scope.prop.pos > $scope.limit)? ($scope.prop.pos-2) : 0;
                //$scope.marks = ['tick', 'bar','area','boxplot'];
                //$scope.props = ['PCA1', 'skewness', 'outlier', 'PCA2'];
                $scope.typeChange =function (){
                    first = true;
                    PCAplot.updateSpec($scope.prop);
                    $scope.limit = $scope.initialLimit || (($scope.prop.dim<1)?10:5);
                    $scope.limitup =  ($scope.prop.pos > 1 )?Math.min( $scope.limitup,($scope.prop.pos-2)): 0;
                    console.log("dim: " + $scope.prop.dim + "limit: " + $scope.limit);
                };
                $scope.previewSlider = function (index){
                    $scope.prop.pos =index;

                    //console.log($scope.prop.pos);
                };
                $scope.markChange =function (){
                    first = true;
                    PCAplot.updateSpec($scope.prop);
                    $scope.limit = $scope.initialLimit || (($scope.prop.dim<1)?10:5);
                    $scope.limitup =  ($scope.prop.pos > 1 )?Math.min( $scope.limitup,($scope.prop.pos-2)): 0;
                    console.log("dim: " + $scope.prop.dim + "limit: " + $scope.limit);
                };
                var specWatcher = $scope.$watch('prop', function(spec) {
                    $scope.limit = first?($scope.initialLimit || (($scope.prop.dim<1)?10:5)):$scope.limit;
                    first = false;
                    console.log("dim: " + $scope.prop.dim + "limit: " + $scope.limit);
                    $scope.limitup =  ($scope.prop.pos > 1 )?Math.min( $scope.limitup,($scope.prop.pos-2)): 0;
                }, true); //, true /* watch equality rather than reference */);

                $scope.increaseLimit = function () {
                    $scope.limit += 4;
                };

                $scope.$on('$destroy', function() {
                    // Clean up watcher
                    specWatcher();
                });
            }
        }
    });
