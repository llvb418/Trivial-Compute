from rest_framework import serializers
from .models import *

class AnswerOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerOption
        fields = ['text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    options = AnswerOptionSerializer(many=True, required=False)

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'question_type', 'category', 'answer_text', 'is_true', 'options']

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'name', 'color', 'position', 'session', 'session_player_id']
