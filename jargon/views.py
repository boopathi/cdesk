# Create your views here.

from django.http import HttpResponse
from django.template import Context, loader
from django.shortcuts import render_to_response, get_object_or_404

def index(request):
    context = {
        'servers': [1,2,3,4]
    }
    return render_to_response('jargon.html', context)
