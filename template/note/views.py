from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import StickyNote
from .serializers import StickyNoteSerializer

class StickyNoteViewSet(viewsets.ModelViewSet):
    serializer_class = StickyNoteSerializer

    def get_queryset(self):
        return StickyNote.objects.filter(is_deleted=False)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_deleted = True
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class StickyNoteHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StickyNote.objects.filter(is_deleted=True)
    serializer_class = StickyNoteSerializer

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        """付箋を復元する"""
        instance = self.get_object()
        instance.is_deleted = False
        instance.save()
        return Response(status=status.HTTP_200_OK)
