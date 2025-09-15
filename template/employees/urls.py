from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, 
    EmployeeProfileViewSet, 
    AttendanceViewSet, 
    BreakViewSet,
    RoleActivityViewSet
)

router = DefaultRouter()

# 各ViewSetをURLエンドポイントとして登録します
router.register(r'users', UserViewSet, basename='user')
router.register(r'employeeprofiles', EmployeeProfileViewSet, basename='employeeprofile')
router.register(r'attendances', AttendanceViewSet, basename='attendance')
router.register(r'breaks', BreakViewSet, basename='break')
router.register(r'roleactivities', RoleActivityViewSet, basename='roleactivity')

urlpatterns = [
    path('', include(router.urls)),
]