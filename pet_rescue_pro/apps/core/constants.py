# core/constants.py

PET_STATUS_CHOICES = [
    ("Adopted", "Adopted"),
    ("Available", "Available"),
    ("Lost", "Lost"),
    ("Found", "Found"),
]

USER_ROLE_CHOICES = [
    ("Admin", "Admin"),
    ("User", "User"),
    ("SuperAdmin", "SuperAdmin"),
]

ADOPTION_STATUS_CHOICES = [
    ("Pending", "Pending"),
    ("Approved", "Approved"),
    ("Rejected", "Rejected"),
    ("Completed", "Completed"),
]

REPORT_STATUS_CHOICES = [
    ("Pending", "Pending"),
    ("Accepted", "Accepted"),
    ("Rejected", "Rejected"),
    ("Closed", "Closed"),
]

NOTIFICATION_TYPE_CHOICES = [
    ("Adoption_Request", "Adoption Request"),
    ("Report_Status", "Report Status"),
    ("Adoption_Status", "Adoption Status"),
    ("General", "General"),
    ("Match_Found", "Match Found"),
    ("Report_Creation", "Report Creation"),
    ("Pet_Registration", "Pet Registration"),
]   
