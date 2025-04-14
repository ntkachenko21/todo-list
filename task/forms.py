from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.forms.models import ModelForm

from task.models import Task, Tag


class TaskUpdateForm(ModelForm):
    class Meta:
        model = Task
        fields = (
            "content",
            "deadline",
            "is_done",
        )

class TaskForm(ModelForm):
    tags = forms.ModelMultipleChoiceField(
        queryset=Tag.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False,
    )

    class Meta:
        model = Task
        fields = "__all__"
