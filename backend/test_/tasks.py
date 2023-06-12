from celery import shared_task
from django.core.cache import cache
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import ChessGame, ChessGameStatistics
import time 

@shared_task
def update_player_remaining_time(game_id):
    lock_key = f"update_player_remaining_time_lock:{game_id}"
    lock_acquired = cache.add(lock_key, "locked", timeout=10)  # Acquire the lock

    if lock_acquired:
        try:
            while True:
                with cache.lock(lock_key):
                    game = ChessGame.objects.get(id=game_id)
                    if game.is_completed:
                        break

                    if game.is_player_turn():
                        # Calculate the elapsed time since the last update minus 1 second
                        game.player_remaining_time -= timezone.timedelta(seconds=1)
                        print(game.player_remaining_time)
                        if game.player_remaining_time.total_seconds() <= 0:
                            # Game over, handle accordingly
                            game.is_completed = True
                            game.end_time = timezone.now()
                            game.reason = 'time limit'

                            # Update statistics
                            statistics = get_object_or_404(ChessGameStatistics, user=game.player)
                            statistics.games_lost += 1
                            statistics.games_played += 1
                            statistics.save()

                        game.save()

                # Sleep for a short interval before the next update
                time.sleep(1)  # Adjust the interval as needed
        finally:
            cache.delete(lock_key)  # Release the lock
    else:
        # Another worker already acquired the lock, skip the task
        pass
