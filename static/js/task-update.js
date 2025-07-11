// Task Update Form JavaScript
document.addEventListener("DOMContentLoaded", () => {
  initializeTaskUpdateForm()
})

function initializeTaskUpdateForm() {
  const contentInput = document.getElementById("id_content")
  const deadlineInput = document.getElementById("id_deadline")
  const tagCheckboxes = document.querySelectorAll('input[name="tags"]')

  // Initialize form functionality similar to task-create.js
  if (contentInput) {
    contentInput.addEventListener("input", () => {
      // Add any specific update logic here
    })
  }

  if (deadlineInput) {
    deadlineInput.addEventListener("change", () => {
      // Add any specific update logic here
    })
  }

  if (tagCheckboxes.length > 0) {
    tagCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        // Add any specific update logic here
      })
    })
  }
}
