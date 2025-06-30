# backend/game/game_logic.py

tile_graph = {
    0: [1, 9], 1: [0, 2], 2: [1, 3], 3: [2, 4], 4: [3, 5, 10], 5: [4, 6], 6: [5, 7], 7: [6, 8], 8: [7, 11],
    9: [0, 12], 10: [4, 13], 11: [8, 14],
    12: [9, 15], 13: [10, 16], 14: [11, 17],
    15: [12, 18], 16: [13, 22], 17: [14, 24],
    18: [15, 19, 27], 19: [18, 20], 20: [19, 21], 21: [20, 22], 22: [21, 23, 16, 28], 23: [22, 24], 24: [23, 25], 25: [24, 26], 26: [17, 25, 29], 
    27: [18, 30], 28: [22, 31], 29: [26, 32], 
    30: [27, 33], 31: [28, 34], 32: [29, 35], 
    33: [30, 36], 34: [31, 40], 35: [32, 44], 
    36: [33, 37], 37: [36, 38], 38: [37, 39], 39: [38, 40], 40: [39, 34, 41], 41: [40, 42], 42: [41, 43], 43: [42, 44], 44: [43, 35]
}

from collections import deque

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
            for neighbor in tile_graph.get(current_tile, []):
                if neighbor != prev_tile and (neighbor, steps + 1) not in visited:
                    visited.add((neighbor, steps + 1))
                    queue.append((neighbor, steps + 1, current_tile, path + [neighbor]))
    return result
