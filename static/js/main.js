// Main JavaScript file for Task Manager
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initializeSidebar()
  initializeSearch()
  initializeFilters()
  initializeTaskStats()
  initializeModals()
  initializeAlerts()
  initializeTaskCards()
  initializeLoadingStates()

  // Update stats on page load
  updateTaskStats()
  checkOverdueTasks()
})

// Sidebar functionality
function initializeSidebar() {
  const sidebar = document.getElementById("sidebar")
  const sidebarToggle = document.getElementById("sidebarToggle")
  const mainContent = document.querySelector(".main-content")

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active")

      // Close sidebar when clicking outside on mobile
      if (sidebar.classList.contains("active")) {
        document.addEventListener("click", closeSidebarOnOutsideClick)
      }
    })
  }

  function closeSidebarOnOutsideClick(event) {
    if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
      sidebar.classList.remove("active")
      document.removeEventListener("click", closeSidebarOnOutsideClick)
    }
  }
}

// Search functionality
function initializeSearch() {
  const searchInput = document.getElementById("searchInput")
  const searchClear = document.getElementById("searchClear")
  const taskCards = document.querySelectorAll(".task-card")

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase().trim()

      // Show/hide clear button
      if (searchTerm) {
        searchClear.classList.add("visible")
      } else {
        searchClear.classList.remove("visible")
      }

      // Filter tasks
      filterTasksBySearch(searchTerm)
    })
  }

  if (searchClear) {
    searchClear.addEventListener("click", () => {
      searchInput.value = ""
      searchClear.classList.remove("visible")
      filterTasksBySearch("")
      searchInput.focus()
    })
  }
}

function filterTasksBySearch(searchTerm) {
  const taskCards = document.querySelectorAll(".task-card")
  let visibleCount = 0

  taskCards.forEach((card) => {
    const title = card.querySelector(".task-title").textContent.toLowerCase()
    const tags = Array.from(card.querySelectorAll(".tag-pill"))
      .map((tag) => tag.textContent.toLowerCase())
      .join(" ")

    const isVisible = title.includes(searchTerm) || tags.includes(searchTerm)

    if (isVisible) {
      card.style.display = "block"
      card.classList.add("fade-in")
      visibleCount++
    } else {
      card.style.display = "none"
      card.classList.remove("fade-in")
    }
  })

  // Show/hide empty state
  toggleEmptyState(visibleCount === 0 && searchTerm !== "")
}

// Filter functionality
function initializeFilters() {
  const filterTabs = document.querySelectorAll(".filter-tab")

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      filterTabs.forEach((t) => t.classList.remove("active"))

      // Add active class to clicked tab
      this.classList.add("active")

      // Filter tasks
      const filter = this.dataset.filter
      filterTasks(filter)
    })
  })
}

function filterTasks(filter) {
  const taskCards = document.querySelectorAll(".task-card")
  let visibleCount = 0

  taskCards.forEach((card) => {
    let isVisible = false

    switch (filter) {
      case "all":
        isVisible = true
        break
      case "completed":
        isVisible = card.classList.contains("completed")
        break
      case "pending":
        isVisible = card.classList.contains("pending")
        break
      case "overdue":
        isVisible = card.classList.contains("overdue") || isTaskOverdue(card)
        break
    }

    if (isVisible) {
      card.style.display = "block"
      card.classList.add("slide-up")
      visibleCount++
    } else {
      card.style.display = "none"
      card.classList.remove("slide-up")
    }
  })

  // Update filter tab badges
  updateFilterBadges()

  // Show/hide empty state
  toggleEmptyState(visibleCount === 0)
}

function updateFilterBadges() {
  const taskCards = document.querySelectorAll(".task-card")
  const completedCount = document.querySelectorAll(".task-card.completed").length
  const pendingCount = document.querySelectorAll(".task-card.pending").length
  const overdueCount =
    document.querySelectorAll(".task-card").length - Array.from(taskCards).filter((card) => !isTaskOverdue(card)).length

  // Update filter tab text with counts (if you want to show counts)
  // This is optional - you can uncomment if you want counts in tabs
  /*
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        const filter = tab.dataset.filter;
        const span = tab.querySelector('span:last-child');

        switch (filter) {
            case 'completed':
                span.textContent = `Completed (${completedCount})`;
                break;
            case 'pending':
                span.textContent = `Pending (${pendingCount})`;
                break;
            case 'overdue':
                span.textContent = `Overdue (${overdueCount})`;
                break;
        }
    });
    */
}

