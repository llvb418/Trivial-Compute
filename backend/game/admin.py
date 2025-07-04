from django.contrib import admin
from .models import Question, Category, AnswerOption, GameSession

class AnswerOptionInline(admin.TabularInline):
    model = AnswerOption
    extra = 4  # number of blank option fields

class QuestionAdmin(admin.ModelAdmin):
    inlines = [AnswerOptionInline]

admin.site.register(Question, QuestionAdmin)
admin.site.register(Category)
admin.site.register(GameSession)
admin.site.site_header = "Teacher Administration Panel"
admin.site.site_title = "Teacher Administration Portal"
admin.site.index_title = "Welcome, educators!"