document.addEventListener("DOMContentLoaded", () => {
  console.log("Scroll animations loaded")

  // Add animation classes to elements
  addAnimationClasses()

  // Initialize animations
  initializeAnimations()

  // Run animations on scroll
  window.addEventListener("scroll", () => {
    animateOnScroll()
  })

  // Run initial animations
  setTimeout(() => {
    animateOnScroll()
  }, 100)
})

// Function to add animation classes to elements
function addAnimationClasses() {
  // Section headers
  document.querySelectorAll(".section-header").forEach((header) => {
    header.classList.add("animate")
  })

  // About content
  const aboutContent = document.querySelector(".about-content")
  if (aboutContent) {
    const aboutText = aboutContent.querySelector(".about-text")
    const aboutImage = aboutContent.querySelector(".about-image")

    if (aboutText) aboutText.classList.add("slide-right")
    if (aboutImage) aboutImage.classList.add("slide-left")
  }

  // Services grid
  const servicesGrid = document.querySelector(".services-grid")
  if (servicesGrid) {
    servicesGrid.classList.add("stagger-container")
    servicesGrid.querySelectorAll(".service-card").forEach((card, index) => {
      card.classList.add("stagger-item")
      card.classList.add(`delay-${((index % 5) + 1) * 100}`)
    })
  }

  // Services grid full
  const servicesGridFull = document.querySelector(".services-grid-full")
  if (servicesGridFull) {
    const columns = servicesGridFull.querySelectorAll(".services-column")
    columns.forEach((column, colIndex) => {
      column.querySelectorAll(".service-item").forEach((item, itemIndex) => {
        item.classList.add("slide-up")
        item.style.transitionDelay = `${(colIndex * 3 + itemIndex) * 0.1}s`
      })
    })
  }

  // Destinations grid
  const destinationsGrid = document.querySelector(".destinations-grid")
  if (destinationsGrid) {
    destinationsGrid.classList.add("stagger-container")
    destinationsGrid.querySelectorAll(".destination-card").forEach((card, index) => {
      card.classList.add("stagger-item")
      card.classList.add(`delay-${((index % 5) + 1) * 100}`)
    })
  }

  // Info cards
  const infoCards = document.querySelector(".info-cards")
  if (infoCards) {
    infoCards.classList.add("stagger-container")
    infoCards.querySelectorAll(".info-card").forEach((card, index) => {
      card.classList.add("stagger-item")
      card.classList.add(`delay-${((index % 5) + 1) * 100}`)
    })
  }

  // Attraction items
  document.querySelectorAll(".attraction-item").forEach((item, index) => {
    if (index % 2 === 0) {
      item.classList.add("slide-right")
    } else {
      item.classList.add("slide-left")
    }
  })

  // Mission & Vision
  const missionVisionContent = document.querySelector(".mission-vision-content")
  if (missionVisionContent) {
    const missionBox = missionVisionContent.querySelector(".mission-box")
    const visionBox = missionVisionContent.querySelector(".vision-box")

    if (missionBox) missionBox.classList.add("slide-right")
    if (visionBox) visionBox.classList.add("slide-left")
  }

  // Values grid
  const valuesGrid = document.querySelector(".values-grid")
  if (valuesGrid) {
    valuesGrid.classList.add("stagger-container")
    valuesGrid.querySelectorAll(".value-card").forEach((card, index) => {
      card.classList.add("stagger-item")
      card.classList.add(`delay-${((index % 5) + 1) * 100}`)
    })
  }

  // Certifications
  const certGrid = document.querySelector(".cert-grid")
  if (certGrid) {
    certGrid.classList.add("stagger-container")
    certGrid.querySelectorAll(".cert-item").forEach((item, index) => {
      item.classList.add("stagger-item")
      item.classList.add(`delay-${((index % 5) + 1) * 100}`)
    })
  }

  // FAQ items
  const faqContainer = document.querySelector(".faq-container")
  if (faqContainer) {
    faqContainer.classList.add("stagger-container")
    faqContainer.querySelectorAll(".faq-item").forEach((item, index) => {
      item.classList.add("stagger-item")
      item.classList.add(`delay-${((index % 5) + 1) * 100}`)
    })
  }

  // Contact form and image
  const contactContent = document.querySelector(".contact-content")
  if (contactContent) {
    const formContainer = contactContent.querySelector(".form-container")
    const contactImage = contactContent.querySelector(".contact-image")

    if (formContainer) formContainer.classList.add("slide-right")
    if (contactImage) contactImage.classList.add("slide-left")
  }

  // Map container
  const mapContainer = document.querySelector(".map-container")
  if (mapContainer) {
    mapContainer.classList.add("scale-in")
  }

  // CTA sections
  document.querySelectorAll(".cta-section, .cta-section-new").forEach((cta) => {
    cta.classList.add("animate")
  })

  // Footer
  const footer = document.querySelector("footer")
  if (footer) {
    footer.classList.add("animate")

    // Footer content sections
    const footerSections = footer.querySelectorAll(".footer-logo, .footer-links, .footer-contact, .footer-social")
    footerSections.forEach((section, index) => {
      section.classList.add("slide-up")
      section.style.transitionDelay = `${index * 0.1}s`
    })
  }

  // Error page elements
  const errorContent = document.querySelector(".error-content")
  if (errorContent) {
    errorContent.classList.add("animate")

    const errorIcon = errorContent.querySelector(".error-icon")
    if (errorIcon) errorIcon.classList.add("scale-in")

    const errorHeading = errorContent.querySelector("h2")
    if (errorHeading) errorHeading.classList.add("slide-up")

    const errorParagraphs = errorContent.querySelectorAll("p")
    errorParagraphs.forEach((p, index) => {
      p.classList.add("slide-up")
      p.classList.add(`delay-${(index + 1) * 100}`)
    })

    const errorContactInfo = errorContent.querySelector(".error-contact-info")
    if (errorContactInfo) {
      errorContactInfo.classList.add("slide-up")
      errorContactInfo.classList.add("delay-300")
    }

    const errorActions = errorContent.querySelector(".error-actions")
    if (errorActions) {
      errorActions.classList.add("slide-up")
      errorActions.classList.add("delay-400")
    }
  }
}

