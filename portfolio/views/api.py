from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from core.models import Profile
from portfolio.serializers import ProfileSerializer


class ProfileDetail(generics.RetrieveUpdateAPIView):
    """
    GET     /api/profile/ → Returns the profile of the logged in user
    PUT     /api/profile/ → Updates the full profile
    PATCH   /api/profile/ → Partially updates
    """

    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self) -> Profile:
        """
        Em vez de buscar pelo pk da URL, busca pelo usuario logado.
        Se o perfil nao existir, cria um vazio automaticamente.
        """
        profile, _created = Profile.objects.get_or_create(
            user=self.request.user,
            defaults={"name": self.request.user.username},
        )
        return profile
