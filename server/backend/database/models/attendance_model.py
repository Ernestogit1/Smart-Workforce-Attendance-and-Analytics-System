from mongoengine import (
    Document, ReferenceField, DateField, DateTimeField, StringField
)
import datetime
from .employee_model import Employee

class Attendance(Document):
    meta = {
        "collection": "attendances",
        "indexes": [
            {"fields": ["employee", "date"], "unique": True},
        ],
    }

    employee = ReferenceField(Employee, required=True, reverse_delete_rule=2)
    date = DateField(required=True)
    timeIn = DateTimeField(null=True)
    timeOut = DateTimeField(null=True)
    status = StringField(choices=["Present", "Late"], required=False, default=None)
    hoursWorked = StringField(default="00:00:00")

    created_at = DateTimeField(default=datetime.datetime.utcnow)
    updated_at = DateTimeField(default=datetime.datetime.utcnow)

    def save(self, *args, **kwargs):
        self.updated_at = datetime.datetime.utcnow()
        return super().save(*args, **kwargs)