// Booking Form JavaScript
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm")
  const steps = document.querySelectorAll(".form-step")
  const progressSteps = document.querySelectorAll(".progress-step")
  const nextBtn = document.getElementById("nextBtn")
  const prevBtn = document.getElementById("prevBtn")
  const submitBtn = document.getElementById("submitBtn")

  let currentStep = 1
  const totalSteps = steps.length

  // Set minimum date to today
  const dateInput = document.querySelector('input[name="appointmentDate"]')
  const today = new Date().toISOString().split("T")[0]
  dateInput.min = today

  // Service selection handler
  const serviceSelect = document.querySelector('select[name="service"]')
  serviceSelect.addEventListener("change", updateBookingSummary)

  // Payment method handlers
  const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]')
  paymentMethods.forEach((method) => {
    method.addEventListener("change", showPaymentInstructions)
  })

  // Navigation handlers
  nextBtn.addEventListener("click", nextStep)
  prevBtn.addEventListener("click", prevStep)
  form.addEventListener("submit", handleSubmit)

  function updateBookingSummary() {
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex]
    const serviceName = selectedOption.text.split(" - ")[0]
    const price = selectedOption.dataset.price
    const duration = selectedOption.dataset.duration

    document.getElementById("selectedService").textContent = serviceName || "Please select a service"
    document.getElementById("selectedDuration").textContent = duration ? `${duration} minutes` : "-"
    document.getElementById("selectedPrice").textContent = price ? `$${price}` : "$0"

    // Update final summary
    document.getElementById("finalService").textContent = serviceName || "-"
    document.getElementById("finalDuration").textContent = duration ? `${duration} minutes` : "-"
    document.getElementById("finalPrice").textContent = price ? `$${price}` : "$0"
  }

  function showPaymentInstructions() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked')
    const instructionsDiv = document.getElementById("paymentInstructions")
    const instructionText = document.getElementById("instructionText")

    if (!selectedMethod) {
      instructionsDiv.style.display = "none"
      return
    }

    const instructions = {
      "apple-pay": "You will be redirected to Apple Pay to complete your payment securely using Touch ID or Face ID.",
      paypal: "You will be redirected to PayPal to log in and complete your payment.",
      venmo: "Please send payment to @ZenTouchMassage on Venmo with your booking reference number.",
      zelle: "Please send payment to info@zentouch.com via Zelle with your booking reference number.",
      cashapp: "Please send payment to $ZenTouchMassage on Cash App with your booking reference number.",
      cash: "You can pay with cash or card when you arrive for your appointment. Please bring exact change if paying with cash.",
    }

    instructionText.textContent = instructions[selectedMethod.value]
    instructionsDiv.style.display = "block"
  }

  function nextStep() {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        currentStep++
        showStep(currentStep)
        updateFinalSummary()
      }
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--
      showStep(currentStep)
    }
  }

  function showStep(step) {
    // Hide all steps
    steps.forEach((s) => s.classList.remove("active"))
    progressSteps.forEach((s) => {
      s.classList.remove("active", "completed")
    })

    // Show current step
    document.querySelector(`[data-step="${step}"]`).classList.add("active")

    // Update progress
    for (let i = 1; i <= totalSteps; i++) {
      const progressStep = document.querySelector(`.progress-step[data-step="${i}"]`)
      if (i < step) {
        progressStep.classList.add("completed")
      } else if (i === step) {
        progressStep.classList.add("active")
      }
    }

    // Update navigation buttons
    prevBtn.style.display = step > 1 ? "inline-block" : "none"

    if (step === totalSteps) {
      nextBtn.style.display = "none"
      submitBtn.style.display = "none"
    } else if (step === totalSteps - 1) {
      nextBtn.style.display = "none"
      submitBtn.style.display = "inline-block"
    } else {
      nextBtn.style.display = "inline-block"
      submitBtn.style.display = "none"
    }
  }

  function validateCurrentStep() {
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`)
    const requiredFields = currentStepElement.querySelectorAll("[required]")
    let isValid = true

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        field.classList.add("is-invalid")
        isValid = false
      } else {
        field.classList.remove("is-invalid")
      }
    })

    // Special validation for email
    const emailField = currentStepElement.querySelector('input[type="email"]')
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(emailField.value)) {
        emailField.classList.add("is-invalid")
        isValid = false
      }
    }

    // Special validation for phone
    const phoneField = currentStepElement.querySelector('input[type="tel"]')
    if (phoneField && phoneField.value) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(phoneField.value.replace(/\D/g, ""))) {
        phoneField.classList.add("is-invalid")
        isValid = false
      }
    }

    if (!isValid) {
      // Show error message
      showNotification("Please fill in all required fields correctly.", "error")
    }

    return isValid
  }

  function updateFinalSummary() {
    // Update date and time
    const date = document.querySelector('input[name="appointmentDate"]').value
    const time = document.querySelector('select[name="appointmentTime"]').value
    const therapist = document.querySelector('select[name="therapist"]').value

    if (date && time) {
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      const formattedTime = new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      document.getElementById("finalDateTime").textContent = `${formattedDate} at ${formattedTime}`
    }

    // Update therapist
    const therapistSelect = document.querySelector('select[name="therapist"]')
    const therapistName = therapistSelect.options[therapistSelect.selectedIndex].text.split(" - ")[0]
    document.getElementById("finalTherapist").textContent = therapistName || "No preference"
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!validateCurrentStep()) {
      return
    }

    // Show loading state
    submitBtn.classList.add("loading")
    submitBtn.disabled = true

    try {
      const formData = new FormData(form)

      // Add calculated fields
      const serviceSelect = document.querySelector('select[name="service"]')
      const selectedOption = serviceSelect.options[serviceSelect.selectedIndex]
      formData.append("totalAmount", selectedOption.dataset.price || "0")
      formData.append("duration", selectedOption.dataset.duration || "0")

      const response = await fetch("php/booking.php", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        // Update confirmation details
        document.getElementById("bookingReference").textContent = `#${result.data.bookingId}`
        document.getElementById("confirmService").textContent = document.getElementById("finalService").textContent
        document.getElementById("confirmDateTime").textContent = document.getElementById("finalDateTime").textContent
        document.getElementById("confirmTherapist").textContent = document.getElementById("finalTherapist").textContent
        document.getElementById("confirmPrice").textContent = document.getElementById("finalPrice").textContent

        // Move to confirmation step
        currentStep = totalSteps
        showStep(currentStep)

        // Show success notification
        showNotification("Booking confirmed successfully!", "success")
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error("Booking error:", error)
      showNotification(error.message || "Booking failed. Please try again.", "error")
    } finally {
      submitBtn.classList.remove("loading")
      submitBtn.disabled = false
    }
  }

  function showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `alert alert-${type === "error" ? "danger" : type === "success" ? "success" : "info"} alert-dismissible fade show position-fixed`
    notification.style.cssText = "top: 100px; right: 20px; z-index: 9999; min-width: 300px;"
    notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `

    document.body.appendChild(notification)

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 5000)
  }

  // Initialize form
  showStep(1)
  updateBookingSummary()

  console.log("[v0] Booking form initialized successfully")
})
