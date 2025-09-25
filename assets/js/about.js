// About page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "Lead Massage Therapist & Founder",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      specialties: ["Swedish Massage", "Deep Tissue", "Aromatherapy"],
      experience: "12 years",
      certification: "Licensed Massage Therapist (LMT)",
      bio: "Dr. Johnson founded ZenTouch with a vision to make professional massage therapy accessible to everyone. With over 12 years of experience, she specializes in therapeutic and relaxation techniques.",
      education: "Master's in Massage Therapy, Certified Aromatherapist",
      languages: ["English", "Spanish"],
      availability: "Monday - Friday",
      specialization: "Therapeutic massage and stress relief techniques",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Sports Massage Specialist",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      specialties: ["Sports Massage", "Deep Tissue", "Injury Recovery"],
      experience: "8 years",
      certification: "Certified Sports Massage Therapist",
      bio: "Michael specializes in sports massage and injury recovery. He has worked with professional athletes and helps clients improve performance and recover from injuries.",
      education: "Sports Medicine Degree, Advanced Sports Massage Certification",
      languages: ["English", "Mandarin"],
      availability: "Tuesday - Saturday",
      specialization: "Athletic performance and injury rehabilitation",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Prenatal & Wellness Specialist",
      image:
        "https://images.unsplash.com/photo-1594824804732-ca8db7536a9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      specialties: ["Prenatal Massage", "Swedish Massage", "Reflexology"],
      experience: "6 years",
      certification: "Prenatal Massage Certified",
      bio: "Emily is our prenatal massage specialist, providing safe and effective massage therapy for expecting mothers. She creates a nurturing environment for wellness.",
      education: "Prenatal Massage Certification, Reflexology Training",
      languages: ["English", "Spanish", "Portuguese"],
      availability: "Monday - Thursday",
      specialization: "Prenatal care and women's wellness",
    },
    {
      id: 4,
      name: "David Kim",
      role: "Hot Stone & Aromatherapy Expert",
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      specialties: ["Hot Stone Massage", "Aromatherapy", "Couples Massage"],
      experience: "10 years",
      certification: "Aromatherapy Certified Practitioner",
      bio: "David brings expertise in hot stone massage and aromatherapy. His holistic approach combines traditional techniques with modern wellness practices.",
      education: "Holistic Therapy Degree, Advanced Aromatherapy Certification",
      languages: ["English", "Korean"],
      availability: "Wednesday - Sunday",
      specialization: "Holistic wellness and relaxation therapy",
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Therapeutic Massage Specialist",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      specialties: ["Therapeutic Massage", "Pain Management", "Rehabilitation"],
      experience: "9 years",
      certification: "Licensed Therapeutic Massage Therapist",
      bio: "Lisa focuses on therapeutic massage for pain management and rehabilitation. She works closely with healthcare providers to support client recovery.",
      education: "Therapeutic Massage Degree, Pain Management Certification",
      languages: ["English", "French"],
      availability: "Monday - Friday",
      specialization: "Pain management and therapeutic rehabilitation",
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Relaxation & Wellness Therapist",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      specialties: ["Swedish Massage", "Relaxation Therapy", "Stress Relief"],
      experience: "7 years",
      certification: "Certified Relaxation Therapist",
      bio: "James specializes in relaxation techniques and stress relief. His gentle approach helps clients achieve deep relaxation and mental wellness.",
      education: "Massage Therapy Certification, Stress Management Training",
      languages: ["English"],
      availability: "Thursday - Monday",
      specialization: "Stress relief and relaxation therapy",
    },
  ]

  // Load team grid
  function loadTeamGrid() {
    const teamContainer = document.getElementById("teamGrid")
    if (!teamContainer) return

    teamContainer.innerHTML = teamMembers
      .map(
        (member, index) => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="team-card slide-up" style="animation-delay: ${index * 0.1}s" onclick="showTeamMember(${
                  member.id
                })">
                    <div class="team-image">
                        <img src="${member.image}" alt="${member.name}" class="img-fluid">
                        <div class="team-overlay">
                            <div class="team-overlay-content">
                                <h6>Click to learn more</h6>
                                <p>View full profile and specializations</p>
                            </div>
                        </div>
                    </div>
                    <div class="team-content">
                        <h5>${member.name}</h5>
                        <div class="team-role">${member.role}</div>
                        <p class="team-bio">${member.bio}</p>
                        <div class="team-specialties">
                            <h6>Specialties:</h6>
                            <div class="specialty-tags">
                                ${member.specialties
                                  .map((specialty) => `<span class="specialty-tag">${specialty}</span>`)
                                  .join("")}
                            </div>
                        </div>
                        <div class="team-experience">
                            <div class="experience-item">
                                <h6>${member.experience}</h6>
                                <span>Experience</span>
                            </div>
                            <div class="experience-item">
                                <h6>${member.certification.split(" ")[0]}</h6>
                                <span>Certified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }

  // Show team member details in modal
  window.showTeamMember = (memberId) => {
    const member = teamMembers.find((m) => m.id === memberId)
    if (!member) return

    const modal = document.getElementById("teamModal")
    const modalTitle = document.getElementById("teamModalTitle")
    const modalBody = document.getElementById("teamModalBody")

    modalTitle.textContent = member.name

    modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-4 text-center">
                    <img src="${member.image}" alt="${member.name}" class="team-modal-image">
                    <div class="team-modal-content">
                        <h4>${member.name}</h4>
                        <div class="team-modal-role">${member.role}</div>
                    </div>
                </div>
                <div class="col-md-8">
                    <p class="team-modal-bio">${member.bio}</p>
                    
                    <div class="team-modal-details">
                        <div class="detail-item">
                            <div class="detail-label">Experience</div>
                            <div class="detail-value">${member.experience}</div>
                        </div>
                        
                        <div class="detail-item">
                            <div class="detail-label">Certification</div>
                            <div class="detail-value">${member.certification}</div>
                        </div>
                        
                        <div class="detail-item">
                            <div class="detail-label">Education</div>
                            <div class="detail-value">${member.education}</div>
                        </div>
                        
                        <div class="detail-item">
                            <div class="detail-label">Specialization</div>
                            <div class="detail-value">${member.specialization}</div>
                        </div>
                        
                        <div class="detail-item">
                            <div class="detail-label">Languages</div>
                            <div class="detail-value">${member.languages.join(", ")}</div>
                        </div>
                        
                        <div class="detail-item">
                            <div class="detail-label">Availability</div>
                            <div class="detail-value">${member.availability}</div>
                        </div>
                        
                        <div class="detail-item">
                            <div class="detail-label">Specialties</div>
                            <div class="detail-value">
                                <div class="specialty-tags mt-2">
                                    ${member.specialties
                                      .map((specialty) => `<span class="specialty-tag">${specialty}</span>`)
                                      .join("")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `

    const bootstrapModal = new window.bootstrap.Modal(modal)
    bootstrapModal.show()
  }

  // Initialize page
  loadTeamGrid()

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

  // Observe elements for animation
  document
    .querySelectorAll(".value-card, .certification-card, .award-card, .story-content, .story-image")
    .forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      observer.observe(el)
    })

  // Add staggered animation for story stats
  const statItems = document.querySelectorAll(".story-stats .stat-item")
  statItems.forEach((item, index) => {
    item.style.opacity = "0"
    item.style.transform = "translateY(20px)"
    item.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    item.style.transitionDelay = `${index * 0.2}s`

    observer.observe(item)
  })

  // Counter animation for stats
  function animateCounters() {
    const counters = document.querySelectorAll(".stat-item h3")
    counters.forEach((counter) => {
      const target = Number.parseInt(counter.textContent.replace(/\D/g, ""))
      const suffix = counter.textContent.replace(/\d/g, "")
      let current = 0
      const increment = target / 50
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          counter.textContent = target + suffix
          clearInterval(timer)
        } else {
          counter.textContent = Math.floor(current) + suffix
        }
      }, 30)
    })
  }

  // Trigger counter animation when stats section is visible
  const statsSection = document.querySelector(".story-stats")
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters()
            statsObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 },
    )
    statsObserver.observe(statsSection)
  }
})
