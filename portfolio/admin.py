from django.contrib import admin

from .models import Certificate, Project


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ("title",)
    search_fields = ("title",)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "project_type", "git_link")
    list_filter = ("project_type",)
    search_fields = ("name", "description")
