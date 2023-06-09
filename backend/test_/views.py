import os
import chess
import chess.engine
from django.contrib.gis.geoip2 import GeoIP2
from .models import User, ChessGameStatistics, ChessGame

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from .serializers import RegistrationSerializer, LoginSerializer
from rest_framework.response import Response
from rest_framework import permissions
from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework.authtoken.models import Token
import time
import datetime


from django.http import FileResponse, HttpResponseNotFound
from django.conf import settings

from .tasks import update_player_remaining_time


# get current file path
dir_path = os.path.dirname(os.path.realpath(__file__))

engine = chess.engine.SimpleEngine.popen_uci(
    dir_path + "/../stockfish_engine/stockfish")
easy_bot = chess.engine.SimpleEngine.popen_uci(
    dir_path + "/../stockfish_engine/stockfish")
easy_bot.configure({"UCI_LimitStrength": True, "UCI_Elo": 1350})


class RegistrationAPIView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer

    def post(self, request):
        user = request.data.get('user', {})

        # Use geoip2 to get the country from the IP address
        geo = GeoIP2()
        country = geo.country_code(user['ip'])

        # Add the country to the user data
        user['country'] = country
        # Remove ip from the user data
        user.pop('ip', None)
        # Update the serializer with the country
        serializer = RegistrationSerializer(data=user)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except:
            # Check if related to username
            try:
                # if username is already taken
                if serializer.errors['username'][0] == 'This field must be unique.':
                    return Response({'error': 'Username is already taken'}, status=status.HTTP_400_BAD_REQUEST)
            except:
                pass
            try:
                # if username is too short
                if serializer.errors['username'][0].code == 'Ensure this field has at least 3 characters.':
                    return Response({'error': 'Username is too short'}, status=status.HTTP_400_BAD_REQUEST)
            except:
                pass
            # Check if related to email
            try:
                # if email is already taken
                if serializer.errors['email'][0] == 'user with this email address already exists.':
                    return Response({'error': 'Email is already taken'}, status=status.HTTP_400_BAD_REQUEST)
            except:
                pass
                
            try:
                # if email is invalid
                if serializer.errors['email'][0].code == 'Enter a valid email address.':
                    return Response({'error': 'Email is invalid'}, status=status.HTTP_400_BAD_REQUEST)
            except:
                pass
            # Check if related to password
            try:
                # if password is too short
                if serializer.errors['password'][0].code == 'This password is too short. It must contain at least 8 characters.':
                    return Response({'error': 'Password is too short'}, status=status.HTTP_400_BAD_REQUEST)
            except:
                pass

            return Response({'error' : 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        user = request.data.get('user', {})
        serializer = LoginSerializer(data=user)
        print(serializer.data)
        try:
            serializer.is_valid(raise_exception=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            try:
                # if username is empty
                if serializer.errors['username'][0].code == 'blank':
                    return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
            except:
                pass
            try:
                # if password is empty
                if serializer.errors['password'][0].code == 'blank':
                    return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
            except:
                pass
            try:
                # if username is not found
                if serializer.errors['non_field_errors'][0].code == 'invalid':
                    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
            except:
                pass
            try:
                # if password is incorrect
                if serializer.errors['non_field_errors'][0].code == 'invalid':
                    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
            except:
                pass


"""
The UserAPIView class is a Django Rest Framework class-based view that provides a way to retrieve basic information about the currently authenticated user.

Attributes:
    permission_classes: A list of permission classes that determine who can access this view. In this case, the view can only be accessed by authenticated users, as specified by the IsAuthenticated permission class.

Methods:
    get: Handles GET requests to the view. Retrieves the user object of the currently authenticated user using the User.objects.get() method, and returns a JSON response containing the username and email of the user.
"""


class UserAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        print(settings.MEDIA_ROOT)
        user = User.objects.get(username=request.user.username)
        # get all the completed games of the user
        completed_user_games = ChessGame.objects.filter(
            player=user, is_completed=True)

        return Response({'username': user.username, 'email': user.email, 'country': user.country, 'status': user.status,
                         'games': completed_user_games.values('color', 'bot_difficulty', 'is_won', 'start_time', 'moves', 'state', 'id')})


class UserUpdateAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Check if the request if for updating status
        if request.data.get('status'):
            user = User.objects.get(username=request.user.username)
            user.status = request.data.get('status')
            user.save()
            return Response({'status': user.status})

        # Check if the request if for updating profile picture
        if request.data.get('profile_picture'):
            user = User.objects.get(username=request.user.username)
            user.profile_picture = request.data.get('profile_picture')
            user.save()
            return Response({'profile_picture': user.profile_picture})


def image_view(request, image_name):
    # Construct the path to the image file
    image_path = os.path.join(settings.BASE_DIR, '.', 'images', image_name)
    print(image_path)
    # Check if the image file exists
    if os.path.exists(image_path):
        # Serve the image file using FileResponse
        return FileResponse(open(image_path, 'rb'))

    # Return a 404 response if the image file doesn't exist
    return HttpResponseNotFound()


class ChessStatisticsAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        token = request.headers.get('Authorization').split(' ')[1]
        try:
            token_obj = Token.objects.get(key=token)
            user = token_obj.user
            stats = ChessGameStatistics.objects.get(user=user)
            return Response({
                'games_played': stats.games_played,
                'games_won': stats.games_won,
                'games_lost': stats.games_lost,
                'games_drawn':  stats.games_drawn,
                'elo_rating': stats.elo_rating,
                'highest_elo_rating': stats.highest_elo_rating,
            })
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)


class NewChessGameAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        print(request.data)
        user = User.objects.get(username=request.user.username)
        # Get the bot difficulty from the request data
        bot_difficulty = request.data.get('bot_difficulty')
        # Get player color
        color = request.data.get('color')
        # Get time control
        time_control = request.data.get('time_control')
        # Set bot and player remaining time to time control
        bot_remaining_time = datetime.timedelta(minutes=int(time_control))
        player_remaining_time = datetime.timedelta(minutes=int(time_control))
        # Virtual time of last move
        last_move_time = datetime.datetime.now()

        # Create a new chess game
        chess_game = ChessGame.objects.create(player=user, bot_difficulty=bot_difficulty, color=color, time_control=time_control,
                                              bot_remaining_time=bot_remaining_time, player_remaining_time=player_remaining_time, last_move_time=last_move_time)
        chess_game.save()

        # Setup the worker to update player
        update_player_remaining_time.delay(chess_game.id)

        return Response({'game_id': chess_game.id})


class ChessGameDeleteAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, game_id):
        token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
        try:
            # Check if the token is valid and get the user
            token_obj = Token.objects.get(key=token)
            user = token_obj.user
            game = ChessGame.objects.get(id=game_id, player=user)
            game.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ChessGame.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class ChessGameStateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, game_id):
        token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
        try:
            # Check if the token is valid and get the user
            token_obj = Token.objects.get(key=token)
            user = token_obj.user
            game = get_object_or_404(ChessGame, id=game_id, player=user)
            # player stats
            player_stats = ChessGameStatistics.objects.get(user=user)
            player_elorating = player_stats.elo_rating
            player_username = user.username
            player_avatar = user.avatar.url
            player_remaining_time = game.player_remaining_time
            bot_remaining_time = game.bot_remaining_time
            is_game_complete = game.is_completed
            reason = game.reason
            is_won = game.is_won
            return Response({'state': game.state, 'color': game.color, 'bot': game.bot_difficulty,
                             'time_control': game.time_control, 'player_username': player_username, 'player_elorating': player_elorating,
                             'player_avatar': player_avatar, 'player_remaining_time': player_remaining_time, 'bot_remaining_time': bot_remaining_time,
                             'is_game_complete': is_game_complete, 'reason': reason, 'is_won': is_won})

        except (Token.DoesNotExist, ChessGame.DoesNotExist):
            return Response(status=401)


