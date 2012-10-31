# Create your views here.

from django.http import HttpResponse
from django.template import Context, loader
from django.shortcuts import render_to_response, get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.core.context_processors import csrf

import sys, time, os, whisper, json

def old_find_children(path):
    #walk through the system to find all whisperdb files
    available_metrics=[]
    for root, dirnames, filenames in os.walk(basepath):
        for filename in filenames:
            temp=os.path.join(root,filename)
            if "wsp" == os.path.splitext(temp)[1]:
                available_metrics.append(temp)
    ametr = {}
    for i in available_metrics:
        p=ametr
        for x in i.split('/'):
            p = p.setdefault(x,{})

def _whisper_fetch(path):
    #imported from whisperfetch.py
    basepath = "/data/graphite/whisper/"
    path = basepath+str(path)
    from_time='0'
    until_time=int(time.time())
    (timeInfo, values) = whisper.fetch(path, from_time, until_time)
    (start,end,step)=timeInfo
    values_json = str(values).replace('None','null')
    return {'start':start,'end':end,'step':step,'values':values_json }

@ensure_csrf_cookie
def index(request):
    context = _whisper_fetch('hosting/cp-23/mysql/modsec/total_dbs_size.wsp')
    context.update(csrf(request))
    return render_to_response('jargon.html', context)

@csrf_exempt
def children(request):
    response = {}
    basepath = '/data/graphite/whisper/'
    currentpath = os.path.realpath(request.POST['metricpath'])
    if currentpath.startswith(basepath): #then no one trying to hack into parent folders
        submetrics=[x for x in os.listdir(currentpath)]
        response['status'] = 1
        response['payload'] = submetrics
        return HttpResponse(json.dumps(response), mimetype='application/json')
    else:
        response['status'] = 0
        response['payload'] = []
        response['input'] = currentpath
        return HttpResponse(json.dumps(response), mimetype='application/json')
