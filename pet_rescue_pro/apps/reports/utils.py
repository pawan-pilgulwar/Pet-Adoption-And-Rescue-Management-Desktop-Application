from .models import PetReport
from apps.notifications.models import Notification

def find_matches(new_report):
    """
    Search for potential matches for a new pet report.
    If the new report is 'Lost', search for 'Found' reports and vice versa.
    Matches are based on pet species, breed, color, and location.
    Notifications are sent to both the new report owner and the matching report owners.
    """
    if not new_report.pet:
        return

    # Determine the opposite status to search for
    target_type = "Found" if new_report.report_type == "Lost" else "Lost"
    
    # Filter for matching reports
    matches = PetReport.objects.filter(
        report_type=target_type,
        pet__species__iexact=new_report.pet.species,
        status="Accepted"
    ).exclude(user=new_report.user)
    
    # Apply additional filters
    if new_report.pet.breed:
        matches = matches.filter(pet__breed__icontains=new_report.pet.breed)
    
    if new_report.pet.color:
        matches = matches.filter(pet__color__icontains=new_report.pet.color)
        
    if new_report.location:
        matches = matches.filter(location__icontains=new_report.location)

    # Trigger notifications for all matches
    for match in matches:
        # Notify the owner of the existing matching report
        Notification.objects.create(
            user=match.user,
            report=new_report,
            notification_type="Match_Found",
            title="Potential Match Found!",
            message=f"A similar {new_report.pet.species} has been reported as {new_report.report_type}. Please check."
        )
        
        # Notify the owner of the new report
        Notification.objects.create(
            user=new_report.user,
            report=match,
            notification_type="Match_Found",
            title="Potential Match Found!",
            message=f"A similar {match.pet.species} was previously reported as {match.report_type}. Please check."
        )
