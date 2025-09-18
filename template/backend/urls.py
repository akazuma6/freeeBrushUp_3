from django.contrib import admin
from django.urls import path, include
from employees.views import MyTokenObtainPairView # カスタムビューをインポート
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 認証トークン用のURL
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # 【重要】各アプリに固有のパスを割り当てます
    # postsアプリは /api/posts/ 以下に配置 (もしあれば)
    # path('api/posts/', include('posts.urls')), 
    
    # employeesアプリは /api/employees/ 以下に配置
    path('api/employees/', include('employees.urls')),
    path('api/', include('table.urls')),
    path('api/', include('note.urls')),
]
