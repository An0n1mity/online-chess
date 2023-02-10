import chess 

def createBoard():
    return chess.Board()

def boardToFen(board):
    return board.fen()

def isMoveLegal(board, move):
    if move in board.legal_moves:
        return True 
    else:
        return False
