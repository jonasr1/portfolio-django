from django.http import HttpRequest, HttpResponse
from django.shortcuts import render

from core.models import Profile
from portfolio.models import Certificate, Project


def home(request: HttpRequest) -> HttpResponse:
    profile: Profile = Profile.objects.all().first()
    certificates: Certificate = Certificate.objects.all()
    return render(
        request,
        "portfolio/home.html",
        {
            "profile": profile,
            "certificates": certificates,
        },
    )


def projects(request: HttpRequest) -> HttpResponse:
    projects = Project.objects.all()
    return render(request, "portfolio/projects.html", {"projects": projects})


def contact(request: HttpRequest) -> HttpResponse:
    user: Profile = Profile.objects.first()
    return render(request, "portfolio/contact.html", {"user": user})
