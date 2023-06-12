"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from test_.views import *

from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('api/register', RegistrationAPIView.as_view(), name='register'),
    path('api/login', LoginAPIView.as_view(), name='login'),
    path('api/user_info', UserAPIView.as_view(), name='user_info'),
    path('api/chess_stats', ChessStatisticsAPIView.as_view(), name='chess_statistics'),
    path('api/create_game/', NewChessGameAPIView.as_view(), name='new_chess_game'),
    path('api/game/<str:game_id>/state/', ChessGameStateAPIView.as_view(), name='chess_game_state'),
    path('api/game/<str:game_id>/move/', ChessGameMoveAPIView.as_view()),
    path('images/<str:image_name>/', image_view, name='image-view'),
    path('api/user_update', UserUpdateAPIView.as_view(), name='user_update'),	
    path('api/games/<str:game_id>/delete', ChessGameDeleteAPIView.as_view(), name='game-delete'),
    ]
