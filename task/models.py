from django.conf import settings
from django.db import models


class Task(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(null=True, blank=True)
    is_done = models.BooleanField(default=False)
    tags = models.ManyToManyField("Tag", related_name="tasks")
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tasks",
    )

    class Meta:
        ordering = ["is_done", "-created_at"]

    def __str__(self):
        return self.title


class Tag(models.Model):
    name = models.CharField(max_length=63)

    def __str__(self):
        return self.name
