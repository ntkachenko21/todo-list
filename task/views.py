from django.core.cache import cache
from django.db.models import Count, Q
from django.utils import timezone
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse_lazy
from django.views import generic
from django.views.generic import View

from task.forms import TaskForm, TaskUpdateForm, TagForm
from task.models import Task, Tag


def index(request: HttpRequest) -> HttpResponse:
    tasks = Task.objects.prefetch_related("tags")
    tags = Tag.objects.all()

    total_tasks = tasks.count()
    completed_tasks = tasks.filter(is_done=True).count()
    pending_tasks = tasks.filter(is_done=False).count()

    overdue_tasks = tasks.filter(
        is_done=False,
        deadline__lt=timezone.now()
    ).count()

    context = {
        "tasks": tasks,
        "tags": tags,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "overdue_tasks": overdue_tasks,
    }
    return render(request, "task/index.html", context=context)


class TaskDetailView(generic.DetailView):
    model = Task
    template_name = "task/task-detail.html"
    context_object_name = "task"

    def get_queryset(self):
        return Task.objects.prefetch_related("tags")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        task = self.get_object()

        related_tasks = self._get_related_tasks(task)



        context.update({
            "related_tasks": related_tasks,
            "page_title": f"{task.title} - Task Details",
        })

        return context

    @staticmethod
    def _get_related_tasks(task):
        cache_key = f"related_tasks_{task.id}"
        related_tasks = cache.get(cache_key)

        if related_tasks is None:
            tags_ids = list(task.tags.values_list("id", flat=True))

            if tags_ids:
                related_tasks = Task.objects.filter(
                    tags__in=tags_ids
                ).exclude(
                    id=task.id
                ).prefetch_related("tags").distinct()[:5]

                cache.set(cache_key, related_tasks, 60 * 15)
            else:
                related_tasks = Task.objects.none()

        return related_tasks


class TasksByTagView(generic.ListView):
    model = Task
    template_name = 'task/tasks_by_tag.html'
    context_object_name = 'tasks'
    paginate_by = 20

    def get_queryset(self):
        self.tag = get_object_or_404(Tag, pk=self.kwargs["pk"])
        return Task.objects.filter(
            tags=self.tag
        ).prefetch_related("tags").order_by('-created_at')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        tasks = self.get_queryset()

        context['tag'] = self.tag

        stats = self._get_tasks_statistics(tasks)
        context.update(stats)

        context['related_tags'] = self._get_related_tags(tasks)

        return context

    def _get_tasks_statistics(self, tasks):
        cache_key = f"task_stats_{self.tag.id}"
        stats = cache.get(cache_key)

        if stats is None:
            stats_result = tasks.aggregate(
                total=Count("id"),
                completed=Count("id", filter=Q(is_done=True)),
                pending=Count("id", filter=Q(is_done=False)),
                overdue=Count("id", filter=Q(
                    is_done=False,
                    deadline__lt=timezone.now()
                ))
            )

            stats = {
                "total_count": stats_result["total"],
                "completed_count": stats_result["completed"],
                "pending_count": stats_result["pending"],
                "overdue_count": stats_result["overdue"]
            }
            cache.set(cache_key, stats, 60 * 10)

        return stats

    def _get_related_tags(self, tasks):
        cache_key = f"related_tags_{self.tag.id}"
        related_tags = cache.get(cache_key)

        if related_tags is None:
            task_ids = tasks.values_list("id", flat=True)
            related_tags = Tag.objects.filter(
                tasks__in=task_ids
            ).exclude(id=self.tag.id).annotate(
                task_count=Count("tasks", distinct=True)
            ).order_by("-task_count")[:10]
            cache.set(cache_key, related_tags, 60 * 30)

        return related_tags


class TagListView(generic.ListView):
    model = Tag
    paginate_by = 5
    queryset = Tag.objects.get_queryset().prefetch_related("tasks")


class TagCreateView(generic.CreateView):
    model = Tag
    form_class = TagForm
    success_url = reverse_lazy("task:tag-list")


class TagUpdateView(generic.UpdateView):
    model = Tag
    fields = "__all__"
    success_url = reverse_lazy("task:tag-list")


class TagDeleteView(generic.DeleteView):
    model = Tag
    success_url = reverse_lazy("task:tag-list")


class TaskCreateView(generic.CreateView):
    model = Task
    form_class = TaskForm
    success_url = reverse_lazy("task:index")


class TaskDeleteView(generic.DeleteView):
    model = Task
    fields = "__all__"
    success_url = reverse_lazy("task:index")


class TaskUpdateView(generic.UpdateView):
    model = Task
    form_class = TaskUpdateForm
    success_url = reverse_lazy("task:index")


class ToggleTaskStatusView(View):
    def post(self, request, pk, *args, **kwargs):
        task = get_object_or_404(Task, pk=pk)
        task.is_done = not task.is_done
        task.save()

        return redirect("task:index")
