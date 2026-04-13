from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def home(request: HttpRequest) -> HttpResponse:
    return render(request, "portfolio/home.html")


def projects(request: HttpRequest) -> HttpResponse:
    return render(request, "portfolio/projects.html")


def contact(request: HttpRequest) -> HttpResponse:
    return render(request, "portfolio/contact.html")