// Task statistics
function initializeTaskStats() {
  updateTaskStats()
}

function updateTaskStats() {
  const taskCards = document.querySelectorAll(".task-card")
  const completedTasks = document.querySelectorAll(".task-card.completed")
  const pendingTasks = document.querySelectorAll(".task-card.pending")

  // Count overdue tasks
  let overdueCount = 0
  taskCards.forEach((card) => {
    if (isTaskOverdue(card)) {
      overdueCount++
      card.classList.add("overdue")
    }
  })

  // Update stat cards
  const pendingCountEl = document.getElementById("pendingCount")
  const overdueCountEl = document.getElementById("overdueCount")

  if (pendingCountEl) {
    animateNumber(pendingCountEl, pendingTasks.length)
  }

  if (overdueCountEl) {
    animateNumber(overdueCountEl, overdueCount)
  }
}

function animateNumber(element, targetNumber) {
  const startNumber = Number.parseInt(element.textContent) || 0
  const duration = 1000
  const startTime = performance.now()

  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    const currentNumber = Math.floor(startNumber + (targetNumber - startNumber) * progress)
    element.textContent = currentNumber

    if (progress < 1) {
      requestAnimationFrame(updateNumber)
    }
  }

  requestAnimationFrame(updateNumber)
}

function isTaskOverdue(taskCard) {
  const deadlineEl = taskCard.querySelector("[data-deadline]")
  if (!deadlineEl || !deadlineEl.dataset.deadline) return false

  const deadline = new Date(deadlineEl.dataset.deadline)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isCompleted = taskCard.classList.contains("completed")
  return deadline < today && !isCompleted
}

function checkOverdueTasks() {
  const taskCards = document.querySelectorAll(".task-card")

  taskCards.forEach((card) => {
    if (isTaskOverdue(card)) {
      card.classList.add("overdue")

      // Add overdue styling to deadline info
      const deadlineInfo = card.querySelector(".deadline-info")
      if (deadlineInfo) {
        deadlineInfo.classList.add("overdue")
      }

      // Update priority badge
      const priorityBadge = card.querySelector(".priority-badge")
      if (priorityBadge) {
        priorityBadge.classList.add("high")
        priorityBadge.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Overdue'
      }
    }
  })
}

// Modal functionality
function initializeModals() {
  const modals = document.querySelectorAll(".modal")

  modals.forEach((modal) => {
    const closeBtn = modal.querySelector(".modal-close")

    if (closeBtn) {
      closeBtn.addEventListener("click", () => closeModal())
    }

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal()
      }
    })
  })

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal()
    }
  })
}

function showModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.add("active")
    document.body.style.overflow = "hidden"

    // Focus first focusable element
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }
  }
}

function closeModal() {
  const activeModal = document.querySelector(".modal.active")
  if (activeModal) {
    activeModal.classList.remove("active")
    document.body.style.overflow = ""
  }
}

// Delete confirmation
function confirmDelete(deleteUrl) {
  const modal = document.getElementById("deleteModal")
  const confirmBtn = document.getElementById("confirmDeleteBtn")

  if (modal && confirmBtn) {
    confirmBtn.href = deleteUrl
    showModal("deleteModal")
  }
}

// Alert functionality
function initializeAlerts() {
  const alerts = document.querySelectorAll(".alert")

  alerts.forEach((alert) => {
    const closeBtn = alert.querySelector(".alert-close")

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        closeAlert(alert)
      })
    }

    // Auto-close alerts after 5 seconds
    setTimeout(() => {
      if (alert.parentNode) {
        closeAlert(alert)
      }
    }, 5000)
  })
}

