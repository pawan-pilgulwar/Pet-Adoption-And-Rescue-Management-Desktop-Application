# core/constants.py

PET_STATUS_CHOICES = [
    ("Adopted", "Adopted"),
    ("Available", "Available"),
    ("Lost", "Lost"),
    ("Found", "Found"),
]

USER_ROLE_CHOICES = [
    ("USER", "User"),
    ("SHOP_OWNER", "ShopOwner"),
    ("ADMIN", "Admin"),
]

ADOPTION_STATUS_CHOICES = [
    ("Available", "Available"),
    ("Not Available", "Not Available"),
]

ADOPTION_REQUEST_STATUS_CHOICES = [
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

RESCUE_REQUEST_STATUS_CHOICES = [
    ("Pending", "Pending"),
    ("Accepted", "Accepted"),
    ("Rejected", "Rejected"),
    ("Completed", "Completed"),
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
