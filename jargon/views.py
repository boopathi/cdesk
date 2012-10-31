# Create your views here.

from django.http import HttpResponse
from django.template import Context, loader
from django.shortcuts import render_to_response, get_object_or_404

def _whisper_fetch(path):
    #imported from whisperfetch.py
    import sys, time
    import whisper
    basepath = "/data/graphite/whisper/"
    path = basepath+str(path)
    from_time='0'
    until_time=int(time.time())
    (timeInfo, values) = whisper.fetch(path, from_time, until_time)
    (start,end,step)=timeInfo
    values_json = str(values).replace('None','null')
    return '''{
"start": %d,
"end": $d,
"step": %d,
"values": %s
}''' % (start, end, step, values_json)

def index(request):
    context = {
        'servers': [1,2,3,4]
    }
    jsondata = _whisper_fetch('hosting/cp-23/mysql/modsec/total_dbs_size.wsp')
    context['data'] = jsondata
    return render_to_response('jargon.html', context)
