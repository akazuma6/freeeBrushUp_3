from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils import timezone
from .models import EmployeeProfile, Attendance, Break, RoleActivity
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['is_staff'] = user.is_staff
        token['user_id_debug'] = user.id # Add user_id for debugging
        return token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class BreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = Break
        fields = '__all__'

class RoleActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleActivity
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    breaks = BreakSerializer(many=True, read_only=True)
    role_activities = RoleActivitySerializer(many=True, read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'check_in', 'check_out', 'breaks', 'role_activities', 'summary']

class EmployeeProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    active_check_in = serializers.SerializerMethodField()
    hp = serializers.SerializerMethodField()
    current_role = serializers.SerializerMethodField()

    class Meta:
        model = EmployeeProfile
        fields = ['id', 'user', 'employee_number', 'active_check_in', 'hp', 'current_role']

    def get_active_check_in(self, obj):
        active_attendance = Attendance.objects.filter(employee=obj, check_out__isnull=True).order_by('-check_in').first()
        # Cache the result on the object instance for other methods to use
        obj._active_attendance = active_attendance
        if active_attendance:
            return active_attendance.check_in
        return None

    def get_hp(self, obj):
        # Use the cached active_attendance if it exists
        active_attendance = getattr(obj, '_active_attendance', None)
        if not active_attendance:
            return None

        now = timezone.now()
        hp = 10.0

        total_break_seconds = sum([
            ((b.break_end or now) - b.break_start).total_seconds()
            for b in active_attendance.breaks.all()
        ])
        hp += (total_break_seconds / 3600) * 2

        for activity in active_attendance.role_activities.all():
            duration_hours = ((activity.end_time or now) - activity.start_time).total_seconds() / 3600
            if activity.role == RoleActivity.KITCHEN:
                hp -= duration_hours * 1
            elif activity.role == RoleActivity.HALL:
                hp -= duration_hours * 2
        
        return round(hp, 2)

    def get_current_role(self, obj):
        # Use the cached active_attendance if it exists
        active_attendance = getattr(obj, '_active_attendance', None)
        if active_attendance:
            active_role = RoleActivity.objects.filter(attendance=active_attendance, end_time__isnull=True).first()
            if active_role:
                return active_role.get_role_display()
        
        return None