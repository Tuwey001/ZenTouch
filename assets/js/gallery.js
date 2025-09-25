// Gallery page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Gallery images data
  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Swedish Massage Session",
      category: "swedish",
      description: "Relaxing full-body massage with gentle pressure techniques for ultimate stress relief",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Deep Tissue Therapy",
      category: "deep-tissue",
      description: "Therapeutic massage targeting deep muscle layers to relieve chronic tension",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1571019613454-1cb289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Aromatherapy Experience",
      category: "aromatherapy",
      description: "Essential oils enhance the massage experience for mind and body wellness",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Hot Stone Treatment",
      category: "hot-stone",
      description: "Heated stones provide deep muscle relaxation and improved circulation",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-15597571485c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Couples Massage",
      category: "couples",
      description: "Romantic massage experience for two in a beautifully prepared environment",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1540555700478-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Prenatal Care",
      category: "prenatal",
      description: "Gentle, safe massage specially designed for expecting mothers",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Sports Massage",
      category: "deep-tissue",
      description: "Performance-focused therapeutic treatment for athletes and active individuals",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1512290923902-e120087004b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Reflexology Session",
      category: "aromatherapy",
      description: "Pressure point therapy for feet and hands promoting overall wellness",
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Professional Setup",
      category: "setup",
      description: "Professional equipment setup at your location for optimal comfort",
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Relaxation Environment",
      category: "setup",
      description: "Creating the perfect atmosphere for relaxation and healing",
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1591343395082-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Essential Oils Collection",
      category: "aromatherapy",
      description: "Premium essential oils for therapeutic benefits and aromatherapy",
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-154436756704732-ca8db7536a9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Therapeutic Massage",
      category: "swedish",
      description: "Professional therapeutic massage techniques for healing and relaxation",
    },
    {
      id: 13,
      src: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Hot Stone Preparation",
      category: "hot-stone",
      description: "Careful preparation of heated stones for therapeutic treatment",
    },
    {
      id: 14,
      src: "https://images.unsplash.com/photo-1594824804732-ca8db7536a9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Prenatal Comfort",
      category: "prenatal",
      description: "Specialized positioning and techniques for expecting mothers' comfort",
    },
    {
      id: 15,
      src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Couples Relaxation",
      category: "couples",
      description: "Shared relaxation experience strengthening bonds and reducing stress",
    },
  ]

  let currentLightboxIndex = 0
  let filteredImages = [...galleryImages]

  // Load gallery grid
  function loadGallery() {
    const galleryContainer = document.getElementById("galleryGrid")
    if (!galleryContainer) return

    galleryContainer.innerHTML = galleryImages
      .map(
        (image, index) => `
            <div class="col-lg-4 col-md-6 gallery-item fade-in" data-category="${image.category}" data-index="${index}">
                <div class="gallery-image-container" onclick="openLightbox(${index})">
                    <img src="${image.src}" alt="${image.title}" class="gallery-image">
                    <div class="gallery-category">${getCategoryName(image.category)}</div>
                    <div class="gallery-overlay">
                        <div class="gallery-info">
                            <h5>${image.title}</h5>
                            <p>${image.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")

    // Add staggered animation
    const galleryItems = document.querySelectorAll(".gallery-item")
    galleryItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`
    })
  }

  // Get category display name
  function getCategoryName(category) {
    const categoryNames = {
      swedish: "Swedish",
      "deep-tissue": "Deep Tissue",
      aromatherapy: "Aromatherapy",
      "hot-stone": "Hot Stone",
      couples: "Couples",
      prenatal: "Prenatal",
      setup: "Setup",
    }
    return categoryNames[category] || category
  }

  // Filter functionality
  function initializeFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn")

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Update active button
        filterButtons.forEach((btn) => btn.classList.remove("active"))
        button.classList.add("active")

        // Filter images
        const filterValue = button.getAttribute("data-filter")
        filterGallery(filterValue)
      })
    })
  }

  // Filter gallery images
  function filterGallery(category) {
    const galleryItems = document.querySelectorAll(".gallery-item")

    galleryItems.forEach((item, index) => {
      const itemCategory = item.getAttribute("data-category")

      if (category === "all" || itemCategory === category) {
        item.classList.remove("hidden")
        item.style.animationDelay = `${index * 0.05}s`
      } else {
        item.classList.add("hidden")
      }
    })

    // Update filtered images for lightbox
    if (category === "all") {
      filteredImages = [...galleryImages]
    } else {
      filteredImages = galleryImages.filter((img) => img.category === category)
    }
  }

  // Lightbox functionality
  function openLightbox(index) {
    currentLightboxIndex = index
    const image = galleryImages[index]
    const modal = document.getElementById("lightboxModal")
    const lightboxImage = document.getElementById("lightboxImage")
    const lightboxTitle = document.getElementById("lightboxTitle")
    const lightboxDescription = document.getElementById("lightboxDescription")
    const lightboxCategory = document.getElementById("lightboxCategory")

    lightboxImage.src = image.src
    lightboxImage.alt = image.title
    lightboxTitle.textContent = image.title
    lightboxDescription.textContent = image.description
    lightboxCategory.textContent = getCategoryName(image.category)

    modal.classList.add("active")
    document.body.style.overflow = "hidden"

    // Add zoom animation
    const lightboxContent = document.querySelector(".lightbox-content")
    lightboxContent.classList.add("zoom-in")
  }

  function closeLightbox() {
    const modal = document.getElementById("lightboxModal")
    modal.classList.remove("active")
    document.body.style.overflow = "auto"
  }

  function navigateLightbox(direction) {
    if (direction === "next") {
      currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length
    } else {
      currentLightboxIndex = currentLightboxIndex === 0 ? galleryImages.length - 1 : currentLightboxIndex - 1
    }

    const image = galleryImages[currentLightboxIndex]
    const lightboxImage = document.getElementById("lightboxImage")
    const lightboxTitle = document.getElementById("lightboxTitle")
    const lightboxDescription = document.getElementById("lightboxDescription")
    const lightboxCategory = document.getElementById("lightboxCategory")

    lightboxImage.src = image.src
    lightboxImage.alt = image.title
    lightboxTitle.textContent = image.title
    lightboxDescription.textContent = image.description
    lightboxCategory.textContent = getCategoryName(image.category)
  }

  // Keyboard navigation for lightbox
  document.addEventListener("keydown", (e) => {
    const modal = document.getElementById("lightboxModal")
    if (!modal.classList.contains("active")) return

    switch (e.key) {
      case "Escape":
        closeLightbox()
        break
      case "ArrowLeft":
        navigateLightbox("prev")
        break
      case "ArrowRight":
        navigateLightbox("next")
        break
    }
  })

  // Lazy loading for images
  function initializeLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove("lazy")
          observer.unobserve(img)
        }
      })
    })

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img)
    })
  }

  // Initialize everything
  loadGallery()
  initializeFilters()
  initializeLazyLoading()

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

  // Observe transformation cards
  document.querySelectorAll(".transformation-card").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
})
