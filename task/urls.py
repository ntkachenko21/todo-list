from django.urls import path

from task.views import (
    TagCreateView,
    TagDeleteView,
    TagListView,
    TagUpdateView,
    TaskCreateView,
    TaskDeleteView,
    TaskDetailView,
    TasksByTagView,
    TaskUpdateView,
    ToggleTaskStatusView,
    index,
)

urlpatterns = [
    path("", index, name="index"),
    path("tags/", TagListView.as_view(), name="tag-list"),
    path("tags/create/", TagCreateView.as_view(), name="tag-create"),
    path("tags/<int:pk>/delete/", TagDeleteView.as_view(), name="tag-delete"),
    path("tags/<int:pk>/update/", TagUpdateView.as_view(), name="tag-update"),
    path("task/create/", TaskCreateView.as_view(), name="task-create"),
    path("task/<int:pk>/delete/", TaskDeleteView.as_view(), name="task-delete"),
    path("task/<int:pk>/update/", TaskUpdateView.as_view(), name="task-update"),
    path("task/<int:pk>/", TaskDetailView.as_view(), name="task-detail"),
    path("tags/<int:pk>/tasks/", TasksByTagView.as_view(), name="tasks-by-tag"),
    path(
        "tasks/<int:pk>/toggle-status/",
        ToggleTaskStatusView.as_view(),
        name="task-toggle-status",
    ),
]

app_name = "task"
