from django.db import models

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

    def __str__(self):
        return f"Table {self.id} - {self.get_status_display()}"