// Services page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Extended services data with detailed information
  const services = [
    {
      id: 1,
      name: "Swedish Massage",
      price: 80,
      duration: "60 min",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description:
        "A gentle, relaxing massage that uses long strokes, kneading, and circular movements on superficial layers of muscle.",
      benefits: ["Stress relief", "Improved circulation", "Muscle relaxation", "Better sleep"],
      popular: true,
      details: {
        technique: "Long, flowing strokes with gentle to moderate pressure",
        bestFor: "First-time massage clients, stress relief, general relaxation",
        preparation: "Arrive hydrated and avoid heavy meals 2 hours before",
        aftercare: "Drink plenty of water and rest for optimal benefits",
      },
    },
    {
      id: 2,
      name: "Deep Tissue Massage",
      price: 95,
      duration: "60 min",
      image:
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Targets deeper layers of muscle and connective tissue to release chronic muscle tension and knots.",
      benefits: ["Pain relief", "Injury recovery", "Improved mobility", "Tension release"],
      popular: false,
      details: {
        technique: "Slow, deep strokes with firm pressure targeting muscle knots",
        bestFor: "Chronic pain, muscle tension, injury recovery, athletes",
        preparation: "Communicate pain levels and problem areas to therapist",
        aftercare: "Apply ice to sore areas and stay hydrated",
      },
    },
    {
      id: 3,
      name: "Aromatherapy Massage",
      price: 90,
      duration: "75 min",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description:
        "Combines gentle massage with essential oils to enhance relaxation and promote emotional well-being.",
      benefits: ["Stress reduction", "Mood enhancement", "Aromatherapy benefits", "Deep relaxation"],
      popular: true,
      details: {
        technique: "Gentle Swedish massage enhanced with therapeutic essential oils",
        bestFor: "Stress relief, anxiety, mood enhancement, holistic wellness",
        preparation: "Inform therapist of any allergies to essential oils",
        aftercare: "Avoid showering for 2-3 hours to maximize oil benefits",
      },
    },
    {
      id: 4,
      name: "Hot Stone Massage",
      price: 110,
      duration: "90 min",
      image:
        "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Uses heated stones placed on specific points of the body to warm and loosen tight muscles.",
      benefits: ["Deep muscle relaxation", "Improved circulation", "Pain relief", "Stress reduction"],
      popular: false,
      details: {
        technique: "Heated basalt stones combined with traditional massage techniques",
        bestFor: "Muscle tension, poor circulation, stress relief, winter wellness",
        preparation: "Inform therapist of heat sensitivity or medical conditions",
        aftercare: "Stay hydrated and avoid extreme temperatures for 24 hours",
      },
    },
    {
      id: 5,
      name: "Couples Massage",
      price: 180,
      duration: "60 min",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "A romantic massage experience for two people in the same room with two therapists.",
      benefits: ["Shared relaxation", "Bonding experience", "Stress relief for two", "Romantic atmosphere"],
      popular: true,
      details: {
        technique: "Customized massage for each person with synchronized timing",
        bestFor: "Couples, anniversaries, special occasions, bonding",
        preparation: "Ensure adequate space for two massage tables",
        aftercare: "Enjoy quiet time together to extend the relaxation",
      },
    },
    {
      id: 6,
      name: "Prenatal Massage",
      price: 85,
      duration: "60 min",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Specially designed for expecting mothers to reduce pregnancy discomfort and promote relaxation.",
      benefits: ["Reduced swelling", "Better sleep", "Pain relief", "Stress reduction"],
      popular: false,
      details: {
        technique: "Gentle, side-lying positions with pregnancy-safe techniques",
        bestFor: "Pregnant women after first trimester, pregnancy discomfort",
        preparation: "Discuss training schedule and problem areas with therapist",
        aftercare: "Light stretching and gradual return to activity",
      },
    },
    {
      id: 7,
      name: "Sports Massage",
      price: 100,
      duration: "60 min",
      image:
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Designed for athletes and active individuals to prevent injuries and enhance performance.",
      benefits: ["Injury prevention", "Enhanced performance", "Faster recovery", "Flexibility improvement"],
      popular: false,
      details: {
        technique: "Targeted techniques focusing on muscle groups used in specific sports",
        bestFor: "Athletes, active individuals, pre/post workout, injury prevention",
        preparation: "Discuss training schedule and problem areas with therapist",
        aftercare: "Light stretching and gradual return to activity",
      },
    },
    {
      id: 8,
      name: "Reflexology",
      price: 75,
      duration: "45 min",
      image:
        "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Focuses on pressure points in the feet, hands, and ears that correspond to different body organs.",
      benefits: ["Improved circulation", "Stress relief", "Better sleep", "Pain reduction"],
      popular: false,
      details: {
        technique: "Targeted pressure point therapy on feet, hands, and ears",
        bestFor: "Stress relief, circulation issues, holistic wellness, relaxation",
        preparation: "Ensure feet are clean and inform of any foot conditions",
        aftercare: "Drink water and rest to allow body to process the treatment",
      },
    },
  ]

  // Load services grid
  function loadServicesGrid() {
    const servicesContainer = document.getElementById("servicesGrid")
    if (!servicesContainer) return

    servicesContainer.innerHTML = services
      .map(
        (service) => `
            <div class="col-lg-6 mb-4">
                <div class="service-detail-card" data-service-id="${service.id}">
                    <div class="row g-0">
                        <div class="col-md-5">
                            <div class="service-image-container">
                                <img src="${service.image}" alt="${service.name}" class="service-image">
                                ${
                                  service.popular
                                    ? '<div class="popular-badge"><i class="fas fa-star"></i> Popular</div>'
                                    : ""
                                }
                                <div class="service-price-badge">$${service.price}</div>
                            </div>
                        </div>
                        <div class="col-md-7">
                            <div class="service-content">
                                <div class="service-header">
                                    <h4>${service.name}</h4>
                                    <div class="service-duration">
                                        <i class="fas fa-clock me-1"></i>${service.duration}
                                    </div>
                                </div>
                                <p class="service-description">${service.description}</p>
                                <div class="service-benefits">
                                    <h6>Benefits:</h6>
                                    <div class="benefits-tags">
                                        ${service.benefits
                                          .map((benefit) => `<span class="benefit-tag">${benefit}</span>`)
                                          .join("")}
                                    </div>
                                </div>
                                <div class="service-actions">
                                    <a href="booking.html?service=${service.id}" class="btn btn-primary">Book Now</a>
                                    <button class="btn btn-outline-primary" onclick="showServiceDetails(${service.id})">
                                        More Info
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }

  // Show service details in modal
  window.showServiceDetails = (serviceId) => {
    const service = services.find((s) => s.id === serviceId)
    if (!service) return

    const modal = document.getElementById("serviceModal")
    const modalTitle = document.getElementById("serviceModalTitle")
    const modalBody = document.getElementById("serviceModalBody")

    modalTitle.textContent = service.name

    modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${service.image}" alt="${service.name}" class="img-fluid rounded mb-3">
                    <div class="service-pricing">
                        <h5>Pricing</h5>
                        <div class="price-info">
                            <span class="price">$${service.price}</span>
                            <span class="duration">${service.duration}</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <h5>About This Service</h5>
                    <p>${service.description}</p>
                    
                    <h6>Benefits</h6>
                    <ul>
                        ${service.benefits.map((benefit) => `<li>${benefit}</li>`).join("")}
                    </ul>
                    
                    <h6>Technique</h6>
                    <p>${service.details.technique}</p>
                    
                    <h6>Best For</h6>
                    <p>${service.details.bestFor}</p>
                    
                    <h6>Preparation</h6>
                    <p>${service.details.preparation}</p>
                    
                    <h6>Aftercare</h6>
                    <p>${service.details.aftercare}</p>
                </div>
            </div>
        `

    const bootstrapModal = new window.bootstrap.Modal(modal)
    bootstrapModal.show()
  }

  // Initialize page
  loadServicesGrid()

  // Add scroll animations
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

  // Observe service cards for animation
  document.querySelectorAll(".service-detail-card, .addon-card, .pricing-card").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
})
