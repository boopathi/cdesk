var masterChart,detailChart;
$(document).ready(function() {
    // create the master chart
    function createMaster() {
        masterChart = new Highcharts.Chart({
            chart: {
                renderTo: 'master-container',
                reflow: false,
                borderWidth: 0,
                backgroundColor: null,
                marginLeft: 50,
                marginRight: 20,
                zoomType: 'x',
                events: {
                    selection: function(event) {
                        var extremesObject = event.xAxis[0],
                        min = extremesObject.min,
                        max = extremesObject.max,
                        detailData = [],
                        xAxis = this.xAxis[0];
                        jQuery.each(this.series[0].data, function(i, point) {
                            if (point.x > min && point.x < max) {
                                detailData.push({
                                    x: point.x,
                                    y: point.y
                                });
                            }
                        });
                        xAxis.removePlotBand('mask-before');
                        xAxis.addPlotBand({
                            id: 'mask-before',
                            from: _graph.from,
                            to: min,
                            color: 'rgba(0, 0, 0, 0.2)'
                        });
                        xAxis.removePlotBand('mask-after');
                        xAxis.addPlotBand({
                            id: 'mask-after',
                            from: max,
                            to: _graph.to,
                            color: 'rgba(0, 0, 0, 0.2)'
                        });
                        detailChart.series[0].setData(detailData);
                        return false;
                    }
                }
            },
            title: {
                text: null
            },
            xAxis: {
                type: 'datetime',
                showLastTickLabel: true,
                maxZoom: 24 * 3600000, // fourteen days
                plotBands: [{
                    id: 'mask-before',
                    from: _graph.from,
                    to: _graph.to,
                    color: 'rgba(0, 0, 0, 0.2)'
                }],
                title: {
                    text: null
                }
            },
            yAxis: {
                gridLineWidth: 0,
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                min: 0.6,
                showFirstLabel: false
            },
            tooltip: {
                formatter: function() {
                    return false;
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    fillColor: {
                        linearGradient: [0, 0, 0, 70],
                        stops: [
                            [0, '#4572A7'],
                            [1, 'rgba(0,0,0,0)']
                        ]
                    },
                    lineWidth: 1,
                    marker: {
                        enabled: false
                    },
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    enableMouseTracking: false
                }
            },
            series: [{
                type: 'area',
                name: _graph.title,
                pointInterval: 24 * 3600 * 1000,
                pointStart: _graph.from,
                data: data
            }],
            exporting: {
                enabled: false
            }
        }, function(masterChart) {
            createDetail(masterChart)
        });
    }
    // create the detail chart
    function createDetail(masterChart) {
        var detailData = [],
        detailStart = _graph.from;
        jQuery.each(masterChart.series[0].data, function(i, point) {
            if (point.x >= detailStart) {
                detailData.push(point.y);
            }
        });
        detailChart = new Highcharts.Chart({
            chart: {
                marginBottom: 120,
                renderTo: 'detail-container',
                reflow: false,
                marginLeft: 50,
                marginRight: 20,
                style: {
                    position: 'absolute'
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: _graph.desc
            },
            subtitle: {
                text: 'Select an area by dragging across the lower chart'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: null
                },
                maxZoom: 0.1
            },
            tooltip: {
                formatter: function() {
                    var point = this.points[0];
                    return point.series.name + ': <b>'+Highcharts.numberFormat(point.y,2)+'</b><br/>'+ Highcharts.dateFormat('%A %B %e %Y', this.x);
                },
                shared: true
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                enabled: true,
                                radius: 8
                            }
                        }
                    }
                }
            },
            series: [{
                name: _graph.title,
                pointStart: detailStart,
                pointInterval: 24 * 3600 * 1000,
                data: detailData
            }],
            exporting: {
                enabled: false
            }
        });
    }
    var $container = $('#graph-container')
        .css('position', 'relative');
    var $detailContainer = $('<div id="detail-container">')
        .appendTo($container);

    var $masterContainer = $('<div id="master-container">')
        .css({ position: 'absolute', top: 300, height: 80, width: '100%' })
        .appendTo($container);

    // create master and in its callback, create the detail chart
    createMaster();

    $("header .selector .element").change(function() {
	var level=parseInt($(this).data('level'));
	$(this).parent().find(".element").each(function(i,item) {
	    if($(item).data('level') > level)
		$(item).remove();
	});
    });

});
