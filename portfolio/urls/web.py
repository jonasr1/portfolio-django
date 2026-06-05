from django.urls import path

from portfolio.views import site

app_name = "portfolio"

urlpatterns = [
    path("", site.home, name="home"),
    path("projects/", site.projects, name="projects"),
    path("contact/", site.contact, name="contact"),
]
