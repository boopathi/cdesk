var masterChart,detailChart;
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
$(document).ready(function() {

    var resizedata = function (args) {
	if(args.data.length <= 1000) return args;
	var list=[],sum=0;
	var ng=args.data.length/1000;
	/*
	for(var i=0;i<1000;i++){
	    sum=0;
	    for(var j=0;j<ng;j++)
		sum=sum+args.data[i+j];
	    list.push(sum/ng);
	}*/
	for(var i=0;i<1000;i++){
	    console.log(getRandomInt(ng*i, ng*(i+1)));
	    list.push(data[getRandomInt(ng*i, ng*(i+1))]);
	}
	console.log(list);
	return {
	    data: list,
	    interval: ng*args.interval
	};
    }
    // create the master chart
    function createMaster() {
	var newdata = resizedata({
	    data: data, interval: _graph.interval
	});
	console.log(newdata);
	_graph.data = newdata.data;
	_graph.interval = newdata.interval;
	//map only the last few points
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
                        xAxis.removePlotBand('mask-before');
                        xAxis.addPlotBand({
                            id: 'mask-before',
                            from: _graph.from,
                            to: min,
                            color: 'rgba(0, 0, 0, 0.4)'
                        });
                        xAxis.removePlotBand('mask-after');
                        xAxis.addPlotBand({
                            id: 'mask-after',
                            from: max,
                            to: _graph.to,
                            color: 'rgba(0, 0, 0, 0.4)'
                        });
			console.log(min,max);
			var detailgraph = {
			    from: parseInt((min-_graph.from)/_graph._interval),
			    to: parseInt((max-_graph.from)/_graph._interval)+1,
			    data: [], interval: 10
			}
			for(i=detailgraph.from;i<detailgraph.to;i++)
			    detailgraph.data.push(data[i]);
			var newdata = resizedata({
			    data: detailgraph.data,
			    interval: _graph._interval
			});
			detailgraph.data = newdata.data;
			detailgraph.interval = newdata.interval;
			console.log(detailgraph);
			createDetail(detailgraph);
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
                //maxZoom: 24 * 3600000, // fourteen days
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
                pointInterval: _graph.interval,
                pointStart: _graph.from,
                data: _graph.data
            }],
            exporting: {
                enabled: false
            }
        }, function(masterChart) {
            createDetail(_graph)
        });
    }
    // create the detail chart
    function createDetail(detailgraph) {
        //var detailData = [],
	var detailData = detailgraph.data;
        var detailStart = detailgraph.from;
	/*
        jQuery.each(masterChart.series[0].data, function(i, point) {
            if (point.x >= detailStart) {
                detailData.push(point.y);
            }
        });*/
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
                pointInterval: detailgraph.interval,
                data: detailData
            }],
            exporting: {
                enabled: false
            }
        });
    }
    var $container = $('#graph-container').css('position', 'relative');
    var $detailContainer = $('<div id="detail-container">').appendTo($container);

    var $masterContainer = $('<div id="master-container">').css({
	position: 'absolute', top: 300, height: 80, width: '100%'
    }).appendTo($container);

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

    var pathSelector = (function() {
	var selector = $("header .selector");
	var elements = selector.find(".element");
	var max = 0;
	var path = [];
	var loader = $("#loader");
	function changer() {
	    var level=parseInt($(this).data('level'));
	    var els = selector.find(".element");
	    els.each(function(i,item) {
		if(parseInt($(item).data('level')) > level) {
		    $(item).remove(); path.pop();
		}
	    });
	    max = level;
	    loader.show();
	    val = $(this).val();
	    send(val);
	}
	elements.change(changer);
	function send(val) {
	    if(!val) val='.';
	    path.push(val);
	    $.ajax({
		type: "POST",
		url: "./_a",
		data: {metricpath:path.join('/')},
		dataType: "json",
		success: function(response) {
		    loader.hide();
		    if(response.status == 2) {
			var arr = response.payload.values;
			window.data=arr;
			window._graph = {
			    title: "val",
			    desc: path.join('.'),
			    data: [], interval: response.payload.step,
			    _interval: response.payload.step,
			    from: response.payload.start*1000,
			    to: response.payload.end*1000
			};
			createMaster();
		    }
		    if(response.status == 1)
			add(response.payload);
		    else
			path.pop();
		},
		error: function() {
		    path.pop();
		    loader.hide();
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
