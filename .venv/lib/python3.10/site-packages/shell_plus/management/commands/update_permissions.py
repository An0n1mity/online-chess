from django.core.management.base import NoArgsCommand

class Command(NoArgsCommand):
    help = "Update permissions for all installed apps."

    requires_model_validation = True

    def handle_noargs(self, **options):
        from django.contrib.auth.management import create_permissions
        from django.apps import apps
        for app in apps.get_app_configs():
           create_permissions(app, None, 2)
