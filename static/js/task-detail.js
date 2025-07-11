// ===== ДЕТАЛЬНАЯ СТРАНИЦА ЗАДАЧИ - JAVASCRIPT =====

document.addEventListener("DOMContentLoaded", () => {
  initializeTaskDetail()
})

function initializeTaskDetail() {
  console.log("Initializing task detail page...")

  // Инициализация модальных окон
  initializeModals()

  // Инициализация прогресс-бара
  initializeProgressBar()

  // Инициализация тегов
  initializeTagInteractions()

  // Инициализация быстрых действий
  initializeQuickActions()

  // Инициализация подсказок
  initializeTooltips()

  // Инициализация клавиатурных ярлыков
  initializeKeyboardShortcuts()

  // Инициализация форм
  initializeForms()

  // Инициализация плавной прокрутки
  initializeSmoothScrolling()

  console.log("Task detail page initialized successfully")
}

// ===== МОДАЛЬНЫЕ ОКНА =====
function initializeModals() {
  const modals = document.querySelectorAll(".modal-overlay")

  modals.forEach((modal) => {
    // Закрытие окна по кнопке
    const closeBtn = modal.querySelector(".modal-close")
    if (closeBtn) {
      closeBtn.addEventListener("click", () => closeModal(modal))
    }

    // Закрытие окна по клику вне его
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal)
      }
    })
  })

  // Закрытие окна по нажатию клавиши Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const activeModal = document.querySelector(".modal-overlay.active")
      if (activeModal) {
        closeModal(activeModal)
      }
    }
  })
}

function showModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.add("active")
    document.body.style.overflow = "hidden"

    // Управление фокусом
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    // Добавление анимации
    const modalContainer = modal.querySelector(".modal-container")
    if (modalContainer) {
      modalContainer.style.animation = "modalSlideIn 0.3s ease"
    }
  }
}

function closeModal(modal) {
  if (modal) {
    modal.classList.remove("active")
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

// ===== АНИМАЦИЯ ПРОГРЕСС-БАРА =====
function initializeProgressBar() {
  const progressFill = document.querySelector(".progress-fill")
  if (progressFill) {
    const targetProgress = progressFill.getAttribute("data-progress")

    // Начинаем с 0 и анимируем до целевого значения
    progressFill.style.width = "0%"

    setTimeout(() => {
      progressFill.style.width = targetProgress + "%"
    }, 500)

    // Добавляем эффект мерцания
    progressFill.addEventListener("animationend", () => {
      progressFill.style.animation = "none"
    })
  }
}

// ===== ВЗАИМОДЕЙСТВИЕ С ТЕГАМИ =====
function initializeTagInteractions() {
  const tagPills = document.querySelectorAll(".tag-pill")

  tagPills.forEach((tag) => {
    // Эффекты при наведении
    tag.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px) scale(1.05)"
    })

    tag.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
    })

    // Эффект риппл при клике
    tag.addEventListener("click", function (e) {
      createRippleEffect(this, e)
    })

    // Доступность клавиатуры
    tag.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        this.click()
      }
    })
  })
}

// ===== БЫСТРЫЕ ДЕЙСТВИЯ =====
function initializeQuickActions() {
  const quickActionBtns = document.querySelectorAll(".quick-action-btn")

  quickActionBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      createRippleEffect(this, e)
    })
  })
}

function duplicateTask(taskId) {
  showLoading()

  // Симулируем API-запрос
  setTimeout(() => {
    hideLoading()
    showToast("Task duplicated successfully!", "success")

    // В реальном приложении здесь бы был фактический API-запрос
    // fetch(`/api/tasks/${taskId}/duplicate/`, {
    //     method: 'POST',
    //     headers: {
    //         'X-CSRFToken': getCsrfToken(),
    //         'Content-Type': 'application/json',
    //     },
    // })
    // .then(response => response.json())
    // .then(data => {
    //     hideLoading();
    //     if (data.success) {
    //         showToast('Task duplicated successfully!', 'success');
    //         if (data.new_task_id) {
    //             setTimeout(() => {
    //                 window.location.href = `/task/${data.new_task_id}/`;
    //             }, 1500);
    //         }
    //     } else {
    //         showToast('Failed to duplicate task', 'error');
    //     }
    // })
    // .catch(error => {
    //     hideLoading();
    //     console.error('Error:', error);
    //     showToast('An error occurred while duplicating the task', 'error');
    // });
  }, 1000)
}

function shareTask(taskId) {
  const taskUrl = window.location.href

  if (navigator.share) {
    navigator
      .share({
        title: document.querySelector(".task-title").textContent,
        text: "Check out this task",
        url: taskUrl,
      })
      .then(() => {
        showToast("Task shared successfully!", "success")
      })
      .catch((error) => {
        console.log("Error sharing:", error)
        copyToClipboard(taskUrl)
      })
  } else {
    copyToClipboard(taskUrl)
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast("Link copied to clipboard!", "success")
      })
      .catch(() => {
        fallbackCopyToClipboard(text)
      })
  } else {
    fallbackCopyToClipboard(text)
  }
}

