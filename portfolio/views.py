from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def home(request: HttpRequest) -> HttpResponse:
    return render(request, "portfolio/home.html")


def projetos(request: HttpRequest) -> HttpResponse:
    return render(request, "portfolio/projetos.html")
