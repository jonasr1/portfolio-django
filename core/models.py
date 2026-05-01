import logging

from django.db import models
from django.templatetags.static import static

logger = logging.getLogger(__name__)


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

    @property
    def image_url(self) -> str:
        try:
            if not self.url_imagem or not getattr(self.url_imagem, "name", ""):
                return static("images/default_profile.png")
            # Avoid returning a broken URL when the DB has a filename but the file
            # is missing from storage (common in dev/test environments).
            if hasattr(
                self.url_imagem, "storage",
            ) and not self.url_imagem.storage.exists(
                self.url_imagem.name,
            ):
                return static("images/default_profile.png")
        except ValueError as exc:
            logger.info("Profile image has no file associated: %s", exc)
        except Exception:
            logger.exception("Unexpected error while building profile image URL")
        else:
            return self.url_imagem.url
        return static("images/default_profile.png")
