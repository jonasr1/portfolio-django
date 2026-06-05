from rest_framework import serializers

from core.models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "id",
            "name",
            "description",
            "course",
            "period",
            "email",
            "git",
            "linked",
            "url_imagem",
        ]
