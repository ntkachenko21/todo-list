// ===== ОПТИМИЗИРОВАННЫЙ САЙДБАР - ИСПРАВЛЕНИЕ ВСЕХ ПРОБЛЕМ =====
document.addEventListener("DOMContentLoaded", () => {
  // Инициализация всех компонентов
  initializeOptimizedSidebar()
  initializeSearch()
  initializeFilters()
  initializeModals()
  initializeAlerts()
  initializeTaskCards()
  initializeLoadingStates()
  initializeTooltips()
  checkOverdueTasks()
})

// ===== ОПТИМИЗИРОВАННЫЙ САЙДБАР =====
function initializeOptimizedSidebar() {
  const sidebar = document.getElementById("sidebar")
  const sidebarPin = document.getElementById("sidebarPin")
  const sidebarMobileToggle = document.getElementById("sidebarMobileToggle")
  const sidebarOverlay = document.getElementById("sidebarOverlay")
  const mainContent = document.getElementById("mainContent")

  if (!sidebar) return

  let hoverTimeout = null
  let isTransitioning = false
  let transitionTimeout = null

  // ===== УЛУЧШЕННАЯ HOVER ЛОГИКА С DEBOUNCING =====
  if (sidebar && mainContent) {
    sidebar.addEventListener("mouseenter", () => {
      // Очищаем все таймауты
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
        hoverTimeout = null
      }
      if (transitionTimeout) {
        clearTimeout(transitionTimeout)
        transitionTimeout = null
      }

      if (!sidebar.classList.contains("sidebar-pinned") && window.innerWidth > 1024 && !isTransitioning) {
        isTransitioning = true
        sidebar.classList.add("sidebar-hovering")

        // Сброс флага после завершения анимации
        transitionTimeout = setTimeout(() => {
          isTransitioning = false
        }, 400) // Соответствует CSS transition
      }
    })

    sidebar.addEventListener("mouseleave", () => {
      if (!sidebar.classList.contains("sidebar-pinned") && window.innerWidth > 1024) {
        // Увеличенная задержка для предотвращения мерцания
        hoverTimeout = setTimeout(() => {
          if (!isTransitioning) {
            isTransitioning = true
            sidebar.classList.remove("sidebar-hovering")

            transitionTimeout = setTimeout(() => {
              isTransitioning = false
            }, 400)
          }
        }, 150) // Оптимальная задержка
      }
    })
  }

  // ===== УЛУЧШЕННАЯ PIN/UNPIN ФУНКЦИОНАЛЬНОСТЬ =====
  if (sidebarPin) {
    sidebarPin.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()

      const isPinned = sidebar.classList.contains("sidebar-pinned")

      // Создаем визуальный эффект
      createOptimizedRipple(sidebarPin, e)

      if (isPinned) {
        sidebar.classList.remove("sidebar-pinned")
        sidebarPin.classList.remove("active")
        sidebarPin.title = "Pin sidebar"
      } else {
        sidebar.classList.add("sidebar-pinned")
        sidebar.classList.remove("sidebar-hovering") // Убираем hover состояние
        sidebarPin.classList.add("active")
        sidebarPin.title = "Unpin sidebar"
      }

      // Сохраняем состояние
      localStorage.setItem("sidebarPinned", !isPinned)
    })
  }

  // ===== ОПТИМИЗИРОВАННАЯ МОБИЛЬНАЯ ФУНКЦИОНАЛЬНОСТЬ =====
  if (sidebarMobileToggle) {
    sidebarMobileToggle.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()

      const isOpen = sidebar.classList.contains("sidebar-mobile-open")

      if (isOpen) {
        closeMobileSidebar()
      } else {
        openMobileSidebar()
      }
    })
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", () => {
      closeMobileSidebar()
    })
  }

  function openMobileSidebar() {
    sidebar.classList.add("sidebar-mobile-open")
    sidebarOverlay.classList.add("active")
    document.body.style.overflow = "hidden"

    // Фокус на первой ссылке для доступности
    const firstNavLink = sidebar.querySelector(".nav-link")
    if (firstNavLink) {
      setTimeout(() => firstNavLink.focus(), 100)
    }
  }

  function closeMobileSidebar() {
    sidebar.classList.remove("sidebar-mobile-open")
    sidebarOverlay.classList.remove("active")
    document.body.style.overflow = ""
  }

  // ===== ВОССТАНОВЛЕНИЕ СОСТОЯНИЯ =====
  const isPinned = localStorage.getItem("sidebarPinned") === "true"
  if (isPinned && sidebarPin) {
    sidebar.classList.add("sidebar-pinned")
    sidebarPin.classList.add("active")
    sidebarPin.title = "Unpin sidebar"
  }

  // ===== ОПТИМИЗИРОВАННАЯ ОБРАБОТКА RESIZE =====
  let resizeTimeout = null
  const handleResize = () => {
    const width = window.innerWidth

    if (width > 1024) {
      closeMobileSidebar()
      // Сброс hover состояния при изменении размера
      if (!sidebar.classList.contains("sidebar-pinned")) {
        sidebar.classList.remove("sidebar-hovering")
      }
    } else {
      sidebar.classList.remove("sidebar-hovering")
    }
  }

  window.addEventListener("resize", () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }
    resizeTimeout = setTimeout(handleResize, 100)
  })

  // ===== УЛУЧШЕННЫЕ ЭФФЕКТЫ ДЛЯ НАВИГАЦИИ =====
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    // Плавные hover эффекты
    link.addEventListener("mouseenter", function () {
      if (!this.classList.contains("active")) {
        this.style.transform = "translateX(2px)"
      }
    })

    link.addEventListener("mouseleave", function () {
      if (!this.classList.contains("active")) {
        this.style.transform = "translateX(0)"
      }
    })

    // Ripple эффект при клике
    link.addEventListener("click", function (e) {
      createOptimizedRipple(this, e)
    })

    // Закрытие мобильного меню после клика
    link.addEventListener("click", () => {
      if (window.innerWidth <= 1024 && sidebar.classList.contains("sidebar-mobile-open")) {
        setTimeout(() => {
          closeMobileSidebar()
        }, 150)
      }
    })
  })

  // ===== KEYBOARD NAVIGATION =====
  document.addEventListener("keydown", (e) => {
    // Escape для закрытия мобильного меню
    if (e.key === "Escape" && sidebar.classList.contains("sidebar-mobile-open")) {
      closeMobileSidebar()
    }

    // Ctrl/Cmd + B для toggle pin состояния
    if ((e.ctrlKey || e.metaKey) && e.key === "b" && window.innerWidth > 1024) {
      e.preventDefault()
      if (sidebarPin) {
        sidebarPin.click()
      }
    }
  })

  // ===== PERFORMANCE OPTIMIZATION =====
  // Используем Intersection Observer для оптимизации анимаций
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate")
          }
        })
      },
      { threshold: 0.1 },
    )

    navLinks.forEach((link) => observer.observe(link))
  }
}

