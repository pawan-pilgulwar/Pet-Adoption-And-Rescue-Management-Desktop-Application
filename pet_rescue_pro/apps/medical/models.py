from django.db import models
from apps.pets.models import Pet

class MedicalRecord(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='medical_records')
    vaccination_status = models.CharField(max_length=100, blank=True, null=True)
    medical_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Medical Record for {self.pet.name}"

    class Meta:
        db_table = 'medical_record'
