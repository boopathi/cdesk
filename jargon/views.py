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
    #basepath = "/data/graphite/whisper/"
    path = str(path)
    from_time='0'
    until_time=int(time.time())
    (timeInfo, values) = whisper.fetch(path, from_time, until_time)
    (start,end,step)=timeInfo
    values_json = str(values).replace('None','null')
    return {'start':start,'end':end,'step':step,'values':values_json }

@ensure_csrf_cookie
def index(request):
    context = {} # _whisper_fetch('hosting/cp-23/mysql/modsec/total_dbs_size.wsp')
    context.update(csrf(request))
    return render_to_response('jargon.html', context)

@csrf_exempt
def children(request):
    response = {}
    basepath = '/data/graphite/whisper'
    currentpath = os.path.realpath(os.path.join(basepath,request.POST['metricpath']))
    nohack = currentpath.startswith(basepath)
    wsp = nohack and os.path.splitext(currentpath)[1] == ".wsp"
    response['nohack']=nohack
    response['wsp']=os.path.splitext(currentpath)[1]
    if wsp:
        context = _whisper_fetch(currentpath)
        response['status'] = 2
        response['payload'] = context
        response['input'] = currentpath
        response['base'] = basepath
        return HttpResponse(json.dumps(response), mimetype='application/json')
    flag = nohack and os.path.exists(currentpath)
    response['flag']=flag
    try:
        os.listdir(currentpath);
    except OSError:
        response['oserror']=True
        flag=False
    if flag: #then no one trying to hack into parent folders
        submetrics=[x for x in os.listdir(currentpath)]
        response['status'] = 1
        response['payload'] = submetrics
        response['input'] = currentpath
        response['base'] = basepath
        return HttpResponse(json.dumps(response), mimetype='application/json')
    else:
        response['status'] = 0
        response['payload'] = []
        response['input'] = currentpath
        response['base']=basepath
        return HttpResponse(json.dumps(response), mimetype='application/json')
