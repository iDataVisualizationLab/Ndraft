'use strict';
angular.module('pcagnosticsviz')
    .directive('guideMenu',['Heap','$timeout', function(Heap,$timeout){
        //template: "<svg id =\'bi-plot\' width=\'100%\' class=\"\"></svg>",
        let renderQueue = new Heap(function(a, b){
                return a.priority - b.priority;
            }),
            rendering = false;
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
            controller: function($scope, PCAplot, Logger,Dataset,Heap) {
                var first = true;

                //<editor-fold desc=“new area"

                //general plot variable stored
                let generalattr ={
                    svg: d3v4.select('.thum').select('svg.mainview'),
                    legend: d3v4.select('.thum').select('svg.legend'),
                    canvas: d3v4.select('.thum').select('canvas'),
                    g: d3v4.select('.thum').select('.oneDimentional'),
                    margin: {left:20, top: 75, bottom:20    , right:20},
                    width: 1200,
                    height: 1200,
                    w: function() {return this.width-this.margin.left-this.margin.right},
                    h: function() {return this.height-this.margin.top-this.margin.bottom},
                    sw: 300,
                    sh: 100,
                    force: undefined,
                    xScale: undefined,
                    yScale: undefined,
                };
                generalattr.g.attr('transform','translate('+generalattr.margin.left+','+generalattr.margin.top+')');
                let detachedContainer = document.createElement('custom');
                let dataContainer = d3v4.select(detachedContainer);

                //</editor-fold>
                //<editor-fold desc="ui-watcher">
                $scope.confict = false;
                $scope.recommendLevel = 0;
                $scope.byPass = false;

                $scope.limit = $scope.initialLimit || (($scope.prop.dim<1)?10:5);
                // console.log("dim: " + $scope.prop.dim + "limit: " + $scope.limit);
                $scope.limitup =  ($scope.prop.pos > $scope.limit)? ($scope.prop.pos-2) : 0;

                generalattr.tip = d3.tip()
                    .attr('class', 'd3-tip tips guideplot')
                    .offset([10, 20])
                    .direction('e')
                    .html(function (values, title) {
                        var str = ''
                        str += "<table>";
                        for (var i = 0; i < values.length; i++) {
                                str += "<tr>";
                                str += "<td>" + values[i].key + "</td>";
                                var val = d3.format('.2f')(values[i].value);
                                val = isNaN(val)?values[i].value:val;
                                str += "<td class=pct>" + val + "</td>";
                                str + "</tr>";
                        }
                        str += "</table>";

                        return str;
                    });


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
                var renderQueueNextPromise = null;
                function size2type (l,d){
                    const combination = d*(d-1)/2*l;
                    if (combination<50000)
                        return 0;
                    if (combination<200000)
                        return 1;
                    if (combination<500000)
                        return 2;
                    return 3;
                }
                function checkAvailability(dim) {
                    if (dim!==1){
                        $scope.confict = false;
                        let chose = $scope.marks.find(d=> d.mark === $scope.prop.mark).level;
                        return  chose;
                    }else {
                        $scope.recommendLevel = size2type(Dataset.data.length,Dataset.schema._fieldSchemas.length);
                        let chose = $scope.marks.find(d=> d.mark === $scope.prop.mark).level;
                        $scope.confict = chose < $scope.recommendLevel;
                        let finalDecision = ($scope.confict&&!$scope.byPass)?$scope.recommendLevel:chose;
                        return finalDecision;
                    }
                }
                var generalWatcher = $scope.$watch('[prop.dim,prop.type,prop.mark,prop.previewcharts.length]', function(newValue, oldValue) {
                    first = false;
                    if(newValue[0]!== oldValue[0])
                        checkAvailability(newValue[0]);
                    render($scope.prop);

                }, true); //, true /* watch equality rather than reference */);

                var posWatcher = $scope.$watch('[prop.pos,prop.previewcharts]', function(newValue, oldValue) {
                    if (newValue[1]!==oldValue[1])
                        selectInterface($scope.prop.dim,$scope.prop.pos);

                }, true);

                $scope.increaseLimit = function () {
                    $scope.limit += 4;
                };

                $scope.generateID = function (chart) {
                    return chart.fieldSet.map((d)=>d.field).join('_');
                };

                $scope.$on('$destroy', function() {
                    console.log('guidemenu destroyed');
                    // Clean up watcher
                    // specWatcher();
                    if (view) {
                        destroyView();
                    }
                    scope.destroyed = true;
                    generalWatcher();
                    posWatcher();
                    generalattr.pc2 = undefined;
                });

                $scope.byPassHandle = function (){
                    $scope.byPass = !$scope.byPass;
                    render($scope.prop);
                };

                function renderQueueNext() {
                    // render next item in the queue
                    if (renderQueue.size() > 0) {
                        var next = renderQueue.pop();
                        next.parse();
                    } else {
                        // or say that no one is rendering
                        rendering = false;
                    }

                }

                function render(data) {
                    if (!data) {
                        if (view) {
                            destroyView();
                        }
                        return;
                    }
                    function updateInterface (){
                        if ($scope.destroyed || $scope.disabled) {
                            console.log('cancel rendering', shorthand);
                            renderQueueNext();
                            return;
                        }
                        try {
                            switch ($scope.prop.dim) {
                                case 0:
                                    generalplot_1D($scope.prop);
                                    break;
                                case 1:
                                    generalplot_2D($scope.prop);
                                    break;
                                case 2:
                                    generalplot_3D($scope.prop);
                                    break;
                                default:
                                    generalplot_nD($scope.prop);
                                    break;
                            }
                        }catch (e) {
                            console.error(e, JSON.stringify($scope.prop));
                        }finally {
                            renderQueueNextPromise = $timeout(renderQueueNext, 1);
                        }

                    }

                    if (!rendering) { // if no instance is being render -- rendering now
                        rendering=true;
                        updateInterface();

                    } else {
                        // otherwise queue it
                        renderQueue.push({
                            priority: $scope.priority || 0,
                            parse: updateInterface
                        });
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
                        case 2:
                            selectplot_3D(data);
                            break;
                        default:
                            selectplot_nD(data);
                            break;
                    }
                }
                function selectplot_3D(data){
                    const dims = $scope.prop.mspec.fieldSet.map(d=>d.field);

                }

                function selectplot_nD(data){
                    const dims = $scope.prop.mspec.fieldSet.map(d=>d.field);
                    generalattr.pc2.svg.selectAll('.dimension')
                        .classed('hightlight',false)
                        .filter(f=>dims.find(d=>d===f)!==undefined)
                        .classed('hightlight',true);
                }

                function makeLegend(x,y) {
                    let legend = generalattr.legend.select('g');
                    let legednTicks = d3v4.axisLeft(d3v4.scaleLinear().domain([0, 1]).range([150, 0])).ticks(3).tickFormat(d3.format(".f"));
                    if (legend.empty()) {
                        legend = generalattr.legend.append('g')
                            .attr('class', 'legend').attr('transform', 'translate(' + (x||30) + ',' + (y||40) + ')');
                        legend.append('rect')
                            .attr('x', 0)
                            .attr('width', 20)
                            .attr('height', 150)
                            .style('fill', 'url("#linear-gradient")');
                        legend.append('text').attr('class','featureType mlabeltext')
                            .text($scope.prop.type)
                            .style('text-transform','capitalize')
                            .attr('dy','-1em')
                            .attr('transform', 'translate(' + (20) + ',' + 0 + ')');
                    }else{
                        legend.select('.featureType.mlabeltext')
                            .text($scope.prop.type);
                    }
                    legend.call(legednTicks).select('.domain').remove();
                }

                function generalplot_1D (data) {
                    // inital value
                    if (generalattr.force) {
                        generalattr.force.stop();
                    }
                    else {
                        generalattr.force = d3v4.forceSimulation()
                            .force('forceY', d3v4.forceY().strength(0.8).y(d => {
                                return generalattr.yScale(Math.abs(d.vlSpec.config.typer.val[d.vlSpec.config.typer.type]));
                            })).force('forceX', d3v4.forceX().x(function (d) {
                                return generalattr.xScale(d);
                            })).force('collision', d3v4.forceCollide().strength(1).radius(function (d) {
                                if (d.order === generalattr.mouseoverIndex) {
                                    return generalattr.sh / 2;
                                }
                                return generalattr.sh/4
                            }))
                            .on('tick', ticked);
                    }
                    generalattr.margin= {left:20, top: 75, bottom:20    , right:20};
                    generalattr.height = Math.max(800,generalattr.sh*$scope.prop.previewcharts.length/4);
                    generalattr.svg.attr('viewBox',[0,0,generalattr.width,generalattr.height].join(' '));
                    generalattr.g = d3v4.select('.thum').select('.oneDimentional');
                    generalattr.g.select('.twoDimentional').selectAll('*').remove();
                    var colorArray = ["#9cb5a0","#aec7b2","#c5d6c6","#e6e6e6","#e6e6d8","#e6d49c","#e6b061","#e6a650","#e67532","#ED5F3B"];
                    var level= colorArray.length;
                    var domain = d3.range(level).map(function(d) {return d/(level-1)});

                    generalattr.colorScale = d3v4.scaleLinear()
                        .domain(domain)
                        .range(colorArray);
                    if (generalattr.g.select('defs').empty()) {
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

                    makeLegend();
                    generalattr.yScale = d3v4.scaleLinear().range([generalattr.h()-generalattr.sh/2,generalattr.sh/2]);
                    generalattr.xScale = function(d){return 0};
                    generalattr.xRescale = d3v4.scaleLinear().domain([0,generalattr.sh/2]).range([generalattr.w()/2-generalattr.sw/2,generalattr.w()/2]);
                    function ticked (d){
                        generalattr.force.nodes($scope.prop.previewcharts)
                        const foreign = d3v4.select(".thum").selectAll('.foreignObject').data($scope.prop.previewcharts)
                            // .attr ('transform',function (d){
                            //     return'translate('+ generalattr.xRescale(d.x) +','+ (d.y-generalattr.sh/2)+')'})
                        .attr ('x',function (d){
                                return generalattr.xRescale(d.x||0)})
                            .attr ('y',function (d){
                                return (d.y-generalattr.sh/2)})
                            .on('mouseover',function (d){
                                generalattr.mouseoverIndex = d.order;
                                generalattr.force.nodes($scope.prop.previewcharts).alpha(0.01).restart();
                                // d3v4.select(this).select('foreignObject').attr('transform','scale(1)');
                                d3v4.select(this).classed('hover',true);
                            })
                                .on('mouseleave',function (d) {
                                generalattr.mouseoverIndex = -1;
                                    generalattr.force.nodes($scope.prop.previewcharts).alpha(0.3).restart();
                                    // d3v4.select(this).select('foreignObject').attr('transform','scale(0.5)');
                                d3v4.select(this).classed('hover',false);
                            });
                        foreign.select('div').style('background-color',d=>generalattr.colorScale(Math.abs(d.vlSpec.config.typer.val[d.vlSpec.config.typer.type])))
                            // .attr("x", function(d){ return generalattr.xRescale(d.x); })
                            // .attr("y", function(d){ return d.y-generalattr.sh/2; })
                    }


                    // update
                    // generalattr.yScale.domain(d3.extent($scope.prop.previewcharts,d=>Math.abs(d.vlSpec.config.typer.val[d.vlSpec.config.typer.type])));
                    generalattr.yScale.domain([0,1]);
                    generalattr.force.nodes($scope.prop.previewcharts).alpha(0.3).restart();
                    // fixedSizeForeignObjects(d3v4.select(".thum").selectAll('foreignObject').nodes());

                }

                function selectplot_1D (index) {
                    // generalattr.g.selectAll('.active').classed('active',false);
                    // generalattr.g.selectAll('.foreignObject').filter(d=>d.order==index).classed('active',true);
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
                    generalattr.margin= {left:0, top: 0, bottom:20, right:20};
                    generalattr.height = generalattr.w()+generalattr.margin.top+generalattr.margin.bottom;
                    generalattr.svg.attr('viewBox',[0,0,generalattr.width,generalattr.height]);
                    generalattr.canvas.attr('width',generalattr.width)
                        .attr('height',generalattr.height);
                    generalattr.g = d3v4.select('.thum').select('.twoDimentional');

                    makeLegend(undefined,75);
                    let sizescale = d3v4.scaleLinear()
                        .domain([0,1])
                        .range([0.5,1]);
                    // update

                    const r = PCAplot.orderVariables($scope.prop.type);
                    let domainByTrait = r.domainByTrait;
                    let traits = r.traits;

                    // traits.forEach(function(trait) {
                    //     trait.value = d3.sum($scope.prop.previewcharts.filter(pc=> pc.fieldSet.find(f=> f.field === trait.text) !== undefined ).map(d=>Math.abs(d.vlSpec.config.typer.val[d.vlSpec.config.typer.type])));
                    //     domainByTrait[trait] = [Dataset.schema.fieldSchema(trait.text).stats.min,Dataset.schema.fieldSchema(trait.text).stats.max];
                    //
                    // });
                    //
                    // traits.sort((a,b)=>b.value-a.value);

                    generalattr.xScale = d3v4.scaleBand().paddingInner(0.05).paddingOuter(0).range([0, generalattr.w()]).round(true).domain(traits.map(d=>d.text));
                    generalattr.yScale = d3v4.scaleBand().paddingInner(0.05).paddingOuter(0).range([0, generalattr.h()]).round(true).domain(traits.map(d=>d.text));
                    const xScales = d3v4.scaleLinear().range([generalattr.xScale.bandwidth()*0.15,generalattr.xScale.bandwidth()*0.85]).domain([0,1]);
                    const yScales = d3v4.scaleLinear().range([generalattr.xScale.bandwidth()*0.85,generalattr.xScale.bandwidth()*0.15]).domain([0,1]);
                    let level= 7;
                    let maincolor = d3v4.scaleSequential(d3v4.interpolateViridis);
                    var emptycolor = "#ffffff";
                    maincolor.domain([0, (level+1)*0.1]);
                    maincolor.interpolator(d3v4["interpolateGreys"]);
                    var colorpoint = d3.scale.linear()
                        .range([maincolor(0.1),maincolor(0.7)]);

                    let x = d3v4.scaleLinear()
                        .range([0, generalattr.xScale.bandwidth()]);
                    let y = d3v4.scaleLinear()
                        .range([0,generalattr.yScale.bandwidth()]);

                    $scope.prop.previewcharts.forEach(d=>{
                        const pos = [Dataset.schema.fieldSchema(d.fieldSet[0].field).index,Dataset.schema.fieldSchema(d.fieldSet[1].field).index];
                        pos.sort((a,b)=>a-b);
                        d.id = pos.join('|');
                    });

                    let labels = generalattr.g.selectAll(".mlabel")
                        .data(traits,d=>d.text);
                    labels.transition().duration(generalattr.w()).delay(function(d, i) { return generalattr.xScale(d.text); }).call(updateLabel);
                    labels.exit().remove();
                    labels.enter().call(plotLabel);

                    let ctx = generalattr.canvas.node().getContext("2d");
                    let drawPoint = function (offset,point,r) {
                        let radius = this.radius||1;
                        if (r)
                            r= xScales(r)-xScales(0);
                        var cx = (offset[0]+xScales(point[0])+generalattr.margin.left +0.5)|0;
                        var cy = (offset[1]+yScales(point[1])+generalattr.margin.top +0.5)|0;
                        switch (this?this.mark:'point'){
                            case 'hexagon':
                                mark_hexagon((r||radius),[cx,cy]);
                                ctx.fillStyle = colorpoint(point.val);
                                ctx.fill();
                                break;
                            case 'leader':
                                ctx.fillStyle = colorpoint(point.val);
                                ctx.beginPath();
                                const cr = (xScales(point.r)-xScales(0)+0.5)|0;
                                ctx.arc(cx, cy, cr<2?2:cr , 0, 2 * Math.PI);
                                ctx.fill();
                                break;
                            default:
                                // NOTE; each point needs to be drawn as its own path
                                // as every point needs its own stroke. you can get an insane
                                // speed up if the path is closed after all the points have been drawn
                                // and don't mind points not having a stroke
                                ctx.fillStyle = maincolor(0.7);
                                ctx.beginPath();
                                ctx.arc(cx, cy, r||radius, 0, 2 * Math.PI);
                                // ctx.closePath();
                                ctx.fill();
                                break;
                        }
                    };
                    let drawCanvas = function (d,pos){
                        const conf = this?this.conf:undefined;
                        return new Promise(function (resolve, reject) {
                            setTimeout(function() {
                                drawPoint = _.bind(drawPoint, conf);
                                const data = getdata(d, conf.bin);
                                if (data.length) colorpoint.domain(d3.extent(data.map(function (b) {
                                    return b.val
                                })));
                                data.forEach(e => drawPoint(pos, e, data.radius));
                            }, 20);
                            });
                    };

                    plotminisummary (Dataset.data);
                    initdrawScatterplot ();
                    let cells = generalattr.g.selectAll(".cell")
                        .data($scope.prop.previewcharts,d=>d.id);
                    cells.transition().duration(generalattr.w()).delay(function(d, i) { return generalattr.xScale(d.fieldSet[0].field); })
                        .call(updateplot);
                    cells.exit().remove();
                    cells.enter().call(plot);

                    function initdrawScatterplot (){
                        ctx.clearRect(0, 0, generalattr.width, generalattr.height);
                        ctx.fillStyle = 'black';
                    }
                    function plot(p) {
                        const subg =  p.append("g")
                            .attr("class", "cell")
                            .attr("transform", function(d) {
                                //inject cavnas
                                const pos = [generalattr.xScale(d.fieldSet[0].field),generalattr.xScale(d.fieldSet[1].field)];
                                if (pos[0]>pos[1])
                                    PCAplot.transpose(d.order);
                                pos.sort((a,b)=>a-b);
                                    drawCanvas (d,pos);
                                return "translate(" + pos[0] + "," + pos[1] + ")"; })
                            .on('click', function (d,i){
                                generalattr.g.selectAll('.active').classed('active',false);
                                d3v4.select(this).classed('active',true);
                                $scope.previewSlider(d.order)});
                        subg
                            .append("rect")
                            .attr("class", "frame")
                            .style("fill",d=>generalattr.colorScale(Math.abs(d.vlSpec.config.typer.val[d.vlSpec.config.typer.type])))
                            .attr("width", d => generalattr.xScale.bandwidth())
                            .attr("height",d => generalattr.xScale.bandwidth());
                        // svg
                        // draw scatterplot
                        // let subg_c = subg.selectAll('.cpoint')
                        //     .data(d=>getdata(d));
                        // subg_c.exit().remove();
                        // subg_c.enter().append('circle')
                        //     .attr('r',2)
                        //     .call(create_circle);
                        // subg_c.transition().duration(100).call(create_circle);

                        // canvas

                        return  subg;


                        function create_circle (p){
                            return p.attr('cx',d=>xScales(d[0]))
                                .attr('cy',d=>yScales(d[1]));
                        }
                    }

                    function mark_hexagon(radius,pos) {
                        const d3_hexbinAngles = d3.range(0, 2 * Math.PI, Math.PI / 3);
                        function hexagon(radius) {

                            return d3_hexbinAngles.map(function(angle) {
                                var x1 = Math.sin(angle) * radius+pos[0],
                                    y1 = -Math.cos(angle) * radius+pos[1];
                                return [(x1+0.5)|0, (0.5+y1)|0];
                            });
                        }

                        hexagon(radius).forEach(function(d,i) {
                            if (i === 0) {
                                ctx.moveTo(d[0], d[1]);
                                ctx.beginPath();
                            } else {
                                ctx.lineTo(d[0], d[1]);
                            }
                        });
                        ctx.closePath();
                    }
                    function distance (a, b){
                        var dx = a[0] - b[0],
                            dy = a[1] - b[1];
                        return Math.round(Math.sqrt((dx * dx) + (dy * dy))*Math.pow(10, 10))/Math.pow(10, 10);
                    }
                    function getdata (spec,conf) {
                        var fieldset = spec.fieldSet.map(function(d){return d.field});
                        fieldset.sort((a,b)=>traits.indexOf(traits.find(d=>d.text ===a))-traits.indexOf(traits.find(d=>d.text ===b)));
                        // check valid
                        const fieldValue = fieldset.map(f=>Dataset.schema._fieldSchemaIndex[f]);
                        // if (fieldValue[0].stats.distinct<2||fieldValue[1].stats.distinct<2)
                        //     return [];
                        var points =  Dataset.data.map(function(d,i){
                            var point = fieldset.map(
                                (f,i) =>{
                                    if (fieldValue[i].primitiveType === 'string') {
                                        const maxv = fieldValue[i].stats.distinct-1;
                                        return Object.keys(fieldValue[i].stats.unique).indexOf(d[f])/maxv;
                                    }
                                    // var rangec = d3.extent(d3.keys(fieldValue.stats.unique).map(d=>+d));
                                    var rangec =   [fieldValue[i].stats.min,fieldValue[i].stats.max];
                                    var scaledval = (d[f]-rangec[0])/(rangec[1]-rangec[0]);

                                    return isNaN(scaledval)?0.5:scaledval;
                                });
                            if (point.filter(p=> (p===undefined)).length)
                                return false;
                            point.data={key: i, value: d};
                            return point;
                        }).filter(d=>d);
                        // configuration bin
                        if (conf) {
                            let binf;
                                binf = scagnostics(points, {
                                    binType: conf.type,
                                    startBinGridSize: conf.type==='leader'?2.5:7,
                                    isNormalized: true,
                                    isBinned: false,
                                    outlyingUpperBound: undefined,
                                    minBins: 1,
                                    maxBins: Infinity,
                                    binOnly: true
                                });
                            // }
                            let binr;
                            if (conf.type === 'leader')
                                binr = binf.bins.map(d=>{
                                    let p = [d.x,d.y];
                                    p.val = d.length;
                                    var distances = d.map(function(p){return distance([d.x, d.y], p)*0.5});
                                    var radius = d3.max(distances);
                                    p.r = radius;
                                    return p;});
                            else
                                binr = binf.bins.map(d=>{let p = [d.x,d.y]; p.val = d.length; return p;});
                            binr.radius = binf.binRadius;
                            return binr;
                        }
                        return points;
                    }

                    function getIDfields (fields){
                        let ff = fields.map(f=> {let d ={id:Object.keys (Dataset.schema._fieldSchemaIndex).indexOf(f),name:f}; return d});
                        ff.sort((a,b)=>a.id-b.id);
                        return ff.map(d=>d.name).join('|');
                    }


                    function plotminisummary (data) {
                        let conf ={};
                        let finalDecision = checkAvailability(1);
                        switch(finalDecision){
                            case 0:
                                conf.mark = 'point';
                                conf.radius = 1;
                                break;
                            case 1:
                                conf.mark = 'hexagon';
                                conf.bin = {name: 'scagnostics',
                                    type: 'hexagon'};
                                break;
                            case 2:
                                conf.mark = 'leader';
                                conf.bin = {name: 'binnerN',
                                    type: 'leader'};
                                break;
                            default:
                                conf.mark = 'leader';
                                conf.bin = {name: 'scagnostics',
                                    type: 'leader'};
                                break;
                        }
                        drawCanvas = _.bind(drawCanvas,{conf:conf});
                    }
                    function updateplot(p) {
                        p.attr("transform", function(d) {
                            const pos = [generalattr.xScale(d.fieldSet[0].field),generalattr.xScale(d.fieldSet[1].field)];
                            if (pos[0]>pos[1])
                                PCAplot.transpose(d.order);
                            pos.sort((a,b)=>a-b);
                            return "translate(" + pos[0] + "," + pos[1] + ")"; })
                            .on('end',d=>{
                                const pos = [generalattr.xScale(d.fieldSet[0].field),generalattr.xScale(d.fieldSet[1].field)];
                                pos.sort((a,b)=>a-b);
                                drawCanvas (d,pos);
                            });
                        return p
                            .select(".frame")
                            // .attr("transform", function(d) {
                            //     const pos = (1-sizescale(Math.abs(d.vlSpec.config.typer.val[d.vlSpec.config.typer.type])))*generalattr.xScale.bandwidth()/2;
                            //     return "translate(" + pos + "," + pos + ")"; })
                            .style("fill",d=>generalattr.colorScale(Math.abs(d.vlSpec.config.typer.val[d.vlSpec.config.typer.type])))
                            .attr("width", d => generalattr.xScale.bandwidth())
                            .attr("height",d => generalattr.xScale.bandwidth());
                    }

                    function plotLabel(p) {
                        return p.append("g")
                            .attr("class", "mlabel")
                            .attr("transform", function(d) {
                                const pos = [generalattr.xScale(d.text),generalattr.xScale(d.text)+generalattr.xScale.bandwidth()];
                                return "translate(" + pos[0] + "," + pos[1] + ")"; })
                            .append("text")
                            .attr("class", "mlabeltext")
                            .attr('dy','-0.5em')
                            .text(d=>d.text);
                    }

                    function updateLabel(p) {
                        return p.attr("transform", function(d) {
                            const pos = [generalattr.xScale(d.text),generalattr.xScale(d.text)+generalattr.xScale.bandwidth()];
                            return "translate(" + pos[0] + "," + pos[1] + ")"; });
                    }

                }

                function generalplot_3D (data) {
                    // clean
                    if (generalattr.force) {
                        generalattr.force.stop();
                    }
                    // init
                    generalattr.margin= {left:0, top: 0, bottom:20, right:20};
                    generalattr.height = generalattr.w()+generalattr.margin.top+generalattr.margin.bottom;
                    generalattr.svg.attr('viewBox',[0,0,generalattr.width,generalattr.height]);
                    // generalattr.canvas.attr('width',generalattr.width)
                    //     .attr('height',generalattr.height);
                    generalattr.g = d3v4.select('.thum').select('.threeDimentional');
                    generalattr.svg.call(d3v4.drag().on('drag', dragged).on('start', dragStart).on('end', dragEnd));
                    generalattr.svg.call(generalattr.tip);

                    makeLegend(undefined,75);
                    let sizescale = d3v4.scaleLinear()
                        .domain([0,1])
                        .range([0.5,1]);
                    // update

                    const r = PCAplot.orderVariables($scope.prop.type);
                    let domainByTrait = r.domainByTrait;
                    let traits = r.traits;
                    var origin = [generalattr.width/4, generalattr.height/2], scale = 0.5, j = generalattr.width, cubesData = [], alpha = 0, beta = 0, startAngle = Math.PI/6;
                    var cubes3D = d3v4._3d()
                        .shape('CUBE')
                        .x(function(d){ return  d.x; })
                        .y(function(d){ return d.y; })
                        .z(function(d){ return d.z; })
                        .rotateY( startAngle)
                        .rotateX(-startAngle)
                        .origin(origin)
                        .scale(scale);
                    var floor3D = d3v4._3d()
                        .shape('PLANE')
                        .x(function(d){ return  d.x; })
                        .y(function(d){ return d.y; })
                        .z(function(d){ return d.z; })
                        .rotateY( startAngle)
                        .rotateX(-startAngle)
                        .origin(origin)
                        .scale(scale);
                    // traits.sort((a,b)=>b.value-a.value);

                    generalattr.xScale = d3v4.scaleBand().paddingInner(0.05).paddingOuter(0).range([0, j]).round(true).domain(traits.map(d=>d.text));
                    generalattr.yScale = d3v4.scaleBand().paddingInner(0.05).paddingOuter(0).range([-j, 0]).round(true).domain(traits.map(d=>d.text));
                    generalattr.zScale = d3v4.scaleBand().paddingInner(0.05).paddingOuter(0).range([j, 0]).round(true).domain(traits.map(d=>d.text));
                    let level= 7;
                    let maincolor = d3v4.scaleSequential(d3v4.interpolateViridis);
                    var emptycolor = "#ffffff";
                    var mx, my, mouseX, mouseY;
                    maincolor.domain([0, (level+1)*0.1]);
                    maincolor.interpolator(d3v4["interpolateGreys"]);
                    var colorpoint = d3.scale.linear()
                        .range([maincolor(0.1),maincolor(0.7)]);


                    cubesData = [];
                    $scope.prop.previewcharts.forEach(d=>{
                        let pos = d.fieldSet.map(f=> Dataset.schema.fieldSchema(f.field).index);
                        pos.sort((a,b)=>a-b);
                        d.id = pos.join('|');

                        pos = d.fieldSet.map(f=>{return {key:f.field,value: generalattr.xScale(f.field)}});
                        // if (pos[0]>pos[1])
                            // PCAplot.transpose(d.order);
                        pos.sort((a,b)=>b.value-a.value);
                        let h = generalattr.xScale.bandwidth();
                            var _cube = makeCube(pos[2].value,generalattr.yScale(pos[0].key), pos[1].value, h);
                        _cube.id = 'cube_' + d.id;
                        _cube.fields = pos;
                        _cube.height = h;
                        cubesData.push(_cube);
                    });

                    // make axis
                    var Scale3d = d3v4._3d()
                        .shape('LINE_STRIP')
                        .origin(origin)
                        .rotateY( startAngle)
                        .rotateX(-startAngle)
                        .scale(scale);

                    let axis = [[],[],[]]; //x,y,z
                    axis[0].id = 'x';
                    axis[1].id = 'y';
                    axis[2].id = 'z';
                    traits.forEach((t,i)=>{
                        axis.forEach((a,ai)=>{
                            let tick ;
                            if (ai===0) { // x
                                tick = [generalattr.xScale(t.text)+generalattr.xScale.bandwidth()/2,generalattr.yScale(traits[1].text),generalattr.xScale.bandwidth()];
                                tick.text = t.text;
                            }
                            if (ai===1) { // y
                                tick = [0,generalattr.yScale(t.text)-generalattr.xScale.bandwidth()/2,generalattr.xScale.bandwidth()];
                                tick.text = i>1?t.text:'';
                            }
                            if (ai===2){ // z
                                tick = [generalattr.xScale.bandwidth()/2,generalattr.yScale(traits[1].text),generalattr.xScale(t.text)+generalattr.xScale.bandwidth()/2];
                                tick.text = i>0?t.text:'';
                            }
                            tick.index = t.value;
                            a[i] = tick;
                        });
                    });
                    // change axis
                    // let temp = axis[0][0].text;
                    // axis[0][0][0] = generalattr.xScale(temp);
                    // axis[0][0][1] = axis[1][0][1]-generalattr.xScale.bandwidth()/2;
                    // axis[0][0][2] = 0;
                    // temp = axis[2][0].text;
                    // axis[0][0][0] = 0;
                    // axis[2][0][2] = generalattr.xScale(temp);
                    // axis[2][0][1] = axis[1][0][1]-generalattr.xScale.bandwidth()/2;
                    // make floor
                    let floor = makeFloor(0,-generalattr.xScale.bandwidth(),0,j);
                    floor.id = 'floor';


                    draw3Dcubes(cubes3D(cubesData),Scale3d(axis),floor3D([floor]),100); // displat y axis only

                    function draw3Dcubes (data,axis_data,floor_data,tt) {
                        /* --------- CUBES ---------*/
                        let cubes = generalattr.g.selectAll("g.cube")
                            .data(data, d => d.id);
                        let ce = cubes.enter().append("g")
                            .attr("class", "cube bigObject")
                            .attr('fill', function (d) {
                                return maincolor(d[0].x/j);
                            })
                            .attr('stroke', function (d) {
                                return d3v4.color(maincolor(d[0].x/j)).darker(2);
                            })
                            .merge(cubes)
                            .sort(cubes3D.sort)
                            .on('mouseover',function(d){
                                generalattr.tip.show(d.fields,this);
                            }).on('mouseleave',d=>generalattr.tip.hide());
                        cubes.exit().remove();

                        /* --------- FACES ---------*/

                        var faces = cubes.merge(ce).selectAll('path.face').data(function (d) {
                            return d.faces;
                        }, function (d) {
                            return d.face;
                        });

                        faces.enter()
                            .append('path')
                            .attr('class', 'face')
                            .attr('fill-opacity', 0.9)
                            .classed('_3d', true)
                            .merge(faces)
                            .transition().duration(tt)
                            .attr('d', cubes3D.draw);

                        faces.exit().remove();

                        /* --------- SORT TEXT & FACES ---------*/

                        ce.selectAll('._3d').sort(d3v4._3d().sort);

                        legend(axis_data,tt);

                        /* --------- FlOOR ---------*/
                        let floorInstance = generalattr.g.selectAll("path.plane")
                            .data(floor_data, d => d.id);
                        let fe = floorInstance.enter().append("path")
                            .attr("class", "plane bigObject")
                            .attr('fill', 'gray')
                            .merge(floorInstance)
                            .transition().duration(tt)
                            .attr('d', floor3D.draw);
                        floorInstance.exit().remove();

                        d3.selectAll('.bigObject').sort(d3v4._3d().sort);
                    }

                    function legend(data,tt) {
                        /* ----------- y-Scale Group ----------- */

                        let axisG = generalattr.g.selectAll('g.axisg').data(data,d=>d.id);
                        let axisn_new = axisG.enter().append("g")
                            .attr("class", "axisg");

                        let axisn = axisn_new
                            .merge(axisG)
                            .attr('text-anchor',d=>d.id!=='y'?'middle':'end')
                            .sort(Scale3d.sort);
                        /* ----------- y-Scale ----------- */

                        // var yScale = axisn.select('path.axisScale');
                        // axisn_new
                        //     .append('path')
                        //     .attr('class', '_3d axisScale')
                        //     .merge(yScale)
                        //     .transition().duration(tt)
                        //     .attr('stroke', 'black')
                        //     .attr('stroke-width', .5)
                        //     .attr('d', Scale3d.draw);
                        axisG.exit().remove();
                        /* ----------- y-Scale Text ----------- */
                        var axisText = axisG.merge(axisn).selectAll('text._3d.axisText').data(d=>d,d=>d.text);

                        axisText
                            .enter()
                            .append('text')
                            .attr('class', '_3d axisText')
                            .attr('dx', '.3em')
                            // .attr('dy', -generalattr.xScale.bandwidth()*scale/2)
                            .merge(axisText)
                            .transition().duration(tt)
                            .each(function(d){
                                d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
                            })
                            .attr('x', function(d){ return d.projected.x; })
                            .attr('y', function(d){ return d.projected.y; })
                            .text(function(d){ return d.text; });

                        axisText.exit().remove();

                        axisn.selectAll('._3d').sort(d3v4._3d().sort);
                    }

                    function makeFloor(x,y,z,size){
                        return [
                            {x: x , y: y, z: z}, // BACK  BOTTOM LEFT
                            {x: x + size, y: y, z: z}, // BACK  BOTTOM RIGHT
                            {x: x+size, y: y, z: z + size}, // FRONT BOTTOM RIGHT
                            {x: x, y: y, z: z + size}, // FRONT BOTTOM LEFT
                        ];
                    }

                    function makeCube(x,y,z,size){
                        return [
                            {x: x, y: y, z: z + size}, // FRONT TOP LEFT
                            {x: x, y: y-size, z: z + size}, // FRONT BOTTOM LEFT
                            {x: x+size, y: y-size, z: z + size}, // FRONT BOTTOM RIGHT
                            {x: x + size, y: y, z: z + size}, // FRONT TOP RIGHT
                            {x: x, y: y, z: z}, // BACK  TOP LEFT
                            {x: x , y: y-size, z: z}, // BACK  BOTTOM LEFT
                            {x: x + size, y: y-size, z: z}, // BACK  BOTTOM RIGHT
                            {x: x + size, y: y, z: z}, // BACK  TOP RIGHT
                        ];
                    }

                    function dragStart(){
                        mx = d3v4.event.x;
                        my = d3v4.event.y;
                    }

                    function dragged(){
                        mouseX = mouseX || 0;
                        mouseY = mouseY || 0;
                        beta   = (d3v4.event.x - mx + mouseX) * Math.PI / 230 ;
                        alpha  = (d3v4.event.y - my + mouseY) * Math.PI / 230  * (-1);
                        draw3Dcubes(cubes3D.rotateY(beta + startAngle).rotateX(alpha - startAngle)(cubesData)
                            , Scale3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(axis)
                            , floor3D.rotateY(beta + startAngle).rotateX(alpha - startAngle)([floor])
                            ,100);
                    }

                    function dragEnd(){
                        mouseX = d3v4.event.x - mx + mouseX;
                        mouseY = d3v4.event.y - my + mouseY;
                    }

                    function plotLabel(p) {
                        return p.append("g")
                            .attr("class", "mlabel")
                            .attr("transform", function(d) {
                                const pos = [generalattr.xScale(d.text),generalattr.xScale(d.text)+generalattr.xScale.bandwidth()];
                                return "translate(" + pos[0] + "," + pos[1] + ")"; })
                            .append("text")
                            .attr("class", "mlabeltext")
                            .attr('dy','-0.5em')
                            .text(d=>d.text);
                    }

                    function updateLabel(p) {
                        return p.attr("transform", function(d) {
                            const pos = [generalattr.xScale(d.text),generalattr.xScale(d.text)+generalattr.xScale.bandwidth()];
                            return "translate(" + pos[0] + "," + pos[1] + ")"; });
                    }

                }

                function generalplot_nD (data) {
                    // clean
                    generalattr.svg.select('g.threeDimentional').selectAll('*');
                    if (generalattr.force) {
                        generalattr.force.stop();
                    }
                    // init
                    generalattr.margin= {top: 50, left: 10, bottom: 12, right: 10};
                    generalattr.height = generalattr.w()+generalattr.margin.top+generalattr.margin.bottom;
                    generalattr.svg.attr('viewBox',[0,0,generalattr.width,generalattr.height]);
                    // generalattr.canvas.attr('width',generalattr.width)
                    //     .attr('height',generalattr.height);
                    generalattr.g = d3v4.select('.thum').select('.nDimentional');


                    //data
                    const r = PCAplot.orderVariables($scope.prop.type);
                    let domainByTrait = r.domainByTrait;
                    let traits = r.traits;
                    let dimObj ={}
                    traits.filter(t=>{let f = Dataset.schema.fieldSchema(t.text);
                    return !(f.primitiveType==="string"&&f.type==="nominal");}).forEach(t=>{
                        let dimFormat = {
                            title: t.text,
                        };
                        if (Dataset.schema.fieldSchema(t.text).type==='temporal') {
                            //FIXME will fix in future
                            dimFormat.tickFormat = function(d){
                                return '';
                            }
                            // let scaleTime =
                            // dimFormat.type = 'date';
                            // dimFormat.yscale = d3.sc;
                        }
                        dimObj[t.text] = dimFormat;
                    });
                    if (generalattr.pc2===undefined) {
                        generalattr.pc2 = generalattr.pc2||ParCoords()('.nDimentional');
                    generalattr.pc2
                        .mode("queue") // progressive rendering
                        .margin(generalattr.margin)
                        .alpha(0.2)
                        .composite("darker")
                        .color('steelblue')
                            .data(Dataset.data)
                            .bundlingStrength(0.35) // set bundling strength
                            .smoothness(0.20)
                            .bundleDimension(traits[0].text)
                            .dimensions(dimObj)
                            .render()
                            .reorderable()
                            .brushMode("1D-axes");
                        generalattr.pc2.svg.selectAll('.dimension').select('text.label').style('fill', 'black');
                        generalattr.pc2.svg.selectAll("text")
                            .style("font", "10px sans-serif");
                    }else{
                        generalattr.pc2.dimension(dimObj)
                            .render()
                            .updateAxes();
                    }
                }
                //TODO
                function Time2format(field){
                    const orderTIME = ['year','month','date'];
                    const timeStats = Dataset.schema.fieldSchema(field).timestats;
                    const highestorder = orderTIME.find(o=>timeStats[o].distinct>1);
                    if (highestorder){
                        return
                    }else{

                    }
                }
                //</editor-fold>

                //<editor-fold desc="render">
                function destroyView() {
                    // if (view) {
                    //     try {
                    //         if (scope.tip)
                    //             scope.tip.destroy();
                    //     } catch(e) {
                    //         if (scope.tip)
                    //             scope.tip.remove();
                    //     }
                    //     if (tooltip)
                    //         tooltip.destroy(); // destroy tooltip (promise and event listners)
                    //     view.off('mouseover');
                    //     view.off('mouseout');
                    //     view.destroy();
                    //     view = null;
                    //
                    //     var shorthand = getShorthand();
                    //     if (consts.debug && $window.views) {
                    //         delete $window.views[shorthand];
                    //     }
                    // }
                }
                //</editor-fold>
            }
        }
    }])
    .directive('foRepeatDirective', function() {
        return function(scope, element, attrs) {

            if (scope.$last){
                // d3.select('.thum').select('.oneDimentional').selectAll('.active').classed('active',false);
                // d3.select('.thum').select('.oneDimentional').selectAll('foreignObject').filter(d=>d.order==index).classed('active',true);
                // window.alert("im the last!");
            }
        };
    });
