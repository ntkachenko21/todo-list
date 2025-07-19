from django import forms
from django.forms.models import ModelForm

from task.models import Tag, Task


class TaskUpdateForm(ModelForm):
    class Meta:
        model = Task
        fields = (
            "content",
            "deadline",
            "is_done",
            "tags",
        )
        widgets = {
            "content": forms.Textarea(
                attrs={
                    "class": "form-control",
                    "rows": 4,
                    "placeholder": "Describe what needs to be done...",
                }
            ),
            "deadline": forms.DateTimeInput(
                attrs={"class": "form-control", "type": "datetime-local"}
            ),
            "is_done": forms.CheckboxInput(attrs={"class": "form-checkbox"}),
        }

    tags = forms.ModelMultipleChoiceField(
        queryset=Tag.objects.all(),
        required=False,
        widget=forms.CheckboxSelectMultiple(attrs={"class": "tags-checkbox-list"}),
    )


class TaskForm(ModelForm):
    class Meta:
        model = Task
        fields = (
            "content",
            "deadline",
            "tags",
        )
        widgets = {
            "content": forms.Textarea(
                attrs={
                    "class": "form-control",
                    "rows": 4,
                    "placeholder": "Describe what needs to be done...",
                }
            ),
            "deadline": forms.DateTimeInput(
                attrs={"class": "form-control", "type": "datetime-local"}
            ),
        }

    tags = forms.ModelMultipleChoiceField(
        queryset=Tag.objects.all(),
        required=False,
        widget=forms.CheckboxSelectMultiple(attrs={"class": "tags-checkbox-list"}),
    )


class TagForm(ModelForm):
    class Meta:
        model = Tag
        fields = ("name",)
        widgets = {
            "name": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter tag name (e.g., Work, Personal, Urgent)...",
                    "maxlength": 63,
                }
            )
        }
