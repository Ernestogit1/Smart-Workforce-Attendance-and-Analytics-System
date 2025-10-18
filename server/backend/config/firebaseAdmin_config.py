from pathlib import Path
import firebase_admin
from firebase_admin import credentials

_initialized = False

def init_firebase():
    global _initialized
    if _initialized and firebase_admin._apps:
        return firebase_admin.get_app()

    # serviceAccountKey.json is in this same folder
    cred_path = Path(__file__).with_name("serviceAccountKey.json")
    if not cred_path.exists():
        raise FileNotFoundError(f"Missing Firebase service account: {cred_path}")

    if not firebase_admin._apps:
        cred = credentials.Certificate(str(cred_path))
        firebase_admin.initialize_app(cred)

    _initialized = True
    return firebase_admin.get_app()