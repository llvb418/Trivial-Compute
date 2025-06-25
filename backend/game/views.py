from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import *
from .serializers import QuestionSerializer
from django.http import HttpResponse
import random

def home(request):
    return HttpResponse("Welcome to the Trivial Compute backend.")

@api_view(['GET'])
def get_random_question(request):
    question = Question.objects.order_by('?').first()
    data = {
        "id": question.id,
        "question_text": question.question_text,
        "question_type": question.question_type,
        "category": question.category.name,
    }

    if question.question_type == "MC" or question.question_type == "TF":
        options = question.options.all().values('text')  # don’t include is_correct
        data["options"] = list(options)
    elif question.question_type == "TXT":
        data["answer_type"] = "text"

    return Response(data)

def roll_dice(request):
    rolled_val = random.randint(1, 6)
    context = {'roll_result': rolled_val}
    return Response(context)

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

    player = Player.objects.create(name=name, color=available_colors[0], session=session)
    return Response({"name": player.name, "color": player.color})

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
