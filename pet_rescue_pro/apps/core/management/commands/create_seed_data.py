import random
from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker
from apps.users.models import User, UserProfile, ShopOwnerProfile, AdminProfile
from apps.pets.models import Pet
from apps.adoption.models import AdoptionListing, Adoption
from apps.services.models import Service, Booking, Schedule
from apps.rescue.models import Report, RescueRequest
from datetime import time, timedelta

fake = Faker('en_IN')

class Command(BaseCommand):
    help = 'Generates realistic Indian seed data for the PetRescue platform'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')
        self.clear_data()

        self.stdout.write('Creating Admin user...')
        admin = self.create_admin()

        self.stdout.write('Creating Shop Owners...')
        shop_owners = self.create_shop_owners(10)

        self.stdout.write('Creating Normal Users...')
        normal_users = self.create_normal_users(20)

        self.stdout.write('Creating Pets...')
        pets = self.create_pets(shop_owners, 50)

        self.stdout.write('Creating Adoption Listings...')
        listings = self.create_adoption_listings(pets, shop_owners)

        self.stdout.write('Creating Adoptions...')
        self.create_adoptions(listings, normal_users)

        self.stdout.write('Creating Services...')
        services = self.create_services(shop_owners, 20)

        self.stdout.write('Creating Schedules...')
        self.create_schedules(services)

        self.stdout.write('Creating Bookings...')
        self.create_bookings(services, normal_users, 30)

        self.stdout.write('Creating Rescue Reports...')
        reports = self.create_rescue_reports(normal_users, pets, 25)

        self.stdout.write('Creating Rescue Requests...')
        self.create_rescue_requests(reports, shop_owners, 15)

        self.stdout.write(self.style.SUCCESS('Successfully seeded the database with realistic Indian data!'))
        self.stdout.write(self.style.SUCCESS('All users password: User@123'))

    def clear_data(self):
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
            first_name = fake.first_name()
            last_name = fake.last_name()
            
            # Realistic Shop Name
            raw_shop_name = f"{fake.first_name()}'s {random.choice(shop_name_suffixes)} {random.choice(cities)}"
            
            # Username from shop name
            username = raw_shop_name.lower().replace(" ", "").replace("'", "")
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

            # Profile is created by signal, but let's update it
            profile = user.shop_profile
            profile.shop_name = raw_shop_name
            profile.shop_address = f"{fake.building_number()}, {fake.street_name()}, {fake.city()}, {fake.state()}"
            profile.phone_number = f"+91 {fake.msisdn()[3:]}"
            profile.shop_license = f"LIC-{fake.random_number(digits=8)}"
            profile.profile_picture_url = f"https://loremflickr.com/200/200/person,face?lock={random.randint(1, 1000)}"
            profile.save()
            
            shop_owners.append(user)
        return shop_owners

    def create_normal_users(self, count):
        users = []
        for i in range(count):
            first_name = fake.first_name()
            last_name = fake.last_name()
            full_name = f"{first_name} {last_name}"
            
            # Username from name
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

            # Update Profile
            profile = user.user_profile
            profile.address = f"{fake.building_number()}, {fake.street_name()}, {fake.city()}"
            profile.phone_number = f"+91 {fake.msisdn()[3:]}"
            profile.profile_picture_url = f"https://loremflickr.com/200/200/person,face?lock={random.randint(1, 1000)}"
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
                image_url=f"https://loremflickr.com/400/400/pet,{species.lower()}?lock={random.randint(1, 1000)}"
            )
            pets.append(pet)
        return pets

    def create_adoption_listings(self, pets, owners):
        listings = []
        # List about 70% of pets for adoption
        available_pets = random.sample(pets, int(len(pets) * 0.7))
        
        for pet in available_pets:
            listing = AdoptionListing.objects.create(
                pet=pet,
                shop_owner=pet.created_by,
                price=random.randint(2000, 15000),
                is_available=True,
                description=f"Lovely {pet.breed} looking for a forever home. {fake.sentence()}"
            )
            listings.append(listing)
        return listings

    def create_adoptions(self, listings, users):
        # Adopt about 40% of listings
        adopted_listings = random.sample(listings, int(len(listings) * 0.4))
        
        for listing in adopted_listings:
            user = random.choice(users)
            
            Adoption.objects.create(
                user=user,
                pet=listing.pet,
                shop_owner=listing.shop_owner,
                price=listing.price,
                notes=f"Adopted by {user.first_name} on {timezone.now().date()}. {fake.sentence()}"
            )
            
            # Update listing and pet ownership
            listing.is_available = False
            listing.save()
            
            pet = listing.pet
            pet.owner = user
            pet.save()

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
                img = f"https://loremflickr.com/400/400/veterinary,clinic?lock={random.randint(1, 1000)}"
            else:
                name = random.choice(general_names)
                s_type = 'General'
                m_type = None
                doc = None
                addr = None
                img = f"https://loremflickr.com/400/400/pet,grooming?lock={random.randint(1, 1000)}"
                
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
                image_url=img
            )
            services.append(service)
        return services

    def create_schedules(self, services):
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        for service in services:
            # Add schedule for 3-5 random days
            active_days = random.sample(days, random.randint(3, 5))
            for day in active_days:
                Schedule.objects.create(
                    service=service,
                    day=day,
                    start_time=time(9, 0),
                    end_time=time(18, 0)
                )

    def create_bookings(self, services, users, count):
        statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled']
        for _ in range(count):
            user = random.choice(users)
            service = random.choice(services)
            
            # Random date in the next 30 days or past 10 days
            delta = random.randint(-10, 30)
            booking_date = timezone.now() + timedelta(days=delta)
            
            Booking.objects.create(
                user=user,
                service=service,
                booking_date=booking_date,
                status=random.choice(statuses),
                additional_notes=fake.sentence()
            )

    def create_rescue_reports(self, users, pets, count):
        reports = []
        report_types = ['Lost', 'Found']
        statuses = ['Pending', 'Verified', 'Resolved']
        locations = ['Andheri, Mumbai', 'Kothrud, Pune', 'Connaught Place, Delhi', 'Indiranagar, Bangalore', 'Salt Lake, Kolkata']
        
        for _ in range(count):
            user = random.choice(users)
            is_lost = random.choice([True, False])
            
            pet = None
            if is_lost:
                # If lost, usually linked to a pet in the system
                user_pets = Pet.objects.filter(owner=user)
                if user_pets.exists():
                    pet = random.choice(user_pets)
            
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
        statuses = ['Pending', 'Accepted', 'Rejected']
        for _ in range(count):
            report = random.choice(reports)
            owner = random.choice(shop_owners)
            
            RescueRequest.objects.create(
                report=report,
                user=owner,
                status=random.choice(statuses),
                message=f"I can help with the rescue. I have a shop nearby at {owner.shop_profile.shop_address}."
            )
