from rest_framework import viewsets, status
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
    queryset = StickyNote.objects.all()
    serializer_class = StickyNoteSerializer
