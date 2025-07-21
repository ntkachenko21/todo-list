from django.contrib.auth import login
from django.http.response import JsonResponse
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views import generic

from user.forms import CustomUserCreationForm


class CustomUserCreateView(generic.CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy("task:index")
    template_name = "registration/signup.html"

    # Form validation with AJAX
    def form_valid(self, form):
        user = form.save()
        login(self.request, user, backend="django.contrib.auth.backends.ModelBackend")

        if self.request.headers.get("x-requested-with") == "XMLHttpRequest":
            return JsonResponse({"success": True, "redirect_url": self.success_url})
        return redirect(self.get_success_url())

    def form_invalid(self, form):
        if self.request.headers.get("x-requested-with") == "XMLHttpRequest":
            errors_json = form.errors.as_json()
            response_data = {"success": False, "errors": errors_json}
            return JsonResponse(response_data)
        return super().form_invalid(form)
