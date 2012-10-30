from django.conf.urls import patterns, include, url

urlpatterns = patterns( 'jargon.views',
    url(r'^$', 'index')
)
