from mongoengine import Document, ReferenceField, StringField, DateField, DateTimeField
import datetime
from .employee_model import Employee

class LeaveRequeast(Document):
    meta = {
        "collection": "leave_requests",
        "indexes": [
            {"fields": ["employee", "startDate", "endDate"]},
        ],
    }

    employee = ReferenceField(Employee, required=True, reverse_delete_rule=2)
    leaveType = StringField(required=True, choices=["sick", "vacation", "maternity", "emergency"])
    startDate = DateField(required=True)
    endDate = DateField(required=True)
    reason = StringField(max_length=500)
    status = StringField(required=True, choices=["Pending", "Approved", "Rejected"], default="Pending")

    created_at = DateTimeField(default=datetime.datetime.utcnow)
    updated_at = DateTimeField(default=datetime.datetime.utcnow)

    def save(self, *args, **kwargs):
        self.updated_at = datetime.datetime.utcnow()
        return super().save(*args, **kwargs)