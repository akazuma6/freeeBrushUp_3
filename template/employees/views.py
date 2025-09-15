from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import EmployeeProfile, Attendance, Break, RoleActivity
from .serializers import (
    UserSerializer, 
    EmployeeProfileSerializer, 
    AttendanceSerializer, 
    BreakSerializer,
    RoleActivitySerializer,
    MyTokenObtainPairSerializer
)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class EmployeeProfileViewSet(viewsets.ModelViewSet):
    serializer_class = EmployeeProfileSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned employees to a given employee_number,
        by filtering against a `employee_number` query parameter in the URL.
        """
        queryset = EmployeeProfile.objects.all().select_related('user')
        employee_number = self.request.query_params.get('employee_number')
        if employee_number is not None:
            queryset = queryset.filter(employee_number=employee_number)
        return queryset

    def create(self, request, *args, **kwargs):
        user_data = request.data.pop('user', {})
        password = user_data.pop('password', None)
        employee_number = request.data.get('employee_number')

        # Enforce username is the same as employee_number
        user_data['username'] = employee_number

        # Check if user with this username already exists
        if User.objects.filter(username=employee_number).exists():
            return Response({"error": "A user with this employee number already exists."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            # Use create_user to handle password hashing
            user = User.objects.create_user(
                username=user_data['username'],
                password=password,
                first_name=user_data.get('first_name', ''),
                last_name=user_data.get('last_name', '')
            )

            profile = EmployeeProfile.objects.create(user=user, employee_number=employee_number)
            serializer = self.get_serializer(profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            if 'user' in locals() and user.id:
                user.delete()  # Clean up user if profile creation fails
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user_instance = instance.user
        user_data = request.data.pop('user', {})
        employee_number = request.data.get('employee_number', instance.employee_number)

        # Enforce username is the same as employee_number
        user_data['username'] = employee_number

        # Update user fields
        for attr, value in user_data.items():
            setattr(user_instance, attr, value)
        user_instance.save()

        # Update profile fields
        instance.employee_number = employee_number
        instance.save()

        return Response(self.get_serializer(instance).data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # The user will be deleted as well due to on_delete=models.CASCADE
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def change_role(self, request, pk=None):
        profile = self.get_object()
        new_role = request.data.get('role')

        if not new_role:
            return Response({'error': 'New role not provided'}, status=status.HTTP_400_BAD_REQUEST)

        active_attendance = Attendance.objects.filter(employee=profile, check_out__isnull=True).first()
        if not active_attendance:
            return Response({'error': 'Employee is not checked in'}, status=status.HTTP_400_BAD_REQUEST)

        # End current role
        now = timezone.now()
        RoleActivity.objects.filter(attendance=active_attendance, end_time__isnull=True).update(end_time=now)

        # Start new role
        RoleActivity.objects.create(attendance=active_attendance, role=new_role, start_time=now)

        return Response({'status': f'Role changed to {new_role}'}, status=status.HTTP_200_OK)

class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    def get_queryset(self):
        queryset = Attendance.objects.all()
        employee_id = self.request.query_params.get('employee_profile', None)
        if employee_id is not None:
            queryset = queryset.filter(employee_id=employee_id)
        if self.action == 'list':
            latest = self.request.query_params.get('latest', None)
            if latest is not None and latest.lower() == 'true':
                return queryset.order_by('-check_in')[:1]
            return queryset.order_by('-check_in')[:10]
        return queryset

class BreakViewSet(viewsets.ModelViewSet):
    queryset = Break.objects.all()
    serializer_class = BreakSerializer

class RoleActivityViewSet(viewsets.ModelViewSet):
    queryset = RoleActivity.objects.all()
    serializer_class = RoleActivitySerializer