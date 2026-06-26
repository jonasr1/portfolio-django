from typing import Any

from django.conf import settings
from django.http import HttpRequest


def notification_ms(request: HttpRequest) -> dict[str, Any]:
    """
    Provides the notification microservice configurations
    to all templates.
    """
    context: dict[str, Any] = {
        "NOTIFICATION_MS_URL": settings.NOTIFICATION_MS_URL,
        "NOTIFICATION_MS_API_KEY": settings.NOTIFICATION_MS_API_KEY,
    }

    # Pass user_id if the user is authenticated
    if request.user.is_authenticated:
        context["NOTIFICATION_USER_ID"] = request.user.pk

    return context
