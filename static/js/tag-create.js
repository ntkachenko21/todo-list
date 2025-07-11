// Tag Create Form JavaScript
document.addEventListener("DOMContentLoaded", () => {
  initializeTagCreateForm()
})

function initializeTagCreateForm() {
  const nameInput = document.getElementById("id_name")
  const previewText = document.getElementById("previewText")

  if (nameInput && previewText) {
    nameInput.addEventListener("input", function () {
      updateTagPreview(this.value, previewText)
    })
  }
}

function updateTagPreview(value, previewElement) {
  const trimmedValue = value.trim()
  previewElement.textContent = trimmedValue || "New Tag"
}
