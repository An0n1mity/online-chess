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
from .serializers import RegistrationSerializer, LoginSerializer
from rest_framework.response import Response


class RegistrationAPIView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer

    def post(self, request):
        user = request.data.get('user', {})
        # Check if the mail or the username already exists 
        serializer = RegistrationSerializer(data=user)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except:
            # Check if serialize errors are related to the username or the email 
            try:
                if serializer.errors['username'][0].code == 'unique':
                    return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
            except:
                pass 
            try:
                if serializer.errors['email'][0].code == 'unique':
                    return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
            except:
                pass
           # Check if serialize errors are related to the password 
            try:    
                if serializer.errors['password'][0].code == 'password_too_common':
                    return Response({'error': 'Password is too common'}, status=status.HTTP_400_BAD_REQUEST)
                elif serializer.errors['password'][0].code == 'password_too_short':
                    return Response({'error': 'Password is too short'}, status=status.HTTP_400_BAD_REQUEST)
                elif serializer.errors['password'][0].code == 'password_too_similar':
                    return Response({'error': 'Password is too similar to the username'}, status=status.HTTP_400_BAD_REQUEST)
                elif serializer.errors['password'][0].code == 'password_entirely_numeric':
                    return Response({'error': 'Password is entirely numeric'}, status=status.HTTP_400_BAD_REQUEST)
            except:
                pass

            
class LoginAPIView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        user = request.data.get('user', {})
        serializer = LoginSerializer(data=user)
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

