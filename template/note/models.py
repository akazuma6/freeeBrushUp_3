from django.db import models

class StickyNote(models.Model):
    """付箋を管理するモデル"""
    memo = models.TextField(blank=True)
    color = models.CharField(max_length=20, default='#fff8e1') # 黄色っぽい色をデフォルトに
    position_x = models.IntegerField(default=10)
    position_y = models.IntegerField(default=10)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"Note {self.id} - {self.memo[:20]}"