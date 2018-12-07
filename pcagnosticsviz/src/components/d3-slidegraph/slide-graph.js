'use strict';
angular.module('pcagnosticsviz')
    .directive('slideGraph', function(PCAplot,Spec,Pills,Logger){
        //template: "<svg id =\'bi-plot\' width=\'100%\' class=\"\"></svg>",
        return {
            templateUrl: 'components/d3-slidegraph/slide-graph.html',
            replace: true,
            scope: {
                charts: '<', // Two-way
                pos: '=',
                postSelectAction: '&',
                limit: '='
            },
            link: function postLink(scope,element) {

                var itemCount = scope.charts.length;
                var items = d3.select(".items-slider");
                //scope.PCAplot = PCAplot;
                // console.log (scope.charts);
                function setTransform() {
                    //items.style("transform",'translate3d(' + (-pos * items.node().offsetWidth) + 'px,0,0)');
                    items.style("transform",'translate3d(0,' + (-scope.pos * items.node().offsetHeight) + 'px,0)');
                }

                scope.$watch("pos",function(){
                    setTransform();
                    //PCAplot.alternativeupdate( scope.charts[scope.pos]);
                    PCAplot.mspec = scope.charts[scope.pos];
                    scope.charts[scope.pos].vlSpec.config.typer = PCAplot.prop.mspec.config.typer;
                    Pills.select(scope.charts[scope.pos].vlSpec);
                },true);

                scope.prev = function() {
                    scope.pos = Math.max(scope.pos - 1, 0);
                    Logger.logInteraction(Logger.actions.MAINVIEW_NAVIGATION, scope.pos,{
                        val:{spec:this.charts[scope.pos].vlSpec,query:this.charts[scope.pos].query},
                        time:new Date().getTime()});
                    setTransform();
                };

                scope.next = function () {
                    scope.pos = Math.min(scope.pos + 1, itemCount - 1);
                    if (scope.pos > scope.limit-1)
                        scope.limit = scope.pos+2;
                    Logger.logInteraction(Logger.actions.MAINVIEW_NAVIGATION, scope.pos,{
                        val:{spec:this.charts[scope.pos].vlSpec,query:this.charts[scope.pos].query},
                        time:new Date().getTime()});
                    setTransform();
                };

                scope.$on('$destroy', function() {
                    console.log('guideplot destroyed');
                    scope.charts = null;
                });
            }
        }
    });
