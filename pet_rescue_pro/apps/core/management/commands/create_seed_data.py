import random
from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker
from apps.users.models import User, UserProfile, ShopOwnerProfile, AdminProfile
from apps.pets.models import Pet
from apps.adoption.models import AdoptionListing, Adoption
from apps.services.models import Service, Booking, Schedule
from apps.rescue.models import Report, RescueRequest
from apps.notifications.models import Notification
from apps.chats.models import ChatRoom, Message
from datetime import time, timedelta

fake = Faker('en_IN')

# Premium curated list of decent, clean MALE user profile pictures
MALE_PROFILE_PICS = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200&h=200",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200&h=200",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200",
]

# Premium curated list of decent, clean FEMALE user profile pictures
FEMALE_PROFILE_PICS = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=200&h=200",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200",
    "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200&h=200",
    "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=200&h=200",
]

# Premium curated list of high-quality pet pictures (mapped by species)
DECENT_PET_PICS = {
    'Dog': [
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400&h=400",
        "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=400&h=400",
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400&h=400",
        "https://images.unsplash.com/photo-1537151608828-ea2b117b6b86?auto=format&fit=crop&q=80&w=400&h=400",
        "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=400&h=400",
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400&h=400",
        "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=400&h=400",
    ],
    'Cat': [
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400&h=400",
        "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=400&h=400",
        "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&q=80&w=400&h=400",
        "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=400&h=400",
        "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&q=80&w=400&h=400",
    ],
    'Rabbit': [
        "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=400&h=400",
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&q=80&w=400&h=400",
        "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&q=80&w=400&h=400",
    ],
    'Hamster': [
        "https://images.unsplash.com/photo-1501820488136-72669a482d24?auto=format&fit=crop&q=80&w=400&h=400",
        "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&q=80&w=400&h=400",
    ]
}

# Premium curated list of pet service pictures
DECENT_SERVICE_PICS = [
    "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400&h=400",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=400&h=400",
    "https://images.unsplash.com/photo-1597601031489-08285c699745?auto=format&fit=crop&q=80&w=400&h=400",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400&h=400",
]

