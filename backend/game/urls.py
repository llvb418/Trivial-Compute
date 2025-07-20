from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
    path('start-session/', views.start_session, name='start-session'),
    path('join-session/<int:session_id>/', views.join_session, name='join-session'),
    path('get-question/', views.get_random_question, name='get-question'),
    path('roll-dice/<int:session_id>/<int:player_id>/', views.roll_dice, name='roll-dice'),
    path('session-state/<int:session_id>/', views.get_session_state, name='get-session-state'),
    path('award-chip/<int:player_id>/', views.award_chip, name='award-chip'),
    path('update-position/<int:player_id>/', views.update_position, name='update-position'),
    path('get-board/<int:session_id>/', views.get_board, name='get-board'),
    path('categories/', views.list_categories, name='categories'),
    path('session-categories/<int:session_id>/', views.list_session_categories, name='session-categories'),

]
