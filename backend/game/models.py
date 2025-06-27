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
    
class GameSession(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    current_turn = models.IntegerField(default=0)  # 0-3 for turn order
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Session {self.id} (Turn {self.current_turn})"
    
class Player(models.Model):
    COLORS = [
        ('red', 'Red'),
        ('blue', 'Blue'),
        ('green', 'Green'),
        ('yellow', 'Yellow'),
    ]

    name = models.CharField(max_length=50)
    color = models.CharField(max_length=10, choices=COLORS, default='red')
    session = models.ForeignKey(GameSession, related_name='players', on_delete=models.CASCADE, default=1)
    position = models.PositiveIntegerField(null=True, blank=True)  

    # Each chip represents a category earned
    has_red_chip = models.BooleanField(default=False)
    has_blue_chip = models.BooleanField(default=False)
    has_green_chip = models.BooleanField(default=False)
    has_yellow_chip = models.BooleanField(default=False)

    def chips_collected(self):
        return {
            "red": self.has_red_chip,
            "blue": self.has_blue_chip,
            "green": self.has_green_chip,
            "yellow": self.has_yellow_chip,
        }
    
    def award_chip(self, category_color):
        if category_color == 'red':
            self.has_red_chip = True
        elif category_color == 'blue':
            self.has_blue_chip = True
        elif category_color == 'green':
            self.has_green_chip = True
        elif category_color == 'yellow':
            self.has_yellow_chip = True
        self.save()

    def __str__(self):
        return f"{self.name} ({self.color}, pos {self.position})"


