// Task Create Form JavaScript
document.addEventListener("DOMContentLoaded", () => {
  initializeTaskCreateForm()
})

function initializeTaskCreateForm() {
  const contentInput = document.getElementById("id_content")
  const deadlineInput = document.getElementById("id_deadline")
  const tagCheckboxes = document.querySelectorAll('input[name="tags"]')

  const previewTitle = document.getElementById("previewTitle")
  const previewDeadline = document.getElementById("previewDeadline")
  const deadlineText = document.getElementById("deadlineText")
  const previewTags = document.getElementById("previewTags")

  // Initialize preview functionality
  if (contentInput && previewTitle) {
    contentInput.addEventListener("input", function () {
      updateTaskTitlePreview(this.value, previewTitle)
    })
  }

  if (deadlineInput && previewDeadline && deadlineText) {
    deadlineInput.addEventListener("change", function () {
      updateDeadlinePreview(this.value, previewDeadline, deadlineText)
    })
  }

  if (tagCheckboxes.length > 0 && previewTags) {
    tagCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        updateTagsPreview(tagCheckboxes, previewTags)
      })
    })

    // Initialize tags preview
    updateTagsPreview(tagCheckboxes, previewTags)
  }
}

function updateTaskTitlePreview(value, previewElement) {
  const trimmedValue = value.trim()
  previewElement.textContent = trimmedValue || "Your task description will appear here..."
}

function updateDeadlinePreview(value, previewElement, textElement) {
  if (value) {
    const date = new Date(value)
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    textElement.textContent = "Deadline: " + date.toLocaleDateString("en-US", options)
    previewElement.style.display = "flex"
  } else {
    previewElement.style.display = "none"
  }
}

function updateTagsPreview(checkboxes, previewElement) {
  const selectedTags = Array.from(checkboxes)
    .filter((cb) => cb.checked)
    .map((cb) => cb.nextElementSibling.textContent.trim())

  if (selectedTags.length > 0) {
    previewElement.innerHTML = selectedTags
      .map((tag) => `<span class="tag-pill"><i class="fas fa-tag"></i>${tag}</span>`)
      .join("")
  } else {
    previewElement.innerHTML = '<span class="no-tags"><i class="fas fa-tag"></i>No tags selected</span>'
  }
}
