// ===== LOGIN PAGE FUNCTIONALITY =====
document.addEventListener("DOMContentLoaded", () => {
    initializeLoginPage()
})

function initializeLoginPage() {
    initializePasswordToggle()
    initializeFormValidation()
    initializeGoogleSignup()
    initializeFormSubmission()
    initializeAlerts()
}

// ===== PASSWORD TOGGLE FUNCTIONALITY =====
function initializePasswordToggle() {
    const passwordToggle = document.getElementById("passwordToggle")
    const passwordInput = document.getElementById("id_password1")
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener("click", () => {
            togglePasswordVisibility(passwordInput, passwordToggle)
        })
    }
}

function togglePasswordVisibility(passwordInput, toggleBtn) {
    if (passwordInput.type === "password") {
        passwordInput.type = "text"
        toggleBtn.textContent = "🙈"
        toggleBtn.setAttribute("aria-label", "Hide password")
    } else {
        passwordInput.type = "password"
        toggleBtn.textContent = "👁"
        toggleBtn.setAttribute("aria-label", "Show password")
    }
}

// ===== FORM VALIDATION =====
function initializeFormValidation() {
    const emailInput = document.getElementById("id_email");
    const passwordInput = document.getElementById("id_password1");
    const password2Input = document.getElementById("id_password2");

    if (emailInput) {
        // При потере фокуса - валидируем
        emailInput.addEventListener("blur", () => validateEmail(emailInput));
        // При вводе - убираем ошибку
        emailInput.addEventListener("input", () => clearError(emailInput));
    }
    if (passwordInput) {
        passwordInput.addEventListener("blur", () => validatePassword(passwordInput));
        passwordInput.addEventListener("input", () => clearError(passwordInput));
    }
    if (password2Input) {
        // Для поля подтверждения пароля просто убираем ошибку при вводе
        password2Input.addEventListener("input", () => clearError(password2Input));
    }
}

function validateEmail(emailInput) {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        showError(emailInput, "Email is required");
        return false;
    }
    if (!emailRegex.test(email)) {
        showError(emailInput, "Please enter a valid email address");
        return false;
    }
    clearError(emailInput);
    return true;
}

function validatePassword(passwordInput) {
    const password = passwordInput.value;

    if (!password) {
        showError(passwordInput, "Password is required");
        return false;
    }
    if (password.length < 8) {
        showError(passwordInput, "Password must be at least 8 characters long");
        return false;
    }
    clearError(passwordInput);
    return true;
}

// Упрощенная и правильная функция показа ошибки
function showError(inputElement, message) {
    inputElement.classList.add("error");

    const errorContainer = inputElement.closest('.form-group').querySelector('.error-message');


    if (errorContainer) {
        errorContainer.textContent = message;
    } else {
        console.error('ERROR: .error-message container not found!');
    }
}

// Упрощенная и правильная функция очистки ошибки
function clearError(inputElement) {
    inputElement.classList.remove("error");
    const errorContainer = inputElement.closest('.form-group').querySelector('.error-message');
    if (errorContainer) {
        errorContainer.textContent = "";
    }
}


// ===== GOOGLE SIGNUP =====
function initializeGoogleSignup() {
    const googleBtn = document.getElementById("googleSignupBtn")
    
    if (googleBtn) {
        googleBtn.addEventListener("click", handleGoogleSignup)
    }
}

function handleGoogleSignup() {
    // Add ripple effect
    createRippleEffect(event.target, event)
    
    // Show loading state
    showLoadingOverlay("Connecting to Google...")
    
    // For Django integration, redirect to Google OAuth endpoint
    // Replace with your actual Google OAuth URL
    setTimeout(() => {
        // window.location.href = '/auth/google/'
        console.log("Google signup clicked - implement OAuth integration")
        hideLoadingOverlay()
        showAlert("Google signup will be implemented with OAuth", "warning")
    }, 1000)
}

// ===== FORM SUBMISSION =====
function initializeFormSubmission() {
    const signupForm = document.getElementById("signupForm")
    
    if (signupForm) {
        signupForm.addEventListener("submit", handleFormSubmission)
    }
}

function handleFormSubmission(event) {
    event.preventDefault()

    // const emailInput = document.getElementById("id_email")
    // const passwordInput = document.getElementById("id_password1")
    const signupBtn = document.getElementById("signupBtn")

    // // Validate form
    // const isEmailValid = validateEmail(emailInput)
    // const isPasswordValid = validatePassword(passwordInput)
    //
    // if (!isEmailValid || !isPasswordValid) {
    //     showAlert("Please fix the errors above", "error")
    //     return
    // }

    // Show loading state
    setButtonLoading(signupBtn, true)
    showLoadingOverlay("Creating your account...")

    // Get form data
    const formData = new FormData(event.target)

    // For Django integration, submit via fetch
    submitFormData(formData, signupBtn)
}

