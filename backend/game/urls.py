from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'), 
    path('random-question/', views.get_random_question, name='random-question'),
]
