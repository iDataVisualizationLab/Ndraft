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
                props: '=',
                limit:'=',
                limitup: '=',
            },
            replace: true,
            controller: function($scope, PCAplot, Logger,Dataset) {
                var first = true;

                //<editor-fold desc=“new area"

                //general plot variable stored
                let generalattr ={
                    g: d3.select('.thum').select('.oneDimentional'),
                    margin: {left:20, top: 20, bottom:20, right:20},
                    width: 1200,
                    height: 1200,
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
                    // $scope.prop.pos =index+$scope.limitup;
                    console.log(index);
                    $scope.prop.pos =index;
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

                // var specWatcher = $scope.$watch('prop', function(spec) {
                //     $scope.limit = first?($scope.initialLimit || (($scope.prop.dim<1)?10:5)):$scope.limit;
                //     first = false;
                //     // console.log("dim: " + $scope.prop.dim + "limit: " + $scope.limit);
                //     $scope.limitup = Math.min($scope.limitup,($scope.prop.pos > $scope.limit)? ($scope.prop.pos-2) : 0);
                //
                //
                // }, true);

                var generalWatcher = $scope.$watch('[prop.dim,prop.type,prop.mark]', function(spec) {

                    updateInterface($scope.prop.dim,$scope.prop);

                }, true); //, true /* watch equality rather than reference */);

                var posWatcher = $scope.$watch('[prop.pos]', function(spec) {

                    selectInterface($scope.prop.dim,$scope.prop.pos);

                }, false);

                $scope.increaseLimit = function () {
                    $scope.limit += 4;
                };

                $scope.$on('$destroy', function() {
                    // Clean up watcher
                    // specWatcher();
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

                function selectInterface (dim,data){
                    switch (dim){
                        case 0:
                            selectplot_1D(data);
                            break;
                        case 1:
                            selectplot_2D(data);
                            break;
                        default:
                            selectplot_nD(data);
                            break;
                    }
                }

                function generalplot_1D (data) {
                    // inital value
                    if (generalattr.force) {

                    }
                    else {
                        generalattr.force = d3v4.forceSimulation()
                            .force('forceY', d3v4.forceY().strength(0.8).y(d => {
                                return generalattr.yScale(d.vlSpec.config.typer.val[d.vlSpec.config.typer.type]);
                            })).force('forceX', d3v4.forceX().x(function (d) {
                                return generalattr.xScale(d);
                            })).force('collision', d3v4.forceCollide().strength(0.5).radius(function (d) {
                                if (d.order === $scope.prop.pos || d.order === generalattr.mouseoverIndex) {
                                    return generalattr.sh / 2;
                                }
                                return generalattr.sh/4
                            }))
                            .on('tick', ticked);
                    }
                    generalattr.g = d3.select('.thum').select('.oneDimentional');
                    generalattr.g.select('.twoDimentional').selectAll('*').remove();

                    generalattr.yScale = d3v4.scaleLinear().range([generalattr.h()-generalattr.sh/2,generalattr.sh/2]);
                    generalattr.xScale = function(d){return 0};
                    generalattr.xRescale = d3v4.scaleLinear().domain([0,generalattr.sh/2]).range([generalattr.w()/2,generalattr.w()/2+generalattr.sw/2]);
                    function ticked (d){
                        d3v4.select(".thum").selectAll('.foreignObject').data($scope.prop.previewcharts)
                            .attr ('transform',function (d){
                                return'translate('+ generalattr.xRescale(d.x) +','+ (d.y-generalattr.sh/2)+')'})
                            .on('mouseover',function (d){
                                generalattr.mouseoverIndex = d.order;
                                generalattr.force.nodes($scope.prop.previewcharts).alpha(0.01).restart();
                                d3.select(this).classed('hover',true);
                            })
                                .on('mouseleave',function (d) {
                                generalattr.mouseoverIndex = -1;
                                    generalattr.force.nodes($scope.prop.previewcharts).alpha(0.3).restart();
                                d3.select(this).classed('hover',false);
                            });
                            // .attr("x", function(d){ return generalattr.xRescale(d.x); })
                            // .attr("y", function(d){ return d.y-generalattr.sh/2; })
                    }


                    // update
                    generalattr.yScale.domain(d3.extent($scope.prop.previewcharts,d=>d.vlSpec.config.typer.val[d.vlSpec.config.typer.type]));
                    generalattr.force.nodes($scope.prop.previewcharts).alpha(0.3).restart();
                    // fixedSizeForeignObjects(d3v4.select(".thum").selectAll('foreignObject').nodes());

                }

                function selectplot_1D (index) {
                    generalattr.g.selectAll('.active').classed('active',false);
                    generalattr.g.selectAll('.foreignObject').filter(d=>d.order==index).classed('active',true);
                    generalattr.force.nodes($scope.prop.previewcharts).alpha(0.3).restart();
                }

                function selectplot_2D (index) {
                    generalattr.g.selectAll('.active').classed('active',false);
                    generalattr.g.selectAll('.cell').filter(d=>d.order==index).classed('active',true);
                }

                function generalplot_2D (data) {
                    // clean
                    if (generalattr.force) {
                        generalattr.force.stop();
                    }
                    // init
                    generalattr.g = d3.select('.thum').select('.twoDimentional');

                    var colorArray = ["#77946F","#aec7b2","#c5d6c6","#e6e6e6","#e6e6d8","#e6d49c","#e6b061","#e6852f","#e6531a","#e61e1a"];
                    var level= colorArray.length;
                    var domain = d3.range(level).map(function(d) {return d/(level-1)});
                    let rainbowcolor = d3v4.scaleLinear()
                        .domain(domain)
                        .range(colorArray);
                    if (generalattr.g.select('defs')[0][0]==null) {
                        const defs = generalattr.g.append('defs');
                        let colorGradient = defs.append('linearGradient')
                            .attr('id','linear-gradient')
                            .attr('x1','0%')
                            .attr('x2','0%')
                            .attr('y1','100%')
                            .attr('y2','0%');
                        colorGradient.selectAll("stop").data(colorArray).enter()
                            .append('stop')
                            .attr('offset',(d,i)=> (i / (level - 1) * 100) + '%')
                            .attr('stop-color',(d)=>d);
                    }
                    let legend = generalattr.g.select('.legend');
                    if (legend[0][0] === null) {
                        legend = generalattr.g.append('g')
                            .attr('class','legend').attr('transform','translate('+(generalattr.w()-50)+','+0+')');
                        legend.append('rect')
                            .attr('x',20)
                            .attr('width',30)
                            .attr('height',150)
                            .style('fill','url("#linear-gradient")')
                    }

                    let sizescale = d3v4.scaleLinear()
                        .domain([0,1])
                        .range([0.5,1]);

                    // update

                    let domainByTrait = {},
                        traits = Dataset.schema.fieldSchemas.map(d=>{return {text:d.field,value:0}});

                    traits.forEach(function(trait) {
                        trait.value = d3.sum($scope.prop.previewcharts.filter(pc=> pc.fieldSet.find(f=>f.field==trait.text) !== undefined ).map(d=>d.vlSpec.config.typer.val[d.vlSpec.config.typer.type]));
                        domainByTrait[trait] = [Dataset.schema.fieldSchema(trait.text).stats.min,Dataset.schema.fieldSchema(trait.text).stats.max];

                    });
                    traits.sort((a,b)=>b.value-a.value);

                    generalattr.xScale = d3v4.scaleBand().range([0, generalattr.w()]).domain(traits.map(d=>d.text)).paddingInner(0.05);
                    generalattr.yScale = d3v4.scaleBand().range([0, generalattr.h()]).domain(traits.map(d=>d.text));

                    let x = d3v4.scaleLinear()
                        .range([0, generalattr.xScale.bandwidth()]);
                    let y = d3v4.scaleLinear()
                        .range([0,generalattr.yScale.bandwidth()]);

                    $scope.prop.previewcharts.forEach(d=>{
                        const pos = [d.fieldSet[0].field,d.fieldSet[1].field];
                        pos.sort((a,b)=>a-b);
                        d.id = pos.join('|') + pos.reverse().join('|');
                    });

                    let labels = generalattr.g.selectAll(".mlabel")
                        .data(traits,d=>d.text);
                    labels.transition().duration(generalattr.w()).delay(function(d, i) { return generalattr.xScale(d.text); }).call(updateLabel);
                    labels.exit().remove();
                    labels.enter().call(plotLabel);

                    let cells = generalattr.g.selectAll(".cell")
                        .data($scope.prop.previewcharts,d=>d.id);
                    cells.transition().duration(generalattr.w()).delay(function(d, i) { return generalattr.xScale(d.fieldSet[0].field); }).call(updateplot);
                    cells.exit().remove();
                    cells.enter().call(plot);

                    function plot(p) {
                        return p.append("g")
                            .attr("class", "cell")
                            .attr("transform", function(d) {
                                const pos = [generalattr.xScale(d.fieldSet[0].field),generalattr.xScale(d.fieldSet[1].field)];
                                pos.sort((a,b)=>a-b);
                                return "translate(" + pos[0] + "," + pos[1] + ")"; })
                            .on('click', function (d,i){
                                generalattr.g.selectAll('.active').classed('active',false);
                                d3.select(this).classed('active',true);
                                $scope.previewSlider(d.order)})
                            .append("rect")
                            // .attr("transform", function(d) {
                            //     const pos = (1-sizescale(d.vlSpec.config.typer.val[d.vlSpec.config.typer.type]))*generalattr.xScale.bandwidth()/2;
                            //     return "translate(" + pos + "," + pos + ")"; })
                            .attr("class", "frame")
                            .style("fill",d=>rainbowcolor(d.vlSpec.config.typer.val[d.vlSpec.config.typer.type]))
                            .attr("width", d => generalattr.xScale.bandwidth())
                            .attr("height",d => generalattr.xScale.bandwidth());
                    }

                    function updateplot(p) {
                        return p.attr("transform", function(d) {
                            const pos = [generalattr.xScale(d.fieldSet[0].field),generalattr.xScale(d.fieldSet[1].field)];
                            pos.sort((a,b)=>a-b);
                            return "translate(" + pos[0] + "," + pos[1] + ")"; })
                            .select(".frame")
                            // .attr("transform", function(d) {
                            //     const pos = (1-sizescale(d.vlSpec.config.typer.val[d.vlSpec.config.typer.type]))*generalattr.xScale.bandwidth()/2;
                            //     return "translate(" + pos + "," + pos + ")"; })
                            .style("fill",d=>rainbowcolor(d.vlSpec.config.typer.val[d.vlSpec.config.typer.type]))
                            .attr("width", d => generalattr.xScale.bandwidth())
                            .attr("height",d => generalattr.xScale.bandwidth());
                    }

                    function plotLabel(p) {
                        return p.append("g")
                            .attr("class", "mlabel")
                            .attr("transform", function(d) {
                                const pos = [generalattr.xScale(d.text)+generalattr.xScale.bandwidth()/2,generalattr.xScale(d.text)+generalattr.xScale.bandwidth()/2];
                                return "translate(" + pos[0] + "," + pos[1] + ")"; })
                            .append("text")
                            .attr("class", "mlabeltext")
                            .attr('dy','0.5em')
                            .text(d=>d.text);
                    }

                    function updateLabel(p) {
                        return p.attr("transform", function(d) {
                            const pos = [generalattr.xScale(d.text)+generalattr.xScale.bandwidth()/2,generalattr.xScale(d.text)+generalattr.xScale.bandwidth()/2];
                            return "translate(" + pos[0] + "," + pos[1] + ")"; });
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
                // d3.select('.thum').select('.oneDimentional').selectAll('.active').classed('active',false);
                // d3.select('.thum').select('.oneDimentional').selectAll('foreignObject').filter(d=>d.order==index).classed('active',true);
                // window.alert("im the last!");
            }
        };
    });
