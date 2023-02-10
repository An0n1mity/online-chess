from django.db import models

class Game(models.Model):
   white_player = models.ForeignKey(User, related_name='games_white_player')
   black_player = models.ForeignKey(User, related_name='games_black_player')
   current_turn = models.ForeignKey(User, related_name='games_current_turn')
   game_state = models.TextField()
   created_at = models.DateTimeField(auto_now_add=True)
   updated_at = models.DateTimeField(auto_now=True)

# Create your models here.
