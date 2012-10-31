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

    function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
		var cookie = jQuery.trim(cookies[i]);
		if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
		}
            }
	}
	return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');
    function csrfSafeMethod(method) {return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));}
    function sameOrigin(url) {
	var host = document.location.host; // host + port
	var protocol = document.location.protocol;
	var sr_origin = '//' + host;
	var origin = protocol + sr_origin;
	return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    $.ajaxSetup({
	beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url))
		xhr.setRequestHeader("X-CSRFToken", csrftoken);
	}
    });

    var gtree = (function() {
	//settings
	var db = _graph.tree;
	var current = [];
	return {

	};
    })();

    var pathSelector = (function() {
	var selector = $("header .selector");
	var elements = selector.find(".element");
	var max = 0;
	var path = [];
	console.log(elements);
	function changer() {
	    var level=parseInt($(this).data('level'));
	    var els = selector.find(".element");
	    els.each(function(i,item) {
		if(parseInt($(item).data('level')) > level) {
		    $(item).remove(); path.pop();
		}
	    });
	    max = level;
	    val = $(this).val();
	    send(val);
	}
	elements.change(changer);
	function send(val) {
	    if(!val) val = ""
	    $.ajax({
		type: "POST",
		url: "./_children",
		data: {metricpath:path.join('/')+'/'+val},
		dataType: "json",
		success: function(response) {
		    if(response.status == 1) {
			val && path.push(val);
			add(response.payload);
		    }
		}
	    });
	}
	function add(args) {
	    var el = $("<select/>", {
		'class': 'element',
		'data-level': max+1
	    });
	    el.append("<option>...</option>");
	    for( i in args) {
		var sub = $("<option/>",{text: args[i]});
		el.append(sub);
	    }
	    el.change(changer).appendTo(selector);
	}
	return function() {
	    send();
	}
    })();
    pathSelector();
});