def get_bot_move(fen, difficulty):
    board = chess.Board(fen)
    # Set the ply (the number of moves to look ahead) based on the difficulty level
    if difficulty == 1:
        result = easy_bot.play(board, chess.engine.Limit(depth=1, nodes=1))
        # wait a certain amount of time before making the move
        time.sleep(3)

    return result.move


def apply_move(game, move):
    board = chess.Board(game)
    board.push(move)
    return board.fen()



def board_turn_to_color(board_turn):
    if board_turn == chess.WHITE:
        return 'w'
    else:
        return 'b'

class ChessGameMoveAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, game_id):
        # store the time of the request
        request_time = datetime.datetime.now()
        token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
        try:
            token_obj = Token.objects.get(key=token)
            user = token_obj.user
            game = get_object_or_404(ChessGame, id=game_id, player=user)
            board = chess.Board(game.state)

            # Apply locking mechanism on the ChessGame object
            game = ChessGame.objects.select_for_update().get(id=game_id, player=user)

            # Get current player that needs to make a move
            current_turn = board.turn
            # false is black and true is white
            player_color = game.color
            player_turn = True if player_color == 'w' else False
            # If player is black and game just started, make a bot move
            if not player_turn and game.state == 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1':
                bot_move = get_bot_move(game.state, game.bot_difficulty)
                board.push(bot_move)
                game.state = board.fen()
                # update turn 
                game.turn = board_turn_to_color(board.turn) 
                game.save()
                return Response({'state': game.state})

            from_square = request.data.get('from')
            to_square = request.data.get('to')
            move = chess.Move.from_uci(from_square + to_square)

            from django.utils.timezone import make_aware
            # Check if the move is legal and if it is the player's turn
            if move in list(board.legal_moves) and current_turn == player_turn:
                # print how long it takes to get to this part of code
                request_time = make_aware(request_time, datetime.timezone.utc)
                # update player elapsed time
                elapsed_time_since_last_move = request_time - game.last_move_time
                # Convert the time difference to timedelta with minutes and seconds
                total_seconds = elapsed_time_since_last_move.total_seconds()
                # Create a new timedelta object with the calculated time difference
                time_difference = datetime.timedelta(seconds=total_seconds)
                # Update the player remaining time
                game.player_remaining_time -= time_difference
                game.last_move_time = request_time
                # if the player runs out of time, the game is over
                if game.player_remaining_time.total_seconds() <= 0:
                    game.player_remaining_time = datetime.timedelta(
                        seconds=0, milliseconds=0, microseconds=0)
                    game.is_completed = True
                    game.end_time = request_time
                    game.reason = 'time limit'
                    game.save()
                    return Response({'status': 'legal', 'state': game.state, 'player_remaining_time': game.player_remaining_time, 'bot_remaining_time': game.bot_remaining_time})

                board.push(move)
                game.moves += 1
                game.state = board.fen()
                game.turn = board_turn_to_color(board.turn)
                game.save()

                # if checkmate, the game is over
                if board.is_checkmate():
                    game.is_completed = True
                    game.end_time = request_time
                    game.reason = 'checkmate'
                    game.save()
                    return Response({'status': 'legal', 'state': game.state, 'player_remaining_time': game.player_remaining_time, 'bot_remaining_time': game.bot_remaining_time})

                # elif stalemate, the game is over
                elif board.is_stalemate():
                    game.is_completed = True
                    game.end_time = request_time
                    game.reason = 'stalemate'
                    game.save()
                    return Response({'status': 'legal', 'state': game.state, 'player_remaining_time': game.player_remaining_time, 'bot_remaining_time': game.bot_remaining_time})

                bot_move = get_bot_move(game.state, game.bot_difficulty)
                # check if capture
                captured = False
                if board.is_capture(bot_move):
                    captured = True

                # update bot elapsed time
                elapsed_time_since_last_move = make_aware(
                    datetime.datetime.now(), datetime.timezone.utc) - game.last_move_time
                # Convert the time difference to timedelta with minutes and seconds
                total_seconds = elapsed_time_since_last_move.total_seconds()
                # Create a new timedelta object with the calculated difference
                time_difference = datetime.timedelta(seconds=total_seconds)
                # Update the bot remaining time
                game.bot_remaining_time -= time_difference
                game.last_move_time += time_difference

                # if the bot runs out of time, the game is over
                if game.bot_remaining_time.total_seconds() <= 0:
                    game.bot_remaining_time = datetime.timedelta(
                        seconds=0, milliseconds=0, microseconds=0)
                    game.is_completed = True
                    game.end_time = request_time
                    game.reason = 'time limit'
                    game.save()
                    return Response({'status': 'legal', 'state': game.state, 'player_remaining_time': game.player_remaining_time, 'bot_remaining_time': game.bot_remaining_time})

                board.push(bot_move)
                game.moves += 1
                game.state = board.fen()
                game.turn = board_turn_to_color(board.turn)
                game.save()

                # if checkmate, the game is over
                if board.is_checkmate():
                    game.is_completed = True
                    game.end_time = request_time
                    game.reason = 'checkmate'
                    game.save()
                    return Response({'status': 'legal', 'state': game.state, 'player_remaining_time': game.player_remaining_time, 'bot_remaining_time': game.bot_remaining_time})

                # elif stalemate, the game is over
                elif board.is_stalemate():
                    game.is_completed = True
                    game.end_time = request_time
                    game.reason = 'stalemate'
                    game.save()
                    return Response({'status': 'legal', 'state': game.state, 'player_remaining_time': game.player_remaining_time, 'bot_remaining_time': game.bot_remaining_time})

                return Response({'status': 'legal', 'state': game.state, 'player_remaining_time': game.player_remaining_time, 'bot_remaining_time': game.bot_remaining_time, 'captured': captured})
            else:
                return Response({'status': 'illegal', 'state': game.state}, status=status.HTTP_200_OK)
        except (Token.DoesNotExist, ChessGame.DoesNotExist):
            return Response(status=401)
