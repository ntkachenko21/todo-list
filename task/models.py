from django.db import models


class Task(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(null=True, blank=True)
    is_done = models.BooleanField(default=False)
    tags = models.ManyToManyField("Tag", related_name="tasks")

    class Meta:
        ordering = ["is_done", "-created_at"]

    @property
    def title(self):
        return self.content[:50] + "..." if len(self.content) > 50 else self.content

    @property
    def description(self):
        return self.content

    def __str__(self):
        return self.content


class Tag(models.Model):
    name = models.CharField(max_length=63)

    def __str__(self):
        return self.name