function submitFormData(formData, submitBtn) {
    fetch(window.location.href, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        // Проверяем, что ответ действительно JSON
        const contentType = response.headers.get('content-type');

        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Response is not JSON');
        }

        return response.json();
    })
    .then(data => {
        hideLoadingOverlay()
        setButtonLoading(submitBtn, false)

        if (data.success) {
            showAlert("Account created successfully! Redirecting...", "success")
            setTimeout(() => {
                window.location.href = data.redirect_url || '/dashboard/'
            }, 1500)
        } else {
            handleFormErrors(data.errors)
        }
    })
    .catch(error => {
        console.error('=== FETCH ERROR ===');
        console.error('Error details:', error)
        hideLoadingOverlay()
        setButtonLoading(submitBtn, false)
        showAlert("An error occurred. Please try again.", "error")
    })
}

function handleFormErrors(errors) {
    clearAllErrors();

    let parsedErrors;
    if (typeof errors === 'string') {
        try {
            parsedErrors = JSON.parse(errors);
        } catch (e) {
            console.error('Failed to parse errors JSON:', e);
            parsedErrors = {__all__: [errors]};
        }
    } else {
        parsedErrors = errors;
    }

    // Обработка общих ошибок формы
    if (parsedErrors.__all__) {
        const errorMessage = Array.isArray(parsedErrors.__all__)
            ? parsedErrors.__all__[0].message || parsedErrors.__all__[0]
            : parsedErrors.__all__;
        showAlert(errorMessage, "error");
    }

    // Обработка ошибок конкретных полей
    for (const fieldName in parsedErrors) {
        if (fieldName !== '__all__') {
            const inputElement = document.getElementById(`id_${fieldName}`);

            if (inputElement) {
                const errorMessage = Array.isArray(parsedErrors[fieldName])
                    ? parsedErrors[fieldName][0].message || parsedErrors[fieldName][0]
                    : parsedErrors[fieldName];
                showError(inputElement, errorMessage);
            } else {
                console.warn(`Input element not found for field: id_${fieldName}`);
            }
        }
    }
}

function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input.error').forEach(el => el.classList.remove('error'));
}

function setButtonLoading(button, isLoading) {
    const btnText = button.querySelector('.btn-text')
    const btnSpinner = button.querySelector('.btn-spinner')
    
    if (isLoading) {
        button.disabled = true
        btnText.classList.add('hidden')
        btnSpinner.classList.remove('hidden')
    } else {
        button.disabled = false
        btnText.classList.remove('hidden')
        btnSpinner.classList.add('hidden')
    }
}

// ===== LOADING OVERLAY =====
function showLoadingOverlay(message = "Loading...") {
    const overlay = document.getElementById("loadingOverlay")
    const messageElement = overlay.querySelector("p")
    
    if (overlay) {
        if (messageElement) {
            messageElement.textContent = message
        }
        overlay.classList.remove("hidden")
        document.body.style.overflow = "hidden"
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById("loadingOverlay")
    
    if (overlay) {
        overlay.classList.add("hidden")
        document.body.style.overflow = ""
    }
}

// ===== ALERT SYSTEM =====
function initializeAlerts() {
    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert')
    alerts.forEach(alert => {
        setTimeout(() => {
            hideAlert(alert)
        }, 5000)
        
        const closeBtn = alert.querySelector('.alert-close')
        if (closeBtn) {
            closeBtn.addEventListener('click', () => hideAlert(alert))
        }
    })
}

function showAlert(message, type = "info") {
    const alertContainer = document.getElementById("alertContainer")
    
    if (!alertContainer) return
    
    const alert = document.createElement("div")
    alert.className = `alert ${type}`
    alert.innerHTML = `
        <i class="fas ${getAlertIcon(type)}"></i>
        <span>${message}</span>
        <button class="alert-close">&times;</button>
    `
    
    alertContainer.appendChild(alert)
    
    // Add close functionality
    const closeBtn = alert.querySelector('.alert-close')
    closeBtn.addEventListener('click', () => hideAlert(alert))
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideAlert(alert)
    }, 5000)
}

function hideAlert(alert) {
    alert.style.animation = "slideOutRight 0.3s ease-in forwards"
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove()
        }
    }, 300)
}

function getAlertIcon(type) {
    switch (type) {
        case "success":
            return "fa-check-circle"
        case "error":
            return "fa-exclamation-circle"
        case "warning":
            return "fa-exclamation-triangle"
        default:
            return "fa-info-circle"
    }
}

// ===== RIPPLE EFFECT =====
function createRippleEffect(element, event) {
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
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `
    
    // Ensure element has position relative
    const computedStyle = window.getComputedStyle(element)
    if (computedStyle.position === "static") {
        element.style.position = "relative"
    }
    
    element.style.overflow = "hidden"
    element.appendChild(ripple)
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove()
        }
    }, 600)
}

// ===== UTILITY FUNCTIONS =====
function getCsrfToken() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')
    return csrfToken ? csrfToken.value : ''
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

// ===== KEYBOARD NAVIGATION =====
document.addEventListener("keydown", (e) => {
    // Enter key on Google button
    if (e.key === "Enter" && e.target.id === "googleSignupBtn") {
        e.preventDefault()
        handleGoogleSignup()
    }
    
    // Escape key to hide loading overlay
    if (e.key === "Escape") {
        hideLoadingOverlay()
    }
})

// ===== CSS ANIMATIONS =====
if (!document.querySelector("#login-animations")) {
    const style = document.createElement("style")
    style.id = "login-animations"
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
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
        
        .fade-in {
            animation: fadeIn 0.3s ease-out;
        }
    `
    document.head.appendChild(style)
}