function closeAlert(alert) {
  alert.style.animation = "slideOutUp 0.3s ease-in forwards"
  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove()
    }
  }, 300)
}

// Task card interactions
function initializeTaskCards() {
  const taskCards = document.querySelectorAll(".task-card")

  taskCards.forEach((card) => {
    // Add hover effects
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-4px)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })

    // Handle form submissions with loading states
    const toggleForm = card.querySelector(".toggle-form")
    if (toggleForm) {
      toggleForm.addEventListener("submit", function (e) {
        const button = this.querySelector(".btn-toggle")
        const originalText = button.innerHTML

        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'
        button.disabled = true

        // Show loading overlay
        showLoading()

        // The form will submit normally, but we show loading state
        setTimeout(() => {
          hideLoading()
        }, 1000)
      })
    }
  })
}

// Loading states
function initializeLoadingStates() {
  // Add loading states to all forms
  const forms = document.querySelectorAll("form")

  forms.forEach((form) => {
    form.addEventListener("submit", function () {
      const submitBtn = this.querySelector('input[type="submit"], button[type="submit"]')
      if (submitBtn && !submitBtn.classList.contains("btn-toggle")) {
        const originalText = submitBtn.textContent
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'
        submitBtn.disabled = true

        showLoading()
      }
    })
  })
}

function showLoading() {
  const loadingOverlay = document.getElementById("loadingOverlay")
  if (loadingOverlay) {
    loadingOverlay.classList.add("active")
  }
}

function hideLoading() {
  const loadingOverlay = document.getElementById("loadingOverlay")
  if (loadingOverlay) {
    loadingOverlay.classList.remove("active")
  }
}

// Utility functions
function toggleEmptyState(show) {
  const emptyState = document.querySelector(".empty-state")
  const taskGrid = document.querySelector(".task-grid")

  if (show) {
    if (taskGrid) taskGrid.style.display = "none"
    if (emptyState) emptyState.style.display = "block"
  } else {
    if (taskGrid) taskGrid.style.display = "grid"
    if (emptyState) emptyState.style.display = "none"
  }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Add CSS animation classes
const style = document.createElement("style")
style.textContent = `
    @keyframes slideOutUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`
document.head.appendChild(style)

// Performance optimization: Debounce search
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Apply debounce to search
const searchInput = document.getElementById("searchInput")
if (searchInput) {
  const debouncedSearch = debounce((searchTerm) => {
    filterTasksBySearch(searchTerm)
  }, 300)

  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase().trim()
    debouncedSearch(searchTerm)
  })
}

// Accessibility improvements
document.addEventListener("keydown", (e) => {
  // Handle keyboard navigation for task cards
  if (e.key === "Tab") {
    const focusedElement = document.activeElement
    if (focusedElement.classList.contains("task-card")) {
      // Add visual focus indicator
      focusedElement.style.outline = "2px solid var(--primary-color)"
      focusedElement.style.outlineOffset = "2px"
    }
  }
})

// Remove focus outline when clicking
document.addEventListener("click", () => {
  const focusedElement = document.activeElement
  if (focusedElement.classList.contains("task-card")) {
    focusedElement.style.outline = "none"
  }
})

// Initialize tooltips (if you want to add them)
function initializeTooltips() {
  const tooltipElements = document.querySelectorAll("[title]")

  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", function () {
      const tooltip = document.createElement("div")
      tooltip.className = "tooltip"
      tooltip.textContent = this.getAttribute("title")
      document.body.appendChild(tooltip)

      const rect = this.getBoundingClientRect()
      tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px"
      tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + "px"

      this.setAttribute("data-original-title", this.getAttribute("title"))
      this.removeAttribute("title")
    })

    element.addEventListener("mouseleave", function () {
      const tooltip = document.querySelector(".tooltip")
      if (tooltip) {
        tooltip.remove()
      }

      if (this.getAttribute("data-original-title")) {
        this.setAttribute("title", this.getAttribute("data-original-title"))
        this.removeAttribute("data-original-title")
      }
    })
  })
}

// Call initialize tooltips
initializeTooltips()
