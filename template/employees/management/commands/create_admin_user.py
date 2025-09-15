from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from employees.models import EmployeeProfile

class Command(BaseCommand):
    help = 'Creates or updates the admin user for the system.'

    def handle(self, *args, **options):
        username = '99'
        password = '1209'
        last_name = '小島'
        first_name = '和真'

        # Get or create the user
        user, created = User.objects.get_or_create(username=username)

        # Update user details
        user.last_name = last_name
        user.first_name = first_name
        user.is_staff = True
        user.is_superuser = True  # Grant superuser permissions
        if created:
            user.set_password(password)
        user.save()

        # Get or create the employee profile
        EmployeeProfile.objects.get_or_create(user=user, defaults={'employee_number': username})

        if created:
            self.stdout.write(self.style.SUCCESS(f'Successfully created admin user "{username}".'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Successfully updated user "{username}" to be a superuser.'))
