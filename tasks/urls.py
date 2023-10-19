from django.urls import path
from .views import list_tasks, list_task, create_task

urlpatterns = [
    path('', list_tasks, name='list-tasks'),
    path('list-task/<str:pk>/', list_task, name='list-task'),
    path('create-task/', create_task, name='create-task'),
]