from django.db import models
from django.contrib.auth.models import User

class EmployeeProfile(models.Model):
    """従業員の名前、番号を記録するモデル"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_number = models.CharField(max_length=10, unique=True, null=True, blank=True)

    def __str__(self):
        return self.user.get_full_name() or self.user.username

class Attendance(models.Model):
    """出退勤を記録するモデル"""
    employee = models.ForeignKey(EmployeeProfile, related_name='attendances', on_delete=models.CASCADE)
    check_in = models.DateTimeField(auto_now_add=True)
    check_out = models.DateTimeField(null=True, blank=True)
    summary = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.employee.user.username} @ {self.check_in.strftime('%Y-%m-%d')}"

class Break(models.Model):
    """休憩時間を記録するモデル"""
    attendance = models.ForeignKey(Attendance, related_name='breaks', on_delete=models.CASCADE)
    break_start = models.DateTimeField()
    break_end = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Break for {self.attendance.employee.user.username} from {self.break_start}"

class RoleActivity(models.Model):
    """どの持ち場で働いたかを記録するモデル"""
    KITCHEN = 'kitchen'
    HALL = 'hall'
    ROLE_CHOICES = [
        (KITCHEN, 'キッチン'),
        (HALL, 'ホール'),
    ]
    attendance = models.ForeignKey(Attendance, related_name='role_activities', on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.attendance.employee.user.username} - {self.get_role_display()} from {self.start_time}"