// Function to initialize animations
function initializeAnimations() {
  // Animate hero content immediately
  const heroContent = document.querySelector(".hero-content")
  if (heroContent) {
    heroContent.classList.add("active")
  }

  // Animate banner content immediately
  const bannerContent = document.querySelector(".banner-content")
  if (bannerContent) {
    bannerContent.classList.add("active")
  }
}

// Function to animate elements on scroll
function animateOnScroll() {
  const windowHeight = window.innerHeight
  const scrollY = window.scrollY

  // Animate regular elements
  document
    .querySelectorAll(".animate, .fade-in, .slide-up, .slide-left, .slide-right, .scale-in")
    .forEach((element) => {
      const elementTop = element.getBoundingClientRect().top + scrollY
      const elementVisible = 150 // Adjust this value to change when the element becomes visible

      if (scrollY + windowHeight > elementTop + elementVisible) {
        element.classList.add("active")
      }
    })

  // Animate staggered elements
  document.querySelectorAll(".stagger-container").forEach((container) => {
    const containerTop = container.getBoundingClientRect().top + scrollY
    const containerVisible = 150

    if (scrollY + windowHeight > containerTop + containerVisible) {
      const items = container.querySelectorAll(".stagger-item")
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add("active")
        }, 100 * index) // Stagger the animations
      })
    }
  })

  // Animate CTA sections
  document.querySelectorAll(".cta-section, .cta-section-new").forEach((cta) => {
    const ctaTop = cta.getBoundingClientRect().top + scrollY
    const ctaVisible = 150

    if (scrollY + windowHeight > ctaTop + ctaVisible) {
      cta.classList.add("active")
    }
  })

  // Animate footer
  const footer = document.querySelector("footer")
  if (footer) {
    const footerTop = footer.getBoundingClientRect().top + scrollY
    const footerVisible = 150

    if (scrollY + windowHeight > footerTop + footerVisible) {
      footer.classList.add("active")
    }
  }
}
