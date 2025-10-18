import os
from datetime import datetime
import os
from firebase_admin import auth
from database.models.employee_model import Employee  # was backend.database...

_ran = False

def ensure_admin_exists():
    global _ran
    if _ran:
        return
    _ran = True
    email = os.getenv("ADMIN_EMAIL", "admin@gmail.com")
    fb_password = os.getenv("ADMIN_PASSWORD", "admin123")

    existing_admin = Employee.objects(isAdmin=True).first()
    if existing_admin:
        print("Meron nang admin!!!")
        return

    print("Walang ADMIN account. Gumagawa na ng admin account")

    try:
        user = auth.get_user_by_email(email)
    except Exception:
        print("🔹 YUNG ADMIN WALA SA FIREBASE!!! Kaya gagawa tayo ng bagong user sa firebase...")
        user = auth.create_user(email=email, password=fb_password, display_name="Admin")

    try:
        new_admin = Employee(
            lastName="Admin",
            firstName="Admin",
            middleName=None,
            suffixes=None,
            email=email,
            firebaseUid=user.uid,
            password="firebase-manage",  # Firebase manages password
            address="Admin Address",
            birthDate=datetime(1990, 1, 1),
            age=30,
            profileImage=None,
            contactNumber="0000000000",
            isAdmin=True,
        )
        new_admin.save()
        print("NAKAGAWA NA NG ADMIN ACCOUNT AT NASA MONGODB NA!!!!")
    except Exception as ex:
        print("MAY ERROR SA PAG SETUP NG ADMIN ACCOUNT:", ex)