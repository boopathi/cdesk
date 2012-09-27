# Create your views here.

from django.http import HttpResponse

def index(request): #provide server_list
    return HttpResponse("Hello World. Server List")

def servergraphs(request,server_name):
    return HttpResponse(server_name)