class Command(BaseCommand):
    help = 'Generates comprehensive realistic seeded database records including chats and notifications'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data (except superusers)...')
        self.clear_data()

        self.stdout.write('Creating Admin user...')
        admin = self.create_admin()

        self.stdout.write('Creating Shop Owners...')
        shop_owners = self.create_shop_owners(8)

        self.stdout.write('Creating Normal Users...')
        normal_users = self.create_normal_users(15)

        self.stdout.write('Creating Pets with individual images...')
        pets = self.create_pets(shop_owners + normal_users, 40)

        self.stdout.write('Creating Adoption Listings...')
        listings = self.create_adoption_listings(pets, shop_owners)

        self.stdout.write('Creating Adoptions...')
        adoptions = self.create_adoptions(listings, normal_users)

        self.stdout.write('Creating Services...')
        services = self.create_services(shop_owners, 15)

        self.stdout.write('Creating Schedules...')
        self.create_schedules(services)

        self.stdout.write('Creating Bookings...')
        bookings = self.create_bookings(services, normal_users, 25)

        self.stdout.write('Creating Rescue Reports...')
        reports = self.create_rescue_reports(normal_users, pets, 20)

        self.stdout.write('Creating Rescue Requests...')
        requests = self.create_rescue_requests(reports, shop_owners, 12)

        self.stdout.write('Creating Live Chats and Messages...')
        self.create_chats_and_messages(reports, normal_users, shop_owners)

        self.stdout.write('Creating System Notifications...')
        self.create_notifications(normal_users, shop_owners, bookings, adoptions, reports)

        self.stdout.write(self.style.SUCCESS('Successfully seeded ALL models with premium assets!'))
        self.stdout.write(self.style.SUCCESS('All users password: User@123'))

    def clear_data(self):
        Message.objects.all().delete()
        ChatRoom.objects.all().delete()
        Notification.objects.all().delete()
        RescueRequest.objects.all().delete()
        Report.objects.all().delete()
        Booking.objects.all().delete()
        Schedule.objects.all().delete()
        Service.objects.all().delete()
        Adoption.objects.all().delete()
        AdoptionListing.objects.all().delete()
        Pet.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()

    def create_admin(self):
        admin_email = 'admin@petrescue.in'
        if not User.objects.filter(email=admin_email).exists():
            user = User.objects.create(
                email=admin_email,
                username='admin',
                first_name='Admin',
                last_name='System',
                role='ADMIN',
                is_staff=True
            )
            user.set_password('User@123')
            user.save()
            return user
        return User.objects.get(email=admin_email)

    def create_shop_owners(self, count):
        shop_owners = []
        shop_name_suffixes = ["Pet Store", "Clinic", "Pet Care", "Animal Hospital", "Pet World", "Paws & Claws"]
        cities = ["Mumbai", "Pune", "Delhi", "Bangalore", "Hyderabad", "Chennai"]

        for i in range(count):
            gender = random.choice(['Male', 'Female'])
            if gender == 'Male':
                first_name = fake.first_name_male()
                profile_pic = random.choice(MALE_PROFILE_PICS)
            else:
                first_name = fake.first_name_female()
                profile_pic = random.choice(FEMALE_PROFILE_PICS)

            last_name = fake.last_name()
            raw_shop_name = f"{fake.first_name()}'s {random.choice(shop_name_suffixes)} {random.choice(cities)}"
            username = "".join(char for char in raw_shop_name.lower() if char.isalnum())
            username = f"{username}{random.randint(100, 999)}"
            email = f"{username}@petshop.in"
            
            user = User.objects.create(
                email=email,
                username=username,
                first_name=first_name,
                last_name=last_name,
                role='SHOP_OWNER'
            )
            user.set_password('User@123')
            user.save()

            profile = user.shop_profile
            profile.shop_name = raw_shop_name
            profile.shop_address = f"{fake.building_number()}, {fake.street_name()}, {fake.city()}, {fake.state()}"
            profile.phone_number = f"+91 {fake.msisdn()[3:]}"
            profile.shop_license = f"LIC-{fake.random_number(digits=8)}"
            profile.profile_picture_url = profile_pic
            profile.save()
            
            shop_owners.append(user)
        return shop_owners

    def create_normal_users(self, count):
        users = []
        for i in range(count):
            gender = random.choice(['Male', 'Female'])
            if gender == 'Male':
                first_name = fake.first_name_male()
                profile_pic = random.choice(MALE_PROFILE_PICS)
            else:
                first_name = fake.first_name_female()
                profile_pic = random.choice(FEMALE_PROFILE_PICS)

            last_name = fake.last_name()
            full_name = f"{first_name} {last_name}"
            username = full_name.lower().replace(" ", "")
            username = f"{username}{random.randint(100, 999)}"
            email = f"{username}@gmail.com"
            
            user = User.objects.create(
                email=email,
                username=username,
                first_name=first_name,
                last_name=last_name,
                role='USER'
            )
            user.set_password('User@123')
            user.save()

            profile = user.user_profile
            profile.address = f"{fake.building_number()}, {fake.street_name()}, {fake.city()}"
            profile.phone_number = f"+91 {fake.msisdn()[3:]}"
            profile.profile_picture_url = profile_pic
            profile.save()
            
            users.append(user)
        return users

    def create_pets(self, owners, count):
        pets = []
        species_list = ['Dog', 'Cat', 'Rabbit', 'Hamster']
        breeds = {
            'Dog': ['Labrador', 'Indie Dog', 'Golden Retriever', 'German Shepherd', 'Pug', 'Beagle'],
            'Cat': ['Persian Cat', 'Siamese Cat', 'Indian Billi', 'Maine Coon'],
            'Rabbit': ['English Spot', 'Dutch Rabbit'],
            'Hamster': ['Syrian Hamster', 'Dwarf Hamster']
        }
        genders = ['Male', 'Female']
        sizes = ['Small', 'Medium', 'Large']
        vaccination_statuses = ['Fully Vaccinated', 'Partially Vaccinated', 'Not Vaccinated']

        for i in range(count):
            owner = random.choice(owners)
            species = random.choice(species_list)
            breed = random.choice(breeds[species])
            
            # Select species specific premium image
            img_list = DECENT_PET_PICS.get(species, DECENT_PET_PICS['Dog'])
            pet_img = random.choice(img_list)

            pet = Pet.objects.create(
                name=fake.first_name_nonbinary(),
                species=species,
                breed=breed,
                color=fake.color_name(),
                age=random.randint(1, 10),
                gender=random.choice(genders),
                size=random.choice(sizes),
                description=fake.paragraph(nb_sentences=3),
                vaccination_status=random.choice(vaccination_statuses),
                created_by=owner,
                owner=owner,
                image_url=pet_img
            )
            pets.append(pet)
        return pets

    def create_adoption_listings(self, pets, owners):
        listings = []
        # Filter pets owned by shop owners for adoption listings
        shop_pets = [p for p in pets if p.created_by.role == 'SHOP_OWNER']
        available_pets = random.sample(shop_pets, min(len(shop_pets), int(len(shop_pets) * 0.8)))
        
        for pet in available_pets:
            listing = AdoptionListing.objects.create(
                pet=pet,
                shop_owner=pet.created_by,
                price=random.randint(2000, 15000),
                is_available=True,
                description=f"Lovely and cheerful {pet.breed} looking for a happy family. {fake.sentence()}"
            )
            listings.append(listing)
        return listings

    def create_adoptions(self, listings, users):
        adoptions = []
        # Adopt about half of the listings
        adopted_listings = random.sample(listings, int(len(listings) * 0.5))
        
        for listing in adopted_listings:
            user = random.choice(users)
            
            adoption = Adoption.objects.create(
                user=user,
                pet=listing.pet,
                shop_owner=listing.shop_owner,
                price=listing.price,
                notes=f"Successfully adopted by {user.first_name} on {timezone.now().date()}. {fake.sentence()}"
            )
            adoptions.append(adoption)
            
            listing.is_available = False
            listing.save()
            
            pet = listing.pet
            pet.owner = user
            pet.save()
        return adoptions

    def create_services(self, shop_owners, count):
        services = []
        general_names = ['Grooming', 'Bath & Brush', 'Nail Trimming', 'Ear Cleaning', 'Pet Sitting', 'Walking']
        medical_names = ['Vaccination', 'General Checkup', 'Dental Cleaning', 'Deworming', 'First Aid']
        medical_types = ['Vaccination', 'Consultation', 'Surgery', 'Diagnostic']
        
        for i in range(count):
            owner = random.choice(shop_owners)
            is_medical = random.choice([True, False])
            
            if is_medical:
                name = random.choice(medical_names)
                s_type = 'Medical'
                m_type = random.choice(medical_types)
                doc = f"Dr. {fake.name()}"
                addr = owner.shop_profile.shop_address
            else:
                name = random.choice(general_names)
                s_type = 'General'
                m_type = None
                doc = None
                addr = None
                
            service = Service.objects.create(
                name=f"{name} - {fake.word().capitalize()}",
                description=fake.paragraph(nb_sentences=2),
                price=random.randint(500, 5000),
                duration=f"{random.choice([30, 60, 90, 120])} mins",
                service_type=s_type,
                medical_type=m_type,
                doctor_name=doc,
                clinic_address=addr,
                created_by=owner,
                image_url=random.choice(DECENT_SERVICE_PICS)
            )
            services.append(service)
        return services

    def create_schedules(self, services):
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        for service in services:
            active_days = random.sample(days, random.randint(3, 5))
            for day in active_days:
                Schedule.objects.create(
                    service=service,
                    day=day,
                    start_time=time(9, 0),
                    end_time=time(18, 0)
                )

    def create_bookings(self, services, users, count):
        bookings = []
        statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled']
        for _ in range(count):
            user = random.choice(users)
            service = random.choice(services)
            delta = random.randint(-10, 30)
            booking_date = timezone.now() + timedelta(days=delta)
            
            booking = Booking.objects.create(
                user=user,
                service=service,
                booking_date=booking_date,
                status=random.choice(statuses),
                additional_notes=fake.sentence()
            )
            bookings.append(booking)
        return bookings

    def create_rescue_reports(self, users, pets, count):
        reports = []
        statuses = ['Pending', 'Verified', 'Resolved']
        locations = ['Andheri, Mumbai', 'Kothrud, Pune', 'Connaught Place, Delhi', 'Indiranagar, Bangalore', 'Salt Lake, Kolkata']
        
        species_list = ['Dog', 'Cat', 'Rabbit', 'Hamster']
        breeds = {
            'Dog': ['Labrador', 'Indie Dog', 'Golden Retriever', 'German Shepherd', 'Pug', 'Beagle'],
            'Cat': ['Persian Cat', 'Siamese Cat', 'Indian Billi', 'Maine Coon'],
            'Rabbit': ['English Spot', 'Dutch Rabbit'],
            'Hamster': ['Syrian Hamster', 'Dwarf Hamster']
        }

        for _ in range(count):
            user = random.choice(users)
            is_lost = random.choice([True, False])
            
            pet = None
            if is_lost:
                user_pets = [p for p in pets if p.owner == user]
                if user_pets:
                    pet = random.choice(user_pets)
            
            if not pet:
                # Create a new pet to ensure every report has an image and name
                species = random.choice(species_list)
                breed = random.choice(breeds[species])
                img_list = DECENT_PET_PICS.get(species, DECENT_PET_PICS['Dog'])
                pet_img = random.choice(img_list)
                
                pet = Pet.objects.create(
                    name=fake.first_name_nonbinary() if is_lost else "Unknown Pet",
                    species=species,
                    breed=breed,
                    color=fake.color_name(),
                    age=random.randint(1, 10),
                    gender=random.choice(['Male', 'Female']),
                    size=random.choice(['Small', 'Medium', 'Large']),
                    description=fake.paragraph(nb_sentences=3),
                    vaccination_status='Not Vaccinated',
                    created_by=user,
                    owner=user,
                    image_url=pet_img
                )
                pets.append(pet)
            
            report = Report.objects.create(
                user=user,
                pet=pet,
                report_type='Lost' if is_lost else 'Found',
                location=random.choice(locations),
                description=fake.paragraph(nb_sentences=3),
                is_verified=random.choice([True, False]),
                status=random.choice(statuses)
            )
            reports.append(report)
        return reports

    def create_rescue_requests(self, reports, shop_owners, count):
        requests = []
        statuses = ['Pending', 'Accepted', 'Rejected']
        for _ in range(count):
            report = random.choice(reports)
            owner = random.choice(shop_owners)
            
            request = RescueRequest.objects.create(
                report=report,
                user=owner,
                status=random.choice(statuses),
                message=f"I am happy to coordinate and help with this rescue. I operate nearby at {owner.shop_profile.shop_name}."
            )
            requests.append(request)
        return requests

    def create_chats_and_messages(self, reports, users, shop_owners):
        # We will create chats for reports that are resolved or active
        active_reports = reports[:10]
        
        for report in active_reports:
            reporter = report.user
            # Find a helper user that is NOT the reporter
            helpers = [u for u in (users + shop_owners) if u.id != reporter.id]
            if not helpers:
                continue
            rescuer = random.choice(helpers)
            
            # Setup Chat Room
            is_resolved = report.status == 'Resolved'
            room = ChatRoom.objects.create(
                report=report,
                reporter=reporter,
                rescuer=rescuer,
                reporter_marked_completed=is_resolved,
                rescuer_marked_completed=is_resolved,
                is_completed=is_resolved
            )
            
            # Seed dynamic chat conversations
            conversations = [
                (rescuer, "Hello! I am near the report location and would like to offer help."),
                (reporter, "Thank you so much! The pet was last spotted near the local park gate."),
                (rescuer, "Understood. I am heading over now with a carrier and some treats."),
                (reporter, "Awesome, thank you! Please let me know once you find them."),
            ]
            
            if is_resolved:
                conversations.extend([
                    (rescuer, "Found the pet! Safe and sounds, currently with me."),
                    (reporter, "Oh my god, thank you so much! Let's complete this rescue operation!"),
                    (rescuer, "Yes! I will mark it complete from my side."),
                ])
                
            for sender, content in conversations:
                Message.objects.create(
                    room=room,
                    sender=sender,
                    content=content,
                    created_at=timezone.now() - timedelta(minutes=random.randint(10, 120))
                )

    def create_notifications(self, users, shop_owners, bookings, adoptions, reports):
        notification_types = ['BOOKING', 'ADOPTION', 'RESCUE', 'SYSTEM']
        
        # Seed booking notifications
        for booking in bookings[:10]:
            Notification.objects.create(
                user=booking.user,
                notification_type='BOOKING',
                title="Service Booking Confirmed!",
                message=f"Your booking for service '{booking.service.name}' on {booking.booking_date.date()} is Confirmed.",
                is_read=random.choice([True, False])
            )
            Notification.objects.create(
                user=booking.service.created_by,
                notification_type='BOOKING',
                title="New Service Booking!",
                message=f"User {booking.user.first_name} booked service '{booking.service.name}' for {booking.booking_date.date()}.",
                is_read=random.choice([True, False])
            )
            
        # Seed adoption notifications
        for adoption in adoptions[:5]:
            Notification.objects.create(
                user=adoption.user,
                notification_type='ADOPTION',
                title="Adoption Approved! 🎉",
                message=f"Congratulations! Your adoption request for '{adoption.pet.name}' has been approved.",
                is_read=random.choice([True, False])
            )
            
        # Seed rescue notifications
        for report in reports[:8]:
            Notification.objects.create(
                user=report.user,
                notification_type='RESCUE',
                report=report,
                title="Rescue Post Verified",
                message=f"Your lost/found report for '{report.pet.name if report.pet else 'Pet'}' has been verified by the team.",
                is_read=random.choice([True, False])
            )
