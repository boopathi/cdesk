from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'cdesk.views.home', name='home'),
    # url(r'^cdesk/', include('cdesk.foo.urls')),
    url(r'^dashboard/$', 'dashboard.views.index'),
    url(r'^dashboard/(?P<server_name>[A-Za-z0-9-]+)/$', 'dashboard.views.servergraphs'),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
