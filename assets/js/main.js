// Main JavaScript for ZenTouch Website

document.addEventListener("DOMContentLoaded", () => {
  // Navigation scroll effect
  const navbar = document.getElementById("mainNav")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Services data
  const services = [
    {
      id: 1,
      name: "Swedish Massage",
      price: "$80",
      duration: "60 min",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Relaxing full-body massage with gentle pressure techniques for ultimate stress relief.",
    },
    {
      id: 2,
      name: "Deep Tissue Massage",
      price: "$95",
      duration: "60 min",
      image:
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Therapeutic massage targeting deep muscle layers to relieve chronic tension and pain.",
    },
    {
      id: 3,
      name: "Aromatherapy Massage",
      price: "$90",
      duration: "75 min",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Relaxing massage enhanced with premium essential oils for mind and body wellness.",
    },
    {
      id: 4,
      name: "Hot Stone Massage",
      price: "$110",
      duration: "90 min",
      image:
        "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Therapeutic massage using heated stones for deep muscle relaxation and circulation.",
    },
    {
      id: 5,
      name: "Couples Massage",
      price: "$180",
      duration: "60 min",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Romantic massage experience for two in a beautifully prepared environment.",
    },
    {
      id: 6,
      name: "Prenatal Massage",
      price: "$85",
      duration: "60 min",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Gentle, safe massage specially designed for expecting mothers' comfort and wellness.",
    },
  ]

  // Load services preview
  function loadServicesPreview() {
    const servicesContainer = document.getElementById("servicesPreview")
    if (!servicesContainer) return

    // Show first 6 services
    const previewServices = services.slice(0, 6)

    servicesContainer.innerHTML = previewServices
      .map(
        (service) => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="service-card">
                    <div class="service-image">
                        <img src="${service.image}" alt="${service.name}" class="img-fluid">
                        <div class="service-price">${service.price}</div>
                    </div>
                    <div class="service-content">
                        <h5>${service.name}</h5>
                        <div class="service-duration">
                            <i class="fas fa-clock me-1"></i>${service.duration}
                        </div>
                        <p>${service.description}</p>
                        <a href="booking.html" class="btn btn-primary w-100">Book This Service</a>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
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

  // Initialize animations on scroll
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    }, observerOptions)

    // Observe elements for animation
    document.querySelectorAll(".feature-card, .service-card, .testimonial-card").forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      observer.observe(el)
    })
  }

  // Initialize everything
  loadServicesPreview()
  initScrollAnimations()

  // Auto-advance testimonial carousel
  const testimonialCarousel = document.getElementById("testimonialCarousel")
  if (testimonialCarousel) {
    const bootstrap = window.bootstrap // Declare bootstrap variable
    const carousel = new bootstrap.Carousel(testimonialCarousel, {
      interval: 5000,
      wrap: true,
    })
  }

  // Add loading animation
  window.addEventListener("load", () => {
    document.body.classList.add("loaded")
  })
})

// Utility functions
function formatPhoneNumber(phone) {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Export for use in other files
window.ZenTouch = {
  services: window.services, // Declare services variable
  formatPhoneNumber: formatPhoneNumber,
  validateEmail: validateEmail,
}
