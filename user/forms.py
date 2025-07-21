# user/forms.py (ФИНАЛЬНАЯ ВЕРСИЯ)

from django.contrib.auth.forms import UserCreationForm

from .models import CustomUser


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ("email",)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["email"].widget.attrs.update(
            {"class": "form-input", "placeholder": "Email", "autocomplete": "email"}
        )
        self.fields["password1"].widget.attrs.update(
            {
                "class": "form-input",
                "placeholder": "Password",
                "autocomplete": "new-password",
            }
        )
        self.fields["password2"].widget.attrs.update(
            {
                "class": "form-input",
                "placeholder": "Confirm Password",
                "autocomplete": "new-password",
            }
        )

    def signup(self, request, user):
        user.save()
        return user