// ===== ОПТИМИЗИРОВАННЫЙ RIPPLE ЭФФЕКТ =====
function createOptimizedRipple(element, event) {
  // Удаляем предыдущие ripple эффекты
  const existingRipples = element.querySelectorAll(".ripple-effect")
  existingRipples.forEach((ripple) => ripple.remove())

  const ripple = document.createElement("span")
  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  ripple.className = "ripple-effect"
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: optimizedRipple 0.6s ease-out;
    pointer-events: none;
    z-index: 1;
  `

  // Убеждаемся, что элемент имеет position: relative
  const computedStyle = window.getComputedStyle(element)
  if (computedStyle.position === "static") {
    element.style.position = "relative"
  }

  element.style.overflow = "hidden"
  element.appendChild(ripple)

  // Удаляем ripple после анимации
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.remove()
    }
  }, 600)
}

// ===== ОСТАЛЬНЫЕ ФУНКЦИИ (без изменений) =====
function initializeSearch() {
  const searchInput = document.getElementById("searchInput")
  const searchClear = document.getElementById("searchClear")

  if (searchInput) {
    const debouncedSearch = debounce((searchTerm) => {
      filterTasksBySearch(searchTerm)
    }, 300)

    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase().trim()

      if (searchTerm) {
        searchClear?.classList.add("visible")
      } else {
        searchClear?.classList.remove("visible")
      }

      debouncedSearch(searchTerm)
    })

    searchInput.addEventListener("focus", function () {
      this.parentElement.classList.add("focused")
    })

    searchInput.addEventListener("blur", function () {
      this.parentElement.classList.remove("focused")
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

  taskCards.forEach((card, index) => {
    const title = card.querySelector(".task-title")?.textContent.toLowerCase() || ""
    const tags = Array.from(card.querySelectorAll(".tag-pill"))
      .map((tag) => tag.textContent.toLowerCase())
      .join(" ")

    const isVisible = title.includes(searchTerm) || tags.includes(searchTerm)

    if (isVisible) {
      card.style.display = "block"
      card.classList.add("fade-in")
      card.style.animationDelay = `${index * 0.05}s`
      visibleCount++
    } else {
      card.style.display = "none"
      card.classList.remove("fade-in")
      card.style.animationDelay = "0s"
    }
  })

  toggleEmptyState(visibleCount === 0 && searchTerm !== "")
}

function initializeFilters() {
  const filterTabs = document.querySelectorAll(".filter-tab")

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      filterTabs.forEach((t) => t.classList.remove("active"))
      this.classList.add("active")

      const filter = this.dataset.filter
      filterTasks(filter)
      createOptimizedRipple(this, event)
    })
  })
}

function filterTasks(filter) {
  const taskCards = document.querySelectorAll(".task-card")
  let visibleCount = 0

  taskCards.forEach((card, index) => {
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
      card.style.animationDelay = `${index * 0.05}s`
      visibleCount++
    } else {
      card.style.display = "none"
      card.classList.remove("slide-up")
      card.style.animationDelay = "0s"
    }
  })

  toggleEmptyState(visibleCount === 0)
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

      const deadlineInfo = card.querySelector(".deadline-info")
      if (deadlineInfo) {
        deadlineInfo.classList.add("overdue")
      }

      const priorityBadge = card.querySelector(".priority-badge")
      if (priorityBadge) {
        priorityBadge.classList.add("high")
        priorityBadge.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Overdue'
      }
    }
  })
}

function initializeModals() {
  const modals = document.querySelectorAll(".modal")

  modals.forEach((modal) => {
    const closeBtn = modal.querySelector(".modal-close")
    if (closeBtn) {
      closeBtn.addEventListener("click", () => closeModal())
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal()
      }
    })
  })

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

function confirmDelete(deleteUrl) {
  const modal = document.getElementById("deleteModal")
  const confirmBtn = document.getElementById("confirmDeleteBtn")

  if (modal && confirmBtn) {
    confirmBtn.href = deleteUrl
    showModal("deleteModal")
  }
}

function initializeAlerts() {
  const alerts = document.querySelectorAll(".alert")

  alerts.forEach((alert) => {
    const closeBtn = alert.querySelector(".alert-close")
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        closeAlert(alert)
      })
    }

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

function initializeTaskCards() {
  const taskCards = document.querySelectorAll(".task-card")

  taskCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-4px)"
      this.style.transition = "transform 0.3s ease"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })

    const toggleForm = card.querySelector(".toggle-form")
    if (toggleForm) {
      toggleForm.addEventListener("submit", function (e) {
        const button = this.querySelector(".btn-toggle")
        const originalText = button.innerHTML
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'
        button.disabled = true
        showLoading()
      })
    }
  })
}

function initializeLoadingStates() {
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

// ===== ДОПОЛНИТЕЛЬНЫЕ CSS АНИМАЦИИ =====
if (!document.querySelector("#optimized-sidebar-styles")) {
  const style = document.createElement("style")
  style.id = "optimized-sidebar-styles"
  style.textContent = `
    @keyframes optimizedRipple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
    
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
    
    .tooltip {
      position: absolute;
      background: var(--bg-dark);
      color: var(--text-white);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--border-radius-sm);
      font-size: var(--font-size-sm);
      z-index: 1000;
      pointer-events: none;
      box-shadow: var(--shadow-lg);
    }
    
    .search-box.focused {
      transform: scale(1.02);
      box-shadow: var(--shadow-lg);
    }
    
    .fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
    
    .slide-up {
      animation: slideUp 0.5s ease-out forwards;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Оптимизация производительности */
    .nav-link.animate {
      animation: navLinkFadeIn 0.3s ease-out;
    }
    
    @keyframes navLinkFadeIn {
      from {
        opacity: 0;
        transform: translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `
  document.head.appendChild(style)
}
