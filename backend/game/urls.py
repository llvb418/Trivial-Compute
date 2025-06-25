from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'), 
    path('random-question/', views.get_random_question, name='random-question'),
    path('start-session/', views.start_session),
    path('join-session/<int:session_id>/', views.join_session),
    path('session/<int:session_id>/', views.get_session_state),
    path('api/award-chip/<int:player_id>/', views.award_chip),
    path('api/update-position/<int:player_id>/', views.update_position),

]
