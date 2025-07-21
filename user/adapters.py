# user/adapters.py (НОВЫЙ ФАЙЛ)

from allauth.account.adapter import DefaultAccountAdapter

from .forms import CustomUserCreationForm


class CustomAccountAdapter(DefaultAccountAdapter):
    def get_signup_form_class(self, request):
        """
        Этот метод перехватывает запрос allauth на получение формы
        и подменяет стандартную форму на нашу кастомную.
        Это позволяет избежать циклического импорта в settings.py.
        """
        return CustomUserCreationForm
