document.addEventListener("DOMContentLoaded", () => {
    console.log("FAQ toggle script loaded")
  
    // Get all FAQ items
    const faqItems = document.querySelectorAll(".faq-item")
  
    // Set initial state - all answers visible with minus icons
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")
      const answer = item.querySelector(".faq-answer")
      const icon = question.querySelector(".toggle-icon i")
  
      // Make sure all answers are initially visible
      answer.style.display = "block"
      item.classList.add("active")
  
      // Set all icons to minus initially
      if (icon) {
        icon.className = "fas fa-minus"
      }
  
      // Add click event to the question
      question.addEventListener("click", () => {
        // Toggle the answer visibility
        if (answer.style.display === "block") {
          answer.style.display = "none"
          item.classList.remove("active")
          // Change icon to plus
          if (icon) icon.className = "fas fa-plus"
        } else {
          answer.style.display = "block"
          item.classList.add("active")
          // Change icon to minus
          if (icon) icon.className = "fas fa-minus"
        }
      })
    })
  })
  