'use strict'
angular.module('pcagnosticsviz')
    .directive('biPlot', function(){
        return {
            //template: "<svg id =\'bi-plot\' width=\'100%\' class=\"\"></svg>",
        scope: {
            error: '<',
        },
        templateUrl: 'components/d3-biplot/bi-plot.html',
        controller: function ($scope) {
                d3.selectAll('.background-biplot')
                    .style('fill','#ffffff')
                    .attr('width',$('.biplot').width())
                    .attr('height',$('.biplot').width());
                // var menu = d3.select("#bi-plot");
                // menu.append('text').text('toggle zoom');
                // menu.append('rect')
        }
        }}
        );
