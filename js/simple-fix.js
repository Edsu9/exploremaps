<<<<<<< HEAD
// This is a standalone script to fix the menu toggle and FAQ functionality
document.addEventListener("DOMContentLoaded", () => {
  console.log("Simple fix script loaded")

  // ===== MOBILE MENU TOGGLE FIX =====
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (menuToggle) {
    console.log("Menu toggle found")

    // Remove any existing event listeners by cloning and replacing the element
    const newMenuToggle = menuToggle.cloneNode(true)
    menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle)

    // Add our new event listener
    newMenuToggle.addEventListener("click", function (e) {
      console.log("Menu toggle clicked")
      e.preventDefault()
      e.stopPropagation() // Prevent event bubbling

      if (navMenu) {
        navMenu.classList.toggle("active")

        // Toggle icon between bars and X
        const icon = this.querySelector("i")
        if (icon) {
          if (icon.classList.contains("fa-bars")) {
            icon.classList.remove("fa-bars")
            icon.classList.add("fa-times")
          } else {
            icon.classList.remove("fa-times")
            icon.classList.add("fa-bars")
          }
        }
      }
    })
  }

  // ===== FAQ TOGGLE FIX =====
  // Target the specific structure shown in the screenshot
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    console.log("Processing FAQ item")

    // Find the question element and the toggle icon
    const question = item.querySelector(".faq-question")
    const answer = item.querySelector(".faq-answer")
    const toggleIcon = item.querySelector(".toggle-icon i")

    if (question && answer && toggleIcon) {
      console.log("Found question, answer, and toggle icon")

      // Remove any existing event listeners by cloning and replacing
      const newQuestion = question.cloneNode(true)
      question.parentNode.replaceChild(newQuestion, question)

      // Make sure answers are initially hidden with inline style
      answer.style.display = "none"

      // Add our new event listener
      newQuestion.addEventListener("click", (e) => {
        console.log("FAQ question clicked")
        e.preventDefault()
        e.stopPropagation() // Prevent event bubbling

        // Toggle answer visibility
        if (answer.style.display === "none" || answer.style.display === "") {
          answer.style.display = "block"
          // Update the icon to minus
          const newToggleIcon = newQuestion.querySelector(".toggle-icon i")
          if (newToggleIcon) {
            newToggleIcon.className = "fas fa-minus"
          }
        } else {
          answer.style.display = "none"
          // Update the icon to plus
          const newToggleIcon = newQuestion.querySelector(".toggle-icon i")
          if (newToggleIcon) {
            newToggleIcon.className = "fas fa-plus"
          }
        }
      })
    }
  })

  // Add some basic CSS fixes
  const style = document.createElement("style")
  style.textContent = `
    /* Make FAQ questions clickable */
    .faq-question {
      cursor: pointer !important;
    }
    
    /* Ensure toggle icon changes on hover */
    .faq-question:hover .toggle-icon {
      color: #0047ab !important;
    }
    
    /* Fix mobile menu toggle */
    @media screen and (max-width: 768px) {
      .menu-toggle {
        display: block !important;
        cursor: pointer !important;
        z-index: 1000 !important;
      }
      
      .nav-menu {
        position: fixed !important;
        top: 0 !important;
        left: -100% !important;
        width: 80% !important;
        height: 100vh !important;
        background-color: white !important;
        transition: all 0.3s ease !important;
        z-index: 999 !important;
        padding-top: 80px !important;
        box-shadow: 0 0 10px rgba(0,0,0,0.1) !important;
      }
      
      .nav-menu.active {
        left: 0 !important;
      }
    }
  `
  document.head.appendChild(style)

  console.log("Simple fix script completed")
})
=======
// This is a standalone script to fix the menu toggle and FAQ functionality
document.addEventListener("DOMContentLoaded", () => {
  console.log("Simple fix script loaded")

  // ===== MOBILE MENU TOGGLE FIX =====
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (menuToggle) {
    console.log("Menu toggle found")

    // Remove any existing event listeners by cloning and replacing the element
    const newMenuToggle = menuToggle.cloneNode(true)
    menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle)

    // Add our new event listener
    newMenuToggle.addEventListener("click", function (e) {
      console.log("Menu toggle clicked")
      e.preventDefault()
      e.stopPropagation() // Prevent event bubbling

      if (navMenu) {
        navMenu.classList.toggle("active")

        // Toggle icon between bars and X
        const icon = this.querySelector("i")
        if (icon) {
          if (icon.classList.contains("fa-bars")) {
            icon.classList.remove("fa-bars")
            icon.classList.add("fa-times")
          } else {
            icon.classList.remove("fa-times")
            icon.classList.add("fa-bars")
          }
        }
      }
    })
  }

  // ===== FAQ TOGGLE FIX =====
  // Target the specific structure shown in the screenshot
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    console.log("Processing FAQ item")

    // Find the question element and the toggle icon
    const question = item.querySelector(".faq-question")
    const answer = item.querySelector(".faq-answer")
    const toggleIcon = item.querySelector(".toggle-icon i")

    if (question && answer && toggleIcon) {
      console.log("Found question, answer, and toggle icon")

      // Remove any existing event listeners by cloning and replacing
      const newQuestion = question.cloneNode(true)
      question.parentNode.replaceChild(newQuestion, question)

      // Make sure answers are initially hidden with inline style
      answer.style.display = "none"

      // Add our new event listener
      newQuestion.addEventListener("click", (e) => {
        console.log("FAQ question clicked")
        e.preventDefault()
        e.stopPropagation() // Prevent event bubbling

        // Toggle answer visibility
        if (answer.style.display === "none" || answer.style.display === "") {
          answer.style.display = "block"
          // Update the icon to minus
          const newToggleIcon = newQuestion.querySelector(".toggle-icon i")
          if (newToggleIcon) {
            newToggleIcon.className = "fas fa-minus"
          }
        } else {
          answer.style.display = "none"
          // Update the icon to plus
          const newToggleIcon = newQuestion.querySelector(".toggle-icon i")
          if (newToggleIcon) {
            newToggleIcon.className = "fas fa-plus"
          }
        }
      })
    }
  })

  // Add some basic CSS fixes
  const style = document.createElement("style")
  style.textContent = `
    /* Make FAQ questions clickable */
    .faq-question {
      cursor: pointer !important;
    }
    
    /* Ensure toggle icon changes on hover */
    .faq-question:hover .toggle-icon {
      color: #0047ab !important;
    }
    
    /* Fix mobile menu toggle */
    @media screen and (max-width: 768px) {
      .menu-toggle {
        display: block !important;
        cursor: pointer !important;
        z-index: 1000 !important;
      }
      
      .nav-menu {
        position: fixed !important;
        top: 0 !important;
        left: -100% !important;
        width: 80% !important;
        height: 100vh !important;
        background-color: white !important;
        transition: all 0.3s ease !important;
        z-index: 999 !important;
        padding-top: 80px !important;
        box-shadow: 0 0 10px rgba(0,0,0,0.1) !important;
      }
      
      .nav-menu.active {
        left: 0 !important;
      }
    }
  `
  document.head.appendChild(style)

  console.log("Simple fix script completed")
})
>>>>>>> f2e559ea65eeb33858ead0486337edae2497eaaa
