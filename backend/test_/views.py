from django.shortcuts import render
from django.http import JsonResponse    
from django.views.decorators.csrf import csrf_exempt
import json 
from . import chess_logic

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
