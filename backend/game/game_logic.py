# backend/game/game_logic.py

# id --> (tile_type, list_of_neighbors)
# C1 = RED, C2 = Yellow, C3 = Green, C4 = Blue
tile_graph = {
    0: ('ROLL_AGAIN', [1, 9]), 1: ('C2', [0, 2]), 2: ('C4', [1, 3]), 3: ('C3', [2, 4]), 4: ('HQ1', [3, 5, 10]), 5: ('C2', [4, 6]), 6: ('C4', [5, 7]), 7: ('C3', [6, 8]), 8: ('ROLL_AGAIN', [7, 11]),
    9: ('C1', [0, 12]), 10: ('C2', [4, 13]), 11: ('C1', [8, 14]),
    12: ('C3', [9, 15]), 13: ('C4', [10, 16]), 14: ('C2', [11, 17]),
    15: ('C4', [12, 18]), 16: ('C3', [13, 22]), 17: ('C4', [14, 26]),
    18: ('HQ2', [15, 19, 27]), 19: ('C4', [18, 20]), 20: ('C3', [19, 21]), 21: ('C1', [20, 22]), 22: ('START', [21, 23, 16, 28]), 23: ('C4', [22, 24]), 24: ('C2', [23, 25]), 25: ('C1', [24, 26]), 26: ('HQ3', [17, 25, 29]), 
    27: ('C1', [18, 30]), 28: ('C2', [22, 31]), 29: ('C1', [26, 32]), 
    30: ('C3', [27, 33]), 31: ('C1', [28, 34]), 32: ('C2', [29, 35]), 
    33: ('C4', [30, 36]), 34: ('C3', [31, 40]), 35: ('C4', [32, 44]), 
    36: ('ROLL_AGAIN', [33, 37]), 37: ('C2', [36, 38]), 38: ('C1', [37, 39]), 39: ('C3', [38, 40]), 40: ('HQ4', [39, 34, 41]), 41: ('C2', [40, 42]), 42: ('C1', [41, 43]), 43: ('C3', [42, 44]), 44: ('ROLL_AGAIN', [43, 35])
}

from collections import deque
from rest_framework.response import Response
from .models import GameSession, Player
from django.shortcuts import render, get_object_or_404

def get_game_board(session_id):
    # Format the tile graph data for frontend consumption
    session = get_object_or_404(GameSession, id=session_id)
    mapping = session.get_category_mapping()
    board_data = []
    for index, (tile_type, neighbors) in tile_graph.items():
        name = mapping.get(tile_type, tile_type) if tile_type.startswith("C") else tile_type
        board_data.append({
            'index': index,
            'name': name,
            'tile_type': tile_type,
            'neighbors': neighbors,
        })
    return Response({'tiles': board_data})

def find_tiles_at_distance(start_tile, distance):
    # Queue stores tuples: (current_tile, steps, prev_tile, path_so_far)
    queue = deque([(start_tile, 0, None, [start_tile])])
    visited = set()
    result = []

    while queue:
        current_tile, steps, prev_tile, path = queue.popleft()

        if steps == distance:
            result.append((current_tile))
        elif steps < distance:
            _, neighbors = tile_graph[current_tile]
            for neighbor in neighbors:
                if neighbor != prev_tile and (neighbor, steps + 1) not in visited:
                    visited.add((neighbor, steps + 1))
                    queue.append((neighbor, steps + 1, current_tile, path + [neighbor]))
    return result
