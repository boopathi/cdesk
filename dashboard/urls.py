from django.conf.urls import patterns, include, url

urlpatterns = patterns( 'dashboard.views',
    url(r'^$', 'index'),
    url(r'^(?P<server_name>[A-Za-z0-9-]+)/$', 'server')
)
