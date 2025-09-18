from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StickyNoteViewSet, StickyNoteHistoryViewSet

router = DefaultRouter()
router.register(r'notes', StickyNoteViewSet, basename='stickynote')
router.register(r'history', StickyNoteHistoryViewSet, basename='stickynote-history')

urlpatterns = [
    path('', include(router.urls)),
]