from mongoengine import Document, StringField, EmailField, BooleanField, DateTimeField, IntField, URLField
from django.contrib.auth.hashers import make_password
import datetime

class Employee(Document):
    meta = {"collection": "employees"}  # reuse your existing collection

    lastName = StringField(required=True, max_length=100)
    firstName = StringField(required=True, max_length=100)
    middleName = StringField(max_length=100, null=True)
    suffixes = StringField(max_length=50, null=True)

    email = EmailField(required=True, unique=True)
    firebaseUid = StringField(required=True, unique=True)

    password = StringField(required=True, max_length=128)

    contactNumber = StringField(max_length=30)
    address = StringField(max_length=255)

    birthDate = DateTimeField()
    age = IntField()

    profileImage = URLField(null=True)
    isAdmin = BooleanField(default=False)

    created_at = DateTimeField(default=datetime.datetime.utcnow)
    updated_at = DateTimeField(default=datetime.datetime.utcnow)

    def clean(self):
        # skip hashing when using Firebase-managed marker
        if self.password and self.password != "firebase-manage" and not str(self.password).startswith("pbkdf2_"):
            self.password = make_password(self.password)

    def save(self, *args, **kwargs):
        self.updated_at = datetime.datetime.utcnow()
        return super().save(*args, **kwargs)