'use strict';
angular.module('pcagnosticsviz')
    .directive('slideGraph', function(PCAplot,Spec,Pills,Logger){
        //template: "<svg id =\'bi-plot\' width=\'100%\' class=\"\"></svg>",
        return {
            templateUrl: 'components/d3-slidegraph/slide-graph.html',
            replace: true,
            scope: {
                charts: '=', // two
                pos: '=',
                postSelectAction: '&',
                limit: '=',
                limitup: '=',
            },
            link: function postLink(scope,element) {
                scope.limitconst = 1;
                scope.buffer = [];
                var itemCount = scope.charts.length;
                var items = d3.select(".items-slider");
                //scope.PCAplot = PCAplot;
                // console.log (scope.charts);
                function setTransform() {
                    //items.style("transform",'translate3d(' + (-pos * items.node().offsetWidth) + 'px,0,0)');
                    items.style("transform",'translate3d(0,' + (-(scope.pos) * items.node().offsetHeight) + 'px,0)');
                    // items.style("transform",'translate3d(0,' + (-(scope.pos-scope.limitup) * items.node().offsetHeight) + 'px,0)');
                }

                // const chartsWatcher =scope.$watch("charts",function(){
                //     console.log(scope.charts)
                //     if (scope.charts) {
                //         update_buffer(scope.pos);
                //         setTransform();
                //     }
                // },true);

                const posWatcher = scope.$watch("[pos,charts]",function(){
                    console.log(scope.pos);
                    if (scope.pos!=-1) {
                        setTransform();
                        //PCAplot.alternativeupdate( scope.charts[scope.pos]);
                        PCAplot.prop.mspec = scope.charts[scope.pos];
                        update_buffer(scope.pos);
                        scope.limitup = scope.pos;//Math.min(scope.limitup,(scope.pos > scope.limit)? (scope.pos-2) : 0);
                        // scope.charts[scope.pos].vlSpec.config.typer = PCAplot.prop.mspec.config.typer;
                        console.log(scope.buffer[scope.pos])
                        setTransform();
                        Pills.select(scope.charts[scope.pos].vlSpec);
                    }
                },true);


                scope.prev = function() {
                    scope.pos = Math.max(scope.pos - 1, 0);
                    if (scope.pos != scope.limitup)
                        update_buffer(scope.limitup, scope.pos);
                    scope.limitup = scope.pos;//Math.min(scope.limitup,(scope.pos > scope.limit)? (scope.pos-2) : 0);
                    Logger.logInteraction(Logger.actions.MAINVIEW_NAVIGATION, scope.pos,{
                        val:{spec:this.charts[scope.pos].vlSpec,query:this.charts[scope.pos].query},
                        time:new Date().getTime()});
                    setTransform();
                };

                scope.next = function () {
                    scope.pos = Math.min(scope.pos + 1, itemCount - 1);
                    scope.limitup = scope.pos;
                    console.log("--------"+scope.limitup)
                    if (scope.pos != scope.limitup)
                        update_buffer(scope.pos);
                    // if (scope.pos > scope.limit-1) {
                    //     scope.limitup = scope.pos//Math.min(scope.limitup,(scope.pos > scope.limit)? (scope.pos-2) : 0);
                        // scope.limit = 3//scope.pos + 2;
                    // }
                    Logger.logInteraction(Logger.actions.MAINVIEW_NAVIGATION, scope.pos,{
                        val:{spec:this.charts[scope.pos].vlSpec,query:this.charts[scope.pos].query},
                        time:new Date().getTime()});
                    setTransform();
                };
                function init_buffer() {
                        scope.buffer = new Array(scope.charts.length);
                }
                function update_buffer(new_pos) {
                    init_buffer();
                    scope.buffer[new_pos] = _.cloneDeep( scope.charts[new_pos]);
                }

                scope.$on('$destroy', function() {
                    console.log('guideplot destroyed');
                    posWatcher();
                });
            }
        }
    });
