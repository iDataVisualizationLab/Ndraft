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
                limitup: '=',
            },
            replace: true,
            controller: function($scope, PCAplot, Logger) {
                var first = true;
                var xScale = d3v4.scaleLinear().range([0,1000]).domain([0,1]);
                //<editor-fold desc=“new area"
                $scope.forcelayout = d3v4.forceSimulation()
                    .force('charge', d3v4.forceManyBody())
                    .force('forceX', d3v4.forceX().x(function(d) {
                        return xScale(d.vlSpec.config.typer.val[d.vlSpec.config.typer.type]);
                    })).force('forceY', d3v4.forceY().y(function(d) {
                        return 200;
                    })).force('collision', d3v4.forceCollide().radius(function(d) {
                        return 75;
                    }))
                    .on('tick', ticked);
                //</editor-fold>
                $scope.limit = $scope.initialLimit || (($scope.prop.dim<1)?10:5);
                console.log("dim: " + $scope.prop.dim + "limit: " + $scope.limit);
                $scope.limitup =  ($scope.prop.pos > $scope.limit)? ($scope.prop.pos-2) : 0;
                $scope.typeChange =function (){
                    var tolog = {level_explore: $scope.prop.dim, abtraction: $scope.prop.mark, visual_feature: $scope.prop.type};
                    Logger.logInteraction(Logger.actions.FEATURE_SELECT, $scope.prop.type,{
                        val:{PS:tolog,spec:this.vlSpec,query:this.query},
                        time:new Date().getTime()});
                    first = true;
                    PCAplot.updateSpec($scope.prop);
                    $scope.limit = $scope.initialLimit || (($scope.prop.dim<1)?10:5);
                    $scope.limitup =  ($scope.prop.pos > 1 )?Math.min( $scope.limitup,($scope.prop.pos-2)): 0;
                    console.log("dim: " + $scope.prop.dim + "limit: " + $scope.limit);
                };
                $scope.previewSlider = function (index){
                    $scope.prop.pos =index+$scope.limitup;
                    var tolog = {level_explore: $scope.prop.dim, abtraction: $scope.prop.mark, visual_feature: $scope.prop.type};
                    Logger.logInteraction(Logger.actions.FEATURE_QUICKNAVIGATION,index, {
                        val:{PS:tolog,spec:this.vlSpec,query:this.query},
                        time:new Date().getTime()});
                    //console.log($scope.prop.pos);
                };
                $scope.markChange =function (){
                    var tolog = {level_explore: $scope.prop.dim, abtraction: $scope.prop.mark, visual_feature: $scope.prop.type};
                    Logger.logInteraction(Logger.actions.TYPEPLOT_SELECT, $scope.prop.mark,{
                        val:{PS:tolog,spec:this.vlSpec,query:this.query},
                        time:new Date().getTime()});
                    first = true;
                    PCAplot.updateSpec($scope.prop);
                    $scope.limit = $scope.initialLimit || (($scope.prop.dim<1)?10:5);
                    $scope.limitup =  ($scope.prop.pos > 1 )?Math.min( $scope.limitup,($scope.prop.pos-2)): 0;
                    console.log("dim: " + $scope.prop.dim + "limit: " + $scope.limit);
                };
                function ticked (d){
                    d3v4.select(".thum").selectAll('foreignObject').data($scope.prop.previewcharts)
                        .attr("x", function(d){ return d.x-100; })
                        .attr("y", function(d){ return d.y; })
                }
                var specWatcher = $scope.$watch('prop', function(spec) {
                    $scope.limit = first?($scope.initialLimit || (($scope.prop.dim<1)?10:5)):$scope.limit;
                    first = false;
                    // console.log("dim: " + $scope.prop.dim + "limit: " + $scope.limit);
                    $scope.limitup = Math.min($scope.limitup,($scope.prop.pos > $scope.limit)? ($scope.prop.pos-2) : 0);

                    $scope.forcelayout.nodes($scope.prop.previewcharts);
                    xScale.domain(d3.extent($scope.prop.previewcharts,d=>d.vlSpec.config.typer.val[d.vlSpec.config.typer.type]))
                    $scope.forcelayout.alpha(0.1).restart()
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
