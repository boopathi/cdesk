# Create your views here.

from django.http import HttpResponse
from django.template import Context, loader
from django.shortcuts import render_to_response, get_object_or_404

def _whisper_fetch(path):
    #imported from whisperfetch.py
    import sys, time, os
    import whisper
    basepath = "/data/graphite/whisper/"
    path = basepath+str(path)
    from_time='0'
    until_time=int(time.time())
    (timeInfo, values) = whisper.fetch(path, from_time, until_time)
    (start,end,step)=timeInfo
    values_json = str(values).replace('None','null')
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
    return {'start':start,'end':end,'step':step,'values':values_json,'metrics':ametr }

def index(request):
    context = _whisper_fetch('hosting/cp-23/mysql/modsec/total_dbs_size.wsp')
    return render_to_response('jargon.html', context)
