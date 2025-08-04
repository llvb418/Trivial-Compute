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

    image = models.ImageField(upload_to='question_images/', null=True, blank=True)
    video = models.FileField(upload_to='question_videos/', null=True, blank=True)
    audio = models.FileField(upload_to='question_audio/', null=True, blank=True)

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
    current_turn = models.IntegerField(default=1)  # 0-3 for turn order
    is_active = models.BooleanField(default=True)

    category_c1 = models.CharField(max_length=100, default='C1')
    category_c2 = models.CharField(max_length=100, default='C2')
    category_c3 = models.CharField(max_length=100, default='C3')
    category_c4 = models.CharField(max_length=100, default='C4')

    def get_category_mapping(self):
        return {
            "C1": self.category_c1,
            "C2": self.category_c2,
            "C3": self.category_c3,
            "C4": self.category_c4
        }
    
    def next_turn(self):
        self.current_turn = (self.current_turn % 4) + 1
        self.save()

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
    position = models.PositiveIntegerField(default=0)  
    session_player_id = models.IntegerField(default=0)
  # Ensure uniqueness within session

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

class Tile(models.Model):
    session = models.ForeignKey("GameSession", on_delete=models.CASCADE, related_name="tiles", default=1)
    position = models.IntegerField(default=0)
    label = models.CharField(max_length=100, default="C1")
    neighbors = models.JSONField(default=list)  # stores list of neighbor tile numbers

    def __str__(self):
        return f"Tile {self.position}: {self.label}"

class Board:
    def __init__(self, tiles):
        """
        Initialize the Board with a list of Tile objects.
        Also initializes player positions as an empty dictionary.
        """
        self.id = None  # Optional: set by database or system
        self.tiles = tiles  # List of Tile objects
        self.player_positions = {}  # Maps player ID to tile index

    def get_state(self):
        """
        Returns a string summary of all player positions on the board.
        """
        state_lines = []
        for player_id, tile_index in self.player_positions.items():
            state_lines.append(f"Player {player_id} is at tile {tile_index}")
        return "\n".join(state_lines)

    def query_tile(self, index):
        """
        Returns the category of the tile at the given index.
        """
        for tile in self.tiles:
            if tile.index == index and tile.tile_type == 'NORMAL':
                return tile.category
        return None

    def place_player(self, player_id, index=0):
        """
        Places a player on the board at the specified tile index (default: start position).
        """
        if index < 0 or index >= len(self.tiles):
            raise ValueError("Invalid tile index.")
        self.player_positions[player_id] = index
