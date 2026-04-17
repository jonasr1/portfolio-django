from django.db import models


class Certificate(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self) -> str:
        return self.title


class Project(models.Model):

    PERSONAL = "personal"
    ACADEMIC = "academic"

    TYPE_CHOICES = [
        (PERSONAL, "Pessoal"),
        (ACADEMIC, "Acadêmico"),
    ]

    project_type = models.CharField(
        max_length=10,
        choices=TYPE_CHOICES,
    )

    name = models.CharField(max_length=100)
    description = models.TextField()
    git_link = models.URLField()

    def __str__(self) -> str:
        return self.name
