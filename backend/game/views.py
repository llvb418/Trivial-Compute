from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Question
from .serializers import QuestionSerializer
from django.http import HttpResponse

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
