'use strict';

angular.module('pcagnosticsviz')
    .factory('PCAplot', function(ANY,Dataset,_, vg, vl, cql, ZSchema,Logger, consts,FilterManager ,Pills,NotifyingService,Alternatives,Alerts,Chart,Config,Schema,util,GuidePill, Webworker) {
        var keys =  _.keys(Schema.schema.definitions.Encoding.properties).concat([ANY+0]);
        var colordot = '#4682b4';
        var states = {IDLE:0,GENERATE_GUIDE:1,GENERATE_ALTERNATIVE:2,FREE:3, UPDATEPOSITION:4};
        var limitDefault = Infinity;
        function instantiate() {
            return {
                data: Config.data,
                transform: {
                },
                mark: 'bar',
                encoding: keys.reduce(function(e, c) {
                    e[c] = {};
                    return e;
                }, {}),
                config: Config.config,
                groupBy: 'auto',
                orderBy: 'auto',
                autoAddCount: false,
                type: 'auto'
            };
        }

        var PCAplot = {
            dataencde: null,
            alternatives: [],
            autoGroupBy: null,
            spec: null,
            firstrun:true,
            chart:null,
            charts:[],
            mainfield: null,
            prop:null,
            dim: 0,
            dataref:[],
            limit: 10,
            mspec:null,
            limitup: 0,
            state:states.IDLE,
        };
        PCAplot.mark2plot = mark2plot;
        var abtractionLevel =['Individual instances','Regular binning','Data-dependent binning','Abtracted'];
        var support =[{
            types : ['outlier','variance', 'multimodality', 'skewness'],
            marks : ['tick','bar','area','boxplot'],
            option : 'auto',
            getmark: getmark
        }, {
            types : ['outlying','sparse','clumpy','skewed','striated','convex','skinny','stringy','monotonic'],
            marks :['point','hexagon','leader','contour'],
            option : 'auto',
            getmark: getmark
        }, {
            types : ['outlying','sparse','clumpy','skewed'],
            marks :['scatter3D-point','scatter3D-evenbin','scatter3D','scatter3D-contour'],
            option : 'auto',
            getmark: getmark
        }, {
            types : ['outlying'],
            marks :['radar','radar-evenbin','radar-leader','radar-contour'],
            option : 'auto',
            getmark: getmark
        }];
        support.getsupport = function(dim){
            var supportdim = ( dim> (support.length-1))?(support.length-1):dim;
            return support[supportdim];
        };
        //PCAplot.updateplot = function (data){};
        PCAplot.plot =function(dataor,dimension) {
            if (!Object.keys(Config.data).length){return PCAplot;}
            if (!PCAplot.firstrun && (Dataset.currentDataset[Object.keys(Config.data)[0]]===Config.data[Object.keys(Config.data)[0]])) {return PCAplot;}
            //console.log("PLOT!!!!");
            PCAplot.firstrun = false;
            // d3.select('#bi-plot').selectAll('g').remove();

            // Biplot.data;
            //var data = Dataset.data);
            if (typeof dataor !=='undefined' ) {
                PCAplot.data = [Dataset.schema.fieldSchemas, PCAplot.dataref];
                var biplotselect = $('.biplot');
                var data = _.cloneDeep(dataor);
                var margin = {top: 20, right: 20, bottom: 20, left: 20};
                var width = biplotselect.width() - margin.left - margin.right;
                var height = biplotselect.width() - margin.top - margin.bottom;
                var angle = Math.PI * 0;
//var color = d3.scaleOrdinal(d3.schemeCategory10);
                var color = d3.scale.category10();
                var x = d3.scale.linear().range([0, width]); // switch to match how R biplot shows it
                var y = d3.scale.linear().range([height, 0]);
                var rdot = 2;
                // sub space
                var submarign = {top: 5, right: 5, bottom: 5, left: 5};
                var subgSize = {
                    w: (40 - submarign.left - submarign.right),
                    h: (40 - submarign.top - submarign.bottom),
                };
                var subx = d3.scale.linear().range([submarign.left, subgSize.w + submarign.left]).domain([0, 1]); // switch to match how R biplot shows it
                var suby = d3.scale.linear().range([submarign.top + subgSize.h, submarign.top]).domain([0, 1]);

                var svg_main = d3.select("#bi-plot")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                ;
                var menu = svg_main.select('#bi-plot');
                var svg = svg_main.select("#bi-plot-g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                // svg_main
                //     .call(d3.behavior.zoom().on("zoom", function () {
                //             svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
                //     }));
                svg_main.select('.overlay')
                    .attr('width',width+margin.left+margin.right)
                    .attr('height',height+margin.top+margin.bottom)
                    .style('fill','none');
                var g_axis = svg.select("#bi-plot-axis");
                var g_point = svg.select("#bi-plot-point");
                var idlabel = [],
                    brand_names = [],
                    matrix = [],
                    outlier = [];
                var dataref = null;
                if (dimension === 0) {

                    brand_names = Dataset.schema._fieldSchemas.filter(d=>(d.type!=="temporal"&& d.primitiveType!=="string")).map(d=>d.field);
                    matrix = data2Num(data,brand_names);

                    outlier = Dataset.schema._fieldSchemas.map(function (b, i) {
                       const  d= b.field
                        // var outliernum = 0,
                        //     row = matrix.map(function (r) {
                        //         return r[i]
                        //     }),
                        //     q1 = ss.quantile(row, 0.25),
                        //     q3 = ss.quantile(row, 0.75),
                        //     iqr = (q3 - q1) * 1.5;
                        // //iqr = Dataset.schema.fieldSchema(d).stats.stdev*1.35;
                        // // console.log('q1: '+q1+'q3: '+q3+'iqr: '+iqr);
                        // Dataset.schema.fieldSchema(d).stats.q1 = q1;
                        // Dataset.schema.fieldSchema(d).stats.q3 = q3;
                        // Dataset.schema.fieldSchema(d).stats.q1iqr = Math.max(q1 - iqr, ss.min(row));
                        // Dataset.schema.fieldSchema(d).stats.q3iqr = Math.min(q3 + iqr, ss.max(row));
                        // Dataset.schema.fieldSchema(d).stats.iqr = iqr;
                        // //console.log(Dataset.schema.fieldSchema(d).stats);
                        // row.forEach(function (e) {
                        //     if ((e < q1 - 2 * iqr) || (e > q3 + 2 * iqr))
                        //         outliernum += 10;
                        //     else if ((e < q1 - iqr) || (e > q3 + iqr))
                        //         outliernum = outliernum + 1;
                        // });

                        if ((Dataset.schema.fieldSchema(d).type !== "quantitative") || (Dataset.schema.fieldSchema(d).primitiveType === "string")) {
                            Dataset.schema.fieldSchema(d).stats.outlier = 0;
                            Dataset.schema.fieldSchema(d).stats.variance = 0;
                            Dataset.schema.fieldSchema(d).stats.modeskew = 0;
                            Dataset.schema.fieldSchema(d).stats.multimodality = 0;
                        }
                        return Dataset.schema.fieldSchema(d).stats.outlier;
                    });
                    var outlier_scale = d3v4.scaleLinear().domain(d3.extent(outlier)).range([0,1]);
                    outlier = outlier.map(o=>outlier_scale(o));
                }
                else {
                    var newdata = [];
                    data.forEach(function (d) {
                        for (var e in d[d.field]) {
                            if (d[d.field][e].invalid !== 1) {
                                idlabel.push([d.field, e]);
                                newdata.push(d[d.field][e]);
                            }
                        }
                    });
                    data = newdata
                    .filter(function (d) {
                        return !d.invalid // FIX ME
                    }); // for overview 2D
                    // idlabel = Object.keys(data);
                    //brand_names = Object.keys(data[idlabel[0]]);
                    brand_names = Object.keys(data[0]).filter(function (d) {
                        return d !== "label";
                    });
                    // data = d3.values(data);
                    matrix = data.map(function (d) {
                        return brand_names.map(b=>d[b])
                    });
                    //console.log(data);
                    // if (brand_names < 9) {
                    //     data.forEach(function (d, i) {
                    //         d.label = idlabel[i];
                    //         d.pc1 = 0;
                    //         d.pc2 = 0;
                    //     });
                    //     dataref = _.cloneDeep(data);
                    //     var brands = brand_names
                    //         .map(function (key, i) {
                    //             return {brand: key, pc1: 0, pc2: 0}
                    //         });
                    //     PCAplot.estimate(brands, dimension, dataref);
                    // }

                }
                try{
                var pca = new PCA();
                // console.log(brand_names);
                matrix = pca.scale(matrix, true, true);

                var pc = pca.pca(matrix, 2);

                var A = pc[0];  // this is the U matrix from SVD
                var B = pc[1];  // this is the dV matrix from SVD
                var chosenPC = pc[2];   // this is the most value of PCA
                data.forEach(function (d, i) {
                    d.pc1 = A[i][chosenPC[0]];
                    d.pc2 = A[i][chosenPC[1]];
                });
                if (dimension === 1) {
                    data.forEach(function (d, i) {
                        d.label = idlabel[i]
                    });
                    dataref = data;
                    data = brand_names.map(function (d) {
                        var top = data.sort(function (a, b) {
                            return a[d] < b[d] ? 1 : -1;
                        })[0];
                        if (top[d] > 0.65) {
                            top.feature = d;
                            return top;
                        }
                    }).filter(function (d) {
                        return d !== undefined;
                    });
                }
                var maxxy = [-Infinity, -Infinity];
                var minxy = [Infinity, Infinity];
                //A.forEach(function(d){maxxy=Math.max(maxxy,Math.abs(d[0]),Math.abs(d[1]));});
                maxxy = maxxy.map(function (d, i) {
                    return d3.max(data.map(function (e) {
                        return e['pc' + (i + 1)];
                    }));
                });
                minxy = minxy.map(function (d, i) {
                    return d3.min(data.map(function (e) {
                        return e['pc' + (i + 1)];
                    }));
                });
                var maxxyall = [0, 0];
                maxxyall = maxxyall.map(function (d, i) {
                    return Math.max(Math.abs(minxy[i]), Math.abs(maxxy[i]));
                });
                // var maxxy = d3.max(maxxyall);
                //     maxxyall[0] = maxxy;
                //     maxxyall[1] = maxxy;
                // x.domain([-maxxyall]).nice();
                // y.domain([minxy[1],maxxy[1]]).nice();
                x.domain([-maxxyall[0], maxxyall[0]]).nice();
                y.domain([-maxxyall[1], maxxyall[1]]).nice();
                var scale_axis = 0;
                B.forEach(function (i) {
                    scale_axis = Math.max(scale_axis, Math.sqrt(i[0] * i[0] + i[1] * i[1]))
                });
                var scale_axisx = maxxyall[0] / scale_axis;
                var scale_axisy = maxxyall[1] / scale_axis;
                var brands = brand_names
                    .map(function (key, i) {
                        return {
                            brand: key,
                            pc1: B[i][chosenPC[0]] * scale_axisx,
                            pc2: B[i][chosenPC[1]] * scale_axisy,
                            load_pc1: B[i][chosenPC[0]],
                            load_pc2: B[i][chosenPC[1]],
                        }
                    });
                // console.log(brands);


                data.forEach(function (d, i) {
                    var xy = rotate(d.pc1, d.pc2, angle);
                    d.pc1 = xy.x;
                    d.pc2 = xy.y;
                    d.vector = matrix[i];
                });

                brands.forEach(function (d, i) {
                    var xy = rotate(d.pc1, d.pc2, angle);
                    d.pc1 = xy.x;
                    d.pc2 = xy.y;

                    if (dimension === 0) {
                        d.outlier = outlier[i];
                        d.skew = Dataset.schema.fieldSchema(d.brand).stats.modeskew;
                        d.variance = Dataset.schema.fieldSchema(d.brand).stats.variance;
                    }
                });
                //update to calculate
                PCAplot.estimate(brands, dimension, dataref);
                // draw
                var onMouseOverAttribute = function (a, j) {
                    brands.forEach(function (b, idx) {
                        var A = {x: 0, y: 0};
                        var B = {x: b.pc1, y: b.pc2};
                        var C = {x: a.pc1, y: a.pc2};
                        //var C = { x: a.vector[idx],  y: a.vector[idx] };

                        b.D = getSpPoint(A, B, C);
                    });

                    svg.selectAll('.tracer')
                        .data(brands)
                        .enter()
                        .append('line')
                        .attr('class', 'tracer tips')
                        .attr('x1', function (b, i) {
                            return x(a.pc1);
                            return x1;
                        })
                        .attr('y1', function (b, i) {
                            return y(a.pc2);
                            return y1;
                        })
                        .attr('x2', function (b, i) {
                            return x(b.D.x);
                            return x2;
                        })
                        .attr('y2', function (b, i) {
                            return y(b.D.y);
                            return y2;
                        })
                        .style("stroke", function (d) {
                            return "#ff6f2b"
                        });

                    delete a.D;
                    var ca = _.cloneDeep(a);
                    delete ca.pc1;
                    delete ca.pc2;
                    delete ca.vector;
                    var tipText = d3.entries(ca);
                    // console.log(a);
                    tip.show(tipText, "");
                };

// draw line from the brand axis a perpendicular to each attribute b
                var legendtop = svg_main.selectAll('.legendtop').data([''],d=>d);
                    legendtop
                    .enter().append('text')
                    .text(function (d) {
                        return d
                    }).attr('class','legendtop')
                    .attr('text-anchor', 'end')
                    .attr('y', height + margin.bottom / 2)
                    .attr('x', width);
                    legendtop = svg_main.selectAll('.legendtop');
                var onMouseOverBrand = function (b, j) {

                    data.forEach(function (a, idx) {
                        var A = {x: 0, y: 0};
                        var B = {x: b.pc1, y: b.pc2};
                        var C = {x: a.pc1, y: a.pc2};
                        // var C = { x: a.vector[j],  y: a.vector[j] };

                        a.D = getSpPoint(A, B, C);
                    });

                    var tracer = svg.selectAll('.tracer')
                        .data(data)
                        .enter();
                    tracer
                        .append('line')
                        .attr('class', 'tracer tips')
                        .attr('x1', function (a, i) {
                            return x(a.D.x);
                        })
                        .attr('y1', function (a, i) {
                            return y(a.D.y);
                        })
                        .attr('x2', function (a, i) {
                            return x(a.pc1);
                        })
                        .attr('y2', function (a, i) {
                            return y(a.pc2);
                        })
                        .style("stroke", function (d) {
                            return "#aaa"
                        });

                    tracer
                        .append('circle')
                        .attr('class', 'tracer-c tips')
                        .attr('cx', function (a, i) {
                            return x(a.D.x);
                        })
                        .attr('cy', function (a, i) {
                            return y(a.D.y);
                        })
                        .attr('r', 5)
                        .style("fill", function (d) {
                            return "#ff6f2b"
                        })
                        .style("fill-opacity", 0.1);
                    console.log('Mouse over brand');
                    console.log(b.brand);
                    legendtop.data([b.brand]).text(function (d) {
                        return d;
                    });
                    /*var tipText = data.map(function(d) {
                        return {key: d[brand_names[0]], value: d[b['brand']] }
                    });*/

                    // call tip
                    /*var tipText ="";
                    tip.show(tipText, b.brand);*/

                    //add tip to head
                };

                var onMouseLeave = function (b, j) {
                    svg.selectAll('.tracer').remove();
                    svg.selectAll('.tracer-c').remove();
                    tip.hide();
                    legendtop.data(['']).text(function (d) {
                        return d;
                    });
                };
                var onClickInstance =function (d) {
                        // TODO use query
                        const channelID = Object.keys(vlSchema.definitions.UnitEncoding.properties).slice(0,d.label.length);
                        channelID.forEach((c,i)=> Pills.set(c,Dataset.schema.fieldSchema(d.label[i]),true));
                    NotifyingService.notify();
                    };
                if (dimension === 0) {
                    g_point.selectAll(".subgraph").remove();
                    var point = g_point.selectAll(".dot")
                        .data(data)
                        .attr("cx", function (d) {
                            return x(d.pc1);
                        })
                        .attr("cy", function (d) {
                            return y(d.pc2);
                        })
                        .style("fill", colordot)
                        .style("stroke", "black")
                        .style("stroke-width", 0.2)
                        .style("stroke-opacity", 0.5)
                        .style("fill-opacity", 0.6)
                        .on('mouseover', onMouseOverAttribute)
                        .on('mouseleave', onMouseLeave);
                    point.exit().remove();
                    point
                        .enter().append("circle")
                        .attr("class", "dot")
                        .attr("r", rdot)
                        .attr("cx", function (d) {
                            return x(d.pc1);
                        })
                        .attr("cy", function (d) {
                            return y(d.pc2);
                        })
                        .style("fill", colordot)
                        .style("stroke", "black")
                        .style("stroke-width", 0.5)
                        .style("fill-opacity", 0.6)
                        .on('mouseover', onMouseOverAttribute)
                        .on('mouseleave', onMouseLeave);
                } else {
                    g_point.selectAll(".dot").remove();
                    var subplot = g_point.selectAll(".subgraph")
                        .data(data,d=>d.label)
                        .attr("class", "subgraph")
                        .attr('transform', function (d) {
                            return "translate(" + (x(d.pc1) - (subgSize.w + submarign.left + submarign.right) / 2) + "," + (y(d.pc2) - (subgSize.h + submarign.top + submarign.bottom) / 2) + ")"
                        });
                        // .on('mouseover', onMouseOverAttribute)
                        // .on('mouseleave', onMouseLeave);
                    subplot.exit().remove();
                    var subinside = subplot
                        .enter().append("g")
                        .attr("class", "subgraph")
                        .attr('transform', function (d) {
                            return "translate(" + (x(d.pc1) - (subgSize.w + submarign.left + submarign.right) / 2) + "," + (y(d.pc2) - (subgSize.h + submarign.top + submarign.bottom) / 2) + ")"
                        })
                        .on('click',onClickInstance)
                        .on('mouseover', onMouseOverAttribute)
                        .on('mouseleave', onMouseLeave);
                    subinside.append("rect")
                        .attr("class", "backgroundSub")
                        .attr("width", subgSize.w + submarign.left + submarign.right)
                        .attr("height", subgSize.h + submarign.top + submarign.bottom)
                        .attr("x", 0)
                        .attr("y", 0);
                    var subpoint = subplot.selectAll(".point")
                        .data(function (d) {
                            //var datapoint = Dataset.data.map(function(it){return [it[PCAplot.mainfield],it[d.label]]});
                            var datapoint = Dataset.data.map(function (it) {
                                return [it[d.label[0]], it[d.label[1]]]
                            });
                            var datax = datapoint.map(function (d) {
                                return d[0]
                            });
                            var datay = datapoint.map(function (d) {
                                return d[1]
                            });
                            var maxx = d3.max(datax);
                            var minx = d3.min(datax);
                            var maxy = d3.max(datay);
                            var miny = d3.min(datay);
                            datapoint.forEach(function (d) {
                                d[0] = (d[0] - minx) / (maxx - minx);
                                d[1] = (d[1] - miny) / (maxy - miny);
                            });
                            return datapoint;
                        })
                        .attr("cx", function (d) {
                            return subx(d[0]);
                        })
                        .attr("cy", function (d) {
                            return suby(d[1]);
                        });
                    subpoint.exit().remove();
                    subpoint.enter()
                        .append("circle")
                        .attr("class", "point")
                        .attr("r", 1)
                        .attr("cx", function (d) {
                            return subx(d[0]);
                        })
                        .attr("cy", function (d) {
                            return suby(d[1]);
                        })
                        .style("fill", function (d) {
                            return '#4682b4';
                        })
                        .style('opacity', 0.8);
                }

                var circlebrand = g_axis.selectAll(".circle_brand")
                    .data(brands)
                    .attr("x", function (d) {
                        return x(d.pc1) - 2.5;
                    })
                    .attr("y", function (d) {
                        return y(d.pc2) - 2.5;
                    })
                    .style("fill", function (d) {
                        return color(d['brand']);
                    }).on('mouseover', onMouseOverBrand)
                    .on('mouseleave', onMouseLeave);;
                circlebrand.exit().remove();
                circlebrand
                    .enter().append("rect")
                    .attr("class", "circle_brand")
                    .attr("width", 5)
                    .attr('height', 5)
                    .attr("x", function (d) {
                        return x(d.pc1) - 2.5;
                    })
                    .attr("y", function (d) {
                        return y(d.pc2) - 2.5;
                    })
                    .style("fill", function (d) {
                        return color(d['brand']);
                    }).on('mouseover', onMouseOverBrand)
                    .on('mouseleave', onMouseLeave);


                var temp_drag;
                var current_field;

                var dragHandler = d3.behavior.drag()
                    .on("dragstart", function (d) {

                        current_field = Dataset.schema.fieldSchema(d.brand);
                        var proIwant = d3.selectAll($("[id='" + d.brand + "']")).select('div')
                        //.attr ('class','schema-list-item ng-pristine ng-untouched ng-valid ui-droppable ui-droppable-disabled ng-empty ui-droppable-active drop-active');
                        var pill = {
                            field: current_field.field,
                            title: current_field.title,
                            type: current_field.type,
                            aggregate: current_field.aggregate
                        };
                        Pills.dragStart(pill, null);
                        // NotifyingService.notify();
                        var ori = proIwant.select('span').html();
                        //console.log(ori);
                        /* temp_drag = proIwant.select('span').select(function() {
                             return this.parentNode.insertBefore(this.cloneNode(true), this.nextSibling);
                         });*/
                        temp_drag = d3.select('bi-plot').append('span').html(ori);
                        temp_drag.attr("class", 'pill draggable cafull-width no-right-margin field-info ng-pristine ng-untouched ng-valid ng-isolate-scope ui-draggable ui-draggable-handle ng-empty ui-draggable-dragging')
                            .style("position", "absolute")
                            .style("z-index", '9999')
                            .style("left", function () {
                                return ((d3.event.x || d3.event.pageX)) + "px"
                            })
                            .style("top", function () {
                                var con = (d3.event.y || d3.event.pageY) + 100;
                                return con + "px"
                            });
                        d3.selectAll('.field-drop')
                            .attr("class", "field-drop ng-pristine ng-untouched ng-valid ui-droppable ng-not-empty ui-dropable-active drop-active ");
                        NotifyingService.notify();
                        // NotifyingService.notify();
                        //console.log($(proIwant[0]));
                        //$(proIwant[0]).trigger("mousedown");
                        //$(proIwant[0]).trigger('DOMContentLoaded');
                        //$(proIwant[0]).trigger('blur');
                    })
                    .on("drag", function (d) {
                        temp_drag
                            .style("left", function () {
                                return d3.event.x + "px"
                            })
                            .style("top", function () {
                                return (d3.event.y + 100) + "px"
                            });

                    })
                    .on("dragend", function (d) {
                        var proIwant = d3.selectAll("schema-list-item")
                            .data(Dataset.schema.fieldSchemas)
                            .filter(function (it) {
                                return it.field=== d.brand;
                            })
                            .select('div')
                            .attr('class', 'schema-list-item ng-pristine ng-untouched ng-valid ui-droppable ui-droppable-disabled ng-empty');
                        Pills.dragStop;

                        var pos = temp_drag.node().getBoundingClientRect();
                        temp_drag.remove();
                        var tem_group = d3.selectAll(".shelf-group");
                        tem_group = tem_group[0];
                        var tem_group = tem_group.filter(function (d, i) {
                            var pos_g = d.getBoundingClientRect();
                            return (pos_g.top < pos.top && pos_g.bottom > pos.top && pos_g.left < pos.left && pos_g.right > pos.left)
                        });

                        try {
                            var chan = $(tem_group[0]).attr('channel-id').replace(/'/g, "");
                            // console.log(chan);
                            if (chan != null) {
                                Pills.set(chan, current_field);
                                Pills.listener.dragDrop(chan);
                                //.update(Spec.spec);
                            }
                        } catch (e) {
                        }
                        NotifyingService.notify();
                        d3.selectAll("div [d3-over='true']")
                            .attr('d3-over', 'false');


                        //var event = new Event('submit');  // (*)
                        //$(d3.select('.schema')[0]).dispatchEvent(event);
                        d3.selectAll('.field-drop')
                            .attr("class", "field-drop ng-pristine ng-untouched ng-valid ui-droppable ng-not-empty");
                    });

                var listitem = g_axis.selectAll(".line")
                    .data(brands)
                    .attr('x1', function (d) {
                        return x(0)
                    })//x(-d.pc1);})
                    .attr('y1', function (d) {
                        return x(0)
                    })//y(-d.pc2); })
                    .attr("x2", function (d) {
                        return x(d.pc1);
                    })
                    .attr("y2", function (d) {
                        return y(d.pc2);
                    })
                    .style("stroke", function (d) {
                        return color(d['brand']);
                    })
                    .style("stroke-width", '1px')
                    .on('mouseover', onMouseOverBrand)
                    .on('mouseleave', onMouseLeave);
                if (dimension == 0) {
                    listitem
                        .on("dblclick", function (d) {
                            var proIwant = d3.selectAll($("[id='" + d.brand + "']"))
                                .select('div').select('span');
                            $(proIwant[0]).trigger("dblclick");
                        })
                        .call(dragHandler);
                } else {
                    listitem
                        .on("dblclick", function (d) {
                            // to do
                        })
                        .on("dragstart", null)
                        .on("drag", null)
                        .on("dragend", null);
                }
                listitem.exit().remove();
                listitem
                    .enter().append("line")
                    .attr("class", "line square draggable")
                    .attr('x1', function (d) {
                        return x(0)
                    })//x(-d.pc1);})
                    .attr('y1', function (d) {
                        return x(0)
                    })//y(-d.pc2); })
                    .attr("x2", function (d) {
                        return x(d.pc1);
                    })
                    .attr("y2", function (d) {
                        return y(d.pc2);
                    })
                    .style("stroke", function (d) {
                        return color(d['brand']);
                    })
                    .style("stroke-width", '1px')
                    .on('mouseover', onMouseOverBrand)
                    .on('mouseleave', onMouseLeave);
                if (dimension == 0) {
                    listitem.on("dblclick", function (d) {
                        var proIwant = d3.selectAll($("[id='" + d.brand + "']"))
                            .select('div').select('span');
                        $(proIwant[0]).trigger("dblclick");
                    })
                        .call(dragHandler);
                } else {
                    listitem
                        .on("dblclick", function (d) {
                            // to do
                        })
                        .on("dragstart", null)
                        .on("drag", null)
                        .on("dragend", null);
                }
                var tip = d3.tip()
                    .attr('class', 'd3-tip tips ')
                    .offset([10, 20])
                    .direction('e')
                    .html(function (values, title) {
                        var str = ''
                        str += '<h3>' + (title.length == 1 ? 'Brand ' : '') + title + '</h3>'
                        str += "<table>";
                        for (var i = 0; i < values.length; i++) {
                            if (values[i].key != 'pc1' && values[i].key != 'pc2') {
                                str += "<tr>";
                                str += "<td>" + values[i].key + "</td>";
                                var val = d3.format('.2f')(values[i].value);
                                val = isNaN(val)?values[i].value:val;
                                str += "<td class=pct>" + val + "</td>";
                                str + "</tr>";
                            }
                        }
                        str += "</table>";

                        return str;
                    });
                svg.call(tip);
                g_axis.selectAll('.place-label').remove();
                if (PCAplot.dim) {
                    var axis = g_axis.node();
                    axis.parentNode.appendChild(axis);

                    var arrangeLabels = function () {
                        var move = 1;
                        while (move > 0) {
                            move = 0;
                            g_axis.selectAll(".place-label")
                                .each(function () {
                                    var that = this,
                                        a = this.getBoundingClientRect();
                                    g_axis.selectAll(".place-label")
                                        .each(function () {
                                            if (this != that) {
                                                var b = this.getBoundingClientRect();
                                                if ((Math.abs(a.left - b.left) * 2 < (a.width + b.width)) &&
                                                    (Math.abs(a.top - b.top) * 2 < (a.height + b.height))) {
                                                    // overlap, move labels
                                                    var dx = (Math.max(0, a.right - b.left) +
                                                        Math.min(0, a.left - b.right)) * 0.01,
                                                        dy = (Math.max(0, a.bottom - b.top) +
                                                            Math.min(0, a.top - b.bottom)) * 0.02,
                                                        tt = d3.transform(d3.select(this).attr("transform")),
                                                        to = d3.transform(d3.select(that).attr("transform"));
                                                    move += Math.abs(dx) + Math.abs(dy);

                                                    to.translate = [to.translate[0] + dx, to.translate[1] + dy];
                                                    tt.translate = [tt.translate[0] - dx, tt.translate[1] - dy];
                                                    d3.select(this).attr("transform", "translate(" + tt.translate + ")");
                                                    d3.select(that).attr("transform", "translate(" + to.translate + ")");
                                                    a = this.getBoundingClientRect();
                                                }
                                            }
                                        });
                                });
                        }
                    }

                    var foci = [],
                        labels = [];

                    // Store the projected coordinates of the places for the foci and the labels
                    brands.forEach(function (d, i) {
                        var shifty = y(d.pc2);
                        shifty += (d.pc2 < 0) ? 15 : -5;
                        // foci.push({x: x(d.pc1), y: shifty});
                        labels.push({x: x(d.pc1), y: shifty, label: d.brand, anchor: (d.pc1 < 0 ? 'end' : 'start')});
                    });

                    var placeLabels = g_axis.selectAll('.place-label')
                        .data(labels)
                        .enter()
                        .append('text')
                        .attr('class', 'place-label')
                        .attr('text-anchor', function (d) {
                            return d.anchor
                        })
                        .attr('x', function (d) {
                            return d.x;
                        })
                        .attr('y', function (d) {
                            return d.y;
                        })
                        .text(function (d) {
                            return d.label.replace("Score", "");
                        })
                        .style("fill", function (d) {
                            return color(d.label);
                        })
                        .style("font-weight", "bold");

                    /*force.on("tick", function(e) {
                         var k = .1 * e.alpha;
                         labels.forEach(function(o, j) {
                             // The change in the position is proportional to the distance
                             // between the label and the corresponding place (foci)
                             o.y += (foci[j].y - o.y) * k;
                             o.x += (foci[j].x - o.x) * k;
                         });

                         // Update the position of the text element
                         g_axis.selectAll("text.place-label")
                             .attr("x", function(d) { return d.x; })
                             .attr("y", function(d) { return d.y; });
                     });

                     force.start();*/
                    arrangeLabels();
                }
                PCAplot.dataencde = data;
            }catch(e){console.log('Not enough dimension');}
            }
            return PCAplot};
        function getSpPoint(A,B,C){
            var x1=A.x, y1=A.y, x2=B.x, y2=B.y, x3=C.x, y3=C.y;
            var px = x2-x1, py = y2-y1, dAB = px*px + py*py;
            var u = ((x3 - x1) * px + (y3 - y1) * py) / dAB;
            var x = x1 + u * px, y = y1 + u * py;
            // var u = x3*scale_axis/dAB;
            var x = x1 + u * px, y = y1 + u * py;
            return {x:x, y:y}; //this is D
        }
        function rotate(x,y, dtheta) {

            var r = Math.sqrt(x*x + y*y);
            var theta = Math.atan(y/x);
            if (x<0) theta += Math.PI;

            return {
                x: r * Math.cos(theta + dtheta),
                y: r * Math.sin(theta + dtheta)
            }
        }
        function data2Num (input,keys){
            var clone = {};
            keys.forEach(key => clone[key] = [])
            var output=  Array.from(input);
            input.forEach(function (d){
                keys.forEach(key =>{
                    if (clone[key].find(function(it){return it.key == [d[key]];}) == undefined){
                        clone[key].push({'key': d[key]});
                    }
                })
            });


            for (var key in clone){
                clone[key].sort(function(a,b){
                    if (a.key < b.key)
                        return -1;
                    else
                        return 1;});


                clone[key].forEach(function(d,i){
                    if (d.key == null)
                        d.newindex = 0;
                    else if (isNaN(parseFloat(d.key) )){
                        d.newindex = i;
                    }else{
                        d.newindex = parseFloat(d.key);
                    }
                });
            }


// output with replaced number
            /*output.forEach(function (d,i){
                for ( var k in d){
                    output[i][k] = clone[k].find(function(it){return it.key == output[i][k]}).newindex;
                }
            });*/

            var matrix = input.map(function (d,i){
                return keys.map(function(k){
                    return clone[k].find(function(it){return it.key == output[i][k]}).newindex;
                });
            });
            return matrix;
            //return output.map(function(d){return Object.keys(d).map(function(i){return d[i]})});
        }

        PCAplot.estimate = function(PCAresult,dim,dataref) {
            // choose main axis
            if (dim===0) {
                PCAplot.charts.length=0;
                Dataset.schema.fieldSchemas.forEach(function (d) {
                    var pca = PCAresult.find(function (it) {
                        return (it['brand'] === d.field)
                    });
                    d.extrastat = {
                        pc1: (pca||{pc1:0}).pc1,
                        pc2: (pca||{pc2:0}).pc2,
                        outlier: (pca||{outlier:0}).outlier,
                    };
                });
                var recomen =[];
                var results ={};
                //variance
                Dataset.schema.fieldSchemas.sort(function (a, b) { return Math.abs(a.stats.variance) > Math.abs(b.stats.variance) ? -1 : 1});
                results.variance = Dataset.schema.fieldSchemas.find(function(d)  {
                    return (recomen.find(r=>r===d)=== undefined);
                });
                //multimodality
                Dataset.schema.fieldSchemas.sort(function (a, b) { return Math.abs(a.stats.multimodality) > Math.abs(b.stats.multimodality) ? -1 : 1});
                results.multimodality = Dataset.schema.fieldSchemas.find(function(d)  {
                    return (recomen.find(r=>r===d)=== undefined);
                });
                Dataset.schema.fieldSchemas.sort(function (a, b) { return Math.abs(a.stats.modeskew) > Math.abs(b.stats.modeskew) ? -1 : 1});
                results.skewness = Dataset.schema.fieldSchemas.find(function(d)  {
                    return (recomen.find(r=>r===d)=== undefined);
                });

                Dataset.schema.fieldSchemas.sort(function(a, b) {
                    return ((a.extrastat.outlier) <(b.extrastat.outlier)) ? 1 : -1});
                // console.log(Dataset.schema.fieldSchemas);
                results.outlier = Dataset.schema.fieldSchemas.find(function(d)  {
                    return (recomen.find(r=>r===d)=== undefined);
                });

                support[dim].types.forEach((d)=>drawGuideplot([results[d]], d));
                // drawGuideplot([variancemost], 'variance');
                // drawGuideplot([multimodalitymost], 'multimodality');
                // // drawGuideplot([object2], 'PC2');
                // drawGuideplot([mostskew], 'skewness');
                // drawGuideplot([mostoutlie], 'outlier');
            }
            else {
                PCAplot.charts.length=0;


                // update_dataref (dataref);

                var objects = {};
                var tops = support[dim].types.filter((d,i)=>i<4).map(function(brand){
                    var type = brand;
                    var get = false;
                    dataref.sort(function (a,b){
                        return a[type]<b[type]?1:-1;
                    });
                    var obj = {};
                    dataref.find ((topp)=>{
                        var topitem = topp.label;
                        if (objects[topitem[0]] === undefined || objects[topitem[0]][topitem[1]]=== undefined){
                            objects[topitem[0]] = {}||objects[topitem[0]];
                            var newobs =  {
                                type: type,
                                fieldDefs:[Dataset.schema.fieldSchema(topitem[0]),Dataset.schema.fieldSchema(topitem[1])],};
                            objects[topitem[0]][topitem[1]] = newobs;
                            obj = {fields: newobs.fieldDefs,
                                type: type,
                                dataref: PCAplot.dataref,
                                score: dataref[0][type]};
                            return true;
                        }

                    });
                    return obj;
                });
                tops.sort(function(a,b){
                    return a.score<b.score?1:-1;
                });
                //console.log(tops.length>4?4:tops.length);
                ran =0;
                support[dim].types.filter((d,i)=>i<4).forEach((d)=>{
                    var  item = tops.find(t=>t.type==d);
                    if(item)
                        drawGuideplot(item.fields,item.type,PCAplot.dataref)});

            }
        };
        function mark2plot (mark,spec,object){
            switch (mark) {
                case 'bar': barplot(spec, object); break;
                case 'tick': dashplot(spec, object); break;
                case 'area': areaplot(spec, object); break;
                case 'boxplot': boxplot(spec, object); break;
                case 'point': pointplot(spec, object); break; // 2D
                case 'hexagon': pointplot(spec, object,'hexagon'); break;
                case 'leader': pointplot(spec, object,'leader'); break;
                case 'contour': pointplot(spec, object,'contour'); break;
                case 'scatter3D': scatterplot(spec,object); break;
                case 'scatter3D-point': scatterplot(spec,object,'point'); break;
                case 'scatter3D-evenbin': scatterplot(spec,object,'evenbin'); break;
                case 'scatter3D-contour': scatterplot(spec,object,'contour'); break;
                case 'radar': radarplot(spec,object); break;
                case 'radar-evenbin': radarplot(spec,object,'evenbin'); break;
                case 'radar-leader': radarplot(spec,object,'leader'); break;
                case 'radar-contour': radarplot(spec,object,'contour'); break;
            }
        }
        function update_dataref (dataref){
            PCAplot.dataref = dataref.map(function(d){
                return {fieldDefs: [Dataset.schema.fieldSchema(d.label[0]),Dataset.schema.fieldSchema(d.label[1])],
                    scag: d,};
            });
            PCAplot.data[1] = PCAplot.dataref;
            PCAplot.madeprop(PCAplot.prop.mspec)
        }
        var guideon = function(prop,mspec){
            if (this) {
                var tolog = {level_explore: prop.dim, abtraction: prop.mark, visual_feature: prop.type};
                Logger.logInteraction(Logger.actions.GUIDEPLOT_SELECT, this.shorthand,{
                    val: {PS: tolog, spec: this.vlSpec, query: this.query},
                    time: new Date().getTime()
                });
            }
            //console.log(prop);
            //prop.charts = Dataset.schema.fieldSchemas.sort(prop.ranking)
            PCAplot.types =  support[prop.dim].types;
            PCAplot.marks = support[prop.dim].marks.map((m,i)=> {return {label:abtractionLevel[i], mark: m}});
            var axis = prop.fieldDefs.map(function(d){return d.field});
            // PCAplot.spec = mspec;
            prop.charts = (prop.dim>1?[prop.fieldDefs]:(getData(prop.dim).sort(prop.ranking)))
            .map(function(d){
                var chart = prop.plot((d.fieldDefs||d ),prop.mark,prop.mspec);
                chart.vlSpec.config.typer = {type: prop.type,val: (prop.dim>1?0:getTypeVal(undefined,d.fieldDefs||d))};
                return chart;});

            prop.previewcharts = prop.charts.map(function (d,i) {
                var thum =_.cloneDeep(d);
                // console.log(d);
                var typer = {};
                typer[prop.type] = d.vlSpec.config.typer.val[prop.type];
                thum.vlSpec.config = {
                    cell: {
                        width: prop.dim?100:200,
                        height: prop.dim?100:30
                    },
                    axis: {
                        grid: false,
                        //ticks: false,
                        labels: false,
                        titleOffset: 20
                    },
                    overlay: {line: true},
                    scale: {useRawDomain: true},
                    displayModeBar: false,
                    colorbar: false,
                    typer: {type: prop.type,val: typer},
                };
                if (d.fieldSet[0].type!=="temporal"){
                    thum.vlSpec.config.axis.ticks = false;
                }
                thum.order = i;
                return thum;});
            var pos = 0;
            pos = findinList(axis,prop.charts);
            //}
            PCAplot.prop.mspec = prop.charts[pos];
            prop.pos = pos;
            PCAplot.updateguide(prop);
        };
        var getData = function (dim) {
            if (dim<2)
                return PCAplot.data[dim>1?1:dim];
            else{
                var dataout = combinations(PCAplot.data[0],0,0,dim,[],[]);
                return dataout;
            }
        };
        function combinations(choices,start,curentn, dim,data,prefix) {
            for (var  i = start;i<choices.length;i++){
                var current_comb = (prefix || []).concat(choices[i]);
                if (curentn===dim) {
                    data.push(current_comb);

                }
                else
                    combinations(choices,start+1,curentn+1, dim,data, current_comb);
            }
            return data;
        }

        function drawGuideplot (object,type,dataref) {
            if (dataref === undefined)
                dataref = Dataset.schema.fieldSchemas;
            var spec = spec = _.cloneDeep(instantiate() || PCAplot.spec);
            //spec.data = Dataset.dataset;
            spec.type = type;
            spec.config = {
                cell: {
                    width: PCAplot.dim?100:200,
                    height: PCAplot.dim?100:30,
                },
                axis: {
                    grid: false,
                    ticks: 0,
                    titleOffset: 20
                },
                overlay: {line: true},
                scale: {useRawDomain: true}
            };
            spec.config.typer = {type: type,val: getTypeVal(type,object)};
            mark2plot (type2mark(type,PCAplot.dim),spec,object);
            var query = getQuery(spec,undefined,type);
            var output = cql.query(query, Dataset.schema);
            PCAplot.query = output.query;
            var topItem = output.result.getTopSpecQueryModel();
            PCAplot.chart = Chart.getChart(topItem);
            PCAplot.chart.vlSpec.config.displayModeBar = false;
            PCAplot.chart.vlSpec.config.colorbar = false;
            PCAplot.chart.vlSpec.config.staticPlot= true;
            PCAplot.chart.query={
                groupBy: 'encoding',
                orderBy: ['feature'],
                chooseBy: ['abstraction']
                //chooseBy: ['aggregationQuality', 'effectiveness'],
                };
            PCAplot.chart.prop = {
                mspec:_.cloneDeep(PCAplot.chart),
                type: type,
                mark: spec.mark,
                ranking: getranking(type),
                plot: drawGuideexplore,
                dim: PCAplot.dim,
                fieldDefs: object,};
            PCAplot.chart.guideon = guideon;
                PCAplot.charts.push(PCAplot.chart);
        }
        PCAplot.prop2spec = function (prop) {
            if (!checksimilar(PCAplot.prop,prop)) {
                PCAplot.state = states.GENERATE_GUIDE;
                PCAplot.prop = prop;
                Pills.select(prop.mspec.vlSpec);
            }
            // angular.element('.markselect').scope().spec = prop.mspec;
        };
        function checksimilar(prop1,prop2){
            if (!(prop1 && prop2))
                return false;
            const testFields = prop1.fieldDefs.map(d=>d.field).join(',')===prop2.fieldDefs.map(d=>d.field).join(',')
            const testMark = prop1.mark===prop2.mark;
            const testDim = prop1.dim===prop2.dim;
            const testType = prop1.type===prop2.type;
            return testFields &&testMark&&testDim&&testType;
        }
        PCAplot.madeprop = function (spec){
            var type = PCAplot.prop.type;
            var dim = PCAplot.prop.dim;
            var mark = PCAplot.prop.mark;
            var prop = {
                mspec: spec,
                type: type,
                mark: mark,
                ranking: getranking(type),
                plot: drawGuideexplore,
                fieldDefs: PCAplot.prop.fieldDefs,
                dim: dim};
            switch (PCAplot.state){
                case states.GENERATE_GUIDE:
                    PCAplot.limitup = Infinity;
                    guideon(prop);
                    var tolog = {level_explore: prop.dim, type: prop.mark,abstraction: prop.mark, visual_feature: prop.type};
                    Logger.logInteraction(Logger.actions.EXPANDED_SELECT,this.shorthand,{val:{PS:tolog,spec:this.vlSpec,query:this.query}, time:new Date().getTime()});
                    PCAplot.limit = limitDefault;
                case states.GENERATE_ALTERNATIVE:
                    PCAplot.alternativeupdate();
                    PCAplot.state = states.FREE;
                    break;
                default: return;
            }
            //PCAplot.updateguide(prop);
            //PCAplot.alternativeupdate();
        };
        function spec2typer(spec,fields){
            var typer ={};
            if (PCAplot.prop) {
                if (spec.type) {
                    var extra = spec.config.extraconfig;
                    typer.mark = extra ? spec.mark + "-" + extra : spec.mark;
                    typer.dim = PCAplot.dim;
                    typer.type = spec.type;
                    typer.fieldDefs = fields.map(function (f) {
                        return Dataset.schema.fieldSchema(f)
                    });
                } else {
                    typer.mark = PCAplot.prop.mark;
                    typer.dim = PCAplot.prop.dim;
                    typer.type = PCAplot.prop.type;
                    typer.fieldDefs = fields.map(function (f) {
                        return Dataset.schema.fieldSchema(f)
                    });
                }
            }else {
                typer.fieldDefs = fields.map(function (f) {
                    return Dataset.schema.fieldSchema(f)
                });
            }
            return typer;
        }
        function wrongMarkDim(mark,dim){
            return support[dim].marks.find(function(m){return m===mark})===undefined;
        }
        PCAplot.checkRender = function (spec,fields) { // convert spec to mpec
            console.log(spec)
            var typer = spec2typer(spec,fields);
            var type = type2type(typer.type,typer.dim,PCAplot.dim);
            console.log(typer);
            console.log(type);
            if (PCAplot.prop!= null ) {
                if ((typer.mark !== PCAplot.prop.mark) ||(PCAplot.dim !== PCAplot.prop.dim))
                {
                    PCAplot.state = states.GENERATE_GUIDE;
                    if ((PCAplot.dim !== PCAplot.prop.dim)||(typer.mark==='__ANY__')){
                        if (wrongMarkDim(typer.mark,PCAplot.dim)) {
                            spec.mark = type2mark(type, PCAplot.dim);
                            PCAplot.prop.mark = spec.mark;
                        }else {
                            PCAplot.prop.mark = typer.mark;
                        }
                        PCAplot.prop.dim = PCAplot.dim;
                        PCAplot.prop.type = type;
                        spec.type = type;
                    }
                    PCAplot.prop.fieldDefs = typer.fieldDefs;
                } else if(PCAplot.state === states.FREE){
                    var pos = findinList(fields);
                    console.log('position find:'+pos);
                    if (PCAplot.prop.pos !== pos){
                        if (pos!==-1) {
                            PCAplot.prop.pos = pos;
                            if (pos > PCAplot.limit) {
                                PCAplot.limitup = pos - 2;
                                PCAplot.limit = limitDefault;
                            }

                            PCAplot.prop.mspec = PCAplot.prop.charts[PCAplot.prop.pos];
                        }else{
                            PCAplot.state = states.GENERATE_GUIDE;
                            PCAplot.prop.fieldDefs = typer.fieldDefs;
                            return;
                        }
                    }
                        PCAplot.state = states.GENERATE_ALTERNATIVE;
                    PCAplot.prop.fieldDefs = typer.fieldDefs;
                }
            }else if (fields.length){
                PCAplot.state = states.GENERATE_GUIDE;
                spec.mark = type2mark(type,PCAplot.dim);
                spec.type = type;
                PCAplot.prop = {};
                PCAplot.prop.mark = spec.mark;
                PCAplot.prop.type = type;
                PCAplot.prop.fieldDefs = typer.fieldDefs;
                PCAplot.prop.dim = PCAplot.dim;
            }
            return spec;
        };
        function mar2Obbject(dim,mark) {
            var markIndex = support[dim].marks.indexOf(mark);
            return {label:abtractionLevel[markIndex],mark:mark};
        }
        function findinList(fields,charts) {
            return (charts||PCAplot.prop.charts).findIndex(function(d){
                var countcheck = 0;
                d.fieldSet.forEach(function(fi){
                    fields.forEach(function(f){
                        countcheck += (fi.field === f);
                    });
                });
                return (countcheck > fields.length)||(countcheck === fields.length);
            });
        }
        PCAplot.alternativeupdate = function(mspec){

            mspec = _.cloneDeep(mspec || PCAplot.prop.mspec);
            if (PCAplot.dataref.length ===0|| PCAplot.dataref== null){
                var data = [];
                var datarefn = [];
                var idlabel=[];
                data = PCAplot.data[0].map(function(d){
                    var tem = {field: d.field};
                    tem[d.field] = d.scag;
                    return tem;});
                var newdata=[];
                data.forEach(function(d){
                    for (var e in d[d.field]) {
                        //if (d[d.field][e].invalid!=1){ FIXME
                            idlabel.push([d.field,e]);
                            newdata.push(d[d.field][e]);//}
                    }
                });
                data = newdata;//.filter(function(d){return !d.invalid});
                data.forEach(function(d,i){d.label = idlabel[i]});
                datarefn = _.cloneDeep(data);
                PCAplot.dataref = datarefn.map(function(d){
                    return {fieldDefs: [Dataset.schema.fieldSchema(d.label[0]),Dataset.schema.fieldSchema(d.label[1])],
                        scag: d,};
                });
                PCAplot.data[1] =PCAplot.dataref;
            }
            //var fieldsets = mspec.fieldSet.map(function(d){return d.field}).filter(function(d){return d!="count"&&d!="*"});
            var fieldsets = mspec.fieldSet.map(function(d){return d.field}).filter(function(d){return d!="count"&&d!="*"});
            if(fieldsets.length>2){
                PCAplot.alternatives = [{'charts': []}];
                return;
            }
            if (fieldsets.length===0) {
                PCAplot.alternatives.length = 0;
                return;
            }
            if (fieldsets.length<2) {
                var possible = getData(1).filter(function (d) {
                    var ff = true;
                    fieldsets.forEach(function (it) {
                        var f = false;
                        d.fieldDefs.forEach(function (m) {
                            f = (f || (m.field=== it));
                        });
                        ff = ff && f;
                    });
                    return ff;
                }).filter(d=> !d.scag.invalid);
                if (possible.length !== 0) {
                    var topitem = support[PCAplot.dim + 1].types.map(function (d) {
                        return possible.sort(function (a, b) {
                            return (a.scag[d] < b.scag[d]) ? 1 : -1;
                        })[0];
                    });
                    var unique = [];
                    var uniquetype = [];
                    topitem.forEach(function (d, i) {
                        if (unique.filter(function (u) {
                                return u === d;
                            }).length === 0) {
                            unique.push(d);
                            uniquetype.push(support[PCAplot.dim + 1].types[i]);
                        }
                    });
                    var charts = uniquetype.map(function (d, i) {
                        return {v: unique[i], type: d}
                    })
                        .map(function (d) {
                            var spec = {};
                            //spec.data = Dataset.dataset;
                            spec.type = d.type;
                            spec.config = {
                                /*cell: {
                                    width: PCAplot.dim?100:200,
                                    height: PCAplot.dim?100:30,
                                },*/
                                axis: {
                                    grid: false,
                                },
                                overlay: {line: true},
                                scale: {useRawDomain: true}
                            };
                            mark2plot(mark2mark(mspec.vlSpec.mark, PCAplot.dim), spec, d.v.fieldDefs);
                            var query = getQuery(spec,undefined,d.type);
                            var output = cql.query(query, Dataset.schema);
                            PCAplot.query = output.query;
                            var topItem = output.result.getTopSpecQueryModel();
                            var temc = Chart.getChart(topItem);
                            // temc.vlSpec.config.typer = {type: d.type,mark: mark2mark(mspec.vlSpec.mark, PCAplot.dim)
                            //     ,dim: d.v.fieldDefs.length-1, fieldDefs:d.v.fieldDefs};
                            temc.query={
                                groupBy: 'encoding',
                                orderBy: ['feature'],
                                chooseBy: ['abstraction'],
                                //chooseBy: ['aggregationQuality', 'effectiveness'],
                            };
                            return temc;

                        });
                    PCAplot.alternatives = [{'charts': charts}];
                }
                else {
                    PCAplot.alternatives.length = 0;
                }
            }
            else {
            var possible = getData(fieldsets.length-1).filter(function (d){
                var ff= false;
                fieldsets.forEach(function(it){
                    var f=false;
                    d.fieldDefs.forEach(function(m){f=(f||(m.field===it)); });
                    ff=ff||f;});
                return ff;});

            possible = possible.filter(function (d){
                var ff= true;
                fieldsets.forEach(function(it){
                    var f=false;
                    d.fieldDefs.forEach(function(m){f=(f||(m.field===it)); });
                    ff=ff&&f;});
                return !ff;});
            var topitem = support[1].types.map(function (d) {
                return possible.sort(function (a, b) {
                    return (a.scag[d] < b.scag[d]) ? 1 : -1;
                })[0];
            });
            // FIX ME lack of relationship mapping here
            var unique = [];
            var uniquetype = [];
            topitem.forEach(function (d, i) {
                if (unique.filter(function (u) {
                        return u.fieldDefs === d.fieldDefs;
                    }).length === 0) {
                    unique.push(JSON.parse(JSON.stringify(d)));
                    var currentsupport = support.getsupport(fieldsets.length-1);
                    var maxsupport = currentsupport.types.length;
                    uniquetype.push(currentsupport.types[i>maxsupport?(maxsupport-1):i]);
                }
            });
            unique.forEach(function(d,i){
                var label='';
                var newf = fieldsets.map(function(f){
                    label=label+'-'+f;
                    return Dataset.schema.fieldSchema(f);});

                Array.prototype.push.apply(newf,d.fieldDefs.filter(function(fe){
                    var ff = true;
                    fieldsets.forEach(function(fs){ff=ff&&(fs!==fe.field)});
                    if (ff) label=label+'-'+fe.field;
                    return ff;})
                );
                d.label = label;
                d.type = uniquetype[i];
            d.fieldDefs=newf});
                unique  = _.uniqBy(unique,'label');

            var charts = unique.map(function (d, i) {
                return {v: d, type: d.type}
            })
                .map(function (d) {
                    var spec = {};
                    spec.type = d.type;
                    spec.config = {

                        axis: {
                            grid: false,
                            ticks: false,
                            titleOffset: 20
                        },
                        overlay: {line: true},
                        scale: {useRawDomain: true}
                    };
                    mark2plot(mark2mark(mspec.vlSpec.mark, PCAplot.dim), spec, d.v.fieldDefs);
                    var query = getQuery(spec,undefined,d.type);
                    var output = cql.query(query, Dataset.schema);
                    PCAplot.query = output.query;
                    var topItem = output.result.getTopSpecQueryModel();
                    var charttemp = Chart.getChart(topItem);
                    charttemp.query={
                        groupBy: 'encoding',
                        orderBy: ['feature'],
                        chooseBy: ['abstraction'],
                        //chooseBy: ['aggregationQuality', 'effectiveness'],
                    };
                    return charttemp;

                });
            PCAplot.alternatives = [{'charts': charts}];
            }

        };

        PCAplot.updateSpec = function(prop){
            //PCAplot.
            PCAplot.types =  support[prop.dim].types;
            PCAplot.marks = support[prop.dim].marks.map((m,i)=> {return {label:abtractionLevel[i], mark: m}});
            var nprop = _.cloneDeep(prop);
            nprop.ranking = getranking(prop.type);
            mark2plot (prop.mark,nprop.mspec,Dataset.schema.fieldSchemas.slice(0,prop.dim+1));
            nprop.charts.length = 0;

            var dataref = prop.dim>1?[prop.fieldDefs]:getData(nprop.dim);//?PCAplot.dataref:Dataset.schema.fieldSchemas;
            nprop.charts = dataref.sort(nprop.ranking)
                .map(function(d) {
                    var chart = drawGuideexplore((d.fieldDefs||d),nprop.mark,nprop.mspec);
                    chart.vlSpec.config.typer = {type: prop.type,val: getTypeVal(undefined,d.fieldDefs||d)};
                    return chart; });
            //while (nprop[nprop.length-1])
            nprop.previewcharts = nprop.charts.map(function(d,i) {
                var thum =_.cloneDeep(d);
                var typer = {};
                typer[prop.type] = d.vlSpec.config.typer.val[prop.type];
                thum.vlSpec.config = {
                    cell: {
                        width: prop.dim?100:200,
                        height: prop.dim?100:30
                    },
                    axis: {
                        grid: false,
                        // ticks: false,
                        labels: false,
                        titleOffset: 20
                    },
                    overlay: {line: true},
                    scale: {useRawDomain: true},
                    displayModeBar: false,
                    colorbar: false,
                    typer: {type: prop.type,val: typer},
                };
                thum.query={
                    groupBy: 'encoding',
                    orderBy: ['feature'],
                    chooseBy: ['abstraction'],
                    //chooseBy: ['aggregationQuality', 'effectiveness'],
                };
                if (d.fieldSet[0].type!=="temporal"){
                    thum.vlSpec.config.axis.ticks = false;
                }
                thum.order = i;
                return thum;});
            var fields = nprop.fieldDefs.map(function(f){return f.field});
            nprop.pos = findinList(fields,nprop.charts);
            nprop.mspec = nprop.charts[nprop.pos];
            // PCAplot.state = states.GENERATE_ALTERNATIVE;
            PCAplot.updateguide(nprop);
            Pills.select(nprop.mspec.vlSpec);
            // PCAplot.madeprop(PCAplot.prop.charts[nprop.pos]);
        };
        var ran = 0;
        function mark2mark(oldmark,dim,newdim){
            newdim = (newdim===undefined)?dim+1:newdim;
            var pos = 0;
            support[dim].marks.forEach(function(d,i){
                if (d==oldmark){
                    pos= i; return ;}});
            return support[dim+1].marks[pos>support[newdim].marks.length-1?0:pos];
        }
        function type2type(oldtype,olddim,newdim){
            if (oldtype===undefined){
                return support[newdim].types[0];
            }else {
                var pos = 0;
                support[olddim].types.forEach(function (d, i) {
                    if (d === (oldtype)) {
                        pos = i;
                        return;
                    }
                });
                return support[newdim].types[pos > support[newdim].types.length - 1 ? 0 : pos];
            }
        }
        function getmark (type,option,pos){
            switch(option||this.option){
                case 'random':
                    var oldran = ran;
                    ran = ran>2?0:(ran+1);
                    return this.marks[oldran];
                case 'manual':
                    return this.marks[pos];
                default:
                    var pos = this.types.findIndex(function(d){return d=== type});
                    return this.marks[pos>this.marks.length-1?0:pos];
            }
        }
        function type2mark (type,dim){
            return support[dim].getmark(type,null);
        }

        function getranking(type){
            switch (type) {
                case 'PC1': return function (a,b){return Math.abs(a.extrastat.pc1) < Math.abs(b.extrastat.pc1) ? 1:-1};
                    break;
                case 'variance': return function (a,b){return Math.abs(a.stats.variance) < Math.abs(b.stats.variance) ? 1:-1};
                    break;
                case 'multimodality': return function (a,b){return Math.abs(a.stats.multimodality) < Math.abs(b.stats.multimodality) ? 1:-1};
                    break;
                case'skewness': return function (a,b){return Math.abs(a.stats.modeskew) < Math.abs(b.stats.modeskew) ? 1:-1};
                    break;
                case'PC2': return function (a,b){return Math.abs(a.extrastat.pc2) < Math.abs(b.extrastat.pc2) ? 1:-1};
                    break;
                case'outlier': return function (a,b){return a.extrastat.outlier < b.extrastat.outlier? 1:-1};
                    break;
                default: return function (a,b){
                    if (a.scag!==undefined)
                        return (a.scag[type] < b.scag[type]) ? 1:-1;
                    else
                        0;
                };
                    break;
            }
        }
        function getTypeVal(type,objects,skipFindField){
            var a;
            if (!skipFindField) {
                if (objects.length===undefined)
                    objects = [objects];
                var dim = objects.length - 1;
                a = getData(dim).find(function (d) {
                    var temp = (d.fieldDefs || [d]);
                    var count = temp.length;

                    (d.fieldDefs || [d]).forEach(function (f) {
                            count = count - !(objects.find(function (o) {
                            return o.field === f.field
                        }) === undefined);
                    });
                    return !count;
                });
            }else{
                a= objects;
            }

            switch (type) {
                case 'PC1': return {'PC1': (a||objects).extrastat.pc1};
                case 'variance': return {'variance': (a||objects).stats.variance};
                case 'multimodality': return {'multimodality': (a||objects).stats.multimodality};
                case 'skewness': return {'skewness':(a||objects).stats.modeskew};
                case 'PC2': return {'PC2':(a||objects).extrastat.pc2};
                case 'outlier': return {'outlier':(a||objects).extrastat.outlier};
                case undefined:
                    var typeval ={};
                    support.getsupport(dim).types.forEach(function(d){
                        typeval[d] = getTypeVal(d,a,true)[d];
                    });
                    return typeval;
                default:
                    var typeval ={};
                    typeval[type] = (a===undefined)?0:a.scag[type];
                    return typeval;
            }
        }
        var drawGuideexplore = function (object,type,mspec) {
            var spec = _.cloneDeep(mspec);
            //spec.data = Dataset.dataset;
            spec.config = {
                overlay: {line: true},
                scale: {useRawDomain: true}
            };

            mark2plot(type,spec,object);

            var query = getQuery(spec,undefined,type);
            var output = cql.query(query, Dataset.schema);
            var topItem = output.result.getTopSpecQueryModel();
            var charttemp = Chart.getChart(topItem);
            charttemp.query={
                groupBy: 'encoding',
                orderBy: ['feature'],
                chooseBy: ['abstraction'],
                //chooseBy: ['aggregationQuality', 'effectiveness'],
            };
            return charttemp;
        };
        // PCAplot.alternatives = Alternatives.getHistograms(null, PCAplot.chart, null);

        function barplot(spec,objectin) {
            var object = objectin[0]||objectin;
            spec.mark = "bar";
            spec.encoding = {
                x: {field: object.field, type: object.type},
                y: {aggregate: "count", field: "*"}
            };
            if (object.type==="quantitative"){
                spec.encoding.x.bin ={};
                spec.encoding.y.type = object.type;
            }else if(object.primitiveType ==="string"){
                spec.encoding.y.type = "quantitative";
            }else if (object.type==="temporal"){
                spec.encoding.x.bin ={};
                //spec.encoding.x.type = "ordinal";
                spec.encoding.x.timeUnit = "year";
                spec.encoding.y.type = "quantitative";
            }

        }

        function dashplot(spec,objectin) {
            var object = objectin[0]||objectin;
            spec.mark = "tick";
            spec.encoding = {
                x: {field: object.field, type: object.type}
            };
        }

        function areaplot(spec,objectin) {
            var object = objectin[0]||objectin;
            spec.mark = "area";
            spec.encoding = {
                x: {field: object.field, type: object.type},
                y: {aggregate: "count", field: "*"}
            };
            if (object.type==="quantitative"){
                spec.encoding.x.bin ={};
                spec.encoding.y.type = object.type;
            }else if(object.primitiveType ==="string"||object.type==="temporal"||object.primitiveType ==="integer"){
                spec.encoding.y.type = "quantitative";
            }
            spec.config.opacity = 1;
        }
        function boxplot(spec,objectin) {
            var object = objectin[0]||objectin;
            spec.mark = "boxplot";
            spec.encoding = {
                x: { field: object.field, type: object.type}
            };
        }

        function pointplot(spec,objects,extramark) {
            spec.mark = extramark||"point";
            spec.encoding = {
                x: { field: objects[0].field, type: objects[0].type},
                y: { field: objects[1].field, type: objects[1].type},
            };
            spec.config = spec.config||{};
            spec.config.mark= {"filled": true, "opacity":1};
        }

        function scatterplot(spec,objects,option){
            spec.mark = "scatter3D";
            spec.encoding = {
                x: { field: objects[0].field, type: objects[0].type},
                y: { field: objects[1].field, type: objects[1].type},
                column: { field: objects[2].field, type: objects[2].type},
            };
            if (option)
                spec.config.extraconfig = option;
        }
        function radarplot(spec,objects,option){
            spec.mark = "radar";
            spec.encoding = {
                x: { field: objects[0].field, type: objects[0].type},
                y: { field: objects[1].field, type: objects[1].type},
                column: { field: objects[2].field, type: objects[2].type},
                row: { field: objects[3].field, type: objects[3].type},
            };
            if (option) {
                spec.config = spec.config ||{};
                spec.config.extraconfig = option;
            }
            //spec.layer = objects.map(function(o){return {encoding:{x: { field: o.field, type: o.type}}}});
        }


        function getQuery(spec, convertFilter,type /*HACK */) {
            var specQuery = getSpecQuery(spec, convertFilter);

            var hasAnyField = false, hasAnyFn = false, hasAnyChannel = false;

            for (var i = 0; i < specQuery.encodings.length; i++) {
                var encQ = specQuery.encodings[i];
                if (encQ.autoCount === false) continue;

                if (cql.enumSpec.isEnumSpec(encQ.field)) {
                    hasAnyField = true;
                }

                if (cql.enumSpec.isEnumSpec(encQ.aggregate) ||
                    cql.enumSpec.isEnumSpec(encQ.bin) ||
                    cql.enumSpec.isEnumSpec(encQ.timeUnit)) {
                    hasAnyFn = true;
                }

                if (cql.enumSpec.isEnumSpec(encQ.channel)) {
                    hasAnyChannel = true;
                }
            }

            /* jshint ignore:start */
            var groupBy = spec.groupBy;

            if (spec.groupBy === 'auto') {
                groupBy = PCAplot.autoGroupBy = hasAnyField ?
                    (hasAnyFn ? 'fieldTransform' : 'field') :
                    'encoding';
            }

            return {
                spec: specQuery,
                groupBy: groupBy,
                orderBy: [type],
                chooseBy: ['aggregationQuality', 'effectiveness'],
                config: {
                    omitTableWithOcclusion: false,
                    autoAddCount: (hasAnyField || hasAnyFn || hasAnyChannel) && spec.autoAddCount
                }
            };
            /* jshint ignore:end */
        }

        function getSpecQuery(spec, convertFilter /*HACK*/) {
            if (convertFilter) {
                spec = util.duplicate(spec);


                // HACK convert filter manager to proper filter spec
                if (spec.transform && spec.transform.filter) {
                    delete spec.transform.filter;
                }

                var filter = FilterManager.getVlFilter();
                if (filter) {
                    spec.transform = spec.transform || {};
                    spec.transform.filter = filter;
                }
            }

            return {
                data: Config.data,
                mark: spec.mark === ANY ? '?' : spec.mark,
                type: spec.type,
                // TODO: support transform enumeration
                transform: spec.transform,
                encodings: vg.util.keys(spec.encoding).reduce(function(encodings, channelId) {
                    var encQ = vg.util.extend(
                        // Add channel
                        { channel: Pills.isAnyChannel(channelId) ? '?' : channelId },
                        // Field Def
                        spec.encoding[channelId],
                        // Remove Title
                        {title: undefined}
                    );

                    if (cql.enumSpec.isEnumSpec(encQ.field)) {
                        // replace the name so we should it's the field from this channelId
                        encQ.field = {
                            name: 'f' + channelId,
                            enum: encQ.field.enum
                        };
                    }

                    encodings.push(encQ);
                    return encodings;
                }, []),
                config: spec.config
            };
        }
        PCAplot.parseSpec = function(newSpec) {
            // TODO: revise this
            PCAplot.spec = parse(newSpec);
        };
        function parse(spec) {
            var oldSpec = util.duplicate(spec);
            var oldFilter = null;

            if (oldSpec) {
                // Store oldFilter, copy oldSpec that exclude transform.filter
                oldFilter = (oldSpec.transform || {}).filter;
                var transform = _.omit(oldSpec.transform || {}, 'filter');
                oldSpec = _.omit(oldSpec, 'transform');
                if (transform) {
                    oldSpec.transform = transform;
                }
            }

            var newSpec = vl.util.mergeDeep(instantiate(), oldSpec);

            // This is not Vega-Lite filter object, but rather our FilterModel
            newSpec.transform.filter = FilterManager.reset(oldFilter);

            return newSpec;
        }

        PCAplot.updateguide= function(prop) {
            //var oldtyper = prop.mspec.config.typer;
            prop = _.cloneDeep(prop || PCAplot.prop);
            prop.mspec.config={};
            // prop.mspec.config.typer = oldtyper||PCAplot.prop.mspec.config.typer;
            // delete prop.mspec.model;
            PCAplot.prop = prop;
            PCAplot.limitup = (PCAplot.prop.pos > (PCAplot.limit-1))? (PCAplot.prop.pos-2) : 0;
            PCAplot.mspec = prop.mspec;
        };
        // const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
        // Array.prototype.naturalSort= function(_){
        //     if (arguments.length) {
        //         return this.sort(function (as, bs) {
        //             return collator.compare(as[_],bs[_]);
        //         });
        //     }else {
        //         return this.sort(collator.compare);
        //     }
        // };
        function combineName (flieds){
            return flieds.map(d=>d.replace(/-/g,'')).naturalSort().join('-');
        }

        /**
         *
         * @param primfield
         * @param dataschema
         * @param data
         * @param maxCombine
         */
        function calscagnotic (primfield,dataschema,data,maxCombine){
            importScripts("https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.20/require.min.js");
            const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
            Array.prototype.naturalSort= function(_){
                if (arguments.length) {
                    return this.sort(function (as, bs) {
                        return collator.compare(as[_],bs[_]);
                    });
                }else {
                    return this.sort(collator.compare);
                }
            };
            function stackforScag(queue,fields, matrix){
                if (fields.length === maxCombine) {
                    const nameTag = combineName(fields);
                    if (dataschema.scag[maxCombine-1][nameTag]) {
                        const scag = scagnoticscoreAll(matrix);
                        notify({source: nameTag, value: scag});
                        return true;
                    }
                        return false;
                }
                else {
                    const field = queue.pop();
                    stackforScag(newfield,fields, matrix)
                }
            }

            require(['https://idatavisualizationlab.github.io/N/Scagnostic/scagnostics.min.js'], function() {
                primfield.forEach(function (selectedfield) {
                    dataschema._fieldSchemas.forEach(function (d) {
                        if ((d.field !== selectedfield) && (dataschema._fieldSchemaIndex[selectedfield].scag == undefined || dataschema._fieldSchemaIndex[selectedfield].scag[d.field] === undefined) && (d.scag === undefined || (d.scag[selectedfield] === undefined))) {
                                var scag = scagnoticscore([selectedfield, d.field],checkValid(dataschema._fieldSchemaIndex[selectedfield]) && checkValid(dataschema._fieldSchemaIndex[d.field]));
                            if (dataschema._fieldSchemaIndex[selectedfield].scag === undefined)
                                dataschema._fieldSchemaIndex[selectedfield].scag = {};
                            dataschema._fieldSchemaIndex[selectedfield] .scag[d.field] = scag;
                            notify({source: selectedfield, target: d.field, value: scag});
                        }
                    })
                });
                return complete(dataschema);
                // stackforScag(primfield,[], []);
            });

            function checkValid(field) {
                return (field.type !== 'temporal')&&(field.primitiveType!=="string");
            }
            function combineName (fields){
                return fields.map(d=>d.replace(/-/g,'')).naturalSort().join('-');
            }
            function scagnoticscore (fields,valid){
                if (valid) {
                    var matrix = [];
                    data.forEach(function (d) {
                        if (d[fields[0]] !== undefined && d[fields[1]] !== undefined)
                        matrix.push( fields.map(f => d[f]))
                    });

                    try {
                        var scag = this.scagnostics(matrix, {
                            // isBinned: false,
                            binType: 'leader',
                            startBinGridSize: 40
                        });
                        if (!isNaN(scag.skinnyScore))
                            return {
                                'outlying': scag.outlyingScore,
                                'skewed': scag.skewedScore,
                                'sparse': scag.sparseScore,
                                'clumpy': scag.clumpyScore,
                                'striated': scag.striatedScore,
                                'convex': scag.convexScore,
                                'skinny': scag.skinnyScore,
                                'stringy': scag.stringyScore,
                                'monotonic': scag.monotonicScore
                            };
                        else return {
                            'outlying': scag.outlyingScore,
                            'skewed': scag.skewedScore,
                            'sparse': scag.sparseScore,
                            'clumpy': scag.clumpyScore,
                            'striated': scag.striatedScore,
                            'convex': scag.convexScore,
                            'skinny': 0,
                            'stringy': scag.stringyScore,
                            'monotonic': scag.monotonicScore,
                            invalid: 1
                        };

                    } catch (e) {
                        return {
                            'outlying': 0,
                            'skewed': 0,
                            'sparse': 0,
                            'clumpy': 0,
                            'striated': 0,
                            'convex': 0,
                            'skinny': 0,
                            'stringy': 0,
                            'monotonic': 0,
                            invalid: 1,
                        };
                    }
                } else {
                    return {
                        'outlying': 0,
                        'skewed': 0,
                        'sparse': 0,
                        'clumpy': 0,
                        'striated': 0,
                        'convex': 0,
                        'skinny': 0,
                        'stringy': 0,
                        'monotonic': 0,
                        invalid: 1,
                    };
                }
            }
                function scagnoticscore3D (field1,field2,field3){
                    var matrix = Dataset.data.map(function(d){return [d[field1],d[field2],d[field3]]});
                    try {
                        var scag = scagnostics3d(matrix,{
                            binType: 'leader',
                            startBinGridSize: 20});
                        if (!isNaN(scag.skinnyScore))
                            return {
                                'outlying': scag.outlyingScore,
                                'skewed': scag.skewedScore,
                                'sparse':scag.sparseScore,
                                'clumpy':scag.clumpyScore,
                                'striated':scag.striatedScore,
                                'convex':scag.convexScore,
                                'skinny':scag.skinnyScore,
                                'stringy':scag.stringyScore,
                                'monotonic':scag.monotonicScore};
                        else return {
                            'outlying': 0,
                            'skewed': 0,
                            'sparse':0,
                            'clumpy':0,
                            'striated':0,
                            'convex':0,
                            'skinny':0,
                            'stringy':0,
                            'monotonic':0,
                            invalid:1
                        };

                    }catch(e){
                        return {
                            'outlying': 0,
                            'skewed': 0,
                            'sparse':0,
                            'clumpy':0,
                            'striated':0,
                            'convex':0,
                            'skinny':0,
                            'stringy':0,
                            'monotonic':0,
                            invalid:1,
                        };
                    }
                }
                function scagnoticscoreND (fields){
                    var matrix = Dataset.data.map(function(d){return fields.map(
                        function (f) {
                            return d[f]})});
                    try {
                        var scag = scagnosticsnd(matrix,{
                            binType: 'leader',
                            startBinGridSize: 20});
                        return {
                            'outlying': scag.outlyingScore,
                        };
                    }catch(e){
                        return {
                            'outlying': 0,
                            invalid:1,
                        };
                    }
                }



            //console.log (Dataset.schema.fieldSchema(primfield[0]));
        };
        function handleScagnostic () {
            Alerts.add('done with scagnostic calculation');
            try {
                let dataref = []
                Dataset.schema.fieldSchemas.map(function(d){
                    var tem = {field: d.field};
                    tem[d.field] = d.scag;
                    return tem;}).forEach(function (d) {
                    for (var e in d[d.field]) {

                        d[d.field][e].label = [d.field, e];
                        dataref.push(d[d.field][e]);

                    }
                });
                update_dataref(dataref);
            }catch(e){}
            if (PCAplot.dim==1) {
                PCAplot.firstrun =true;
                PCAplot.plot(Dataset.schema.fieldSchemas.map(function (d) {
                    var tem = {field: d.field};
                    tem[d.field] = d.scag;
                    return tem;
                }), 1)
            }
        }
        PCAplot.initialize = _.once(handleScagnostic);
        PCAplot.workerScagnotic = undefined;
        PCAplot.checkCalculateStatus = function (dim) {

        }
        PCAplot.calscagnotic = function (primfield){
            let count =0;
            if (!PCAplot.workerScagnotic) {
                PCAplot.workerScagnotic = Webworker.create(calscagnotic, {async: true});
                PCAplot.workerScagnotic.run(primfield, Dataset.schema, Dataset.data).then(function (result) {
                    PCAplot.initialize();
                    PCAplot.workerScagnotic = undefined;
                }, null, function (progress) {
                    // Alerts.add(progress);
                    if (Dataset.schema.fieldSchema(progress.source).scag === undefined)
                        Dataset.schema.fieldSchema(progress.source).scag = {};
                    // if (Dataset.schema.fieldSchema(progress.target).scag === undefined)
                    //     Dataset.schema.fieldSchema(progress.target).scag = {};
                    Dataset.schema.fieldSchema(progress.source).scag[progress.target] = progress.value;
                    // Dataset.schema.fieldSchema(progress.target).scag[progress.source] = Dataset.schema.fieldSchema(progress.source).scag[progress.target];
                }).catch(function (oError) {
                    PCAplot.workerScagnotic = undefined;
                });
            }

        };

        PCAplot.updateAlternative= function (prop,dataref){


        };
        PCAplot.mark2mark = mark2mark;
        PCAplot.reset = function(hard) {
            if (PCAplot.workerScagnotic)
                PCAplot.workerScagnotic.stop();
            var spec = instantiate();
            spec.transform.filter = FilterManager.reset(null, hard);
            PCAplot.spec = spec;
            PCAplot.firstrun =true;
            PCAplot.charts.length = 0;
            PCAplot.chart=null;
            PCAplot.prop=null;
            PCAplot.alternatives=[];
            PCAplot.dataref = [];
            PCAplot.mspec = null;
            PCAplot.state = states.IDLE;
            PCAplot.initialize = _.once(handleScagnostic);
            //PCAplot.plot(Dataset.data);
        };
        PCAplot.reset();
        Dataset.onUpdate.push(function() {
            PCAplot.reset(true);
            //PCAplot.plot(Dataset.data);
        });
        return PCAplot;
    });