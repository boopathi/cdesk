from django.conf.urls import patterns, include, url

urlpatters = patterns( 'jargon.views',
    url(r'^$', 'index')
)
