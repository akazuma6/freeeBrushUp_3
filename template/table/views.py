from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import Table
from .serializers import TableSerializer

class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all().order_by('id')
    serializer_class = TableSerializer

    def get_queryset(self):
        # テーブルが1つもなければ初期データを作成
        if not Table.objects.exists():
            for i in range(1, 7):
                Table.objects.create(id=i, status='available')
        return super().get_queryset()

    @action(detail=True, methods=['post'])
    def extend_time(self, request, pk=None):
        table = self.get_object()
        if table.exitTime:
            table.exitTime += timedelta(minutes=30)
            table.save()
            return Response(self.get_serializer(table).data)
        else:
            return Response({'error': 'No exit time to extend'}, status=status.HTTP_400_BAD_REQUEST)

