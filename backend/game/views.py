from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import *
from .serializers import *
from django.http import HttpResponse
import random
from rest_framework.decorators import api_view
from .game_logic import find_tiles_at_distance

def home(request):
    return HttpResponse("Welcome to the Trivial Compute backend.")

@api_view(['GET'])
def get_random_question(request):
    category_name = request.query_params.get('category', None)  # get category from URL query params, or None

    if category_name:
        # Try to get the category object
        try:
            category = Category.objects.get(name__iexact=category_name)
            questions = Question.objects.filter(category=category)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=404)
    else:
        # No category filter — use all questions
        questions = Question.objects.all()

    if not questions.exists():
        return Response({"error": "No questions available"}, status=404)

    question = questions.order_by('?').first()
    data = {
        "id": question.id,
        "question_text": question.question_text,
        "question_type": question.question_type,
        "category": question.category.name,
        "answer": question.answer_text,
    }

    if question.question_type == "MC":
        options = question.options.all().values('text')  
        data["options"] = list(options)

    return Response(data)

@api_view(['POST'])
def roll_dice(request, player_id):
    player = Player.objects.get(id=player_id)
    roll = random.randint(1, 6)
    start_tile = player.position  # assuming it's an integer ID

    possible_tile_ids = find_tiles_at_distance(start_tile, roll)
    possible_tiles = Tile.objects.filter(id__in=possible_tile_ids)

    return Response({
        "roll": roll,
        "possible_tiles": possible_tile_ids,
        # "possible_tiles": [
        #     {"id": t.id, "position": t.position, "type": t.tile_type}
        #     for t in possible_tiles
        # ]
    })

@api_view(['POST'])
def start_session(request):
    session = GameSession.objects.create()
    return Response({"session_id": session.id})

@api_view(['POST'])
def join_session(request, session_id):
    name = request.data.get("name")
    session = get_object_or_404(GameSession, id=session_id)

    if session.players.count() >= 4:
        return Response({"error": "Session full"}, status=400)

    # Assign next available color
    used_colors = session.players.values_list('color', flat=True)
    available_colors = [c[0] for c in Player.COLORS if c[0] not in used_colors]

    if not available_colors:
        return Response({"error": "No available colors"}, status=400)

    player = Player.objects.create(name=name, color=available_colors[0], session=session, position=22)
    serializer = PlayerSerializer(player)
    return Response(serializer.data)

@api_view(['GET'])
def get_session_state(request, session_id):
    session = get_object_or_404(GameSession, id=session_id)
    players = session.players.all()

    return Response({
        "session_id": session.id,
        "current_turn": session.current_turn,
        "players": [
            {
                "name": p.name,
                "color": p.color,
                "chips": {
                    "red": p.has_red_chip,
                    "blue": p.has_blue_chip,
                    "green": p.has_green_chip,
                    "yellow": p.has_yellow_chip
                },
                "position": p.position
            }
            for p in players
        ]
    })

@api_view(['POST'])
def award_chip(request, player_id):
    color = request.data.get("color")
    player = get_object_or_404(Player, id=player_id)

    player.award_chip(color)
    return Response({"message": f"{player.name} awarded {color} chip."})

@api_view(['POST'])
def update_position(request, player_id):
    player = get_object_or_404(Player, id=player_id)
    position = request.data.get("position")

    if position is None:
        return Response({"error": "Missing 'position' in request"}, status=400)

    player.position = position
    player.save()
    return Response({"message": f"{player.name}'s position updated to {position}."})
