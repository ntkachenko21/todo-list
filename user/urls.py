from django.urls import include, path

from user.views import CustomUserCreateView

urlpatterns = [
    path("", include("django.contrib.auth.urls")),
    path("signup/", CustomUserCreateView.as_view(), name="signup"),
]

app_name = "user"
