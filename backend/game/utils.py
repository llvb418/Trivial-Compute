# game/utils.py

from .models import Tile
from .game_logic import tile_graph  # where you define the static structure

def init_board_for_session(session):
    category_mapping = session.get_category_mapping()

    for position, (tile_type, neighbors) in tile_graph.items():
        label = category_mapping.get(tile_type, tile_type)  # swap C1–C4 with real names
        Tile.objects.create(
            session=session,
            position=position,
            label=label,
            neighbors=neighbors
        )
