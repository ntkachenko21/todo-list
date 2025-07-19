from django.urls import path

from user.views import visits

urlpatterns = [
    path("login/", visits, name="login"),
    path("logout/", visits, name="logout"),
    path("signup/", visits, name="signup"),
]

app_name = "user"
