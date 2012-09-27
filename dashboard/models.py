from django.db import models

# Create your models here.

class dImage(models.Model):
    src = models.CharField(max_length=200)
    alt = models.CharField(max_length=200)

class server(models.Model):
    name = models.CharField(max_length=100)
    ip_addr = models.CharField(max_length=40)


