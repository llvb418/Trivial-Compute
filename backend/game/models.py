from django.db import models

class Category(models.Model):
    COLOR_CHOICES = [
        ('red', 'Red'),
        ('blue', 'Blue'),
        ('green', 'Green'),
        ('yellow', 'Yellow'),
        ('orange', 'Orange'),
        ('purple', 'Purple'),
    ]
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=20, choices=COLOR_CHOICES, default='red')
    def __str__(self):
        return self.name
    
class Question(models.Model):
    QUESTION_TYPES = [
        ('MC', 'Multiple Choice'),
        ('TXT', 'Text Answer'),
        ('TF', 'True/False'),
    ]

    question_text = models.CharField(max_length=300)
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    question_type = models.CharField(max_length=3, choices=QUESTION_TYPES, default='TXT')
    answer_text = models.CharField(max_length=200, blank=True)  # Only used for text or TF

    def __str__(self):
        return f"{self.question_text} ({self.get_question_type_display()})"

class AnswerOption(models.Model):
    question = models.ForeignKey(Question, related_name='options', on_delete=models.CASCADE)
    text = models.CharField(max_length=200)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text
    
class Player(models.Model):
    name = models.CharField(max_length=100)
    chips = models.ManyToManyField(Category, blank=True)

class GameSession(models.Model):
    players = models.ManyToManyField(Player)
    current_turn = models.IntegerField(default=0)  # index of player in turn order
    created_at = models.DateTimeField(auto_now_add=True)

