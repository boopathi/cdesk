# Create your views here.

from django.http import HttpResponse
from django.template import Context, loader
from django.shortcuts import render_to_response, get_object_or_404

def index(request): #provide server_list
    c = {
        'servers': ['md-1','md-2']
    }
    return render_to_response('serverlist.html', c)

def URLParser(base, payload):
    serialized = '&'. join([ "%s=%s" % (key,value) for key,value in payload.iteritems()])
    return str(base) + serialized

def server(request,server_name):
    graphite_url = "http://graphite.directi.com/render/"
    payload = lambda server, service: {
        'from': '-2hours',
        'until': 'now',
        'width': '400',
        'height': '250',
        'target': "hosting.%s.%s" % (server,service),
        'title': "hosting.%s.%s" % (server,service)
    }
    services = ['dns','http','mail']
    context = {
        'imgsrc': []
    }
    for i in services:
        context['imgsrc'].append(URLParser(graphite_url, payload(server_name, i)))
    return render_to_response('server.html', context)
