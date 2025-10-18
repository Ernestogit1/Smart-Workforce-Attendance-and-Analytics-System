import os
from django.apps import AppConfig

class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core"  # was "backend.core"

    def ready(self):
        if os.environ.get("RUN_MAIN") != "true":
            return
        # import using top-level modules inside backend/
        from config.db_config import connect_mongo
        from config.firebaseAdmin_config import init_firebase
        from modules.adminSetup_modules import ensure_admin_exists

        connect_mongo()
        init_firebase()
        ensure_admin_exists()