from django.db import models

# Create your models here.

class server(models.Model):
    name = models.CharField(max_length=15)
    def __unicode__(self):
        return self.name

class service(models.Model):
    sname = models.CharField(max_length=50)
    def __unicode__(self):
        return self.sname

class Graph(models.Model):
    sname = models.ForeignKey(service)
    label = models.CharField(max_length=100)
    data = models.CharField(max_length=200)
    def __unicode__(self):
        return str(self.sname) + " - " + self.data
