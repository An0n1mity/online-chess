from django.shortcuts import render
from django.http import JsonResponse    
from django.views.decorators.csrf import csrf_exempt
import json 
from . import chess_logic

from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate

@csrf_exempt
def create_board(request):
    if request.method == 'POST':
        board = chess_logic.createBoard()
        fen = chess_logic.boardToFen(board)
        return JsonResponse({'fen': fen})
    else:
        return JsonResponse({'error': 'Invalid request type'})

@csrf_exempt
def make_move(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if "move" in data:
            move = data.get("move")
            return JsonResponse({'move': move})

    return JsonResponse({'error': 'Invalid request'})

# Register a new users and save it to the database
@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password') 
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'})
        elif User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'})
        else:
            user = User.objects.create_user(username, email, password)
            user.save()
            return JsonResponse({'success': 'User created successfully'})

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
       
        user = authenticate(request, username=username, password=password)

        if user is not None:
            return JsonResponse({'success': 'Logged in'})
        else:
            return JsonResponse({'error': 'Username or password invalids'})


