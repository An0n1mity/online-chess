from django.db import models

class User(models.Model):
   username = models.CharField(
           max_length=255,
           unique=True
           )
   email = models.CharField(
           max_length=255,
           unique=True
           )
   password = models.CharField(max_length=255)
 # Create your models here.
