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
            controller: function($scope, PCAplot, Logger,Dataset) {
                var first = true;

                //<editor-fold desc=“new area"

                //general plot variable stored
                let generalattr ={
                    g: d3.select('.thum').select('.svgg'),
                    margin: {left:20, top: 20, bottom:20, right:20},
                    width: 800,
                    height: 800,
                    w: function() {return this.width-this.margin.left-this.margin.right},
                    h: function() {return this.height-this.margin.top-this.margin.bottom},
                    sw: 270,
                    sh: 130,
                    force: undefined,
                    xScale: undefined,
                    yScale: undefined,
                };
                generalattr.g.attr('transform','translate('+generalattr.margin.left+','+generalattr.margin.top+')');

                //</editor-fold>


                $scope.limit = $scope.initialLimit || (($scope.prop.dim<1)?10:5);
                // console.log("dim: " + $scope.prop.dim + "limit: " + $scope.limit);
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

                var specWatcher = $scope.$watch('prop', function(spec) {
                    $scope.limit = first?($scope.initialLimit || (($scope.prop.dim<1)?10:5)):$scope.limit;
                    first = false;
                    // console.log("dim: " + $scope.prop.dim + "limit: " + $scope.limit);
                    $scope.limitup = Math.min($scope.limitup,($scope.prop.pos > $scope.limit)? ($scope.prop.pos-2) : 0);


                }, true);

                var generalWatcher = $scope.$watch('[prop.dim,prop.mark,prop.type]', function(spec) {

                    updateInterface($scope.prop.dim,$scope.prop);

                }, true) //, true /* watch equality rather than reference */);

                $scope.increaseLimit = function () {
                    $scope.limit += 4;
                };

                $scope.$on('$destroy', function() {
                    // Clean up watcher
                    specWatcher();
                    generalWatcher();
                });

                function updateInterface (dim,data){
                    switch (dim){
                        case 0:
                            generalplot_1D(data);
                            break;
                        case 1:
                            generalplot_2D(data);
                            break;
                        default:
                            generalplot_nD(data);
                            break;
                    }
                }

                function generalplot_1D (data) {
                    // inital value
                    if (generalattr.force) {
                        generalattr.force.stop();
                    }
                    else {
                        generalattr.force = d3v4.forceSimulation()
                            .force('forceX', d3v4.forceX().x(d => {
                                return generalattr.xScale(d.vlSpec.config.typer.val[d.vlSpec.config.typer.type]);
                            })).force('forceY', d3v4.forceY().y(function (d) {
                                return generalattr.yScale(d);
                            })).force('collision', d3v4.forceCollide().radius(function (d) {
                                return generalattr.sh/2;
                            }))
                            .on('tick', ticked);
                        generalattr.force.stop();
                    }

                    generalattr.xScale = d3v4.scaleLinear().range([generalattr.sw/2,generalattr.w()-generalattr.sw]);
                    generalattr.yScale = function(d){return generalattr.sh/2};
                    function ticked (d){
                        d3v4.select(".thum").selectAll('foreignObject').data($scope.prop.previewcharts)
                            .attr("x", function(d){ return d.x-100; })
                            .attr("y", function(d){ return d.y; })
                    }


                    // update
                    generalattr.xScale.domain(d3.extent($scope.prop.previewcharts,d=>d.vlSpec.config.typer.val[d.vlSpec.config.typer.type]));
                    generalattr.force.nodes($scope.prop.previewcharts);
                    // fixedSizeForeignObjects(d3v4.select(".thum").selectAll('foreignObject').nodes());
                    generalattr.force.alpha(0.3).restart();

                }

                function generalplot_2D (data) {
                    // clean
                    if (generalattr.force) {
                        generalattr.force.stop();
                    }
                    // init
                    var level= 7;
                    var domain = d3.range(level).map(function(d) {return d/(level-1)});
                    let rainbowcolor = d3v4.scaleLinear()
                        .domain(domain)
                        .range(["#110066", "#4400ff", "#00cccc", "#00dd00", "#ffcc44", "#ff0000", "#660000"]);
                    let sizescale = d3v4.scaleLinear()
                        .domain([0,1])
                        .range([0.5,1]);
                    // update

                    let domainByTrait = {},
                        traits = _.uniq(d3.merge($scope.prop.previewcharts.map(d=>d.fieldSet.map(e=>e.field))));

                    traits.forEach(function(trait) {
                        domainByTrait[trait] = [Dataset.schema.fieldSchema(trait).stats.min,Dataset.schema.fieldSchema(trait).stats.max];

                    });

                    generalattr.xScale = d3v4.scaleBand().range([0, generalattr.w()]).domain(traits);
                    generalattr.yScale = d3v4.scaleBand().range([0, generalattr.h()]).domain(traits);

                    let x = d3v4.scaleLinear()
                        .range([0, generalattr.xScale.bandwidth()]);
                    let y = d3v4.scaleLinear()
                        .range([0,generalattr.yScale.bandwidth()]);

                    $scope.prop.previewcharts.forEach(d=>{
                        const pos = [d.fieldSet[0].field,d.fieldSet[1].field];
                        pos.sort((a,b)=>generalattr.xScale(a)-generalattr.xScale(b));
                        d.id = pos + pos.reverse();
                    });

                    let cells = generalattr.g.selectAll(".cell")
                        .data($scope.prop.previewcharts,d=>d.id);
                    cells.transition().duration(1000).call(updateplot);
                    cells.exit().remove();
                    cells.enter().call(plot);

                    function plot(p) {
                        return p.append("g")
                            .attr("class", "cell")
                            .attr("transform", function(d) {
                                const pos = [generalattr.xScale(d.fieldSet[0].field),generalattr.xScale(d.fieldSet[1].field)];
                                pos.sort((a,b)=>a-b);
                                return "translate(" + pos[0] + "," + pos[1] + ")"; })
                            .on('click', (d,i)=>$scope.previewSlider(i))
                            .append("rect")
                            .attr("class", "frame")
                            .style("fill",d=>rainbowcolor(d.vlSpec.config.typer.val[d.vlSpec.config.typer.type]))
                            .attr("width", d => generalattr.xScale.bandwidth()*sizescale(d.vlSpec.config.typer.val[d.vlSpec.config.typer.type]))
                            .attr("height",d => generalattr.xScale.bandwidth()*sizescale(d.vlSpec.config.typer.val[d.vlSpec.config.typer.type]));
                    }

                    function updateplot(p) {
                        return p.attr("transform", function(d) {
                            const pos = [generalattr.xScale(d.fieldSet[0].field),generalattr.xScale(d.fieldSet[1].field)];
                            pos.sort((a,b)=>a-b);
                            return "translate(" + pos[0] + "," + pos[1] + ")"; })
                            .select(".frame")
                            .style("fill",d=>rainbowcolor(d.vlSpec.config.typer.val[d.vlSpec.config.typer.type]));
                    }

                }

                function generalplot_nD (data) {

                }




            }
        }
    })
    .directive('foRepeatDirective', function() {
        return function(scope, element, attrs) {

            if (scope.$last){
                // window.alert("im the last!");
            }
        };
    });
