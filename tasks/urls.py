from django.urls import path
from .views import list_tasks, list_task

urlpatterns = [
    path('', list_tasks, name='list-tasks'),
    path('/<str:pk>', list_task, name='list-task'),
]