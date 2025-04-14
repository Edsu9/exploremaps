<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", () => {
  // Create scroll indicator
  const scrollIndicator = document.createElement("div")
  scrollIndicator.className = "scroll-indicator"
  document.body.appendChild(scrollIndicator)

  // Create scroll to top button
  const scrollTopBtn = document.createElement("div")
  scrollTopBtn.className = "scroll-to-top"
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>'
  scrollTopBtn.setAttribute("aria-label", "Scroll to top")
  scrollTopBtn.setAttribute("role", "button")
  scrollTopBtn.setAttribute("tabindex", "0")
  document.body.appendChild(scrollTopBtn)

  // Update scroll indicator width based on scroll position
  window.addEventListener("scroll", () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const scrolled = (winScroll / height) * 100
    scrollIndicator.style.width = scrolled + "%"

    // Show/hide scroll to top button
    if (winScroll > 300) {
      scrollTopBtn.classList.add("visible")
    } else {
      scrollTopBtn.classList.remove("visible")
    }
  })

  // Scroll to top when button is clicked
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Also allow keyboard navigation for accessibility
  scrollTopBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  })

  // Enhanced page load animation
  document.body.classList.add("loaded")

  // Add a subtle loading animation to images
  const enhanceImageLoading = () => {
    const images = document.querySelectorAll("img")
    images.forEach((img) => {
      if (!img.complete) {
        img.parentElement.classList.add("loading")
        img.addEventListener("load", () => {
          img.parentElement.classList.remove("loading")
        })
      }
    })
  }

  enhanceImageLoading()

  // Add intersection observer for scroll animations
  const animateOnScroll = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active")
          }
        })
      },
      { threshold: 0.1 },
    )

    // Observe all elements with animation classes
    document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-item").forEach((el) => {
      observer.observe(el)
    })

    // Handle staggered animations with delay
    document.querySelectorAll(".stagger-container").forEach((container) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const items = entry.target.querySelectorAll(".stagger-item")
              items.forEach((item, index) => {
                setTimeout(() => {
                  item.classList.add("active")
                }, 100 * index)
              })
            }
          })
        },
        { threshold: 0.1 },
      )

      observer.observe(container)
    })
  }

  // Initialize scroll animations
  animateOnScroll()

  // Add touch swipe support for mobile
  let touchStartX = 0
  let touchEndX = 0

  const handleSwipe = () => {
    if (touchEndX < touchStartX - 50) {
      // Swipe left - could trigger next slide in a carousel
      const nextBtns = document.querySelectorAll(".next-btn")
      if (nextBtns.length > 0) nextBtns[0].click()
    }

    if (touchEndX > touchStartX + 50) {
      // Swipe right - could trigger previous slide in a carousel
      const prevBtns = document.querySelectorAll(".prev-btn")
      if (prevBtns.length > 0) prevBtns[0].click()
    }
  }

  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX
  })

  document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX
    handleSwipe()
  })

  // Add parallax effect to banners
  const pageBannersElements = document.querySelectorAll(".page-banner, .hero")

  if (pageBannersElements.length > 0) {
    window.addEventListener("scroll", () => {
      pageBannersElements.forEach((banner) => {
        const scrollPosition = window.scrollY
        const bannerPosition = banner.offsetTop
        const distance = scrollPosition - bannerPosition

        if (Math.abs(distance) < window.innerHeight) {
          // Only apply parallax if banner is in view
          banner.style.backgroundPositionY = `${distance * 0.4}px`
        }
      })
    })
  }

  // Add subtle hover animations to buttons
  const buttons = document.querySelectorAll(".btn")

  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translateY(-3px)"
    })

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translateY(0)"
    })
  })

  // Add subtle hover animations to cards
  const cards = document.querySelectorAll(".info-card, .service-card, .destination-card, .value-card")

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px) scale(1.02)"
      card.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.15)"
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)"
      card.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)"
    })
  })

  // Add preloading for page transitions
  const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"])')

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const href = link.getAttribute("href")
      if (href && href !== "#" && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
        const preloadLink = document.createElement("link")
        preloadLink.rel = "prefetch"
        preloadLink.href = href
        document.head.appendChild(preloadLink)
      }
    })
  })

  // Add smooth reveal for sections as they come into view
  const revealSections = () => {
    const sections = document.querySelectorAll("section")

    sections.forEach((section) => {
      if (
        !section.classList.contains("fade-in") &&
        !section.classList.contains("slide-in-left") &&
        !section.classList.contains("slide-in-right") &&
        !section.classList.contains("scale-in")
      ) {
        section.classList.add("fade-in")
      }
    })
  }

  revealSections()

  // Add a subtle animation to the logo
  const logo = document.querySelector(".logo")
  if (logo) {
    logo.addEventListener("mouseenter", () => {
      const logoImg = logo.querySelector("img")
      if (logoImg) {
        logoImg.style.transform = "rotate(5deg)"
      }
    })

    logo.addEventListener("mouseleave", () => {
      const logoImg = logo.querySelector("img")
      if (logoImg) {
        logoImg.style.transform = "rotate(0)"
      }
    })
  }

  // Add a subtle animation to the hero content
  const hero_Content = document.querySelector(".hero-content")
  if (hero_Content) {
    hero_Content.addEventListener("mouseenter", () => {
      const btn = hero_Content.querySelector(".btn")
      if (btn) {
        btn.style.transform = "translateY(-3px)"
      }
    })

    hero_Content.addEventListener("mouseleave", () => {
      const btn = hero_Content.querySelector(".btn")
      if (btn) {
        btn.style.transform = "translateY(0)"
      }
    })
  }

  // Add a subtle animation to the destination cards
  const destinationCards = document.querySelectorAll(".destination-card")
  destinationCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const img = card.querySelector(".destination-image img")
      if (img) {
        img.style.transform = "scale(1.1)"
      }
    })

    card.addEventListener("mouseleave", () => {
      const img = card.querySelector(".destination-image img")
      if (img) {
        img.style.transform = "scale(1)"
      }
    })
  })

  // Add a subtle animation to the attraction items
  const attractionItems = document.querySelectorAll(".attraction-item")
  attractionItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const img = item.querySelector(".attraction-image img")
      if (img) {
        img.style.transform = "scale(1.1) rotate(1deg)"
      }
    })

    item.addEventListener("mouseleave", () => {
      const img = item.querySelector(".attraction-image img")
      if (img) {
        img.style.transform = "scale(1) rotate(0)"
      }
    })
  })

  // Add a subtle animation to the social icons
  const socialIcons = document.querySelectorAll(".social-icons a")
  socialIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", () => {
      icon.style.transform = "translateY(-5px) rotate(5deg)"
    })

    icon.addEventListener("mouseleave", () => {
      icon.style.transform = "translateY(0) rotate(0)"
    })
  })

  // Add a subtle animation to the FAQ items
  const faqItemsElements = document.querySelectorAll(".faq-item")
  faqItemsElements.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      item.style.transform = "translateX(5px)"
    })

    item.addEventListener("mouseleave", () => {
      item.style.transform = "translateX(0)"
    })
  })

  // Scroll Animation
  // const animateOnScroll = () => {
  //   const elements = document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right, .scale-in")
  //   const staggerItems = document.querySelectorAll(".stagger-item")

  //   elements.forEach((element) => {
  //     const elementPosition = element.getBoundingClientRect().top
  //     const windowHeight = window.innerHeight

  //     if (elementPosition < windowHeight - 100) {
  //       element.classList.add("active")
  //     }
  //   })

  //   // Handle staggered animations
  //   const staggerContainers = document.querySelectorAll(".stagger-container")
  //   staggerContainers.forEach((container) => {
  //     const containerPosition = container.getBoundingClientRect().top
  //     const windowHeight = window.innerHeight

  //     if (containerPosition < windowHeight - 100) {
  //       const items = container.querySelectorAll(".stagger-item")
  //       items.forEach((item, index) => {
  //         setTimeout(() => {
  //           item.classList.add("active")
  //         }, 150 * index)
  //       })
  //     }
  //   })
  // }

  // Run on page load
  // animateOnScroll()

  // Run on scroll
  // window.addEventListener("scroll", animateOnScroll)

  // Header Scroll Effect
  const header = document.querySelector("header")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })

  // Mobile Menu Toggle with improved accessibility
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false")
    menuToggle.setAttribute("aria-label", "Open menu")

    menuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active")

      // Toggle icon between bars and X
      const icon = this.querySelector("i")
      if (icon.classList.contains("fa-bars")) {
        icon.classList.remove("fa-bars")
        icon.classList.add("fa-times")
        menuToggle.setAttribute("aria-expanded", "true")
        menuToggle.setAttribute("aria-label", "Close menu")
      } else {
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
        menuToggle.setAttribute("aria-expanded", "false")
        menuToggle.setAttribute("aria-label", "Open menu")
      }
    })
  }

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-menu") && !event.target.closest(".menu-toggle")) {
      if (navMenu && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active")
        const icon = menuToggle.querySelector("i")
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
        menuToggle.setAttribute("aria-expanded", "false")
        menuToggle.setAttribute("aria-label", "Open menu")
      }
    }
  })

  // Close menu when pressing Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active")
      const icon = menuToggle.querySelector("i")
      icon.classList.remove("fa-times")
      icon.classList.add("fa-bars")
      menuToggle.setAttribute("aria-expanded", "false")
      menuToggle.setAttribute("aria-label", "Open menu")
    }
  })

  // Destination Slider
  const slides = document.querySelectorAll(".destination-slide")
  const dots = document.querySelectorAll(".dot")
  const prevBtn = document.querySelector(".prev-btn")
  const nextBtn = document.querySelector(".next-btn")

  if (slides.length > 0) {
    let currentSlide = 0
    let slideInterval

    // Function to show a specific slide
    function showSlide(index) {
      // Hide all slides
      slides.forEach((slide) => {
        slide.classList.remove("active")
      })

      // Remove active class from all dots
      dots.forEach((dot) => {
        dot.classList.remove("active")
      })

      // Show the current slide and activate the corresponding dot
      slides[index].classList.add("active")
      dots[index].classList.add("active")
    }

    // Function to go to the next slide
    function nextSlide() {
      currentSlide++
      if (currentSlide >= slides.length) {
        currentSlide = 0
      }
      showSlide(currentSlide)
    }

    // Function to go to the previous slide
    function prevSlide() {
      currentSlide--
      if (currentSlide < 0) {
        currentSlide = slides.length - 1
      }
      showSlide(currentSlide)
    }

    // Start automatic slideshow
    function startSlideshow() {
      slideInterval = setInterval(nextSlide, 5000)
    }

    // Stop automatic slideshow
    function stopSlideshow() {
      clearInterval(slideInterval)
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentSlide = index
        showSlide(currentSlide)
        stopSlideshow()
        startSlideshow()
      })
    })

    // Event listener for previous button
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide()
        stopSlideshow()
        startSlideshow()
      })
    }

    // Event listener for next button
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide()
        stopSlideshow()
        startSlideshow()
      })
    }

    // Pause slideshow on hover
    const sliderContainer = document.querySelector(".destination-slider")
    if (sliderContainer) {
      sliderContainer.addEventListener("mouseenter", stopSlideshow)
      sliderContainer.addEventListener("mouseleave", startSlideshow)
    }

    // Start the slideshow
    startSlideshow()
  }

  // Enhanced Hero Section
  const heroSection = document.querySelector(".hero")
  const heroContent = document.querySelector(".hero-content")

  if (heroSection && heroContent) {
    // Ensure content is properly centered and responsive
    function adjustHeroContent() {
      // Make sure the hero section is tall enough to contain all content
      const contentHeight = heroContent.offsetHeight
      const windowHeight = window.innerHeight - document.querySelector("header").offsetHeight

      if (contentHeight > windowHeight) {
        heroSection.style.height = "auto"
        heroSection.style.minHeight = "100vh"
      } else {
        heroSection.style.height = "100vh"
      }

      // Add some padding if needed
      const paddingNeeded = Math.max(40, (windowHeight - contentHeight) / 4)
      heroSection.style.paddingTop = `${paddingNeeded}px`
      heroSection.style.paddingBottom = `${paddingNeeded}px`
    }

    // Run on load and resize
    window.addEventListener("load", adjustHeroContent)
    window.addEventListener("resize", adjustHeroContent)
  }

  // Smooth scroll for the down arrow
  const scrollDownArrowElement = document.querySelector(".scroll-down a")
  if (scrollDownArrowElement) {
    scrollDownArrowElement.addEventListener("click", (e) => {
      e.preventDefault()
      const targetSection = document.querySelector("#about")
      if (targetSection) {
        const headerHeight = document.querySelector("header").offsetHeight
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  }

  // Testimonials Page - Star Rating
  const ratingStars = document.querySelectorAll(".rating-select i")
  const ratingInput = document.getElementById("rating")

  if (ratingStars.length > 0 && ratingInput) {
    ratingStars.forEach((star) => {
      star.addEventListener("click", () => {
        const rating = star.getAttribute("data-rating")
        ratingInput.value = rating

        // Update star display
        ratingStars.forEach((s) => {
          const starRating = s.getAttribute("data-rating")
          if (starRating <= rating) {
            s.classList.remove("far")
            s.classList.add("fas")
            s.classList.add("active")
          } else {
            s.classList.remove("fas")
            s.classList.add("far")
            s.classList.remove("active")
          }
        })
      })

      star.addEventListener("mouseover", () => {
        const rating = star.getAttribute("data-rating")

        // Update star display on hover
        ratingStars.forEach((s) => {
          const starRating = s.getAttribute("data-rating")
          if (starRating <= rating) {
            s.classList.remove("far")
            s.classList.add("fas")
          } else {
            s.classList.remove("fas")
            s.classList.add("far")
          }
        })
      })

      star.addEventListener("mouseout", () => {
        // Reset to selected rating
        const selectedRating = ratingInput.value

        ratingStars.forEach((s) => {
          const starRating = s.getAttribute("data-rating")
          if (starRating <= selectedRating) {
            s.classList.remove("far")
            s.classList.add("fas")
            s.classList.add("active")
          } else {
            s.classList.remove("fas")
            s.classList.add("far")
            s.classList.remove("active")
          }
        })
      })
    })
  }

  // FAQ Accordion
  const faqItemsElements2 = document.querySelectorAll(".faq-item")

  if (faqItemsElements2.length > 0) {
    faqItemsElements2.forEach((item) => {
      const question = item.querySelector(".faq-question")

      // Add accessibility attributes
      question.setAttribute("aria-expanded", "false")
      const answer = item.querySelector(".faq-answer")
      const answerId = `faq-answer-${Math.random().toString(36).substring(2, 9)}`
      answer.setAttribute("id", answerId)
      question.setAttribute("aria-controls", answerId)

      question.addEventListener("click", () => {
        // Close all other items
        faqItemsElements2.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("active")) {
            otherItem.classList.remove("active")
            const otherQuestion = otherItem.querySelector(".faq-question")
            otherQuestion.setAttribute("aria-expanded", "false")
            const icon = otherItem.querySelector(".toggle-icon i")
            icon.className = "fas fa-plus"
          }
        })

        // Toggle current item
        item.classList.toggle("active")
        const icon = item.querySelector(".toggle-icon i")

        if (item.classList.contains("active")) {
          icon.className = "fas fa-minus"
          question.setAttribute("aria-expanded", "true")
        } else {
          icon.className = "fas fa-plus"
          question.setAttribute("aria-expanded", "false")
        }
      })
    })
  }

  // Fixed: Destination Gallery - Thumbnail Click
  // Completely rewritten to fix the overlapping issue
  const initializeGalleries = () => {
    const galleries = document.querySelectorAll(".destination-gallery")

    if (galleries.length > 0) {
      galleries.forEach((gallery) => {
        const mainImage = gallery.querySelector(".main-image img")
        const thumbnails = gallery.querySelectorAll(".thumbnail")

        // Track if a transition is in progress
        let isTransitioning = false

        thumbnails.forEach((thumbnail) => {
          thumbnail.addEventListener("click", function (e) {
            e.preventDefault()

            // Prevent rapid clicking that causes glitches
            if (isTransitioning || !mainImage) return

            // Mark as transitioning to prevent multiple clicks
            isTransitioning = true

            // Get the image source and alt text
            const thumbnailSrc = this.getAttribute("src")
            const thumbnailAlt = this.getAttribute("alt")

            // Set a fixed height on the main image container to prevent layout shift
            const mainImageContainer = mainImage.parentElement
            mainImageContainer.style.height = mainImageContainer.offsetHeight + "px"

            // Smoothly fade out
            mainImage.style.transition = "opacity 0.3s ease"
            mainImage.style.opacity = "0"

            // After fade out completes, swap images and fade back in
            setTimeout(() => {
              // Update main image
              mainImage.setAttribute("src", thumbnailSrc)
              mainImage.setAttribute("alt", thumbnailAlt)

              // Highlight the clicked thumbnail
              thumbnails.forEach((thumb) => (thumb.style.border = "2px solid transparent"))
              this.style.border = "2px solid var(--primary-color)"

              // Fade back in
              mainImage.style.opacity = "1"

              // Reset transition flag after animation completes
              setTimeout(() => {
                isTransitioning = false
                // Remove the fixed height after transition completes
                mainImageContainer.style.height = ""
              }, 300)
            }, 300)
          })
        })
      })
    }
  }

  // Initialize all galleries
  initializeGalleries()

  // Form Submission with Animation
  const contactForm = document.getElementById("contactForm")
  const storyForm = document.querySelector(".story-form")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      // Don't prevent default - let the form submit normally
      // e.preventDefault(); <- REMOVE THIS LINE

      // Validate form
      let isValid = true
      const requiredFields = contactForm.querySelectorAll("[required]")

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false
          field.classList.add("error")

          // Add error message if it doesn't exist
          let errorMsg = field.parentElement.querySelector(".error-message")
          if (!errorMsg) {
            errorMsg = document.createElement("div")
            errorMsg.className = "error-message"
            errorMsg.textContent = "This field is required"
            field.parentElement.appendChild(errorMsg)
          }
        } else {
          field.classList.remove("error")
          const errorMsg = field.parentElement.querySelector(".error-message")
          if (errorMsg) {
            errorMsg.remove()
          }
        }
      })

      // Email validation
      const emailField = contactForm.querySelector('[type="email"]')
      if (emailField && emailField.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(emailField.value)) {
          isValid = false
          emailField.classList.add("error")

          let errorMsg = emailField.parentElement.querySelector(".error-message")
          if (!errorMsg) {
            errorMsg = document.createElement("div")
            errorMsg.className = "error-message"
            errorMsg.textContent = "Please enter a valid email address"
            emailField.parentElement.appendChild(errorMsg)
          } else {
            errorMsg.textContent = "Please enter a valid email address"
          }
        }
      }

      // If the form is not valid, prevent submission
      if (!isValid) {
        e.preventDefault()
        return
      }

      // If we get here, the form is valid and will submit normally to process-form.php
    })
  }

  if (storyForm) {
    storyForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Add loading state
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...'
      submitBtn.disabled = true

      // Simulate form submission
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Submitted!'
        submitBtn.classList.add("success")

        // Show success message
        const formContainer = storyForm.closest(".story-form-container")
        const successMessage = document.createElement("div")
        successMessage.className = "success-message"
        successMessage.innerHTML =
          '<i class="fas fa-check-circle"></i> Thank you for sharing your story! This is a demo form, so no data has been sent. In a real website, your testimonial would be submitted for review.'
        formContainer.appendChild(successMessage)

        // Reset form after delay
        setTimeout(() => {
          storyForm.reset()
          submitBtn.innerHTML = originalText
          submitBtn.disabled = false
          submitBtn.classList.remove("success")

          // Reset rating stars
          const ratingStars = document.querySelectorAll(".rating-select i")
          if (ratingStars.length > 0) {
            ratingStars.forEach((star) => {
              star.classList.remove("fas", "active")
              star.classList.add("far")
            })
          }

          // Reset rating input
          const ratingInput = document.getElementById("rating")
          if (ratingInput) {
            ratingInput.value = 0
          }

          // Fade out and remove success message
          successMessage.style.opacity = "0"
          setTimeout(() => {
            successMessage.remove()
          }, 500)
        }, 3000)
      }, 1500)
    })
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href")

      if (targetId !== "#") {
        e.preventDefault()

        const targetElement = document.querySelector(targetId)

        if (targetElement) {
          // Calculate header height for offset
          const headerHeight = document.querySelector("header").offsetHeight

          window.scrollTo({
            top: targetElement.offsetTop - headerHeight - 20,
            behavior: "smooth",
          })

          // Close mobile menu if open
          if (navMenu && navMenu.classList.contains("active")) {
            navMenu.classList.remove("active")
            const icon = menuToggle.querySelector("i")
            icon.classList.remove("fa-times")
            icon.classList.add("fa-bars")
            menuToggle.setAttribute("aria-expanded", "false")
            menuToggle.setAttribute("aria-label", "Open menu")
          }
        }
      }
    })
  })

  // Video placeholder click with animation
  const videoPlaceholders = document.querySelectorAll(".video-placeholder")

  if (videoPlaceholders.length > 0) {
    videoPlaceholders.forEach((placeholder) => {
      placeholder.addEventListener("click", function () {
        const playButton = this.querySelector(".play-button")

        // Animate play button
        playButton.style.transform = "translate(-50%, -50%) scale(1.2)"
        playButton.style.backgroundColor = "var(--primary-color)"
        playButton.querySelector("i").style.color = "white"

        setTimeout(() => {
          alert("This is a placeholder for video content. In a real website, this would play a video testimonial.")

          // Reset play button
          playButton.style.transform = "translate(-50%, -50%)"
          playButton.style.backgroundColor = "rgba(255, 255, 255, 0.8)"
          playButton.querySelector("i").style.color = "var(--primary-color)"
        }, 300)
      })
    })
  }

  // Add success message styling
  let style = document.createElement("style")
  style.textContent = `
        .success-message {
            background-color: rgba(40, 167, 69, 0.1);
            color: #28a745;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            display: flex;
            align-items: center;
            transition: opacity 0.5s ease;
        }
        
        .success-message i {
            font-size: 1.5rem;
            margin-right: 10px;
        }
        
        button.success {
            background-color: #28a745 !important;
        }
    `
  document.head.appendChild(style)

  // Add scroll down arrow animation
  const scrollDownArrowElement2 = document.querySelector(".scroll-down a")
  if (scrollDownArrowElement2) {
    scrollDownArrowElement2.addEventListener("click", (e) => {
      e.preventDefault()
      const nextSection = document.querySelector(".about-preview, .services-preview")
      if (nextSection) {
        const headerHeight = document.querySelector("header").offsetHeight
        window.scrollTo({
          top: nextSection.offsetTop - headerHeight,
          behavior: "smooth",
        })
      }
    })
  }

  // Add animation classes to elements
  const addAnimationClasses = () => {
    // Add animation to hero section to match other pages
    const heroSection = document.querySelector(".hero")
    if (heroSection && !heroSection.classList.contains("animated")) {
      heroSection.classList.add("animated")

      // Force the same animation as other page banners
      const heroContent = heroSection.querySelector(".hero-content")
      if (heroContent) {
        const heroTitle = heroContent.querySelector("h1")
        const heroText = heroContent.querySelector("p")
        const heroBtn = heroContent.querySelector(".btn")

        if (heroTitle) heroTitle.style.animation = "slideInDown 1s ease-out"
        if (heroText) heroText.style.animation = "slideInDown 1.2s ease-out"
        if (heroBtn) heroBtn.style.animation = "slideInDown 1.4s ease-out"
      }
    }

    // Section headers
    document.querySelectorAll(".section-header").forEach((header) => {
      header.classList.add("fade-in")
    })

    // About section
    const aboutText = document.querySelector(".about-text")
    const aboutImage = document.querySelector(".about-image")
    if (aboutText && aboutImage) {
      aboutText.classList.add("slide-in-left")
      aboutImage.classList.add("slide-in-right")
    }

    // Services grid
    const serviceCards = document.querySelectorAll(".service-card")
    if (serviceCards.length > 0) {
      const servicesGrid = document.querySelector(".services-grid")
      servicesGrid.classList.add("stagger-container")
      serviceCards.forEach((card) => {
        card.classList.add("stagger-item")
      })
    }

    // Testimonial cards
    const testimonialCard = document.querySelector(".testimonial-card")
    if (testimonialCard) {
      testimonialCard.classList.add("scale-in")
    }

    // CTA section
    const ctaSection = document.querySelector(".cta-section .container")
    if (ctaSection) {
      ctaSection.classList.add("fade-in")
    }

    // Team members
    const teamMembers = document.querySelectorAll(".team-member")
    if (teamMembers.length > 0) {
      const teamGrid = document.querySelector(".team-grid")
      teamGrid.classList.add("stagger-container")
      teamMembers.forEach((member) => {
        member.classList.add("stagger-item")
      })
    }

    // Value cards
    const valueCards = document.querySelectorAll(".value-card")
    if (valueCards.length > 0) {
      const valuesGrid = document.querySelector(".values-grid")
      valuesGrid.classList.add("stagger-container")
      valueCards.forEach((card) => {
        card.classList.add("stagger-item")
      })
    }

    // Info cards
    const infoCards = document.querySelectorAll(".info-card")
    if (infoCards.length > 0) {
      const infoCardsContainer = document.querySelector(".info-cards")
      infoCardsContainer.classList.add("stagger-container")
      infoCards.forEach((card) => {
        card.classList.add("stagger-item")
      })
    }

    // FAQ items
    const faqItems = document.querySelectorAll(".faq-item")
    if (faqItems.length > 0) {
      const faqContainer = document.querySelector(".faq-container")
      faqContainer.classList.add("stagger-container")
      faqItems.forEach((item) => {
        item.classList.add("stagger-item")
      })
    }
  }

  // Run animation class assignment
  addAnimationClasses()

  // Prevent navigation link shifting
  const navLinks = document.querySelectorAll(".nav-menu li a")
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // This prevents any layout shifts when clicking
      e.preventDefault()
      const href = this.getAttribute("href")
      if (href) {
        setTimeout(() => {
          window.location.href = href
        }, 10)
      }
    })
  })

  // Enhanced Hero Section Effects
  const heroSectionFinal = document.querySelector(".hero")
  const heroContentFinal = document.querySelector(".hero-content")

  if (heroSectionFinal) {
    // Parallax effect on scroll
    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY
      if (scrollPosition < window.innerHeight) {
        heroSectionFinal.style.backgroundPositionY = `${scrollPosition * 0.5}px`

        // Move decorative elements on scroll for depth effect
        const decorations = document.querySelectorAll(".hero-decoration")
        decorations.forEach((decoration, index) => {
          const speed = index === 0 ? 0.3 : 0.2
          decoration.style.transform = `translateY(${scrollPosition * speed}px)`
        })
      }
    })

    // Add subtle hover effect to hero content
    if (heroContentFinal) {
      // Replace with simpler hover effect without box shadow
      heroContentFinal.addEventListener("mouseenter", () => {
        const btn = heroContentFinal.querySelector(".btn")
        if (btn) {
          btn.style.transform = "translateY(-3px)"
        }
      })

      heroContentFinal.addEventListener("mouseleave", () => {
        const btn = heroContentFinal.querySelector(".btn")
        if (btn) {
          btn.style.transform = "translateY(0)"
        }
      })
    }
  }

  // Add CSS for form validation
  style = document.createElement("style")
  style.textContent = `
    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
      border-color: #dc3545;
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
    
    .error-message {
      color: #dc3545;
      font-size: 0.85rem;
      margin-top: 5px;
    }
    
    .success-message {
      background-color: rgba(40, 167, 69, 0.1);
      color: #28a745;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
      display: flex;
      align-items: center;
      transition: opacity 0.5s ease;
    }
    
    .success-message i {
      font-size: 1.5rem;
      margin-right: 10px;
    }
    
    button.success {
      background-color: #28a745 !important;
    }
    
    @media (max-width: 768px) {
      .form-group {
        margin-bottom: 15px;
      }
    }
  `
  document.head.appendChild(style)

  // Page Banner Fitting
  const pageBannersElements2 = document.querySelectorAll(".page-banner")

  if (pageBannersElements2.length > 0) {
    function adjustPageBanners() {
      const headerHeight = document.querySelector("header").offsetHeight

      pageBannersElements2.forEach((banner) => {
        // Set margin-top to match header height
        banner.style.marginTop = `${headerHeight}px`

        // Ensure the background image is fully visible
        const bannerImg = window.getComputedStyle(banner).backgroundImage
        if (bannerImg && bannerImg !== "none") {
          const img = new Image()
          img.src = bannerImg.replace(/url$$['"]?(.*?)['"]?$$/i, "$1")

          img.onload = () => {
            const imgRatio = img.width / img.height
            const bannerWidth = banner.offsetWidth
            const idealHeight = bannerWidth / imgRatio

            // Only adjust height if needed to show the full image
            if (idealHeight > 250) {
              banner.style.height = `${idealHeight}px`
            }
          }
        }
      })
    }

    // Run on load and resize
    window.addEventListener("load", adjustPageBanners)
    window.addEventListener("resize", adjustPageBanners)
  }
})
=======
document.addEventListener("DOMContentLoaded", () => {
  // Create scroll indicator
  const scrollIndicator = document.createElement("div")
  scrollIndicator.className = "scroll-indicator"
  document.body.appendChild(scrollIndicator)

  // Create scroll to top button
  const scrollTopBtn = document.createElement("div")
  scrollTopBtn.className = "scroll-to-top"
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>'
  scrollTopBtn.setAttribute("aria-label", "Scroll to top")
  scrollTopBtn.setAttribute("role", "button")
  scrollTopBtn.setAttribute("tabindex", "0")
  document.body.appendChild(scrollTopBtn)

  // Update scroll indicator width based on scroll position
  window.addEventListener("scroll", () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const scrolled = (winScroll / height) * 100
    scrollIndicator.style.width = scrolled + "%"

    // Show/hide scroll to top button
    if (winScroll > 300) {
      scrollTopBtn.classList.add("visible")
    } else {
      scrollTopBtn.classList.remove("visible")
    }
  })

  // Scroll to top when button is clicked
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Also allow keyboard navigation for accessibility
  scrollTopBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  })

  // Enhanced page load animation
  document.body.classList.add("loaded")

  // Add a subtle loading animation to images
  const enhanceImageLoading = () => {
    const images = document.querySelectorAll("img")
    images.forEach((img) => {
      if (!img.complete) {
        img.parentElement.classList.add("loading")
        img.addEventListener("load", () => {
          img.parentElement.classList.remove("loading")
        })
      }
    })
  }

  enhanceImageLoading()

  // Add intersection observer for scroll animations
  const animateOnScroll = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active")
          }
        })
      },
      { threshold: 0.1 },
    )

    // Observe all elements with animation classes
    document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-item").forEach((el) => {
      observer.observe(el)
    })

    // Handle staggered animations with delay
    document.querySelectorAll(".stagger-container").forEach((container) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const items = entry.target.querySelectorAll(".stagger-item")
              items.forEach((item, index) => {
                setTimeout(() => {
                  item.classList.add("active")
                }, 100 * index)
              })
            }
          })
        },
        { threshold: 0.1 },
      )

      observer.observe(container)
    })
  }

  // Initialize scroll animations
  animateOnScroll()

  // Add touch swipe support for mobile
  let touchStartX = 0
  let touchEndX = 0

  const handleSwipe = () => {
    if (touchEndX < touchStartX - 50) {
      // Swipe left - could trigger next slide in a carousel
      const nextBtns = document.querySelectorAll(".next-btn")
      if (nextBtns.length > 0) nextBtns[0].click()
    }

    if (touchEndX > touchStartX + 50) {
      // Swipe right - could trigger previous slide in a carousel
      const prevBtns = document.querySelectorAll(".prev-btn")
      if (prevBtns.length > 0) prevBtns[0].click()
    }
  }

  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX
  })

  document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX
    handleSwipe()
  })

  // Add parallax effect to banners
  const pageBannersElements = document.querySelectorAll(".page-banner, .hero")

  if (pageBannersElements.length > 0) {
    window.addEventListener("scroll", () => {
      pageBannersElements.forEach((banner) => {
        const scrollPosition = window.scrollY
        const bannerPosition = banner.offsetTop
        const distance = scrollPosition - bannerPosition

        if (Math.abs(distance) < window.innerHeight) {
          // Only apply parallax if banner is in view
          banner.style.backgroundPositionY = `${distance * 0.4}px`
        }
      })
    })
  }

  // Add subtle hover animations to buttons
  const buttons = document.querySelectorAll(".btn")

  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translateY(-3px)"
    })

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translateY(0)"
    })
  })

  // Add subtle hover animations to cards
  const cards = document.querySelectorAll(".info-card, .service-card, .destination-card, .value-card")

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px) scale(1.02)"
      card.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.15)"
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)"
      card.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)"
    })
  })

  // Add preloading for page transitions
  const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"])')

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const href = link.getAttribute("href")
      if (href && href !== "#" && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
        const preloadLink = document.createElement("link")
        preloadLink.rel = "prefetch"
        preloadLink.href = href
        document.head.appendChild(preloadLink)
      }
    })
  })

  // Add smooth reveal for sections as they come into view
  const revealSections = () => {
    const sections = document.querySelectorAll("section")

    sections.forEach((section) => {
      if (
        !section.classList.contains("fade-in") &&
        !section.classList.contains("slide-in-left") &&
        !section.classList.contains("slide-in-right") &&
        !section.classList.contains("scale-in")
      ) {
        section.classList.add("fade-in")
      }
    })
  }

  revealSections()

  // Add a subtle animation to the logo
  const logo = document.querySelector(".logo")
  if (logo) {
    logo.addEventListener("mouseenter", () => {
      const logoImg = logo.querySelector("img")
      if (logoImg) {
        logoImg.style.transform = "rotate(5deg)"
      }
    })

    logo.addEventListener("mouseleave", () => {
      const logoImg = logo.querySelector("img")
      if (logoImg) {
        logoImg.style.transform = "rotate(0)"
      }
    })
  }

  // Add a subtle animation to the hero content
  const hero_Content = document.querySelector(".hero-content")
  if (hero_Content) {
    hero_Content.addEventListener("mouseenter", () => {
      const btn = hero_Content.querySelector(".btn")
      if (btn) {
        btn.style.transform = "translateY(-3px)"
      }
    })

    hero_Content.addEventListener("mouseleave", () => {
      const btn = hero_Content.querySelector(".btn")
      if (btn) {
        btn.style.transform = "translateY(0)"
      }
    })
  }

  // Add a subtle animation to the destination cards
  const destinationCards = document.querySelectorAll(".destination-card")
  destinationCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const img = card.querySelector(".destination-image img")
      if (img) {
        img.style.transform = "scale(1.1)"
      }
    })

    card.addEventListener("mouseleave", () => {
      const img = card.querySelector(".destination-image img")
      if (img) {
        img.style.transform = "scale(1)"
      }
    })
  })

  // Add a subtle animation to the attraction items
  const attractionItems = document.querySelectorAll(".attraction-item")
  attractionItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const img = item.querySelector(".attraction-image img")
      if (img) {
        img.style.transform = "scale(1.1) rotate(1deg)"
      }
    })

    item.addEventListener("mouseleave", () => {
      const img = item.querySelector(".attraction-image img")
      if (img) {
        img.style.transform = "scale(1) rotate(0)"
      }
    })
  })

  // Add a subtle animation to the social icons
  const socialIcons = document.querySelectorAll(".social-icons a")
  socialIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", () => {
      icon.style.transform = "translateY(-5px) rotate(5deg)"
    })

    icon.addEventListener("mouseleave", () => {
      icon.style.transform = "translateY(0) rotate(0)"
    })
  })

  // Add a subtle animation to the FAQ items
  const faqItemsElements = document.querySelectorAll(".faq-item")
  faqItemsElements.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      item.style.transform = "translateX(5px)"
    })

    item.addEventListener("mouseleave", () => {
      item.style.transform = "translateX(0)"
    })
  })

  // Scroll Animation
  // const animateOnScroll = () => {
  //   const elements = document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right, .scale-in")
  //   const staggerItems = document.querySelectorAll(".stagger-item")

  //   elements.forEach((element) => {
  //     const elementPosition = element.getBoundingClientRect().top
  //     const windowHeight = window.innerHeight

  //     if (elementPosition < windowHeight - 100) {
  //       element.classList.add("active")
  //     }
  //   })

  //   // Handle staggered animations
  //   const staggerContainers = document.querySelectorAll(".stagger-container")
  //   staggerContainers.forEach((container) => {
  //     const containerPosition = container.getBoundingClientRect().top
  //     const windowHeight = window.innerHeight

  //     if (containerPosition < windowHeight - 100) {
  //       const items = container.querySelectorAll(".stagger-item")
  //       items.forEach((item, index) => {
  //         setTimeout(() => {
  //           item.classList.add("active")
  //         }, 150 * index)
  //       })
  //     }
  //   })
  // }

  // Run on page load
  // animateOnScroll()

  // Run on scroll
  // window.addEventListener("scroll", animateOnScroll)

  // Header Scroll Effect
  const header = document.querySelector("header")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })

  // Mobile Menu Toggle with improved accessibility
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false")
    menuToggle.setAttribute("aria-label", "Open menu")

    menuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active")

      // Toggle icon between bars and X
      const icon = this.querySelector("i")
      if (icon.classList.contains("fa-bars")) {
        icon.classList.remove("fa-bars")
        icon.classList.add("fa-times")
        menuToggle.setAttribute("aria-expanded", "true")
        menuToggle.setAttribute("aria-label", "Close menu")
      } else {
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
        menuToggle.setAttribute("aria-expanded", "false")
        menuToggle.setAttribute("aria-label", "Open menu")
      }
    })
  }

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-menu") && !event.target.closest(".menu-toggle")) {
      if (navMenu && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active")
        const icon = menuToggle.querySelector("i")
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
        menuToggle.setAttribute("aria-expanded", "false")
        menuToggle.setAttribute("aria-label", "Open menu")
      }
    }
  })

  // Close menu when pressing Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active")
      const icon = menuToggle.querySelector("i")
      icon.classList.remove("fa-times")
      icon.classList.add("fa-bars")
      menuToggle.setAttribute("aria-expanded", "false")
      menuToggle.setAttribute("aria-label", "Open menu")
    }
  })

  // Destination Slider
  const slides = document.querySelectorAll(".destination-slide")
  const dots = document.querySelectorAll(".dot")
  const prevBtn = document.querySelector(".prev-btn")
  const nextBtn = document.querySelector(".next-btn")

  if (slides.length > 0) {
    let currentSlide = 0
    let slideInterval

    // Function to show a specific slide
    function showSlide(index) {
      // Hide all slides
      slides.forEach((slide) => {
        slide.classList.remove("active")
      })

      // Remove active class from all dots
      dots.forEach((dot) => {
        dot.classList.remove("active")
      })

      // Show the current slide and activate the corresponding dot
      slides[index].classList.add("active")
      dots[index].classList.add("active")
    }

    // Function to go to the next slide
    function nextSlide() {
      currentSlide++
      if (currentSlide >= slides.length) {
        currentSlide = 0
      }
      showSlide(currentSlide)
    }

    // Function to go to the previous slide
    function prevSlide() {
      currentSlide--
      if (currentSlide < 0) {
        currentSlide = slides.length - 1
      }
      showSlide(currentSlide)
    }

    // Start automatic slideshow
    function startSlideshow() {
      slideInterval = setInterval(nextSlide, 5000)
    }

    // Stop automatic slideshow
    function stopSlideshow() {
      clearInterval(slideInterval)
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentSlide = index
        showSlide(currentSlide)
        stopSlideshow()
        startSlideshow()
      })
    })

    // Event listener for previous button
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide()
        stopSlideshow()
        startSlideshow()
      })
    }

    // Event listener for next button
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide()
        stopSlideshow()
        startSlideshow()
      })
    }

    // Pause slideshow on hover
    const sliderContainer = document.querySelector(".destination-slider")
    if (sliderContainer) {
      sliderContainer.addEventListener("mouseenter", stopSlideshow)
      sliderContainer.addEventListener("mouseleave", startSlideshow)
    }

    // Start the slideshow
    startSlideshow()
  }

  // Enhanced Hero Section
  const heroSection = document.querySelector(".hero")
  const heroContent = document.querySelector(".hero-content")

  if (heroSection && heroContent) {
    // Ensure content is properly centered and responsive
    function adjustHeroContent() {
      // Make sure the hero section is tall enough to contain all content
      const contentHeight = heroContent.offsetHeight
      const windowHeight = window.innerHeight - document.querySelector("header").offsetHeight

      if (contentHeight > windowHeight) {
        heroSection.style.height = "auto"
        heroSection.style.minHeight = "100vh"
      } else {
        heroSection.style.height = "100vh"
      }

      // Add some padding if needed
      const paddingNeeded = Math.max(40, (windowHeight - contentHeight) / 4)
      heroSection.style.paddingTop = `${paddingNeeded}px`
      heroSection.style.paddingBottom = `${paddingNeeded}px`
    }

    // Run on load and resize
    window.addEventListener("load", adjustHeroContent)
    window.addEventListener("resize", adjustHeroContent)
  }

  // Smooth scroll for the down arrow
  const scrollDownArrowElement = document.querySelector(".scroll-down a")
  if (scrollDownArrowElement) {
    scrollDownArrowElement.addEventListener("click", (e) => {
      e.preventDefault()
      const targetSection = document.querySelector("#about")
      if (targetSection) {
        const headerHeight = document.querySelector("header").offsetHeight
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  }

  // Testimonials Page - Star Rating
  const ratingStars = document.querySelectorAll(".rating-select i")
  const ratingInput = document.getElementById("rating")

  if (ratingStars.length > 0 && ratingInput) {
    ratingStars.forEach((star) => {
      star.addEventListener("click", () => {
        const rating = star.getAttribute("data-rating")
        ratingInput.value = rating

        // Update star display
        ratingStars.forEach((s) => {
          const starRating = s.getAttribute("data-rating")
          if (starRating <= rating) {
            s.classList.remove("far")
            s.classList.add("fas")
            s.classList.add("active")
          } else {
            s.classList.remove("fas")
            s.classList.add("far")
            s.classList.remove("active")
          }
        })
      })

      star.addEventListener("mouseover", () => {
        const rating = star.getAttribute("data-rating")

        // Update star display on hover
        ratingStars.forEach((s) => {
          const starRating = s.getAttribute("data-rating")
          if (starRating <= rating) {
            s.classList.remove("far")
            s.classList.add("fas")
          } else {
            s.classList.remove("fas")
            s.classList.add("far")
          }
        })
      })

      star.addEventListener("mouseout", () => {
        // Reset to selected rating
        const selectedRating = ratingInput.value

        ratingStars.forEach((s) => {
          const starRating = s.getAttribute("data-rating")
          if (starRating <= selectedRating) {
            s.classList.remove("far")
            s.classList.add("fas")
            s.classList.add("active")
          } else {
            s.classList.remove("fas")
            s.classList.add("far")
            s.classList.remove("active")
          }
        })
      })
    })
  }

  // FAQ Accordion
  const faqItemsElements2 = document.querySelectorAll(".faq-item")

  if (faqItemsElements2.length > 0) {
    faqItemsElements2.forEach((item) => {
      const question = item.querySelector(".faq-question")

      // Add accessibility attributes
      question.setAttribute("aria-expanded", "false")
      const answer = item.querySelector(".faq-answer")
      const answerId = `faq-answer-${Math.random().toString(36).substring(2, 9)}`
      answer.setAttribute("id", answerId)
      question.setAttribute("aria-controls", answerId)

      question.addEventListener("click", () => {
        // Close all other items
        faqItemsElements2.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("active")) {
            otherItem.classList.remove("active")
            const otherQuestion = otherItem.querySelector(".faq-question")
            otherQuestion.setAttribute("aria-expanded", "false")
            const icon = otherItem.querySelector(".toggle-icon i")
            icon.className = "fas fa-plus"
          }
        })

        // Toggle current item
        item.classList.toggle("active")
        const icon = item.querySelector(".toggle-icon i")

        if (item.classList.contains("active")) {
          icon.className = "fas fa-minus"
          question.setAttribute("aria-expanded", "true")
        } else {
          icon.className = "fas fa-plus"
          question.setAttribute("aria-expanded", "false")
        }
      })
    })
  }

  // Fixed: Destination Gallery - Thumbnail Click
  // Completely rewritten to fix the overlapping issue
  const initializeGalleries = () => {
    const galleries = document.querySelectorAll(".destination-gallery")

    if (galleries.length > 0) {
      galleries.forEach((gallery) => {
        const mainImage = gallery.querySelector(".main-image img")
        const thumbnails = gallery.querySelectorAll(".thumbnail")

        // Track if a transition is in progress
        let isTransitioning = false

        thumbnails.forEach((thumbnail) => {
          thumbnail.addEventListener("click", function (e) {
            e.preventDefault()

            // Prevent rapid clicking that causes glitches
            if (isTransitioning || !mainImage) return

            // Mark as transitioning to prevent multiple clicks
            isTransitioning = true

            // Get the image source and alt text
            const thumbnailSrc = this.getAttribute("src")
            const thumbnailAlt = this.getAttribute("alt")

            // Set a fixed height on the main image container to prevent layout shift
            const mainImageContainer = mainImage.parentElement
            mainImageContainer.style.height = mainImageContainer.offsetHeight + "px"

            // Smoothly fade out
            mainImage.style.transition = "opacity 0.3s ease"
            mainImage.style.opacity = "0"

            // After fade out completes, swap images and fade back in
            setTimeout(() => {
              // Update main image
              mainImage.setAttribute("src", thumbnailSrc)
              mainImage.setAttribute("alt", thumbnailAlt)

              // Highlight the clicked thumbnail
              thumbnails.forEach((thumb) => (thumb.style.border = "2px solid transparent"))
              this.style.border = "2px solid var(--primary-color)"

              // Fade back in
              mainImage.style.opacity = "1"

              // Reset transition flag after animation completes
              setTimeout(() => {
                isTransitioning = false
                // Remove the fixed height after transition completes
                mainImageContainer.style.height = ""
              }, 300)
            }, 300)
          })
        })
      })
    }
  }

  // Initialize all galleries
  initializeGalleries()

  // Form Submission with Animation
  const contactForm = document.getElementById("contactForm")
  const storyForm = document.querySelector(".story-form")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      // Don't prevent default - let the form submit normally
      // e.preventDefault(); <- REMOVE THIS LINE

      // Validate form
      let isValid = true
      const requiredFields = contactForm.querySelectorAll("[required]")

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false
          field.classList.add("error")

          // Add error message if it doesn't exist
          let errorMsg = field.parentElement.querySelector(".error-message")
          if (!errorMsg) {
            errorMsg = document.createElement("div")
            errorMsg.className = "error-message"
            errorMsg.textContent = "This field is required"
            field.parentElement.appendChild(errorMsg)
          }
        } else {
          field.classList.remove("error")
          const errorMsg = field.parentElement.querySelector(".error-message")
          if (errorMsg) {
            errorMsg.remove()
          }
        }
      })

      // Email validation
      const emailField = contactForm.querySelector('[type="email"]')
      if (emailField && emailField.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(emailField.value)) {
          isValid = false
          emailField.classList.add("error")

          let errorMsg = emailField.parentElement.querySelector(".error-message")
          if (!errorMsg) {
            errorMsg = document.createElement("div")
            errorMsg.className = "error-message"
            errorMsg.textContent = "Please enter a valid email address"
            emailField.parentElement.appendChild(errorMsg)
          } else {
            errorMsg.textContent = "Please enter a valid email address"
          }
        }
      }

      // If the form is not valid, prevent submission
      if (!isValid) {
        e.preventDefault()
        return
      }

      // If we get here, the form is valid and will submit normally to process-form.php
    })
  }

  if (storyForm) {
    storyForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Add loading state
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...'
      submitBtn.disabled = true

      // Simulate form submission
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Submitted!'
        submitBtn.classList.add("success")

        // Show success message
        const formContainer = storyForm.closest(".story-form-container")
        const successMessage = document.createElement("div")
        successMessage.className = "success-message"
        successMessage.innerHTML =
          '<i class="fas fa-check-circle"></i> Thank you for sharing your story! This is a demo form, so no data has been sent. In a real website, your testimonial would be submitted for review.'
        formContainer.appendChild(successMessage)

        // Reset form after delay
        setTimeout(() => {
          storyForm.reset()
          submitBtn.innerHTML = originalText
          submitBtn.disabled = false
          submitBtn.classList.remove("success")

          // Reset rating stars
          const ratingStars = document.querySelectorAll(".rating-select i")
          if (ratingStars.length > 0) {
            ratingStars.forEach((star) => {
              star.classList.remove("fas", "active")
              star.classList.add("far")
            })
          }

          // Reset rating input
          const ratingInput = document.getElementById("rating")
          if (ratingInput) {
            ratingInput.value = 0
          }

          // Fade out and remove success message
          successMessage.style.opacity = "0"
          setTimeout(() => {
            successMessage.remove()
          }, 500)
        }, 3000)
      }, 1500)
    })
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href")

      if (targetId !== "#") {
        e.preventDefault()

        const targetElement = document.querySelector(targetId)

        if (targetElement) {
          // Calculate header height for offset
          const headerHeight = document.querySelector("header").offsetHeight

          window.scrollTo({
            top: targetElement.offsetTop - headerHeight - 20,
            behavior: "smooth",
          })

          // Close mobile menu if open
          if (navMenu && navMenu.classList.contains("active")) {
            navMenu.classList.remove("active")
            const icon = menuToggle.querySelector("i")
            icon.classList.remove("fa-times")
            icon.classList.add("fa-bars")
            menuToggle.setAttribute("aria-expanded", "false")
            menuToggle.setAttribute("aria-label", "Open menu")
          }
        }
      }
    })
  })

  // Video placeholder click with animation
  const videoPlaceholders = document.querySelectorAll(".video-placeholder")

  if (videoPlaceholders.length > 0) {
    videoPlaceholders.forEach((placeholder) => {
      placeholder.addEventListener("click", function () {
        const playButton = this.querySelector(".play-button")

        // Animate play button
        playButton.style.transform = "translate(-50%, -50%) scale(1.2)"
        playButton.style.backgroundColor = "var(--primary-color)"
        playButton.querySelector("i").style.color = "white"

        setTimeout(() => {
          alert("This is a placeholder for video content. In a real website, this would play a video testimonial.")

          // Reset play button
          playButton.style.transform = "translate(-50%, -50%)"
          playButton.style.backgroundColor = "rgba(255, 255, 255, 0.8)"
          playButton.querySelector("i").style.color = "var(--primary-color)"
        }, 300)
      })
    })
  }

  // Add success message styling
  let style = document.createElement("style")
  style.textContent = `
        .success-message {
            background-color: rgba(40, 167, 69, 0.1);
            color: #28a745;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            display: flex;
            align-items: center;
            transition: opacity 0.5s ease;
        }
        
        .success-message i {
            font-size: 1.5rem;
            margin-right: 10px;
        }
        
        button.success {
            background-color: #28a745 !important;
        }
    `
  document.head.appendChild(style)

  // Add scroll down arrow animation
  const scrollDownArrowElement2 = document.querySelector(".scroll-down a")
  if (scrollDownArrowElement2) {
    scrollDownArrowElement2.addEventListener("click", (e) => {
      e.preventDefault()
      const nextSection = document.querySelector(".about-preview, .services-preview")
      if (nextSection) {
        const headerHeight = document.querySelector("header").offsetHeight
        window.scrollTo({
          top: nextSection.offsetTop - headerHeight,
          behavior: "smooth",
        })
      }
    })
  }

  // Add animation classes to elements
  const addAnimationClasses = () => {
    // Add animation to hero section to match other pages
    const heroSection = document.querySelector(".hero")
    if (heroSection && !heroSection.classList.contains("animated")) {
      heroSection.classList.add("animated")

      // Force the same animation as other page banners
      const heroContent = heroSection.querySelector(".hero-content")
      if (heroContent) {
        const heroTitle = heroContent.querySelector("h1")
        const heroText = heroContent.querySelector("p")
        const heroBtn = heroContent.querySelector(".btn")

        if (heroTitle) heroTitle.style.animation = "slideInDown 1s ease-out"
        if (heroText) heroText.style.animation = "slideInDown 1.2s ease-out"
        if (heroBtn) heroBtn.style.animation = "slideInDown 1.4s ease-out"
      }
    }

    // Section headers
    document.querySelectorAll(".section-header").forEach((header) => {
      header.classList.add("fade-in")
    })

    // About section
    const aboutText = document.querySelector(".about-text")
    const aboutImage = document.querySelector(".about-image")
    if (aboutText && aboutImage) {
      aboutText.classList.add("slide-in-left")
      aboutImage.classList.add("slide-in-right")
    }

    // Services grid
    const serviceCards = document.querySelectorAll(".service-card")
    if (serviceCards.length > 0) {
      const servicesGrid = document.querySelector(".services-grid")
      servicesGrid.classList.add("stagger-container")
      serviceCards.forEach((card) => {
        card.classList.add("stagger-item")
      })
    }

    // Testimonial cards
    const testimonialCard = document.querySelector(".testimonial-card")
    if (testimonialCard) {
      testimonialCard.classList.add("scale-in")
    }

    // CTA section
    const ctaSection = document.querySelector(".cta-section .container")
    if (ctaSection) {
      ctaSection.classList.add("fade-in")
    }

    // Team members
    const teamMembers = document.querySelectorAll(".team-member")
    if (teamMembers.length > 0) {
      const teamGrid = document.querySelector(".team-grid")
      teamGrid.classList.add("stagger-container")
      teamMembers.forEach((member) => {
        member.classList.add("stagger-item")
      })
    }

    // Value cards
    const valueCards = document.querySelectorAll(".value-card")
    if (valueCards.length > 0) {
      const valuesGrid = document.querySelector(".values-grid")
      valuesGrid.classList.add("stagger-container")
      valueCards.forEach((card) => {
        card.classList.add("stagger-item")
      })
    }

    // Info cards
    const infoCards = document.querySelectorAll(".info-card")
    if (infoCards.length > 0) {
      const infoCardsContainer = document.querySelector(".info-cards")
      infoCardsContainer.classList.add("stagger-container")
      infoCards.forEach((card) => {
        card.classList.add("stagger-item")
      })
    }

    // FAQ items
    const faqItems = document.querySelectorAll(".faq-item")
    if (faqItems.length > 0) {
      const faqContainer = document.querySelector(".faq-container")
      faqContainer.classList.add("stagger-container")
      faqItems.forEach((item) => {
        item.classList.add("stagger-item")
      })
    }
  }

  // Run animation class assignment
  addAnimationClasses()

  // Prevent navigation link shifting
  const navLinks = document.querySelectorAll(".nav-menu li a")
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // This prevents any layout shifts when clicking
      e.preventDefault()
      const href = this.getAttribute("href")
      if (href) {
        setTimeout(() => {
          window.location.href = href
        }, 10)
      }
    })
  })

  // Enhanced Hero Section Effects
  const heroSectionFinal = document.querySelector(".hero")
  const heroContentFinal = document.querySelector(".hero-content")

  if (heroSectionFinal) {
    // Parallax effect on scroll
    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY
      if (scrollPosition < window.innerHeight) {
        heroSectionFinal.style.backgroundPositionY = `${scrollPosition * 0.5}px`

        // Move decorative elements on scroll for depth effect
        const decorations = document.querySelectorAll(".hero-decoration")
        decorations.forEach((decoration, index) => {
          const speed = index === 0 ? 0.3 : 0.2
          decoration.style.transform = `translateY(${scrollPosition * speed}px)`
        })
      }
    })

    // Add subtle hover effect to hero content
    if (heroContentFinal) {
      // Replace with simpler hover effect without box shadow
      heroContentFinal.addEventListener("mouseenter", () => {
        const btn = heroContentFinal.querySelector(".btn")
        if (btn) {
          btn.style.transform = "translateY(-3px)"
        }
      })

      heroContentFinal.addEventListener("mouseleave", () => {
        const btn = heroContentFinal.querySelector(".btn")
        if (btn) {
          btn.style.transform = "translateY(0)"
        }
      })
    }
  }

  // Add CSS for form validation
  style = document.createElement("style")
  style.textContent = `
    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
      border-color: #dc3545;
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
    
    .error-message {
      color: #dc3545;
      font-size: 0.85rem;
      margin-top: 5px;
    }
    
    .success-message {
      background-color: rgba(40, 167, 69, 0.1);
      color: #28a745;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
      display: flex;
      align-items: center;
      transition: opacity 0.5s ease;
    }
    
    .success-message i {
      font-size: 1.5rem;
      margin-right: 10px;
    }
    
    button.success {
      background-color: #28a745 !important;
    }
    
    @media (max-width: 768px) {
      .form-group {
        margin-bottom: 15px;
      }
    }
  `
  document.head.appendChild(style)

  // Page Banner Fitting
  const pageBannersElements2 = document.querySelectorAll(".page-banner")

  if (pageBannersElements2.length > 0) {
    function adjustPageBanners() {
      const headerHeight = document.querySelector("header").offsetHeight

      pageBannersElements2.forEach((banner) => {
        // Set margin-top to match header height
        banner.style.marginTop = `${headerHeight}px`

        // Ensure the background image is fully visible
        const bannerImg = window.getComputedStyle(banner).backgroundImage
        if (bannerImg && bannerImg !== "none") {
          const img = new Image()
          img.src = bannerImg.replace(/url$$['"]?(.*?)['"]?$$/i, "$1")

          img.onload = () => {
            const imgRatio = img.width / img.height
            const bannerWidth = banner.offsetWidth
            const idealHeight = bannerWidth / imgRatio

            // Only adjust height if needed to show the full image
            if (idealHeight > 250) {
              banner.style.height = `${idealHeight}px`
            }
          }
        }
      })
    }

    // Run on load and resize
    window.addEventListener("load", adjustPageBanners)
    window.addEventListener("resize", adjustPageBanners)
  }
})
>>>>>>> f2e559ea65eeb33858ead0486337edae2497eaaa
