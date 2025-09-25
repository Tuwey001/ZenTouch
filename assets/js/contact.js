// Contact page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm")
  const submitBtn = document.getElementById("submitBtn")
  const formMessages = document.getElementById("formMessages")

  // Form validation rules
  const validationRules = {
    firstName: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s]+$/,
      message: "First name must be at least 2 characters and contain only letters",
    },
    lastName: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s]+$/,
      message: "Last name must be at least 2 characters and contain only letters",
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
    phone: {
      required: false,
      pattern: /^[+]?[1-9][\d]{0,15}$/,
      message: "Please enter a valid phone number",
    },
    subject: {
      required: true,
      message: "Please select a subject",
    },
    message: {
      required: true,
      minLength: 10,
      message: "Message must be at least 10 characters long",
    },
    privacy: {
      required: true,
      message: "You must agree to the privacy policy",
    },
  }

  // Initialize form validation
  function initializeValidation() {
    Object.keys(validationRules).forEach((fieldName) => {
      const field = document.getElementById(fieldName)
      if (field) {
        field.addEventListener("blur", () => validateField(fieldName))
        field.addEventListener("input", () => clearFieldError(fieldName))
      }
    })
  }

  // Validate individual field
  function validateField(fieldName) {
    const field = document.getElementById(fieldName)
    const rule = validationRules[fieldName]
    let isValid = true
    let errorMessage = ""

    if (!field) return true

    const value = field.type === "checkbox" ? field.checked : field.value.trim()

    // Required validation
    if (rule.required && (!value || value === "")) {
      isValid = false
      errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
    }

    // Pattern validation
    if (isValid && rule.pattern && value && !rule.pattern.test(value)) {
      isValid = false
      errorMessage = rule.message
    }

    // Min length validation
    if (isValid && rule.minLength && value && value.length < rule.minLength) {
      isValid = false
      errorMessage = rule.message
    }

    // Update field appearance
    if (isValid) {
      field.classList.remove("is-invalid")
      field.classList.add("is-valid")
      removeFieldError(fieldName)
    } else {
      field.classList.remove("is-valid")
      field.classList.add("is-invalid")
      showFieldError(fieldName, errorMessage)
    }

    return isValid
  }

  // Show field error
  function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName)
    const existingError = field.parentNode.querySelector(".invalid-feedback")

    if (existingError) {
      existingError.textContent = message
    } else {
      const errorDiv = document.createElement("div")
      errorDiv.className = "invalid-feedback"
      errorDiv.textContent = message
      field.parentNode.appendChild(errorDiv)
    }
  }

  // Remove field error
  function removeFieldError(fieldName) {
    const field = document.getElementById(fieldName)
    const errorDiv = field.parentNode.querySelector(".invalid-feedback")
    if (errorDiv) {
      errorDiv.remove()
    }
  }

  // Clear field error on input
  function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName)
    if (field.classList.contains("is-invalid")) {
      field.classList.remove("is-invalid")
      removeFieldError(fieldName)
    }
  }

  // Validate entire form
  function validateForm() {
    let isFormValid = true

    Object.keys(validationRules).forEach((fieldName) => {
      const isFieldValid = validateField(fieldName)
      if (!isFieldValid) {
        isFormValid = false
      }
    })

    return isFormValid
  }

  // Show form message
  function showFormMessage(message, type) {
    formMessages.className = type
    formMessages.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"} me-2"></i>
                <span>${message}</span>
            </div>
        `
    formMessages.style.display = "block"

    // Auto-hide success messages
    if (type === "success") {
      setTimeout(() => {
        formMessages.style.display = "none"
      }, 5000)
    }
  }

  // Set loading state
  function setLoadingState(loading) {
    const btnText = submitBtn.querySelector(".btn-text")
    const btnLoading = submitBtn.querySelector(".btn-loading")

    if (loading) {
      btnText.classList.add("d-none")
      btnLoading.classList.remove("d-none")
      submitBtn.disabled = true
      contactForm.classList.add("form-loading")
    } else {
      btnText.classList.remove("d-none")
      btnLoading.classList.add("d-none")
      submitBtn.disabled = false
      contactForm.classList.remove("form-loading")
    }
  }

  // Handle form submission
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      showFormMessage("Please correct the errors below and try again.", "error")
      return
    }

    // Set loading state
    setLoadingState(true)

    try {
      // Prepare form data
      const formData = new FormData(contactForm)

      // Submit form
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        showFormMessage("Thank you for your message! We'll get back to you within 24 hours.", "success")
        contactForm.reset()
        // Clear validation classes
        contactForm.querySelectorAll(".form-control").forEach((field) => {
          field.classList.remove("is-valid", "is-invalid")
        })
      } else {
        throw new Error(result.message || "Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      showFormMessage(
        error.message || "Sorry, there was an error sending your message. Please try again or call us directly.",
        "error",
      )
    } finally {
      setLoadingState(false)
    }
  })

  // Phone number formatting
  const phoneField = document.getElementById("phone")
  if (phoneField) {
    phoneField.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
      } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{0,3})/, "($1) $2")
      }
      e.target.value = value
    })
  }

  // Initialize everything
  initializeValidation()

  // Add scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains("contact-info-card")) {
          entry.target.classList.add("slide-in-left")
        } else if (entry.target.classList.contains("contact-form-card")) {
          entry.target.classList.add("slide-in-right")
        }
      }
    })
  }, observerOptions)

  // Observe contact cards
  document.querySelectorAll(".contact-info-card, .contact-form-card").forEach((el) => {
    observer.observe(el)
  })

  // FAQ accordion enhancement
  const accordionButtons = document.querySelectorAll(".accordion-button")
  accordionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Add smooth scroll to clicked accordion item
      setTimeout(() => {
        button.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }, 300)
    })
  })
})
