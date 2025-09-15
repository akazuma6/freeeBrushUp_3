# employees/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import EmployeeProfile, Attendance, Break

# EmployeeProfileをUserの編集画面内に表示するための設定
class EmployeeProfileInline(admin.StackedInline):
    model = EmployeeProfile
    can_delete = False
    verbose_name_plural = 'employee profiles'

# Django標準のUserAdminを拡張
class UserAdmin(BaseUserAdmin):
    inlines = (EmployeeProfileInline,)

# 元のUserの登録を解除し、新しいUserAdminを登録する
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

# 他のモデルの登録はそのまま
admin.site.register(EmployeeProfile)
admin.site.register(Attendance)
admin.site.register(Break)
# EmployeeProfileはUserAdmin内で扱うので、単独での登録は不要になる
