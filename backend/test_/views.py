from django.shortcuts import render
from django.http import JsonResponse    
from django.views.decorators.csrf import csrf_exempt
import json 
from . import chess_logic

from django.contrib.auth import get_user_model
import django.contrib.auth as auth
from django.contrib.auth import login, authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from .serializers import RegistrationSerializer
from rest_framework.response import Response


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
            try:
                validate_password(password) 
                user = User.objects.create_user(username, email, password)          
                user.save()
                return JsonResponse({'success': 'User created successfully'})
            except ValidationError as e:
                return JsonResponse({'error': str(e).replace('[', '').replace(']', '').replace("'", '').split(',')[0]})

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            auth.login(request, user)
            refresh = RefreshToken.for_user(user)
            return JsonResponse({'success': 'Logged in', 'refresh': str(refresh), 'access': str(refresh.access_token)})
        else:
            return JsonResponse({'error': 'Username or password invalids'})

class RegistrationAPIView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer

    def post(self, request):
        user = request.data.get('user', {})
        # Check if the mail or the username already exists 
        if User.objects.filter(username=user.get('username')).exists() or User.objects.filter(email=user.get('email')).exists():
            return JsonResponse({'error': 'Username or email already exists'})
        else:
            serializer = RegistrationSerializer(data=user)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
