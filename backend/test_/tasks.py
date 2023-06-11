from celery import shared_task
from django.utils import timezone

from django.db import transaction
from .models import ChessGame, ChessGameStatistics
import time
from django.shortcuts import get_object_or_404

@shared_task
def update_player_remaining_time(game_id):
    while True:
        with transaction.atomic():
            game = ChessGame.objects.select_for_update().get(id=game_id)
            if game.is_completed:
                break

            if game.is_player_turn():
                # Calculate the elapsed time since the last update minus 1 second
                game.player_remaining_time -= timezone.timedelta(seconds=1)

                if game.player_remaining_time.total_seconds() <= 0:
                    # Game over, handle accordingly
                    game.is_completed = True
                    game.end_time = timezone.now()
                    game.reason = 'time limit'

                    # update statistics
                    statistics = get_object_or_404(ChessGameStatistics, user=game.player)
                    statistics.games_lost += 1
                    statistics.games_played += 1
                    statistics.save()

                game.save()

        # Sleep for a short interval before the next update
        time.sleep(1)  # Adjust the interval as needed