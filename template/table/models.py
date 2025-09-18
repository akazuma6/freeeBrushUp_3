from django.db import models
from django.utils import timezone
from datetime import timedelta

class Table(models.Model):
    """テーブルの状態を管理するモデル"""
    STATUS_CHOICES = [
        ('available', '空席'),
        ('occupied', '利用中'),
        ('reserved', '予約'),
    ]
    
    id = models.IntegerField(primary_key=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='available')
    people = models.IntegerField(null=True, blank=True)
    entryTime = models.DateTimeField(null=True, blank=True)
    exitTime = models.DateTimeField(null=True, blank=True)
    memo = models.TextField(blank=True)
    extension_minutes = models.IntegerField(default=0) # 延長時間（分）

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._previous_status = self.status

    def save(self, *args, **kwargs):
        if self.status != self._previous_status:
            # ステータスが 'occupied' に変更された場合
            if self.status == 'occupied':
                self.entryTime = timezone.now()
                self.exitTime = self.entryTime + timedelta(hours=2)
            # ステータスが 'available' に変更された場合
            elif self.status == 'available':
                self.people = None
                self.entryTime = None
                self.exitTime = None
                self.memo = ''
                self.extension_minutes = 0
        
        super().save(*args, **kwargs)
        self._previous_status = self.status

    def __str__(self):
        return f"Table {self.id} - {self.get_status_display()}"