function fallbackCopyToClipboard(text) {
  const textArea = document.createElement("textarea")
  textArea.value = text
  textArea.style.position = "fixed"
  textArea.style.left = "-999999px"
  textArea.style.top = "-999999px"
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand("copy")
    showToast("Link copied to clipboard!", "success")
  } catch (err) {
    showToast("Failed to copy link", "error")
  }

  document.body.removeChild(textArea)
}

function getCsrfToken() {
  return document.querySelector("[name=csrfmiddlewaretoken]")?.value || ""
}

// ===== ИНДИКАТОР ЗАГРУЗКИ =====
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

// ===== УВЕДОМЛЕНИЯ =====
function showToast(message, type = "info", duration = 5000) {
  const toastContainer = document.getElementById("toastContainer")
  if (!toastContainer) return

  const toast = document.createElement("div")
  toast.className = `toast ${type}`

  const iconMap = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    info: "fa-info-circle",
    warning: "fa-exclamation-triangle",
  }

  toast.innerHTML = `
      <div class="toast-icon">
          <i class="fas ${iconMap[type] || iconMap.info}"></i>
      </div>
      <div class="toast-content">
          <p class="toast-message">${message}</p>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">
          <i class="fas fa-times"></i>
      </button>
  `

  toastContainer.appendChild(toast)

  // Автоматическое удаление через заданное время
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = "toastSlideOut 0.3s ease forwards"
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove()
        }
      }, 300)
    }
  }, duration)
}

// ===== ПОДСКАЗКИ =====
function initializeTooltips() {
  const elementsWithTooltips = document.querySelectorAll("[data-tooltip]")

  elementsWithTooltips.forEach((element) => {
    element.addEventListener("mouseenter", showTooltip)
    element.addEventListener("mouseleave", hideTooltip)
  })
}

function showTooltip(e) {
  const element = e.target
  const tooltipText = element.getAttribute("data-tooltip")

  if (!tooltipText) return

  const tooltip = document.createElement("div")
  tooltip.className = "tooltip"
  tooltip.textContent = tooltipText

  document.body.appendChild(tooltip)

  const rect = element.getBoundingClientRect()
  tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px"
  tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + "px"

  element._tooltip = tooltip
}

function hideTooltip(e) {
  const element = e.target
  if (element._tooltip) {
    element._tooltip.remove()
    delete element._tooltip
  }
}

// ===== КЛАВИАТУРНЫЕ ЯРЛЫКИ =====
function initializeKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Не триггерим ярлыки, если фокус на поле ввода
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      return
    }

    // Ctrl/Cmd + E = Редактирование задачи
    if ((e.ctrlKey || e.metaKey) && e.key === "e") {
      e.preventDefault()
      const editBtn = document.querySelector(".btn-secondary")
      if (editBtn) {
        editBtn.click()
      }
    }

    // Ctrl/Cmd + D = Удаление задачи
    if ((e.ctrlKey || e.metaKey) && e.key === "d") {
      e.preventDefault()
      const deleteBtn = document.querySelector(".btn-danger")
      if (deleteBtn) {
        deleteBtn.click()
      }
    }

    // Пробел = Переключение статуса задачи
    if (e.key === " ") {
      e.preventDefault()
      const toggleBtn = document.querySelector(".btn-success, .btn-warning")
      if (toggleBtn) {
        toggleBtn.click()
      }
    }
  })
}

// ===== ФОРМЫ =====
function initializeForms() {
  const forms = document.querySelectorAll("form")

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      const submitBtn = this.querySelector('button[type="submit"]')
      if (submitBtn) {
        const originalText = submitBtn.innerHTML
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'
        submitBtn.disabled = true

        showLoading()

        // Восстанавливаем кнопку после задержки (в случае ошибок)
        setTimeout(() => {
          submitBtn.innerHTML = originalText
          submitBtn.disabled = false
          hideLoading()
        }, 10000)
      }
    })
  })
}

// ===== ПЛАВНАЯ ПРОКРУТКА =====
function initializeSmoothScrolling() {
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
}

// ===== МОНИТОРИНГ ПРОИЗВОДИТЕЛЬНОСТИ =====
function logPerformance() {
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing
    const loadTime = timing.loadEventEnd - timing.navigationStart
    console.log(`Page load time: ${loadTime}ms`)
  }
}

// ===== ОБРАБОТКА ОШИБОК =====
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error)
  showToast("An unexpected error occurred", "error")
})

// ===== ДОПОЛНИТЕЛЬНЫЙ CSS ДЛЯ АНИМАЦИЙ =====
if (!document.querySelector("#task-detail-animations")) {
  const style = document.createElement("style")
  style.id = "task-detail-animations"
  style.textContent = `
      @keyframes ripple {
          to {
              transform: scale(4);
              opacity: 0;
          }
      }
      
      @keyframes toastSlideOut {
          to {
              opacity: 0;
              transform: translateX(100%);
          }
      }
      
      .tooltip {
          position: absolute;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 1000;
          pointer-events: none;
          animation: fadeIn 0.2s ease;
      }
      
      @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
      }
  `
  document.head.appendChild(style)
}
