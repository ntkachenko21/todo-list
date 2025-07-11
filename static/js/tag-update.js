// Tag Update Form JavaScript
document.addEventListener("DOMContentLoaded", () => {
  initializeTagUpdateForm()
})

function initializeTagUpdateForm() {
  const nameInput = document.getElementById("id_name")
  const previewText = document.getElementById("previewText")
  const originalName = window.tagUpdateData ? window.tagUpdateData.originalName : "Tag"

  if (nameInput && previewText) {
    nameInput.addEventListener("input", function () {
      updateTagPreview(this.value, previewText, originalName)
    })
  }
}

function updateTagPreview(value, previewElement, fallback) {
  const trimmedValue = value.trim()
  previewElement.textContent = trimmedValue || fallback
}
