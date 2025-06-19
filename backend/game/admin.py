from django.contrib import admin
from .models import Question, Category, AnswerOption

class AnswerOptionInline(admin.TabularInline):
    model = AnswerOption
    extra = 4  # number of blank option fields

class QuestionAdmin(admin.ModelAdmin):
    inlines = [AnswerOptionInline]

admin.site.register(Question, QuestionAdmin)
admin.site.register(Category)