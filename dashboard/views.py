# Create your views here.

from django.http import HttpResponse
from django.template import Context, loader
from django.shortcuts import render_to_response, get_object_or_404

from dashboard.models import server as Server, Graph, service as Service

services = ['dns', 'ftp', 'http','mail', 'mysql', 'power', 'system', 'uptime']
server_prefixes = ['md-', 'bh-', 'bh-cp-', 'cp-']

def index(request): #provide server_list
    c = {
        'servers': [ str(i) for i in Server.objects.all() ]
    }
    return render_to_response('serverlist.html', c)

def URLParser(base, payload):
    serialized = '&'. join([ "%s=%s" % (key,value) for key,value in payload.iteritems()])
    return str(base) + '?' + serialized

def server(request,server_name):
    graphite_url = "http://graphite.directi.com/render/"
    graph_dimensions = (200,75)
    payload = lambda host, data : {
        'from': '-2days',
        'until': 'now',
        'width': graph_dimensions[0],
        'height': graph_dimensions[1],
        'target': "mostDeviant(10,%s)" % (data % (host)),
        'title': "host",
        'graphOnly': '1'
    }
    context = {
        'img': {},
        'servers': Server.objects.all(),
        'server_name': server_name,
        'sz': graph_dimensions,
        'message': "No errors"
    }
    ss = Graph.objects.all()
    for SSi in ss:
        pload = payload(server_name, SSi.data)
        context['img'].setdefault(str(SSi.sname),[]).append((SSi.label, URLParser(graphite_url, pload)))

    return render_to_response('server.html', context)
