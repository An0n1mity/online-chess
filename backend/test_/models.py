from django.db import models

class Game(models.Model):
   white_player = models.ForeignKey(User, related_name='games_white_player')
   black_player = models.ForeignKey(User, related_name='games_black_player')
   current_turn = models.ForeignKey(User, related_name='games_current_turn')
   game_state = models.TextField()
   created_at = models.DateTimeField(auto_now_add=True)
   updated_at = models.DateTimeField(auto_now=True)

class User(models.Model):
   username = models.CharField(
           max_length=255
           unique=True
           )
   email = models.CharField(
           max_length=255
           unique=True
           )
   password = models.CharField(max_length=255)
 # Create your models here.
