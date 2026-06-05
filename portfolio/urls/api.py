from django.urls import path

from portfolio.views import api

urlpatterns = [
    path("api/profile/", api.ProfileDetail.as_view(), name="profile-api"),
]
