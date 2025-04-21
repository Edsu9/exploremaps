document.addEventListener("DOMContentLoaded", () => {
  console.log("Menu fix script loaded")

  // Fix for mobile menu toggle - DROPDOWN STYLE with animations
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (menuToggle && navMenu) {
    // Remove any existing event listeners by cloning
    const newMenuToggle = menuToggle.cloneNode(true)
    menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle)

    // Set animation delay for each menu item
    const menuItems = navMenu.querySelectorAll("li")
    menuItems.forEach((item, index) => {
      item.style.setProperty("--item-index", index)
    })

    // Add new event listener
    newMenuToggle.addEventListener("click", function (e) {
      console.log("Menu toggle clicked")
      e.preventDefault()
      e.stopPropagation() // Stop event propagation

      // Toggle the active class
      navMenu.classList.toggle("active")

      // Toggle the icon with animation
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
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".nav-menu") && !e.target.closest(".menu-toggle")) {
        if (navMenu.classList.contains("active")) {
          navMenu.classList.remove("active")

          const icon = newMenuToggle.querySelector("i")
          if (icon) {
            icon.classList.remove("fa-times")
            icon.classList.add("fa-bars")
          }
        }
      }
    })

    // Close menu with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active")

        const icon = newMenuToggle.querySelector("i")
        if (icon) {
          icon.classList.remove("fa-times")
          icon.classList.add("fa-bars")
        }
      }
    })
  }
})
