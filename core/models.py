from django.db import models


class Profile(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    course = models.CharField(max_length=100)
    period = models.CharField(max_length=50)
    email = models.EmailField()
    git = models.URLField()
    linked = models.URLField()
    url_imagem = models.ImageField(upload_to="profile/")

    def __str__(self) -> str:
        return self.name
