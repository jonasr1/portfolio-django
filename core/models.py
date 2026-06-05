from django.conf import settings  # type: ignore[attr-defined]
from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    course = models.CharField(max_length=200)
    period = models.CharField(max_length=50)
    email = models.EmailField(blank=True)
    git = models.URLField(blank=True)
    linked = models.URLField(blank=True)
    url_imagem = models.ImageField(upload_to="profile/", blank=True)

    class Meta:
        verbose_name = "Personal Profile"
        verbose_name_plural = "Personal Profiles"

    def __str__(self) -> str:
        return self.name
